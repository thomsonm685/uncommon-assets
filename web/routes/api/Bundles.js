

import express from 'express';
const router = express.Router();
import Bundles from '../../db/mongo/models/Bundle.js';
import { createBundle } from '../../controllers/bundles.js';

// RETURNS LIST OF ALL BUNDLES
router.get('/bundles', async (req, res) => {
	console.log('APP[INFO] /bundles [GET] hit');
	console.log('IN THIS ONE')
	try {
		console.log('APP[SUCCESS] in /bundles [GET] handler');
		const allBundles = await Bundles.find({});

		res.status(200).json({ data: {bundles:allBundles}, success: true });
	} catch (error) {
		console.log('APP[ERROR] in /bundles [GET] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});




export default router;
