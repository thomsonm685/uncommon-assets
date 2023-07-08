

import express from 'express';
const router = express.Router();
import Subscriptions from '../../db/mongo/models/Subscription.js';
import SellingPlans from '../../db/mongo/models/SellingPlan.js';
import { activateSubscription, attachSellingPlan, cancelSubscription, createSellingPlan, createSubscription, deleteSellingPlan, detachSellingPlan, editSubscription, getAllSubscriptions, updateSellingPlan } from '../../controllers/subscriptions.js';

// RETURNS LIST OF ALL SUBSCRIPTIONS
router.get('/subscriptions', async (req, res) => {
	console.log('APP[INFO] /subscriptions [GET] hit');
	console.log('IN THIS ONE')
	try {
		console.log('APP[SUCCESS] in /subscriptions [GET] handler');
		const allSubscriptions = await Subscriptions.find({});

		// const allSubscriptions = await getAllSubscriptions();

		res.status(200).json({ data: {subscriptions:allSubscriptions}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions [GET] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});


// // CREATE A SINGLE SUBSCRIPTIONS
// router.post('/', async (req, res) => {
// 	console.log('APP[INFO] /subscriptions [POST] hit'); 
// 	try {
// 		console.log('APP[SUCCESS] in /subscriptions [POST] handler');
// 		res.status(200).json({ data: {deliveries,pickups}, success: true });
// 	} catch (error) {
// 		console.log('APP[ERROR] in /subscriptions [POST] handler:', error);
// 		res.status(400).json({ data: error, success: false });
// 	}
// });

// // RETURNS SINGLE SUBSCRIPTION
// router.get('/:id', async (req, res) => {
// 	console.log('APP[INFO] /subscriptions/:id [GET] hit');
// 	try {
// 		const subscriptionId = req.params.id;
// 		console.log('Subscription ID:', subscriptionId);

// 		console.log('APP[SUCCESS] in /subscriptions/:id [GET] handler');
// 		res.status(200).json({ data: {deliveries,pickups}, success: true });
// 	} catch (error) {
// 		console.log('APP[ERROR] in /subscriptions/:id [GET] handler:', error);
// 		res.status(400).json({ data: error, success: false });
// 	}
// });

// // UPDATES SINGLE SUBSCRIPTION (Swaps and payment info)
// router.put('/:id', async (req, res) => {
// 	console.log('APP[INFO] /subscriptions/:id [PUT] hit');
// 	try {
// 		const subscriptionId = req.params.id;
// 		console.log('Subscription ID:', subscriptionId);

// 		console.log('APP[SUCCESS] in /subscriptions/:id [PUT] handler');
// 		res.status(200).json({ data: {deliveries,pickups}, success: true });
// 	} catch (error) {
// 		console.log('APP[ERROR] in /subscriptions/:id [PUT] handler:', error);
// 		res.status(400).json({ data: error, success: false });
// 	}
// });

// router.delete('*', async (req, res) => {
// 	console.log('APP[INFO] /subscriptions/:id [DELETE] hit');
// 	try {
// 		const subscriptionId = req.params.id;
// 		console.log('Subscription ID:', subscriptionId);
// 		const contractId = 'gid://shopify/SubscriptionContract/'+subscriptionId;

// 		await cancelSubscription(contractId);

// 		console.log('APP[SUCCESS] in /subscriptions/:id [DELETE] handler');
// 		res.status(200).json({ data: {deliveries,pickups}, success: true });
// 	} catch (error) {
// 		console.log('APP[ERROR] in /subscriptions/:id [DELETE] handler:', error);
// 		res.status(400).json({ data: error, success: false });
// 	}
// });

// UPDATES SINGLE SUBSCRIPTION
router.put('/subscriptions', async (req, res) => {
	console.log('APP[INFO] /subscriptions [UPDATE] hit');
	try {

		const updates = req.body.updates;

		if(!updates.status) await editSubscription(req.body.contractId);
		if(updates?.status === "ACTIVE") await activateSubscription(req.body.contractId);
		if(updates?.status === "CANCELLED") await cancelSubscription(req.body.contractId);

		console.log('APP[SUCCESS] in  /subscriptions [UPDATE] handler');
		res.status(200).send();
	} catch (error) {
		console.log('APP[ERROR] in  /subscriptions [UPDATE] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// CREATES SINGLE SUBSCRIPTION
router.post('/subscriptions', async (req, res) => {
	console.log('APP[INFO] /subscriptions [POST] hit');
	try {

		console.log('newSubData:', req.body.subscription);
		await createSubscription(req.body.subscription);

		console.log('APP[SUCCESS] in /subscriptions [POST] handler');
		res.status(200).send();
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions [POST] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// RETURNS LIST OF ALL SELLING PLANS
router.get('/subscriptions/sellingplans', async (req, res) => {
	console.log('APP[INFO] /subscriptions/sellingplans [GET] hit');
	try {
		console.log('APP[SUCCESS] in /subscriptions/sellingplans [GET] handler');
		const allSellingPlans = await SellingPlans.find({});

		res.status(200).json({ data: {sellingPlans:allSellingPlans}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions/sellingplans [GET] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// CREATES SINGLE SELLING PLAN
router.post('/subscriptions/sellingplans', async (req, res) => {
	console.log('APP[INFO] /subscriptions/sellingplans [POST] hit');
	try {

		console.log('sellingPlan Data:', req.body);
		await createSellingPlan({sellingPlanData: req.body, session: res.locals.shopify.session});

		console.log('APP[SUCCESS] in /subscriptions/sellingplans [POST] handler');
		res.status(200).send();
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions/sellingplans [POST] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// UPDATES SINGLE SELLING PLAN
router.put('/subscriptions/sellingplans/:id', async (req, res) => {
	console.log('APP[INFO] /subscriptions/sellingplans [PUT] hit');
	try {

		console.log('sellingPlan Data:', req.body);
		// const thisSellingPlan = await SellingPlans.findById(req.body.id);

		// if(!thisSellingPlan) res.status(400).json({ data: error, success: false });

		if(req.body.addedProducts.length) await attachSellingPlan({productIds: req.body.addedProducts.map(pid=>"gid://shopify/Product/"+pid), sellingPlanGroupId: req.body.sellingPlanGroupId,session:res.locals.shopify.session});
		if(req.body.removedProducts.length) await detachSellingPlan({productIds: req.body.removedProducts.map(pid=>"gid://shopify/Product/"+pid), sellingPlanGroupId: req.body.sellingPlanGroupId,session:res.locals.shopify.session});

		// WEBHOOK
		// await updateSellingPlan({sellingPlanData:req.body,session:res.locals.shopify.session});

		// thisSellingPlan.name = req.body.name;
		// thisSellingPlan.billingInterval = req.body.billingInterval;
		// thisSellingPlan.billingIntervalCount = req.body.billingIntervalCount;
		// thisSellingPlan.deliveryInterval = req.body.deliveryInterval;
		// thisSellingPlan.deliveryIntervalCount = req.body.deliveryIntervalCount;
		// thisSellingPlan.connectedProducts = req.body.connectedProducts;

		console.log('APP[SUCCESS] in /subscriptions/sellingplans [PUT] handler');
		res.status(200).send();
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions/sellingplans [PUT] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// UPDATES SINGLE SELLING PLAN
router.delete('/subscriptions/sellingplans/:id', async (req, res) => {
	console.log('APP[INFO] /subscriptions/sellingplans [DELETE] hit');
	try {

		console.log('req.params.id:', req.params.id);

		await deleteSellingPlan({sellingPlanData:req.body, session:res.locals.shopify.session});

		// webhook takes care of it
		// const thisSellingPlan = await SellingPlans.findByIdAndDelete(req.params.id);

		console.log('APP[SUCCESS] in /subscriptions/sellingplans [DELETE] handler');
		res.status(200).send();
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions/sellingplans [DELETE] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});



// // RETURNS CUSTOMER OBJECT AND ATTACHED SUBSCRIPTIONS
// router.get('/customer/:id', async (req, res) => {
// 	console.log('APP[INFO] /subscriptions/customer/:id [GET] hit');
// 	try {
// 		const customerId = req.params.id;
// 		console.log('Customer ID:', customerId);

// 		console.log('APP[SUCCESS] in /subscriptions/customer/:id [GET] handler');
// 		res.status(200).json({ data: {deliveries,pickups}, success: true });
// 	} catch (error) {
// 		console.log('APP[ERROR] in /subscriptions/customer/:id [GET] handler:', error);
// 		res.status(400).json({ data: error, success: false });
// 	}
// });


// // RETURNS LIST OF ALL BUNDLES
// router.get('/bundles', async (req, res) => {
// 	console.log('APP[INFO] /subscriptions/bundles [GET] hit');
// 	try {
// 		console.log('APP[SUCCESS] in /subscriptions/bundles [GET] handler');
// 		res.status(200).json({ data: {deliveries,pickups}, success: true });
// 	} catch (error) {
// 		console.log('APP[ERROR] in /subscriptions/bundles [GET] handler:', error);
// 		res.status(400).json({ data: error, success: false });
// 	}
// });

// // CREATE A SINGLE BUNDLE
// router.post('/bundles', async (req, res) => {
// 	console.log('APP[INFO] /subscriptions/bundles [POST] hit');
// 	try {
// 		console.log('APP[SUCCESS] in /subscriptions/bundles [POST] handler');
// 		res.status(200).json({ data: {deliveries,pickups}, success: true });
// 	} catch (error) {
// 		console.log('APP[ERROR] in /subscriptions/bundles [POST] handler:', error);
// 		res.status(400).json({ data: error, success: false });
// 	}
// });

// // RETURNS SINGLE BUNDLE
// router.get('/bundles/:id', async (req, res) => {
// 	console.log('APP[INFO] /subscriptions/bundles/:id [GET] hit');
// 	try {
// 		const bundleId = req.params.id;
// 		console.log('Bundle ID:', subscriptionId);

// 		console.log('APP[SUCCESS] in /subscriptions/bundles/:id [GET] handler');
// 		res.status(200).json({ data: {deliveries,pickups}, success: true });
// 	} catch (error) {
// 		console.log('APP[ERROR] in /subscriptions/bundles/:id [GET] handler:', error);
// 		res.status(400).json({ data: error, success: false });
// 	}
// });

// // UPDATES SINGLE BUNDLE
// router.put('/bundles/:id', async (req, res) => {
// 	console.log('APP[INFO] /subscriptions/bundles/:id [PUT] hit');
// 	try {
// 		const bundleId = req.params.id;
// 		console.log('Bundle ID:', bundleId);

// 		console.log('APP[SUCCESS] in /subscriptions/bundles/:id [PUT] handler');
// 		res.status(200).json({ data: {deliveries,pickups}, success: true });
// 	} catch (error) {
// 		console.log('APP[ERROR] in /subscriptions/bundles/:id [PUT] handler:', error);
// 		res.status(400).json({ data: error, success: false });
// 	}
// });

// // DELETES SINGLE BUNDLE
// router.delete('/bundles/:id', async (req, res) => {
// 	console.log('APP[INFO] /subscriptions/:id [DELETE] hit');
// 	try {
// 		const bundleId = req.params.id;
// 		console.log('Bundle ID:', bundleId);

// 		console.log('APP[SUCCESS] in /subscriptions/:id [DELETE] handler');
// 		res.status(200).json({ data: {deliveries,pickups}, success: true });
// 	} catch (error) {
// 		console.log('APP[ERROR] in /subscriptions/:id [DELETE] handler:', error);
// 		res.status(400).json({ data: error, success: false });
// 	}
// });


export default router;
