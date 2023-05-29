
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
          }
          userErrors {
            field
            message
          }
        }
    }
    `
    // send gql query to Shopify
    const queryRes = await client.query({
      data:{
          "query":gqlQuery,
          "variables":
          {
            "input":{
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
                  }
                },
                "deliveryPolicy": {
                  "recurring": {
                    "interval": "MONTH",
                    "intervalCount": 1,
                    "preAnchorBehavior": "ASAP",
                    "intent": "FULFILLMENT_BEGIN"
                  }
                }
              }
            ]
          }
        }
      }
    });
    console.log("APP[SUCCESS] creating selling plan:", queryRes.body.data);
  }
  catch(error){
    console.log('APP[ERROR] creating selling plan:', error.response.errors);
  }
}

// delete a selling plan in shopify
export const deleteSellingPlan = async () => {

}
// attach selling plan to a product in shopify
export const attachSellingPlan = async () => {
  
  // TEST DATA
  const session = {accessToken:'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', shop:'michael-t-dev.myshopify.com'};
  const planId = 'gid://shopify/SellingPlanGroup/338067641';
  const productIds = ["gid://shopify/Product/6729055240377"];

  try{
    console.log('APP[INFO] in createSellingPlan');
    // create client with session
    const client = new shopify.api.clients.Graphql({session});
    // build query
    const gqlQuery = `
    mutation sellingPlanGroupAddProducts($id: ID!, $productIds: [ID!]!) {
      sellingPlanGroupAddProducts(id: $id, productIds: $productIds) {
        sellingPlanGroup {
          id
        }
        userErrors {
          field
          message
        }
      }
    }
    `
    // send gql query to Shopify
    const queryRes = await client.query({
      data:{
          "query":gqlQuery,
          "variables":
          {
            "id": planId,
            "productIds": productIds
          }
      }
    });

    console.log("APP[SUCCESS] adding product to selling plan:", queryRes.body.data);
  }
  catch(error){
    console.log('APP[ERROR] adding product to selling plan:', error.response.errors);
  }
}

// remove selling plan from a product in shopify
export const detachSellingPlan = async () => {
  // TEST DATA
  const session = {accessToken:'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', shop:'michael-t-dev.myshopify.com'};
  const planId = 'gid://shopify/SellingPlanGroup/338067641';
  const productIds = ["gid://shopify/Product/6729055240377"];

  try{
    console.log('APP[INFO] in createSellingPlan');
    // create client with session
    const client = new shopify.api.clients.Graphql({session});
    // build query
    const gqlQuery = `
    mutation sellingPlanGroupRemoveProducts($id: ID!, $productIds: [ID!]!) {
      sellingPlanGroupRemoveProducts(id: $id, productIds: $productIds) {
        removedProductIds
        userErrors {
          field
          message
        }
      }
    }
    `
    // send gql query to Shopify
    const queryRes = await client.query({
      data:{
          "query":gqlQuery,
          "variables":
          {
            "id": planId,
            "productIds": productIds
          }
      }
    });

    console.log("APP[SUCCESS] removing product to selling plan:", queryRes.body.data);
  }
  catch(error){
    console.log('APP[ERROR] removing product to selling plan:', error.response.errors);
  }
}

// create subscription with customer ID and product with selling plan
export const createSubscription = async () => {
   const session = {accessToken:'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', shop:'michael-t-dev.myshopify.com'};
   const customerId = "gid://shopify/Customer/6425378685113";
 
   try{
     console.log('APP[INFO] in createSubScription');
     // create client with session
     const client = new shopify.api.clients.Graphql({session});
     // build query
     const gqlQuery = `
     {
      customer(id:"${customerId}") {
        id
        paymentMethods(first: 50) { 
          edges {
            node{
              id 
            }
          }
        }
      }
    }
     `
     // send gql query to Shopify
     const customerRes = await client.query({
       data:{
           "query":gqlQuery,
       }
     });

    //  const paymentMethod = 
 
     console.log("APP[SUCCESS] getting customer payment method:", customerRes.body.data.customer.paymentMethods.edges);
   }
   catch(error){
     console.log('APP[ERROR] removing product to selling plan:', error.response.errors);
   }

}
// delete subscription with subscription ID
export const deleteSubscription = async () => {

}

