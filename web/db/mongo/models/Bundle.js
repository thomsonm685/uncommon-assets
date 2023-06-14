import mongoose from 'mongoose';
const Schema = mongoose.Schema; 

// Schema For The Design Resource
const BundleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    masterVariantId: {
        type: String,
        required: true
    },
    masterInventoryId: {
        type: String,
        required: true
    },
    bundleProducts: {
        type: Array,
        required: true,
        default: []
        // {
        //     variantId: 543206541,
        //     quantity: 1
        // }
    },
    aggregateInventory: {
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type : Date, 
        default: Date.now 
    },
    // NEED SOME IDENTIFIER IN PROD, OR STORE UNDER SHOP
    // shop: {
    //     type: String,
    //     required: true
    // }
});

export default mongoose.model('bundles', BundleSchema);



