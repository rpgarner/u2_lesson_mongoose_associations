const { model } = require('mongoose')
const TaskSchema = require('./task')
const UserSchema = require('./user')

const User = model('users', UserSchema)
const Task = model('tasks', TaskSchema)

module.exports = {
    User,
    Task
}