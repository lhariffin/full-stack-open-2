const express = require('express')
var morgan = require('morgan')

morgan.token('body', function (req) {
    return JSON.stringify(req['body'])
})

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const info = `Phonebook has info for ${persons.length} people`
    const date = `${new Date()}`
    response.send(`<p>${info} <br/> ${date}</p>`)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// const generateId = () => {
//     const maxId = persons.length > 0
//       ? Math.max(...persons.map(p => p.id))
//       : 0
//     return maxId + 1
// }
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'name/number missing' 
        })
    }
    if (persons.find(person => person.name === body.name)) {
        return response.status(409).json({ 
            error: 'name must be unique' 
            })
    }
  
    const person = {
        "id": Math.floor(Math.random() * 999),
        "name": body.name, 
        "number": body.number
    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})