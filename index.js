require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Phone = require('./models/phone')



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



app.delete('/api/persons/:id', (request, response, next) => {
  Phone.findByIdAndRemove(request.params.id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const person = new Phone ({
    name: body.name,
    number: body.number,
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


// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})