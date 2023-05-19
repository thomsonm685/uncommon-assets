import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Schema For The Design Resource
const BundleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    connectedProductId: {
        type: String,
        required: true
    },
    bundleProducts: {
        type: Array,
        required: true,
        default: []
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
});

export default mongoose.model('bundles', BundleSchema);



