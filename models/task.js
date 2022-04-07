const {Schema} = require('mongoose')

const Task = new Schema(
    {
        title: { type: String, require: true },
        description: { type: String, required: true }
    },
    {timestamps: true }
)

module.export = Task