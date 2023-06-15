
import shopify from '../shopify.js';
import mongoose from 'mongoose';

// CONTROLS MOST ACTIONS FOR THE SUBSCRIPTION APP

// create a selling plan in shopify
// export const createSellingPlan = async ({session, options}) => {
export const createSellingPlan = async () => {

  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

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
  const session = {accessToken:'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', shop:'e41660.myshopify.com'};
  const planId = 'gid://shopify/SellingPlanGroup/1582268723';
  const productIds = ["gid://shopify/Product/8313364939059"];

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
  const session = {accessToken:'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', shop:'e41660.myshopify.com'};
  const planId = 'gid://shopify/SellingPlanGroup/1582268723';
  const productIds = ["gid://shopify/Product/8313364939059"];

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
   const session = {accessToken:'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', shop:'e41660.myshopify.com'};
   const customerId = "gid://shopify/Customer/6984955593011";
   const variantId = "gid://shopify/ProductVariant/45262107279667"
 
   try{
     console.log('APP[INFO] in createSubScription');
     // create client with session
     const client = new shopify.api.clients.Graphql({session});
     // build query
     let gqlQuery = `
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

     const paymentMethod = customerRes.body.data.customer.paymentMethods.edges[0].node.id;
 
     console.log("APP[SUCCESS] getting customer payment method:", customerRes.body.data.customer.paymentMethods.edges);

    gqlQuery = `
    mutation($customerId: ID!, $paymentMethodId: ID!, $variantId: ID!) {
      subscriptionContractAtomicCreate(input: {customerId: $customerId, nextBillingDate: "2024-06-02", currencyCode: USD, lines: [{line: {productVariantId: $variantId, quantity: 1, currentPrice: 2.0}}], contract: {status: ACTIVE, paymentMethodId: $paymentMethodId, billingPolicy: {interval: MONTH, intervalCount: 1, minCycles: 1}, deliveryPolicy: {interval: MONTH, intervalCount: 1}, deliveryPrice: 1.00, deliveryMethod: {shipping: {address: {firstName: "Michael", lastName: "Thomson", address1: "1118 Loma Mesa", city: "San Antonio", province: "Texas", country: "United States", zip: "78214"}}}}}) {
        contract {
          id
          lines(first: 10) {
            nodes {
              id
              quantity
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
     `
     // send gql query to Shopify
     const createSubscriptionRes = await client.query({
       data:{
           "query":gqlQuery,
           "variables":
           {
            "customerId": customerId,
            "paymentMethodId": paymentMethod,
            "variantId": variantId
          }
       }
     });

    await manageCustomerTag();

     console.log("APP[SUCCESS] creating subscription for customer:", createSubscriptionRes.body.data);

   
    //  subscriptionContractAtomicCreate IS WHAT WE NEED HERE
   
   }
   catch(error){
     console.log('APP[ERROR] removing product to selling plan:', error.response.errors);
   }

}

// delete subscription with subscription ID
export const cancelSubscription = async () => {
  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    const client = new shopify.api.clients.Graphql({session});

    console.log('APP[INFO] in cancelSubscription');

    const contractId = 'gid://shopify/SubscriptionContract/10992681267';
    let draftContractId = null;
  

    // gid://shopify/SubscriptionContract/10992484659

    // create draft
    let gqlQuery = `
    mutation subscriptionContractUpdate($contractId: ID!) {
      subscriptionContractUpdate(contractId: $contractId) {
        draft {
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
      const createSubDraftRes = await client.query({
        data:{
            "query":gqlQuery,
            "variables":
            {
              "contractId": contractId
            }
        }
      });
  
      console.log("APP[SUCCESS] creating subscription draft:", createSubDraftRes.body.data);
  
      draftContractId = createSubDraftRes.body.data.subscriptionContractUpdate.draft.id;
  
    // update draft
  
    gqlQuery = `
    mutation subscriptionDraftUpdate($draftId: ID!, $input: SubscriptionDraftInput!) {
      subscriptionDraftUpdate(draftId: $draftId, input: $input) {
        draft {
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
      const updateSubDraftRes = await client.query({
        data:{
            "query":gqlQuery,
            "variables":
            {
              "draftId": draftContractId,
              "input": {
                "status": "CANCELLED"
              }
            }
            
        }
      });
  
      console.log("APP[SUCCESS] updating subscription draft status to cancelled:", updateSubDraftRes.body.data);
  
    // commit draft

    gqlQuery = `
    mutation subscriptionDraftCommit($draftId: ID!) {
      subscriptionDraftCommit(draftId: $draftId) {
        contract {
            id
            status
        }
        userErrors {
          field
          message
        }
      }
    }
    
       `
       // send gql query to Shopify
      const commitDraftUpdate = await client.query({
        data:{
            "query":gqlQuery,
            "variables":
            {
              "draftId": draftContractId
            }
        }
      });

      await manageCustomerTag();
  
      console.log("APP[SUCCESS] committing subscription draft:", commitDraftUpdate.body.data);
  }
  catch(e){
    console.log('APP[ERROR] in cancelSubscription:', e);

  }

}


export const listCustomerSubscriptions = async () => {
  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    const client = new shopify.api.clients.Graphql({session});

    console.log('APP[INFO] in listCustomerSubscriptions');

    const customerId = "gid://shopify/Customer/6984955593011";
  
    let gqlQuery = `
    {
      customer(id: ${customerId}) {
        id
        firstName
        lastName
        subscriptionContracts(first:50){
          edges {
            node { 
                id
                status
            }
          }
        }   
      }
    }
      `
      // send gql query to Shopify
    const listCustomerSubsRes = await client.query({
      data: `query  {
        customer(id: "${customerId}") {
          id
          firstName
          lastName
          subscriptionContracts(first:50){
            edges {
              node { 
                  id
                  status
              }
            }
          }   
        }
      }`
    });

    console.log("APP[SUCCESS] listing customer subscriptions:", listCustomerSubsRes.body.data.customer.subscriptionContracts.edges);
  
    return listCustomerSubsRes.body.data.customer.subscriptionContracts.edges;
 
  }
  catch(e){
    console.log('APP[ERROR] in listCustomerSubscriptions:', e);

  }

}

export const manageCustomerTag = async () => {
  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    const client = new shopify.api.clients.Graphql({session});

    console.log('APP[INFO] in manageCustomerTag');

    const customerId = "gid://shopify/Customer/6984955593011";

    const customerSubscriptions = await listCustomerSubscriptions();

    console.log("customerSubscriptions:", customerSubscriptions);

    // HERE, WE SHOULD HAVE A SWITCH STATMENT FOR GOLD SILVER AND BRONZE, ASSIGNING EACH RANK

    let isSubscriber = false;
    let gqlQuery
    customerSubscriptions.forEach(sub=>sub.node.status==="ACTIVE"?isSubscriber = true : '');
    console.log("isSubscriber:", isSubscriber);

    if(isSubscriber){
      gqlQuery = `
      mutation tagsAdd($id: ID!, $tags: [String!]!) {
        tagsAdd(id: $id, tags: $tags) {
          node {
            id
          }
          userErrors {
            field
            message
          }
        }
      }`
    }
    else{
      gqlQuery = `
      mutation tagsRemove($id: ID!, $tags: [String!]!) {
        tagsRemove(id: $id, tags: $tags) {
          node {
            id
          }
          userErrors {
            field
            message
          }
        }
      }`
    }


    const manageCustomerTagRes = await client.query({
      data:{
        "query":gqlQuery,
        "variables":
        {
          "id": customerId,
          "tags": ["ACTIVE_SUBSCRIBER"]
        }
      },

    });

    console.log("APP[SUCCESS] in manageCustomerTag:", manageCustomerTagRes.body.data);
  
 
  }
  catch(e){
    console.log('APP[ERROR] in manageCustomerTag:', e);

  }
}

