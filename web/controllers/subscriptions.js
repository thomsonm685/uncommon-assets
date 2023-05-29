
import shopify from '../shopify.js';
import mongoose from 'mongoose';

// CONTROLS MOST ACTIONS FOR THE SUBSCRIPTION APP

// create a selling plan in shopify
// export const createSellingPlan = async ({session, options}) => {
  export const createSellingPlan = async () => {

    const session = {accessToken:'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', shop:'michael-t-dev.myshopify.com'};

    try{
        console.log('APP[INFO] in createSellingPlan');
        // create client with session
        const client = new shopify.api.clients.Graphql({session});
        const planID = new mongoose.Types.ObjectId().toString();
        // build query
        const gqlQuery = `
        mutation sellingPlanGroupCreate($input: SellingPlanGroupInput!) {
            sellingPlanGroupCreate(input: $input) {
              sellingPlanGroup {
                id
                sellingPlansToCreate
              }
              userErrors {
                field
                message
              }
            }
        }
        `

        // TEST ADDED
        // send gql query to Shopify
        const queryRes = await client.query({
            data:{
                "query":gqlQuery,
                "variables":
                {"input":{
                  "name": "Subscribe",
                  "merchantCode": "subscribe",
                  "options": ["Delivery every"],
                  "position": 1,
                  "sellingPlansToCreate": [
                    {
                      "name": "Delivered every month",
                      "options": "1 month(s)",
                      "position": 1,
                      "category": "SUBSCRIPTION",
                      "billingPolicy": {
                        "recurring": {
                          "interval": "MONTH",
                          "intervalCount": 1
                          // anchors: { type: WEEKDAY, day: 1 }
                        }
                      },
                      "deliveryPolicy": {
                        "recurring": {
                          "interval": "MONTH",
                          "intervalCount": 1,
                          // anchors: { type: WEEKDAY, day: 1 }
                          "preAnchorBehavior": "ASAP",
                          // cutoff: 0
                          "intent": "FULFILLMENT_BEGIN"
                        }
                      }
                      // pricingPolicies: [
                      //   {
                      //     fixed: {
                      //       adjustmentType: PERCENTAGE
                      //       adjustmentValue: { percentage: 15.0 }
                      //     }
                      //   }
                      // ]
                    }
                  //   {
                  //     name: "Delivered every two weeks"
                  //     options: "2 Week(s)"
                  //     position: 2
                  //     category: SUBSCRIPTION
                  //     billingPolicy: {
                  //       recurring: {
                  //         interval: WEEK,
                  //         intervalCount: 2
                  //         anchors: { type: WEEKDAY, day: 1 }
                  //       }
                  //     }
                  //     deliveryPolicy: {
                  //       recurring: {
                  //         interval: WEEK,
                  //         intervalCount: 2
                  //         anchors: { type: WEEKDAY, day: 1 }
                  //         preAnchorBehavior: ASAP
                  //         cutoff: 0
                  //         intent: FULFILLMENT_BEGIN
                  //       }
                  //     }
                  //     pricingPolicies: [
                  //       {
                  //         fixed: {
                  //           adjustmentType: PERCENTAGE
                  //           adjustmentValue: { percentage: 10.0 }
                  //         }
                  //       }
                  //     ]
                  //   }
                  //   {
                  //     name: "Delivered every month"
                  //     options: "1 Month"
                  //     position: 3
                  //     category: SUBSCRIPTION
                  //     billingPolicy: {
                  //       recurring: {
                  //         interval: MONTH,
                  //         intervalCount: 1
                  //         anchors: { type: MONTHDAY, day: 15 }
                  //       }
                  //     }
                  //     deliveryPolicy: {
                  //       recurring: {
                  //         interval: MONTH,
                  //         intervalCount: 1
                  //         anchors: { type: MONTHDAY, day: 15 }
                  //         preAnchorBehavior: ASAP
                  //         cutoff: 0
                  //         intent: FULFILLMENT_BEGIN
                  //       }
                  //     }
                  //     pricingPolicies: [
                  //       {
                  //         fixed: {
                  //           adjustmentType: PERCENTAGE
                  //           adjustmentValue: { percentage: 5.0 }
                  //         }
                  //       }
                  //     ]
                  //   }
                  ]
                }
              //   resources: { productIds: [], productVariantIds: [] }}
          }
        }});

        console.log("queryRes:", queryRes);
    }
    catch(error){
        console.log('error in createSellingPlan:', error.response.errors);
    }
}
// delete a selling plan in shopify
export const deleteSellingPlan = async () => {

}
// attach selling plan to a product in shopify
export const attachSellingPlan = async () => {

}
// remove selling plan from a product in shopify
export const detachSellingPlan = async () => {

}
// create subscription with customer ID and product with selling plan
export const createSubscription = async () => {

}
// delete subscription with subscription ID
export const deleteSubscription = async () => {

}

