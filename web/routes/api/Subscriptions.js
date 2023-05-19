

import express from 'express';
const router = express.Router();

// RETURNS LIST OF ALL SUBSCRIPTIONS
router.get('/', async (req, res) => {
	console.log('APP[INFO] /subscriptions [GET] hit');
	try {
		console.log('APP[SUCCESS] in /subscriptions [GET] handler');
		res.status(200).json({ data: {deliveries,pickups}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions [GET] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// CREATE A SINGLE SUBSCRIPTIONS
router.post('/', async (req, res) => {
	console.log('APP[INFO] /subscriptions [POST] hit');
	try {
		console.log('APP[SUCCESS] in /subscriptions [POST] handler');
		res.status(200).json({ data: {deliveries,pickups}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions [POST] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// RETURNS SINGLE SUBSCRIPTION
router.get('/:id', async (req, res) => {
	console.log('APP[INFO] /subscriptions/:id [GET] hit');
	try {
		const subscriptionId = req.params.id;
		console.log('Subscription ID:', subscriptionId);

		console.log('APP[SUCCESS] in /subscriptions/:id [GET] handler');
		res.status(200).json({ data: {deliveries,pickups}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions/:id [GET] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// UPDATES SINGLE SUBSCRIPTION (Swaps and payment info)
router.put('/:id', async (req, res) => {
	console.log('APP[INFO] /subscriptions/:id [PUT] hit');
	try {
		const subscriptionId = req.params.id;
		console.log('Subscription ID:', subscriptionId);

		console.log('APP[SUCCESS] in /subscriptions/:id [PUT] handler');
		res.status(200).json({ data: {deliveries,pickups}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions/:id [PUT] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// DELETES SINGLE SUBSCRIPTION
router.delete('/:id', async (req, res) => {
	console.log('APP[INFO] /subscriptions/:id [DELETE] hit');
	try {
		const subscriptionId = req.params.id;
		console.log('Subscription ID:', subscriptionId);

		console.log('APP[SUCCESS] in /subscriptions/:id [DELETE] handler');
		res.status(200).json({ data: {deliveries,pickups}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions/:id [DELETE] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// RETURNS CUSTOMER OBJECT AND ATTACHED SUBSCRIPTIONS
router.get('/customer/:id', async (req, res) => {
	console.log('APP[INFO] /subscriptions/customer/:id [GET] hit');
	try {
		const customerId = req.params.id;
		console.log('Customer ID:', customerId);

		console.log('APP[SUCCESS] in /subscriptions/customer/:id [GET] handler');
		res.status(200).json({ data: {deliveries,pickups}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions/customer/:id [GET] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});


// RETURNS LIST OF ALL BUNDLES
router.get('/bundles', async (req, res) => {
	console.log('APP[INFO] /subscriptions/bundles [GET] hit');
	try {
		console.log('APP[SUCCESS] in /subscriptions/bundles [GET] handler');
		res.status(200).json({ data: {deliveries,pickups}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions/bundles [GET] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// CREATE A SINGLE BUNDLE
router.post('/bundles', async (req, res) => {
	console.log('APP[INFO] /subscriptions/bundles [POST] hit');
	try {
		console.log('APP[SUCCESS] in /subscriptions/bundles [POST] handler');
		res.status(200).json({ data: {deliveries,pickups}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions/bundles [POST] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// RETURNS SINGLE BUNDLE
router.get('/bundles/:id', async (req, res) => {
	console.log('APP[INFO] /subscriptions/bundles/:id [GET] hit');
	try {
		const bundleId = req.params.id;
		console.log('Bundle ID:', subscriptionId);

		console.log('APP[SUCCESS] in /subscriptions/bundles/:id [GET] handler');
		res.status(200).json({ data: {deliveries,pickups}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions/bundles/:id [GET] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// UPDATES SINGLE BUNDLE
router.put('/bundles/:id', async (req, res) => {
	console.log('APP[INFO] /subscriptions/bundles/:id [PUT] hit');
	try {
		const bundleId = req.params.id;
		console.log('Bundle ID:', bundleId);

		console.log('APP[SUCCESS] in /subscriptions/bundles/:id [PUT] handler');
		res.status(200).json({ data: {deliveries,pickups}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions/bundles/:id [PUT] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// DELETES SINGLE BUNDLE
router.delete('/bundles/:id', async (req, res) => {
	console.log('APP[INFO] /subscriptions/:id [DELETE] hit');
	try {
		const bundleId = req.params.id;
		console.log('Bundle ID:', bundleId);

		console.log('APP[SUCCESS] in /subscriptions/:id [DELETE] handler');
		res.status(200).json({ data: {deliveries,pickups}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /subscriptions/:id [DELETE] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});


export default router;
