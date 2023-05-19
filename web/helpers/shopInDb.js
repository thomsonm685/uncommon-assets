
// make sure shop exists in db, otherwise create it
import User from '../db/mongo/models/User.js'
import mongoose from 'mongoose';

const shopInDb = async (req, res, next) => {

    console.log('In shopInDB()');
    try{
        const {shop, accessToken} = res.locals.shopify.session;
        const foundUser = await User.findOne({shop});

        if(!foundUser){
            console.log('APP[INFO] no user found, creating one for ' + shop);
            const newUser = await new User({shop,accessToken});
            await newUser.save();
        }

        console.log('APP[SUCCESS] In shopInDB()');
        return next();
    }
    catch(e){
        console.log('APP[ERROR] In shopInDB():', e);
        return next();
    }
}

export default shopInDb;