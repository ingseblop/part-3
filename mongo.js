const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

if (process.argv.length > 3 && process.argv.length < 6) {
  console.log('Please provide the name, number and id as an argument')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const id = process.argv[5]

const url = `mongodb+srv://sebalop:${password}@cluster0.wavrkkf.mongodb.net/?retryWrites=true&w=majority`

const PhoneSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number,
})

const Phone = mongoose.model('Phone', PhoneSchema)

if (process.argv.length === 6){
mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    const phone = new Phone({
      name: name,
      number: number,
      id: id
    })

    return phone.save()
  })
  .then(() => {
    console.log(`Added ${name} number ${number} to phonebook!`)
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))
}

if(process.argv.length === 3){
  
  mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')
  })
  console.log('Phonebook:')
  Phone.find({}).then(result => {
    
    result.forEach(phone => {
      
      console.log(phone)
    })
    mongoose.connection.close()
  })
  .catch((err) => console.log(err))
}