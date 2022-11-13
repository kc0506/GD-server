import mongoose from "mongoose";
const MessageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name field is required.']
    },
    body: {
        type: String,
        required: [true, 'Body field is required.']
    }
})

export default mongoose.model('message', MessageSchema);