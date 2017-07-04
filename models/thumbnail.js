var mongoose = require('mongoose');

module.exports = mongoose.model('thumbnail', {
						thumbnail: {type: String},date: { type: Date, default: Date.now },
					}); 