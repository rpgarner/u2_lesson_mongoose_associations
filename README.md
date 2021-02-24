# MongoDB Associations

## Overview

In this lesson we'll learn how to properly associate and establish relationships between the data stored in a database. By associating data, we can eliminate the need for duplicate data entries and a more organized data structure when retrieving the data.

## Getting started

1. Fork
1. Clone

## What Are Associations/Relationships

In order to understand how and why we set up relationships, read the following article: [Modeling Relationships in MongoDB](https://betterprogramming.pub/modeling-relationships-in-mongodb-b69b93181c48)

As you can see, there are many different ways of associating data with MongoDB. There are trade offs to every type of association. What's important to understand, is how to set up the associations.

You'll typically see the following:

- One-To-Many
- Many-To-Many

## MongoDB: One-to-Many Relationships

> Take five minutes and read the MongoDB docs on relationships:

- **[MongoDB One-To-Many Embedded](https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-many-relationships-between-documents)**
- **[One To Many Referenced](https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents)**

> Once again, what are the trade-offs between **embedding** a document vs **referencing** a document?

What's a one-to-many relationship? A common example is a blog app. A blog has users, a user can have many blog posts. One-to-many relationships are quite common and we need to know how to implement them on the database level.

In MongoDB we can create a one-to-many relationship by either:

1. embedding the related documents
2. referencing the related document(s)

There are trade-offs to each. We should understand them and pick what suits our use case best.

Let's consider a few examples!

### Embedding Documents Example 1

_**[MongoDB One-To-Many Embedded](https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-many-relationships-between-documents)**_

Consider the following `user` document with many `address`'s embedded in it:

```js
{
   _id: ObjectId("3e399709171f6188450e43d2"),
   name: "Joe Schmoe",
   address: [
      {
        street: "123 Fake Street",
        city: "Faketon",
        state: "MA",
        zip: "12345"
      },
      {
        street: "1 Some Other Street",
        city: "Boston",
        state: "MA",
        zip: "12345"
      }
   ]
}
```

Embedding related documents is quite common in MongoDB - it's powerful.

This approach is excellent when we plan on creating queries to fetch the user and the user's related addresses.

However, this design falls short when we plan on creating queries that only care about the user and not the address because when we request for the user collection, in this data model, we also get back the related addresses.

It also falls short if we plan on querying for a list of addresses because the addresses are nested within the users.

On the upside, this approach is excellent when we know the embedded documents will not grow too much e.g. a user has one or maybe a few addresses, but its safe to expect that on average a user will not have too many addresses otherwise it would be better off to place the addresses in a separate collection.

### Referencing Documents Example 1

_**[One To Many Referenced](https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents)**_

Let's see how we would model the same data by having addresses **reference** a user document:

```js
{
   _id: ObjectId("3e399709171f6188450e43d2"),
   name: "Joe Schmoe"
}

{
   _id: ObjectId("9e391709171f6188450e43f4"),
   user_id: ObjectId("3e399709171f6188450e43d2"),
   street: "123 Fake Street",
   city: "Faketon",
   state: "MA",
   zip: "12345"
}

{
   _id: ObjectId("8s32170987gf6188450y43f2"),
   user_id: ObjectId("3e399709171f6188450e43d2"),
   street: "1 Some Other Street",
   city: "Boston",
   state: "MA",
   zip: "12345"
}
```

This design is great for when you expect the address documents to grow. In this design we can have as many address documents as we would like without affecting performance on the user collection!

In this design it's also fast to query the user collection because there are no embedded address documents inside the user documents. It's also fast to query the address collection.

However, this design is not the best if we plan on querying users and their related addresses because the relationship exists on the address document - we would have to query all the addresses to find the users' addresses. Where as in the previous model we can lookup one user and we know all their associated addresses.

### Embedding Documents Example 2

_**[MongoDB One-To-Many Embedded](https://docs.mongodb.com/manual/tutorial/model-embedded-one-to-many-relationships-between-documents)**_

Let's take a look at the following `task` document and its associated embedded `user` document:

```js
{
   _id: ObjectId("2e399709171f6188450e43d2")
   title: "Learn JavaScript",
   description: "Take a coding bootcamp on JavaScript",
   status: "active",
   user: {
              first_name: "Joe",
              last_name: "Schmoe",
              email: "j.schmoe@gmail.com",
              job_title: "Junior Developer"
         }
}

{
   _id: ObjectId("8e399709171f6588450e43g2")
   title: "Learn React",
   description: "Take a coding bootcamp on React",
   status: "active",
   user: {
              first_name: "Joe",
              last_name: "Schmoe",
              email: "j.schmoe@gmail.com",
              job_title: "Junior Developer"
         }
}
```

There is a code smell here: repetition. This is a common problem when we are modeling data. We see that we're duplicating the user document inside the task document. We are associating via an embedded document but the association is a bit inefficient.

There is a better way - using document referencing.

## Referencing Documents Example 2

_**[One To Many Referenced](https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents)**_

Using document referencing we model the `user`/`tasks` relationship better:

`user` document

```js
{
  _id: ObjectId("4e339749175f6147450e43d1")
  first_name: "Joe",
  last_name: "Schmoe",
  email: "j.schmoe@gmail.com",
  job_title: "Junior Developer",
  tasks: [ ObjectId("2e399709171f6188450e43d2"), ObjectId("8e399709171f6588450e43g2") ]
}
```

`task`s documents

```js
{
   _id: ObjectId("2e399709171f6188450e43d2")
   title: "Learn JavaScript",
   description: "Take a coding bootcamp on JavaScript",
   status: "active"
}

{
   _id: ObjectId("8e399709171f6588450e43g2")
   title: "Learn React",
   description: "Take a coding bootcamp on React",
   status: "active"
}
```

This is a common way to model one-to-many relationships where we know we plan on creating requests for a user and all their associated tasks. Instead of embedding tasks within the user document, we embed the task id. This is more efficient. Our user document stays small. Its efficient to request all users or a specific user. This model supports a data model where a user can have many tasks because all we're storing is the task id inside the user document - so it doesn't take up much space in the user document. And if we do want the task data we can request it from the tasks collection based on the task id found in the user document.

## Referencing Documents Example 3

> https://docs.mongodb.com/manual/tutorial/model-referenced-one-to-many-relationships-between-documents/

Let's consider one more way of modeling a relationship:

`user` document

```js
{
  _id: ObjectId("4e339749175f6147450e43d1")
  first_name: "Joe",
  last_name: "Schmoe",
  email: "j.schmoe@gmail.com",
  job_title: "Junior Developer"
}
```

`task`s documents

```js
{
   _id: ObjectId("2e399709171f6188450e43d2")
   title: "Learn JavaScript",
   description: "Take a coding bootcamp on JavaScript",
   status: "active",
   user_id: ObjectId("4e339749175f6147450e43d1")
}

{
   _id: ObjectId("8e399709171f6588450e43g2")
   title: "Learn React",
   description: "Take a coding bootcamp on React",
   status: "active",
   user_id: ObjectId("4e339749175f6147450e43d1")
}
```

This is a common use case when we know that the associated document may grow quite a bit. This is a good way to model this relationship. We abstract the document that is likely to grow to its own collection and embed the user id that document belongs to. This is efficient because we can easily request all users or a specific user. We can easily request all tasks or a specific task. And we can request all tasks and their associated user document.

This is not efficient if we plan on requesting all users and their associated tasks.

## Exercise

Let's implement [Exhibit #2B](#referencing-documents-exhibit-2b). We have the concept tasks and users. Tasks belong to users via **referencing**. How would we create that via code?! Let's start:

```sh
cd mongodb-mongoose-relationships
npm init -y
npm install mongoose
npm install --dev faker
mkdir db models seed
touch db/index.js models/{user,task,index}.js seed/tasksUsers.js query.js
```

Create a `.gitignore` file

```sh
echo "
/node_modules
.DS_Store" >> .gitignore
```

Now let's open up Visual Studio Code and write some code:

```sh
code .
```

Inside our `db` folder we are going to use Mongoose to establish a connection to our MongoDB `tasksDatabase`:

`mongodb-mongoose-relationships/db/index.js`

```js
const mongoose = require('mongoose')

mongoose
  .connect('mongodb://127.0.0.1:27017/tasksDatabase', {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Successfully connected to MongoDB.')
  })
  .catch((e) => {
    console.error('Connection error', e.message)
  })
// mongoose.set('debug', true)
const db = mongoose.connection

module.exports = db
```

> Notice `mongoose.set('debug', true)` is commented out. This line of code is super handy if you ever need to debug any mongoDB queries. Feel free to uncomment it and use it.

Let's create our task schema:

`mongodb-mongoose-relationships/models/task.js`

```js
const { Schema } = require('mongoose')

const Task = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true }
  },
  { timestamps: true }
)

module.exports = Task
```

Now we can create our user schema:

`mongodb-mongoose-relationships/models/user.js`

```js
const { Schema } = require('mongoose')

const User = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    job_title: { type: String, required: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'tasks' }]
  },
  { timestamps: true }
)

module.exports = User
```

We'll now set up our models:

`mongodb-mongoose-relationships/models/index.js`

```js
const { model } = require('mongoose')
const TaskSchema = require('./task')
const UserSchema = require('./user')

const User = model('users', UserSchema)
const Task = model('tasks', TaskSchema)

module.exports = {
  User,
  Task
}
```

Notice how we create a tasks array that holds a **reference** to the tasks schema. Our user model now has a relationship to our task model. Our user model can hold an arrays of task ids.

Ok. Let's populate our database with data so we can query against it and make sure we setup our models correctly.

### Seed your database

**Bonus**: Try to create a script to seed users and tasks in our database.

<details><summary>Here is a solution.</summary>
<p>
   
There are many ways we could create a seed script for users and tasks. Study the code below, and reason about the code.

mongodb-mongoose-relationships/seed/tasksUsers.js

```js
const db = require('../db')
const faker = require('faker')
const { Task, User } = require('../models')

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const createTasks = async () => {
  const tasks = [...Array(400)].map((task) => {
    return new Task({
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph()
    })
  })
  await Task.insertMany(tasks)
  console.log('Created Tasks!')
  return tasks
}

const createUsersWithTasks = async (tasks) => {
  console.log(tasks)
  let lenOfItems = 100
  const users = [...Array(lenOfItems)].map((user) => {
    const selectedTasks = tasks.splice(0, tasks.length / lenOfItems)
    return {
      first_name: faker.name.firstName(),
      last_name: faker.name.lastName(),
      email: faker.internet.email(),
      job_title: faker.name.jobTitle(),
      tasks: selectedTasks.map((task) => task._id)
    }
  })
  await User.insertMany(users)
  console.log('Created Users!')
}

const run = async () => {
  const tasks = await createTasks()
  await createUsersWithTasks(tasks)
  db.close()
}

run()
```

</p>
</details>

##

Once you've written a script to seed data test it out:

```sh
node seed/tasksUsers.js
```

You should now be able to open up [MongoDB Compass](https://www.mongodb.com/products/compass) and see your database with all the seed data and proper relationship between users and tasks.

You can also test that your data and relationships are good by writing a simple query file:

`mongodb-mongoose-relationships/query.js`

```js
const db = require('./db')
const { User, Task } = require('./models')

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

const findAllUsers = async () => {
  const users = await User.find()
  console.log('All users:', users)
}

const findAllTasks = async () => {
  const tasks = await Task.find()
  console.log('All tasks:', tasks)
}

const findOneWithTasks = async () => {
  const user1 = await User.findOne({ first_name: 'Jacynthe' })
  console.log(user1)
}

const run = async () => {
  await findAllUsers()
  // await findAllTasks()
  // await findOneWithTasks()
  db.close()
}

run()
```

🎉 Congrats! We went on a journey of different ways we can create relationships in MongoDB. This knowledge will slowly settle in, the more your work with MongoDB. For now, just be aware that there are two ways to create relationships: **embedding** and **referencing**. And there are tradeoffs to both. Feel free to come back to this lesson, study it, review it, and work with it. This knowledge takes a while to solidify.

## Feedback

> [Take a minute to give us feedback on this lesson so we can improve it!](https://forms.gle/vgUoXbzxPWf4oPCX6)
