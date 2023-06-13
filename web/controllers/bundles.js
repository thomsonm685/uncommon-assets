

import shopify from '../shopify.js';
import mongoose from 'mongoose';

export const createBundleDraftOrder = async () => {

    const session = {accessToken:'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', shop:'e41660.myshopify.com'};

    try{
      console.log('APP[INFO] in createBundleDraftOrder');
      // create client with session
      const client = new shopify.api.clients.Graphql({session});

      // send gql query to Shopify
      const queryRes = await client.query({
        data:{
            "query":`
            mutation {
                draftOrderCreate(input: {
                  lineItems: [
                    {
                      variantId: "gid://shopify/ProductVariant/45392269279539",
                      quantity: 1
                    }
                  ],
                  note: "Bundle Order"
                }) {
                  draftOrder {
                    id
                  }
                }
              }
              
            `
        //     "variables":
        //     {
        //       "input":{
        //       "name": "Subscribe",
        //       "merchantCode": "subscribe",
        //       "options": ["Delivery every"],
        //       "position": 1,
        //       "sellingPlansToCreate": [
        //         {
        //           "name": "Delivered every month",
        //           "options": "1 month(s)",
        //           "position": 1,
        //           "category": "SUBSCRIPTION",
        //           "billingPolicy": {
        //             "recurring": {
        //               "interval": "MONTH",
        //               "intervalCount": 1
        //             }
        //           },
        //           "deliveryPolicy": {
        //             "recurring": {
        //               "interval": "MONTH",
        //               "intervalCount": 1,
        //               "preAnchorBehavior": "ASAP",
        //               "intent": "FULFILLMENT_BEGIN"
        //             }
        //           }
        //         }
        //       ]
        //     }
        //   }
        }
      });

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