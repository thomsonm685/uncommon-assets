

import shopify from '../shopify.js';
import mongoose from 'mongoose';
import Bundle from '../db/mongo/models/Bundle.js';

export const createBundle = async ({ title, masterVariantId, bundleProducts }) => {
  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    console.log('APP[INFO] in createBundle');
    // create client with session
    const client = new shopify.api.clients.Graphql({session});

    // check for existing bundle with variant ID
    const existingBundle = await Bundle.findOne({masterVariantId});
    if(existingBundle) return console.log("APP[ERROR] in createBundle: Bundle already exists, should update instead.");

    // GET INVENTORY ID FOR MASTER BUNDLE PRODUCT (it'll make inventory adjustment easier later)
    const queryRes = await client.query({
      data:{
        "query":
          `{
            productVariant(id: "gid://shopify/ProductVariant/${masterVariantId}") {
              inventoryItem{
                  id
              }
            }
          }`
      }
    });

    const masterInventoryId = queryRes.body.data.productVariant.inventoryItem.id;

    const newBundle = await new Bundle({
      title,
      masterVariantId,
      bundleProducts,
      masterInventoryId
    });

    await newBundle.save();

    console.log("APP[SUCCESS] createBundle:", newBundle);
  }
  catch(error){
    console.log('APP[ERROR] createBundle:', error);
  }
  return
}

export const createBundleDraftOrder = async (thisBundle) => {
    const session = {accessToken:'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', shop:'e41660.myshopify.com'};

    try{
      // MAY NEED TO ADD INVENTORY POLICY
      console.log('APP[INFO] in createBundleDraftOrder, masterVariantId:', thisBundle.masterVariantId);
      // create client with session
      const client = new shopify.api.clients.Graphql({session});
      // send gql query to Shopify
      const queryRes = await client.query({
        data:{
          "query":
            `mutation {
                draftOrderCreate(input: {
                  lineItems: ${thisBundle.bundleProducts.map(p=>({variantId:'gid://shopify/ProductVariant/'+p.variantId, quantity:p.quantity}))},
                  note: "Bundle Order"
                }) {
                  draftOrder {
                    id
                  }
                }
            }`
        }
      });

      // lineItems: [
      //   {
      //     variantId: "gid://shopify/ProductVariant/45392269279539",
      //     quantity: 1
      //   }
      // ],

      publishBundleDraftOrder(queryRes.body.data.draftOrderCreate.draftOrder.id)

      console.log("APP[SUCCESS] createBundleDraftOrder:", queryRes.body.data);
    }
    catch(error){
      console.log('APP[ERROR] createBundleDraftOrder:', error.response.errors);
    }
    return
}

export const publishBundleDraftOrder = async (draftOrderId) => {

  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    console.log('APP[INFO] in publishBundleDraftOrder');
    // create client with session
    const client = new shopify.api.clients.Graphql({session});

    // send gql query to Shopify
    const queryRes = await client.query({
      data:{
          "query":`
          mutation {
              draftOrderComplete(id: "${draftOrderId}") {
              draftOrder {
                  id
              }
            }
          }
          `
      }
    });
    console.log("APP[SUCCESS] publishBundleDraftOrder:", queryRes.body.data);
  }
  catch(error){
    console.log('APP[ERROR] publishBundleDraftOrder:', error.response.errors);
  }
  return
}

export const adjustBundleInventory = async (thisBundle) => {

  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    console.log('APP[INFO] in adjustBundleInventory');
    const client = new shopify.api.clients.Graphql({session});
    // get all product variant inventory levels in bundle
    // send gql query to Shopify
    let queryRes = await client.query({
      data:{
        "query":`
          GET_INVENTORY_LEVELS($variantIds: [ID!]!, $locationId: ID!, $names: [String!]!) {
            nodes(ids: $variantIds) {
              ... on ProductVariant {
                inventoryItem {
                  id
                  inventoryLevel(locationId: $locationId) {
                      id
                      quantities(names: $names) {
                          name
                          quantity
                          updatedAt
                      }
                  }
                }
              }
            }
          }
          `,
        "variables":{
          "variantIds": thisBundle.bundleProducts.map(p=>'gid://shopify/ProductVariant/'+p.variantId),
          "locationId": "gid://shopify/Location/84852048179",
          "names": ["available"]
        }
      },
    });
    // for each variant that has tracked inventory, get the inventory level
    console.log("queryRes:", queryRes.body.data);
    const lowestInventory = Math.min(...queryRes.body.data.nodes.map(inventoryItem=>{
      if(inventoryItem.tracked){
        return inventoryItem.quantities.filter(q=>q.value==="available")[0].quantity;
      }
    }));
    console.log("lowestInventory:", lowestInventory);
    // set aggregate inventory in DB 
    console.log("thisBundle._id:", thisBundle._id);
    const bundleToUpdate = await Bundle.findById(thisBundle._id);
    console.log("bundleToUpdate:", bundleToUpdate);
    bundleToUpdate.aggregateInventory = lowestInventory;
    // set aggregate inventory on master bundle product in Shopify
    queryRes = await client.query({
      data: {
        "query": `mutation inventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
          inventoryAdjustQuantities(input: $input) {
            userErrors {
              field
              message
            }
            inventoryAdjustmentGroup {
              createdAt
              reason
              referenceDocumentUri
              changes {
                name
                delta
              }
            }
          }
        }`,
        "variables": {
          "input": {
              "reason": "correction",
              "name": "available",
              "referenceDocumentUri": "logistics://some.warehouse/take/2023-01/13",
              "changes": [{"inventoryItemId":thisBundle.masterInventoryId, "delta":lowestInventory, "locationId":"gid://shopify/Location/84852048179"}]
          }
          },
      },
    });

    await bundleToUpdate.save();

    console.log("APP[SUCCESS] adjustBundleInventory:", queryRes.body.data);
  }
  catch(error){
    console.log('APP[ERROR] adjustBundleInventory:', error.response.errors);
  }
  return
}


// to handle the order webhook, check for bundles, and create the orders if needed
export const bundleOrderWebhookHandler = async (order) => {
  try{
    console.log('APP[INFO] in bundleOrderWebhookHandler');
    // GET ALL BUNDLES
    const allBundles = await Bundle.find({});
    // FILTER THROUGH LINE ITEMS
    for(let i=0; i<order.line_items.length; i++){
      const item = order.line_items[i];
      // CHECK IF LINE ITEM IS MASTER BUNDLE ITEM
      const thisBundle = allBundles.filter(b=>b.masterVariantId===item.variantId)[0];
      if(thisBundle){
        // IF SO, PLACE BUNDLE ORDER FOR EACH QTY
        for(let j=0; j<item.quantity; j++){
          await createBundleDraftOrder(thisBundle);
        }
      }
    }

    console.log("APP[SUCCESS] bundleOrderWebhookHandler:", queryRes.body.data);
  }
  catch(error){
    console.log('APP[ERROR] bundleOrderWebhookHandler:', error.response.errors);
  }
  return
}