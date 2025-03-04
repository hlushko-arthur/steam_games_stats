const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	lastProfileUpdate: Number,
})

const User = mongoose.model('User', userSchema);

module.exports = User;