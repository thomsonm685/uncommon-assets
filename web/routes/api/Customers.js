import express from 'express';
const router = express.Router();
import shopify from '../../shopify.js';
import mongoose from 'mongoose';
// const theseProducts = await shopify.api.rest.Product.all(options);

 

// SINGLE ROUTE TO RETURN STORE CUSTOMER
router.get('/customers/:id', async (req, res) => {
    const session = {accessToken:'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', shop:'e41660.myshopify.com'};

    try{
        console.log('APP[INFO] /customer:id [GET] hit');

        console.log('req.params.id:', req.params.id)

        // const thisCustomer = await shopify.api.rest.Customer.find({
        //     session: res.locals.shopify.session,
        //     id: req.params.id,
        // });

        // console.log('thisCustomer.data:', thisCustomer);

        const client = new shopify.api.clients.Graphql({session});
        // build query
        let gqlQuery = `
        {
            customer(id:"gid://shopify/Customer/6984955593011") {
                id
                paymentMethods(first: 50) { 
                edges {
                    node{
                    id 
                        instrument {
                        ... on CustomerCreditCard {
                            lastDigits
                            brand
                        }
                        }
                    }
                }
                }
                addresses(first:50){
                    firstName
                    lastName
                    address1
                    provinceCode
                    province
                    country
                    zip
                    city
                    id
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
   
        const thisCustomer = {
            paymentMethods: customerRes.body.data.customer.paymentMethods.edges.map(e=>({id:e.node.id, lastDigits:e.node.instrument.lastDigits, brand: e.node.instrument.brand})),
            addresses: customerRes.body.data.customer.addresses
        }
        
        console.log('this customer:', thisCustomer);
    
        console.log('APP[SUCCESS] /customer:id [GET]');
        res.status(200).json({ data: {customer:thisCustomer}, success: true });
    }
    catch(e){
        console.log('APP[ERROR] /customer:id [GET]:', e);
    }
});

export default router;