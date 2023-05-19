import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Schema For The Design Resource
const UserSchema = new Schema({
    shop: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    setupStatus: {
        type: Object,
        required: true,
        default:{}
    },
    createdAt: {
        type : Date, 
        default: Date.now 
    },
});

export default mongoose.model('users', UserSchema);



