import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Schema For The Design Resource
const SubscriptionSchema = new Schema({
    shop: {
        type: String,
        required: true,
        default: null
    },
    customer: {
        type: Object,
        required: true
    },
    deliveryPrice: {
        type: Object,
        required: true
    },
    contractId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    nextBillingDate: {
        type: Date,
        required: false
    },
    originOrder: {
        type: String,
        required: false
    },
    lastPaymentStatus: {
        type: String,
        required: false
    },
    lineItems: {
        type: Array,
        required: true
    },
    customerPaymentMethod: {
        type: String,
        required: true,
        default: {}
    },
    createdAt: {
        type : Date, 
        default: Date.now 
    },
    lineItems: {
        type: Array,
        required: true
    },
    orders: {
        type: Array,
        required: true
    },
});

export default mongoose.model('subscriptions', SubscriptionSchema);



