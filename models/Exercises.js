const mongoose = require('mongoose')

const Exercise = mongoose.model('Exercise',{
    name: String,
    description: String,
    image: String,
    video: String,
    category: String,
    summary: String,
    createdAt: Date,
})

module.exports = Exercise