
import SellingPlan from '../db/mongo/models/SellingPlan.js';
import Subscription from '../db/mongo/models/Subscription.js';
import shopify from '../shopify.js';
import mongoose from 'mongoose';

// CONTROLS MOST ACTIONS FOR THE SUBSCRIPTION APP


// get all subscriptions on the store
// export const getAllSubscriptions = async ({session}) => {
//   // const session = {accessToken:'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', shop:'e41660.myshopify.com'};

//   try{
//     console.log('APP[INFO] in getAllSubscriptions');
//     // create client with session
//     const client = new shopify.api.clients.Graphql({session});
//     // build query
//     let gqlQuery = (cursor) => `
//     {
//       subscriptionContracts (first:50) {
//         pageInfo{
//             hasNextPage
//         }
//         edges {
//             node {
//                 id
//                 customer {
//                     id
//                     firstName
//                     lastName
//                     email
//                 }
//                 status
//                 createdAt
//                 nextBillingDate
//                 originOrder {
//                      id
//                      lineItems (first:10) { 
//                          edges {
//                              node {
//                                 variant {
//                                     id
//                                     title
//                                     price
//                                 }
//                                 quantity
//                              }
//                          }
//                      }
//                 }
//             }
//         }
//       }
//     }
//     `

//     const allSubscriptions = [];

//     // send gql query to Shopify
//     const pollSubscriptions = async (cursor=null) => {

//       console.log('running in pollSubscriptions');

//       console.log('query:', gqlQuery(cursor));

//       const customerRes = await client.query({
//         data:{
//             "query":gqlQuery(cursor),
//         }
//       });

//       const theseSubscriptons = customerRes.body.data.subscriptionContracts;

//       console.log('theseSubscriptons:', theseSubscriptons);

//       if(theseSubscriptons.pageInfo.hasNextPage) await pollSubscriptions(theseSubscriptons.pageInfo.endCursor);
//     }

//     await pollSubscriptions();

//     console.log("APP[SUCCESS] in getAllSubscriptions");
//     return allSubscriptions;
//   }
//   catch(error){
//     console.log('APP[ERROR] in getAllSubscriptions:', error.response.errors);
//   }

// }


// create a selling plan in shopify
// export const createSellingPlan = async ({session, options}) => {
export const createSellingPlan = async ({sellingPlanData, session}) => {

  // const session = {accessToken:'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', shop:'e41660.myshopify.com'};

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
            "name": sellingPlanData.name,
            "merchantCode": "subscribe",
            "options": ["Delivery every"],
            "position": 1,
            "sellingPlansToCreate": [
              {
                "name": sellingPlanData.name,
                "options": `Bill every ${sellingPlanData.billingIntervalCount} ${sellingPlanData.billingInterval}(s), delivery every ${sellingPlanData.deliveryIntervalCount} ${sellingPlanData.deliveryInterval}(s)`,
                "position": 1,
                "category": "SUBSCRIPTION",
                "billingPolicy": {
                  "recurring": {
                    "interval": sellingPlanData.billingInterval.toUpperCase(),
                    "intervalCount": parseInt(sellingPlanData.billingIntervalCount)
                  }
                },
                "deliveryPolicy": {
                  "recurring": {
                    "interval": sellingPlanData.deliveryInterval.toUpperCase(),
                    "intervalCount": parseInt(sellingPlanData.deliveryIntervalCount),
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
    console.log('APP[ERROR] creating selling plan:', error);
  }
} 

// delete a selling plan in shopify
export const deleteSellingPlan = async ({sellingPlanData,session}) => {

  const session = {accessToken:'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', shop:'e41660.myshopify.com'};
  const {sellingPlanGroupId} = sellingPlanData;

  console.log('sellingPlanGroupId:', sellingPlanGroupId);

  try{
    console.log('APP[INFO] in deleteSellingPlan');
    // create client with session
    const client = new shopify.api.clients.Graphql({session});
    const planID = new mongoose.Types.ObjectId().toString();
    // build query
    const gqlQuery = `
    mutation sellingPlanGroupDelete($id: ID!) {
      sellingPlanGroupDelete(id: $id) {
        deletedSellingPlanGroupId
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
            "id": sellingPlanGroupId
          }
      }
    });

    
    console.log("APP[SUCCESS] deleteSellingPlan:", queryRes.body.data);
  }
  catch(error){
    console.log('APP[ERROR] deleteSellingPlan:', error);
  }
} 

// delete a selling plan in shopify
export const updateSellingPlan = async ({sellingPlanData,session}) => {

  const session = {accessToken:'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', shop:'e41660.myshopify.com'};
  const {sellingPlanGroupId} = sellingPlanData;

  console.log('sellingPlanGroupId:', sellingPlanGroupId);

  try{
    console.log('APP[INFO] in updateSellingPlan');
    // create client with session
    const client = new shopify.api.clients.Graphql({session});
    const planID = new mongoose.Types.ObjectId().toString();
    // build query
    const gqlQuery = `
    mutation sellingPlanGroupUpdate($id: ID!) {
      sellingPlanGroupUpdate(id: $id) {
        deletedSellingPlanIds
        sellingPlanGroup {
          # SellingPlanGroup fields
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
            "name": sellingPlanData.name,
            "merchantCode": "subscribe",
            "options": ["Delivery every"],
            "position": 1,
            "sellingPlansToCreate": [
              {
                "name": sellingPlanData.name,
                "options": `Bill every ${sellingPlanData.billingIntervalCount} ${sellingPlanData.billingInterval}(s), delivery every ${sellingPlanData.deliveryIntervalCount} ${sellingPlanData.deliveryInterval}(s)`,
                "position": 1,
                "category": "SUBSCRIPTION",
                "billingPolicy": {
                  "recurring": {
                    "interval": sellingPlanData.billingInterval.toUpperCase(),
                    "intervalCount": parseInt(sellingPlanData.billingIntervalCount)
                  }
                },
                "deliveryPolicy": {
                  "recurring": {
                    "interval": sellingPlanData.deliveryInterval.toUpperCase(),
                    "intervalCount": parseInt(sellingPlanData.deliveryIntervalCount),
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
    
    console.log("APP[SUCCESS] updateSellingPlan:", queryRes.body.data);
  }
  catch(error){
    console.log('APP[ERROR] updateSellingPlan:', error);
  }
} 

// attach selling plan to a product in shopify
export const attachSellingPlan = async ({productIds,sellingPlanGroupId, session}) => {
  
  // TEST DATA
  const session = {accessToken:'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', shop:'e41660.myshopify.com'};
  // const planId = 'gid://shopify/SellingPlanGroup/1582268723';
  // const productIds = ["gid://shopify/Product/8313364939059"];

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
            "id": sellingPlanGroupId,
            "productIds": productIds
          }
      }
    });

    console.log("APP[SUCCESS] adding product to selling plan:", queryRes.body.data.sellingPlanGroupAddProducts.userErrors);
  }
  catch(error){
    console.log('APP[ERROR] adding product to selling plan:', error.response.errors);
  }
}

// remove selling plan from a product in shopify
export const detachSellingPlan = async ({productIds,sellingPlanGroupId, session}) => {
  // TEST DATA
  const session = {accessToken:'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', shop:'e41660.myshopify.com'};
  // const planId = 'gid://shopify/SellingPlanGroup/1582268723';
  // const productIds = ["gid://shopify/Product/8313364939059"];

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
            "id": sellingPlanGroupId,
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
export const createSubscription = async ({subscriptionData,session}) => {
   const session = {accessToken:'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', shop:'e41660.myshopify.com'};
   const customerId = "gid://shopify/Customer/"+subscriptionData.customer.id;
   const variantId = "gid://shopify/ProductVariant/"+subscriptionData.selectedProduct.id;
   const paymentMethod = subscriptionData.paymentMethodId;
 
   try{
     console.log('APP[INFO] in createSubScription');
     // create client with session
     const client = new shopify.api.clients.Graphql({session});
     // build query
    //  let gqlQuery = `
    //  {
    //   customer(id:"${customerId}") {
    //     id
    //     paymentMethods(first: 50) { 
    //       edges {
    //         node{
    //           id 
    //         }
    //       }
    //     }
    //   }
    // }
    //  `
    //  // send gql query to Shopify
    //  const customerRes = await client.query({
    //    data:{
    //        "query":gqlQuery,
    //    }
    //  });

    //  const paymentMethod = customerRes.body.data.customer.paymentMethods.edges[0].node.id;
 
    //  console.log("APP[SUCCESS] getting customer payment method:", customerRes.body.data.customer.paymentMethods.edges);

    // DO WE NEED DELIVERY PRICE???
    let gqlQuery = `
    mutation($customerId: ID!, $paymentMethodId: ID!, $variantId: ID!) {
      subscriptionContractAtomicCreate(input: {customerId: $customerId, nextBillingDate: "${subscriptionData.nextBillingDate}", currencyCode: USD, lines: [{line: {productVariantId: $variantId, quantity: 1, currentPrice: ${parseFloat(subscriptionData.price)}}}], contract: {status: ACTIVE, paymentMethodId: $paymentMethodId, billingPolicy: {interval: ${subscriptionData.chargeInterval.toUpperCase()}, intervalCount: ${subscriptionData.chargeIntervalCount}, minCycles: 1}, deliveryPolicy: {interval: ${subscriptionData.deliveryInterval.toUpperCase()}, intervalCount: ${subscriptionData.deliveryIntervalCount}}, deliveryPrice: 0.00, deliveryMethod: {shipping: {address: {firstName: "${subscriptionData.address.firstName}", lastName: "${subscriptionData.address.lastName}", address1: "${subscriptionData.address.address1}", city: "${subscriptionData.address.city}", province: "${subscriptionData.address.province}", country: "${subscriptionData.address.country}", zip: "${subscriptionData.address.zip}"}}}}}) {
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

     console.log("APP[SUCCESS] creating subscription for customer:", createSubscriptionRes.body.data.subscriptionContractAtomicCreate);

   
    //  subscriptionContractAtomicCreate IS WHAT WE NEED HERE
   
   }
   catch(error){
     console.log('APP[ERROR]  creating subscription:', error.response);
   }

}

// delete subscription with subscription ID
export const cancelSubscription = async ({contractId, session}) => {
  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    const client = new shopify.api.clients.Graphql({session});

    console.log('APP[INFO] in cancelSubscription');

    // const contractId = 'gid://shopify/SubscriptionContract/11030233395';
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

export const activateSubscription = async ({contractId, session}) => {
  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    const client = new shopify.api.clients.Graphql({session});

    console.log('APP[INFO] in activateSubscription');

    let draftContractId = null;

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
                "status": "ACTIVE"
              }
            }
            
        }
      });
  
      console.log("APP[SUCCESS] updating subscription draft status to active:", updateSubDraftRes.body.data);
  
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

export const editSubscription = async ({subscriptionData, session}) => {
  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    const client = new shopify.api.clients.Graphql({session});

    console.log('APP[INFO] in editSubscription');

    let draftContractId = null;

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
                "status": "ACTIVE"
              }
            }
            
        }
      });
  
      console.log("APP[SUCCESS] updating subscription draft status to active:", updateSubDraftRes.body.data);
  
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
  
      console.log("APP[SUCCESS] editSubscription:", commitDraftUpdate.body.data);
  }
  catch(e){
    console.log('APP[ERROR] in editSubscription:', e);

  }

}



export const listCustomerSubscriptions = async ({session}) => {
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

    console.log("APP[SUCCESS] listing customer subscriptions");
  
    return listCustomerSubsRes.body.data.customer.subscriptionContracts.edges;
 
  }
  catch(e){
    console.log('APP[ERROR] in listCustomerSubscriptions:', e);

  }

}

export const manageCustomerTag = async ({session}) => {
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

export const subscriptionCreateWebhookHandler = async ({subWebhookData}) => {

  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    console.log('APP[INFO] in subscriptionCreateWebhookHandler');
    console.log("subWebhookData:", subWebhookData);

    // create client with session
    const client = new shopify.api.clients.Graphql({session});
    // build query
    const gqlQuery = `
    {
      subscriptionContract(id:"${subWebhookData.admin_graphql_api_id}") {
        id
        status
        deliveryPrice {
            amount
        }
        nextBillingDate
        lastPaymentStatus
        lines(first: 50){
            edges{
                node{
                    productId
                    title
                    variantTitle
                    variantId
                    variantImage{
                        url
                    }
                    currentPrice {
                        amount
                    }
                    quantity
                }
            }
        }
        note
        customerPaymentMethod {
            id
        }
        customer {
            id
            firstName
            lastName
            email
        }
        orders (first:50){
            edges {
                node {
                    id
                }
            }
        }
      }
    }
    `
    // send gql query to Shopify
    const queryRes = await client.query({
      data:{
          "query":gqlQuery
      }
    });

    const fullSubData = queryRes.body.data.subscriptionContract;
    console.log('lineItems:',  fullSubData.lines.edges.map(edge=>edge.node));

    // CREATE SUBSCRIPTION
    const newSubscription = new Subscription({
      customer: fullSubData.customer,
      contractId: fullSubData.id,
      status: fullSubData.status,
      nextBillingDate: fullSubData.nextBillingDate,
      lastPaymentStatus: fullSubData.lastPaymentStatus,
      originOrder: fullSubData.originOrder?.id,
      customerPaymentMethod: fullSubData.customerPaymentMethod.id,
      createdAt: fullSubData.createdAt,
      deliveryPrice: fullSubData.deliveryPrice,
    });

    newSubscription.lineItems = fullSubData.lines.edges.map(edge=>edge.node);
    newSubscription.orders = fullSubData.orders.edges.map(edge=>edge.node);

    await newSubscription.save();

    console.log("APP[SUCCESS] subscriptionCreateWebhookHandler");
  }
  catch(error){
    console.log('APP[ERROR] subscriptionCreateWebhookHandler:', error);
  }
  return
}

export const subscriptionUpdateWebhookHandler = async (subWebhookData) => {

  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    console.log('APP[INFO] in subscriptionUpdateWebhookHandler');
    // CREATE SUBSCRIPTION
    const foundSubscription = await Subscription.findOne({contractId:subWebhookData.admin_graphql_api_id})

    if(!foundSubscription) return await subscriptionCreateWebhookHandler(subWebhookData);

    const client = new shopify.api.clients.Graphql({session});
    // build query
    const gqlQuery = `
    {
      subscriptionContract(id:"${subWebhookData.admin_graphql_api_id}") {
        id
        status
        deliveryPrice {
            amount
        }
        nextBillingDate
        lastPaymentStatus
        lines(first: 50){
            edges{
                node{
                    productId
                    title
                    variantTitle
                    variantId
                    variantImage{
                        url
                    }
                    currentPrice {
                        amount
                    }
                    quantity
                }
            }
        }
        note
        customerPaymentMethod {
            id
        }
        customer {
            id
            firstName
            lastName
            email
        }
        orders (first:50){
            edges {
                node {
                    id
                }
            }
        }
      }
    }
    `
    // send gql query to Shopify
    const queryRes = await client.query({
      data:{
          "query":gqlQuery
      }
    });

    const fullSubData = queryRes.body.data.subscriptionContract;

    foundSubscription.customer  = fullSubData.customer,
    foundSubscription.contractId  = fullSubData.id,
    foundSubscription.status  = fullSubData.status,
    foundSubscription.nextBillingDate  = fullSubData.nextBillingDate,
    foundSubscription.lastPaymentStatus  = fullSubData.lastPaymentStatus,
    foundSubscription.originOrder  = fullSubData.originOrder?.id,
    foundSubscription.customerPaymentMethod  = fullSubData.customerPaymentMethod.id,
    foundSubscription.createdAt  = fullSubData.createdAt,
    foundSubscription.deliveryPrice  = fullSubData.deliveryPrice,
    foundSubscription.lineitems = fullSubData.lines.edges.map(edge=>edge.node),
    foundSubscription.orders = fullSubData.orders.edges.map(edge=>edge.node)

    await foundSubscription.save();

    console.log("APP[SUCCESS] subscriptionUpdateWebhookHandler");
  }
  catch(error){
    console.log('APP[ERROR] subscriptionUpdateWebhookHandler:', error);
  }
  return
}

export const sellingPlanGroupCreateWebhookHandler = async (sellingPlanWebhookData) => {

  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    console.log('APP[INFO] in sellingPlanGroupCreateWebhookHandler');
    console.log("sellingPlanWebhookData:", sellingPlanWebhookData);

    // CREATE SUBSCRIPTION
    const newSellingPlan = new SellingPlan({
      sellingPlanGroupId: sellingPlanWebhookData.admin_graphql_api_id,
      // sellingPlanId: sellingPlanWebhookData.selling_plans[0],
      name: sellingPlanWebhookData.selling_plans[0].name,
      billingInterval: sellingPlanWebhookData.selling_plans[0].billing_policy.interval,
      billingIntervalCount: sellingPlanWebhookData.selling_plans[0].billing_policy.interval_count,
      deliveryInterval: sellingPlanWebhookData.selling_plans[0].delivery_policy.interval,
      deliveryIntervalCount: sellingPlanWebhookData.selling_plans[0].delivery_policy.interval_count
    });

    await newSellingPlan.save();

    console.log("APP[SUCCESS] sellingPlanGroupCreateWebhookHandler");
  }
  catch(error){
    console.log('APP[ERROR] sellingPlanGroupCreateWebhookHandler:', error);
  }
  return
}

export const sellingPlanGroupUpdateWebhookHandler = async (sellingPlanWebhookData) => {

  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    console.log('APP[INFO] in sellingPlanGroupUpdateWebhookHandler');
    console.log("sellingPlanWebhookData:", sellingPlanWebhookData);

    const existingSellingPlan = await SellingPlan.findOne({sellingPlanGroupId:sellingPlanWebhookData.admin_graphql_api_id});
    if(!existingSellingPlan) return await sellingPlanGroupCreateWebhookHandler(sellingPlanWebhookData);

    // UPDATE SELLING PLAN
    existingSellingPlan.name=sellingPlanWebhookData.selling_plans[0].name;
    existingSellingPlan.billingInterval=sellingPlanWebhookData.selling_plans[0].billing_policy.interval;
    existingSellingPlan.billingIntervalCount=sellingPlanWebhookData.selling_plans[0].billing_policy.interval_count;
    existingSellingPlan.deliveryInterval=sellingPlanWebhookData.selling_plans[0].delivery_policy.interval;
    existingSellingPlan.deliveryIntervalCount=sellingPlanWebhookData.selling_plans[0].delivery_policy.interval_count;

    // PRODUCTS NEED TO BE ADDED HERE

    await existingSellingPlan.save();

    console.log("APP[SUCCESS] sellingPlanGroupUpdateWebhookHandler");
  }
  catch(error){
    console.log('APP[ERROR] sellingPlanGroupUpdateWebhookHandler:', error);
  }
  return
}

export const sellingPlanGroupDeleteWebhookHandler = async (sellingPlanWebhookData) => {

  const session = {accessToken:'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', shop:'e41660.myshopify.com'};

  try{
    console.log('APP[INFO] in sellingPlanGroupDeleteWebhookHandler');

    const deleteSellingPlan = await SellingPlan.findOneAndDelete({sellingPlanGroupId:sellingPlanWebhookData.admin_graphql_api_id})

    console.log("APP[SUCCESS] sellingPlanGroupDeleteWebhookHandler");
  }
  catch(error){
    console.log('APP[ERROR] sellingPlanGroupDeleteWebhookHandler:', error);
  }
  return
}
