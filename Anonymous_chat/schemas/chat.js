const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    msg: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Chat', chatSchema)
