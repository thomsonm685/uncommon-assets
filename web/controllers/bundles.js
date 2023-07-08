

import shopify from '../shopify.js';
import mongoose from 'mongoose';
import Bundle from '../db/mongo/models/Bundle.js';
import keysToCamel from '../helpers/keysToCamel.js';

export const createBundle = async ({ title, masterVariantId, bundleProducts, aggregateInventory }) => {
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
      masterVariantId:parseInt(masterVariantId),
      bundleProducts,
      masterInventoryId,
      aggregateInventory
    });

    await newBundle.save();

    console.log("APP[SUCCESS] createBundle:", newBundle);
  }
  catch(error){
    console.log('APP[ERROR] createBundle:', error);
  }
  return
}

export const deleteBundle = async ({masterVariantId}) => {
  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    console.log('APP[INFO] in deleteBundle');
    // create client with session
    const client = new shopify.api.clients.Graphql({session});

    // check for existing bundle with variant ID
    const existingBundle = await Bundle.deleteOne({masterVariantId});
    
    console.log("APP[SUCCESS] deleteBundle");
  }
  catch(error){
    console.log('APP[ERROR] deleteBundle:', error);
  }
  return
}

export const updateBundle = async ({ title, bundleProducts, aggregateInventory, masterVariantId }) => {
  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    console.log('APP[INFO] in updateBundle');
    // create client with session
    const client = new shopify.api.clients.Graphql({session});

    // check for existing bundle with variant ID
    const existingBundle = await Bundle.findOne({masterVariantId});
    if(!existingBundle) return console.log("APP[ERROR] in updateBundle: Bundle does not exist.");

    // make this a one liner later
    if(title) existingBundle.title = title;
    if(bundleProducts) existingBundle.bundleProducts = bundleProducts;
    if(aggregateInventory) existingBundle.aggregateInventory = aggregateInventory;

    await existingBundle.save();

    console.log("APP[SUCCESS] updateBundle");
  }
  catch(error){
    console.log('APP[ERROR] updateBundle:', error);
  }
  return
}


export const createBundleDraftOrder = async (thisBundle, orderData) => {
    const session = {accessToken:'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', shop:'e41660.myshopify.com'};

    try{
      // MAY NEED TO ADD INVENTORY POLICY
      console.log('APP[INFO] in createBundleDraftOrder, masterVariantId:', thisBundle.masterVariantId);
      // create client with session
      const client = new shopify.api.clients.Graphql({session});
      // send gql query to Shopify
      // let lineItems = ``;
      // thisBundle.bundleProducts.forEach(p=>lineItems+=`{variantId:"${"gid://shopify/ProductVariant/"+p.variantId}", quantity:${p.quantity}}`)

      // console.log('lineItems:', lineItems);
      // let mutation = `
      // mutation {
      //   draftOrderCreate(input: {
      //     lineItems:[`+ lineItems + `],
      //     note: "Bundle Order"
      //   }) {
      //     draftOrder {
      //       id
      //     }
      //   }
      // }
      // `.replace(/'/g, '"');

      let mutation = `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
      `.replace(/'/g, '"');


      const {billingAddress, noteAttributes, customerId, email, note, shippingAddress} = keysToCamel(orderData);

      const parsedBillingAddress = {
        address1: billingAddress.address1,
        address2: billingAddress.address1,
        city: billingAddress.city,
        company: billingAddress.company,
        country: billingAddress.country,
        countryCode: billingAddress.countryCode,
        firstName: billingAddress.firstName,
        id: billingAddress.id,
        lastName: billingAddress.lastName,
        phone: billingAddress.phone,
        province: billingAddress.province,
        provinceCode: billingAddress.provinceCode,
        zip: billingAddress.zip
      }

      const parsedShippingAddress = {
        address1: billingAddress.address1,
        address2: billingAddress.address1,
        city: billingAddress.city,
        company: billingAddress.company,
        country: billingAddress.country,
        countryCode: billingAddress.countryCode,
        firstName: billingAddress.firstName,
        id: billingAddress.id,
        lastName: billingAddress.lastName,
        phone: billingAddress.phone,
        province: billingAddress.province,
        provinceCode: billingAddress.provinceCode,
        zip: billingAddress.zip
      }

      const variables = {
        billingAddress: parsedBillingAddress,
        customAttributes: noteAttributes,
        customerId,
        email,
        note,
        shippingAddress: parsedShippingAddress,
        tags: ["BUNDLE_ORDER"],
        lineItems: thisBundle.bundleProducts.map(p=>({variantId:"gid://shopify/ProductVariant/"+p.variantId, quantity:p.quantity}))
      };

      console.log('variables:', {"input":variables});

      const queryRes = await client.query({
        data:{
          "query": mutation,
          "variables": {"input":variables}
        }
      });

      await publishBundleDraftOrder(queryRes.body.data.draftOrderCreate.draftOrder.id);
      if(thisBundle.aggregateInventory) await adjustBundleInventory(thisBundle);

      console.log("APP[SUCCESS] createBundleDraftOrder:", queryRes.body.data);
    }
    catch(error){
      console.log('APP[ERROR] createBundleDraftOrder:', error);
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


    let variantIds = ``;
    thisBundle.bundleProducts.forEach((p,i)=>{
      variantIds+=`"gid://shopify/ProductVariant/${p.variantId}`+(i+1===thisBundle.bundleProducts.length?`"`:'",');
    });

    const locationId = "gid://shopify/Location/84852048179";

    let queryRes = await client.query({
      data:{
        "query":`
        {
          nodes(ids: [${variantIds}]) {
            ... on ProductVariant {
              inventoryItem {
                tracked
                id
                inventoryLevel(locationId: "${locationId}") {
                    id
                    quantities(names: ["available"]) {
                        name
                        quantity
                        updatedAt
                    }
                }
              }
            }
          }
        }
          `
      },
    });
    // for each variant that has tracked inventory, get the inventory level
    const lowestInventory = Math.min(...queryRes.body.data.nodes.filter(n=>n.inventoryItem.tracked===true).map(node=>{
      if(node.inventoryItem.tracked){
        return node.inventoryItem.inventoryLevel.quantities.filter(q=>q.name==="available")[0].quantity;
      }
    }));
    queryRes = await client.query({
      data: {
        "query": `mutation inventorySetOnHandQuantities($input: InventorySetOnHandQuantitiesInput!) {
          inventorySetOnHandQuantities(input: $input) {
            inventoryAdjustmentGroup {
                id
            }
            userErrors {
              field
              message
            }
          }
        }`,
        "variables": {
          "input": {
            "reason": "correction",
            "referenceDocumentUri": "logistics://some.warehouse/take/2023-01/13",
            "setQuantities": [{"inventoryItemId":thisBundle.masterInventoryId, "quantity":lowestInventory<0?0:lowestInventory, "locationId":"gid://shopify/Location/84852048179"}]
          }
        },
      },
    });

    // await bundleToUpdate.save();

    console.log("APP[SUCCESS] adjustBundleInventory:", queryRes.body.data);
  }
  catch(error){
    console.log('APP[ERROR] adjustBundleInventory:', error);
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
      const thisBundle = allBundles.filter(b=>b.masterVariantId===item.variant_id)[0];
      if(thisBundle){
        // IF SO, PLACE BUNDLE ORDER FOR EACH QTY
        for(let j=0; j<item.quantity; j++){
          await createBundleDraftOrder(thisBundle, order);
        }
      }
    }

    console.log("APP[SUCCESS] bundleOrderWebhookHandler");
  }
  catch(error){
    console.log('APP[ERROR] bundleOrderWebhookHandler:', error);
  }
  return
}