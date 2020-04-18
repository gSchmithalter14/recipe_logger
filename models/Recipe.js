const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recipeSchema = new Schema({
	name: {
		type: String,
		required: [true, 'Name is required'],
	},
	description: {
		type: [true, 'Description is required'],
	},
	duration: {
		type: String,
	},
	image: {
		type: String,
	},
	owner: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
		username: String,
	},
	steps: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Step',
		},
	],
})

module.exports = mongoose.model('Recipe', recipeSchema)
