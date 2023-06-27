import express from 'express';
const router = express.Router();
import shopify from '../../shopify.js';
import mongoose from 'mongoose';

 

// SINGLE ROUTE TO RETURN STORE PRODUCTS
router.get('/products', async (req, res) => {
    try{
        console.log('APP[INFO] /products [GET] hit');

        const allProducts = [];
        let lastBatch = [];

        console.log('session:',res.locals.shopify.session );
    
        const getProductBatch = async (id=null) => {
            const options = {session: res.locals.shopify.session, limit:250};
            id?options.since_id=id:'';
    
            const theseProducts = await shopify.api.rest.Product.all(options);

            allProducts.push(...theseProducts.data);
            lastBatch = theseProducts;
    
            return theseProducts;
        } 
    
        async function pollProducts(fn, fnCondition, ms) {
            console.log('running')
            let result = await fn();
            while (fnCondition()) {
                console.log('running again')
                // await wait(ms);
                result = await fn(result[result.length-1].id);
            }
            return result;
        }
        await pollProducts(getProductBatch, ()=>allProducts.length===250?true:false, 0);
    
        console.log('APP[SUCCESS] /products [GET]');
        res.status(200).json({ data: {products:allProducts}, success: true });
    }
    catch(e){
        console.log('APP[ERROR] /products [GET]:', e);
    }
});

export default router;