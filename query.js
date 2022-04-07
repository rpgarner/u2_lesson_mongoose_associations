const db = require('./db')
const { User, Task } = require('./models')

const findAllUsers = async () => {
  const users = await User.find()
  console.log('All users:', users)
}

const findAllTasks = async () => {
    const tasks = await Task.find()
    console.log('All tasks:', tasks)
  }

const findOnewithTasks = async () => {
    const user1 = await User.findOne().populate('tasks')
    console.log(user1)
}

const run = async () => {
    try {
        await findOnewithTasks()
    }  catch (error) {
        console.log(error)
      } finally {
        await db.close()
      }

}

run()