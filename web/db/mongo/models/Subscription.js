import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Schema For The Design Resource
const SubscriptionSchema = new Schema({
    customerId: {
        type: String,
        required: true
    },
    contractId: {
        type: String,
        required: true
    },
    lineItems: {
        type: Array,
        required: true
    },
    payment: {
        type: Object,
        required: true,
        default: {}
    },
    createdAt: {
        type : Date, 
        default: Date.now 
    },
});

export default mongoose.model('subscriptions', SubscriptionSchema);



