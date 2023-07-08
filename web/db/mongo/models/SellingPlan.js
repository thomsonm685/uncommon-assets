import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Schema For The Design Resource
const SellingPlanSchema = new Schema({
    sellingPlanGroupId: {
        type: String,
        required: true
    },
    shop: {
        type: String,
        required: true,
        default: null
    },
    // sellingPlanId: {
    //     type: String,
    //     required: true
    // },
    name: {
        type: String,
        required: true
    },
    deliveryInterval: {
        type: String,
        required: true
    },
    deliveryIntervalCount: {
        type: Number,
        required: true
    },
    billingInterval: {
        type: String,
        required: true
    },
    billingIntervalCount: {
        type: Number,
        required: true
    },
    connectedProducts: {
        type: Array,
        required: true,
        default:[]
    },
    createdAt: {
        type : Date, 
        default: Date.now 
    },
});

export default mongoose.model('sellingPlan', SellingPlanSchema);



