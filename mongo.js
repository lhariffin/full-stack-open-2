const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const pasword = process.argv[2]

const url = process.env.MONGODB_URI

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
    Person.find({}).then(result => {
        console.log('connected')
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
}
else {
    const name = process.argv[3]
    const number = process.argv[4]
    mongoose
    .connect(url)
    .then((result) => {
        console.log('connected')
        const person = new Person({
            id: Math.floor(Math.random() * 999),
            name: name,
            number: number
        })
        return person.save()
    })
    .then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
}

