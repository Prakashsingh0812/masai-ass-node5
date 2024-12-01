const exp = require('express');
const users = require('./MOCK_DATA.json')
const fs = require('fs');
const mongoose = require('mongoose');
const { type } = require('os');
mongoose.connect('mongodb://127.0.0.1:27017/project-nodepractice').then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{console.log('error connecting to MongoDB', err)})


const app = exp();
const port = 5000;

//middle ware
app.use(exp.urlencoded({extended:false}));


app.get('/users', async (req, res) => {
    try {
        // Retrieve all users from the MongoDB collection
        const users = await Model.find();
        return res.json(users);
    } catch (err) {
        // Handle any errors that occur
        return res.status(500).json({ status: "error", message: err.message });
    }
});

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Query the database for the user with the given ID
        const user = await Model.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Return the user data as JSON
        return res.json(user);
    } catch (err) {
        // Handle invalid ID format or other errors
        return res.status(500).json({ error: 'An error occurred', details: err.message });
    }
});
app.post('/api/users', async (req, res) => {
    const body = req.body;

    // Create a new user using the Mongoose model
    const newUser = new Model({
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        age: body.age,
        address: body.address
    });

    try {
        // Save the user to the database
        const savedUser = await newUser.save();
        console.log(savedUser);
        return res.json({ status: "success", id: savedUser._id });
        
    } catch (err) {
        // Handle validation errors or other database errors
        return res.status(500).json({ status: "error", message: err.message });
    }
});

//schma
const schema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true
    },
    lastName: {type: String,},
    email: {type: String, required: true, unique: true},
    age: {type: Number, required: true},
    address: {type: String, required: true}
});
const Model = mongoose.model('Test', schema);






app.listen(port, () =>console.log('server started on port ' + port));