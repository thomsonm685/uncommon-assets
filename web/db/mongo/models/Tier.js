import mongoose from 'mongoose';
const Schema = mongoose.Schema; 

// Schema For The Design Resource
const TierSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    shop: {
        type: String,
        required: true,
        default: null
    },
    connectedProducts: {
        type: Array,
        required: true,
        default: []
    },
    createdAt: {
        type : Date, 
        default: Date.now 
    },
});

export default mongoose.model('tiers', TierSchema);



