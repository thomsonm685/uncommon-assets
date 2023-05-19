


import express from 'express';
const router = express.Router();
import User from '../../db/mongo/models/User.js';
import mongoose from 'mongoose';

router.get('/', async (req, res) => {
	console.log('APP[INFO] /user [GET] hit');
	try{

		console.log('req.session:', req.session)
		
		const {shop} = req.session.user;

		console.log('APP[INFO] shop:' + shop);

		const user = await User.findOne({id_:userId});

		console.log("found user:", user);

        console.log('APP[SUCCESS] in /user [GET] handler');
		user?res.status(200).json({success: true, data: {user} }):res.status(404).json({success: false, data: {} });
	} catch (error) {
        console.log('APP[ERROR] in /user [GET] handler:', error);
		res.status(400).json({ data: error, success: false });
	}
});

// router.delete('/', async (req, res) => {
// 	console.log('APP[INFO] /user [DELETE] hit');

// 	try{

// 		const {shop} = req.body;
// 		console.log('APP[INFO] shop:' + shop);

// 		const trimmedShop = shop.replace('https://', '');

// 		console.log('trimmedShop:', trimmedShop);

// 		const deletedUser = await User.findOneAndDelete({shop:trimmedShop});
 
// 		deletedUser?res.status(204).json({success: true, data: {} }):res.status(404).json({success: false, data: {} });
// 	} catch (error) {
// 		console.log('ERROR DELETING USER:', error)
// 		res.status(400).json({ data: error, success: false });
// 	}
// });


module.exports = router;
