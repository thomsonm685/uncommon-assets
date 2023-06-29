import express from 'express';
const router = express.Router();
import shopify from '../../shopify.js';
import mongoose from 'mongoose';
// const theseProducts = await shopify.api.rest.Product.all(options);

 

// SINGLE ROUTE TO RETURN STORE CUSTOMER
router.get('/customers/:id', async (req, res) => {
    try{
        console.log('APP[INFO] /customer:id [GET] hit');

        console.log('req.params.id:', req.params.id)

        const thisCustomer = await shopify.api.rest.Customer.find({
            session: res.locals.shopify.session,
            id: req.params.id,
        });

        console.log('thisCustomer.data:', thisCustomer);
    
        console.log('APP[SUCCESS] /customer:id [GET]');
        res.status(200).json({ data: {customer:thisCustomer}, success: true });
    }
    catch(e){
        console.log('APP[ERROR] /customer:id [GET]:', e);
    }
});

export default router;