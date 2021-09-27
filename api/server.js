// IMPORTS AT THE TOP
const express = require('express')
const Dog = require('./dog-model.js')

// INSTANCE OF EXPRESS APP
const server = express()

// GLOBAL MIDDLEWARE //
server.use(express.json()) // teaches express to read JSON

// ENDPOINTS
// [GET] / (Hello World endpoint)
server.get('/', (req, res) => {
  res.status(200).json({ message: 'hey there' })
})


//Alternative #1 .then() and .catch
// [GET] /api/dogs (R of CRUD, fetch all dogs)
// server.get('/api/dogs', (req, res) => {
//   Dog.findAll()
//     .then(dogs => {
//       res.status(200).json(dogs)
//     })
//     .catch(err => {
//       console.log(err)
//       res.status(500).json({ message: err.message })
//     })
// })

//Alternative #2 more modern using async/await combo
server.get('/api/dogs', async (req, res) => {
  try {
    const dogs = await Dog.findAll()
    // console.log(dogs);
    res.json(dogs)
  } catch (err) {
    res.status(500).json({
      message: err.message,
      customMessage: 'somethhing went wrong'
    })
  }
})
// [GET] /api/dogs/:id (R of CRUD, fetch dog by :id)
// server.get('/api/dogs/:id', (req, res) => {
//   console.log('this is the id', req.params.id)
//   Dog.findById(req.params.id)
//     .then(dog => {
//       console.log(dog)
//       if (dog) {
//         res.status(200).json(dog)
//       } else {
//         console.log('methings this is it')
//         res.status(404).json({ message: 'not found' })
//       }
//     })
//     .catch(err => {
//       console.log(err)
//       res.status(500).json({ message: err.message })
//     })
// })

//Newer modern method
server.get('/api/dogs/:id', async (req, res) =>{
  try{
    const { id } = req.params
    console.log(id);
    const dog = await Dog.findById(req.params.id)
    console.log(dog);
    if (!dog) {
      res.status(404).json({
        message: `no dog with id ${id}`
      })
    }
  }
  catch (err) {
    res.status(500).jso ({
      message: err.message, 
      customMessage: 'something went wrong again'
    })
  }
})




// [POST] /api/dogs (C of CRUD, create new dog from JSON payload)
//Older method
// server.post('/api/dogs', (req, res) => {
//   const newDog = req.body
//   Dog.create(newDog)
//     .then(dog => {
//       res.status(201).json(dog)
//     })
//     .catch(err => {
//       console.log(err)
//       res.status(500).json({ message: err.message })
//     })
// })

//Newer Method
server.post('/api/dogs', async (req, res) => {
  try{
    const { name, weight } = req.body
    if (!name || !weight) {
      res.status(400).json({
        message: 'new dogs need name and weight'
      })
    } else {
      const newDog = await Dog.create({ name, weight })
      console.log(newDog);
      res.status(200).json(newDog)
    }
    console.log(name, weight);
  }catch (err){
    res.status(500).json({
      message: err.message,
      customMessage: 'something went wrong'
    })
  }
})

//Older method
// [PUT] /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
// server.put('/api/dogs/:id', async (req, res) => {
//   const { id } = req.params
//   const changes = req.body
//   console.log(id, changes)
//   try {
//     const result = await Dog.update(id, changes)
//     res.status(200).json(result)
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ message: err.message })
//   }
// })

//Newer Moder method
server.put('/api/dogs/:id', async (req, res) =>{
  try{
    const { name, weight } = req.body
    const { id } = req.params
    if (!name || !weight) {
      res.status(400).json({
        message: 'new dogs need name and weight'
      })
    } else {
      const updateDog = await Dog.update(id, { name, weight })
      console.log(updateDog)
      res.json(updateDog)

    }
  }catch (err){
    res.status(500).json({
      message: err.message,
      customMessage: 'something went wrong'
    })
  }
})



// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)
//Older Method
// server.delete('/api/dogs/:id', (req, res) => {
//   Dog.delete(req.params.id)
//     .then(dog => {
//       if (dog) {
//         res.status(200).json(dog)
//       } else {
//         res.status(404).json({
//           message: `dog ${req.params.id} not real!!!`,
//         })
//       }
//     })
//     .catch(err => {
//       console.log(err)
//       res.status(500).json({ message: err.message })
//     })
// })

//Newer Method
server.delete('/api/dogs/:id', async (req, res) =>{
  try{
  // const { id } = req.params
    const deletedDog = await Dog.delete(req.params.id)
    console.log(deletedDog)
    if (!deletedDog) {
      res.status(404).json({
        message: `dog with id ${req.params.id} does not exist`
      })
    } else {
      res.json(deletedDog)
    }
  } catch (err) {
    res.status(500).json ({
      message: err.message,
      customMessage: "something went wrong"
    })
  }
})

// EXPOSING THE SERVER TO OTHER MODULES
module.exports = server
