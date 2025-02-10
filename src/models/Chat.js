import mongoose from 'mongoose'
import messageSchema from './Message.js'

const chatSchema = new mongoose.Schema({
  title: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [messageSchema],
});

const Chat = mongoose.model('Chat', chatSchema)

export default Chat