require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Phone = require('./models/phone')

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

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

app.get('/', (request, response) => {
    response.redirect('/build/index.html')
  })

app.get('/api/persons', (request, response) => {
  Phone.find({}).then(persons => {
    response.json(persons)
  })
  })

app.get('/api/persons/:id', (request, response, next) => {
  Phone.findById(request.params.id).then(phone => {
    if (phone) {
      response.json(phone)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log(error)
    next(error)
  })
})

app.get('/info', (request,response) =>{
    const totalpersons= persons.length
    const date = new Date()

    response.send(`<p> Phoneboock has info for ${totalpersons} people </p>
                <p>${date}</p>`)
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phone.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
 }
)


const generateId = () => {
    const maxId = persons.length > 0
      ? Math.floor(Math.random()*1000000)
      : 0
    return maxId + 1
  }

 
  
app.post('/api/persons', (request, response, next) => {
const body = request.body
console.log(body)

  if (!body.name || !body.number) {
      return response.status(400).json({ 
      error: 'content missing' 
      })
  }
  let findName = persons.find(person => person.name === body.name)

  if(findName){
      return response.status(400).json({ 
          error: 'Name must be unique' 
          })

  }
  const person = new Phone ({
      name: body.name,
      number: body.number,
      id: generateId(),
  })

  
  person.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})