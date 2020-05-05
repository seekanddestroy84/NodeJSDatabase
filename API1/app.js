// JavaScript source code //
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const User = require('./models/Users');
const Data = require('./models/Data');
const Memos = require('./models/Memos');

const jwt = require('express-jwt');
var jwks = require('jwks-rsa');

require('dotenv/config');

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://dev-z054bswt.auth0.com/.well-known/jwks.json'
    }),
    audience: 'it-ticketing-app',
    issuer: 'https://dev-z054bswt.auth0.com/',
    algorithm: [256]
});

app.use(bodyParser.json());
app.use(cors());


// **** start of users stuff **** //
// ROUTES //

// **** Protected **** //
// users needs to be protected //
app.get('/GetAllUsers', jwtCheck , async (req, res) => {
    try {
        const user = await User.find();

        // zeroing out the password so it cant be seeeeeeeeeen //
        for (var i = 0; i < user.length; i++) {
            user[i].password = "";

        }
    
        res.json(user);
    } catch(err){
        res.json({ message: err });
    }
});


// **** Protected **** //
// getting a user by an attribute //
app.get('/GetUser/:data', jwtCheck, async (req, res) => {
    try {
        const user = await User.find();
        var tempArray = [];
        for (var i = 0; i < user.length; i++) {
            
            var userObject = user[i];
            userObject.password = "";
            var param = req.params.data;
            if (userObject.email == param ||
                userObject.firstName == param ||
                userObject.lastName == param ||
                userObject.department == param ||
                userObject._id == param) {

                tempArray.push(user[i]);
            } 
        }
        console.log("temp -> " + tempArray);
        res.json(tempArray);

    } catch (err) {
        res.json({ message: err });
    }
});




// **** Protected **** //
// adding a new user //
app.post('/AddUser', jwtCheck ,async (req, res) => {

    var dateTime = new Date().toISOString();

    const user = new User({
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        department: req.body.department,
        phone: req.body.phone,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        ext: req.body.ext,
        dateCreated: dateTime,
        userCreated: req.body.userCreated,
        dateUpdated: dateTime,
        userUpdated: req.body.userUpdated,
        active: req.body.active
    });

    try {

        const totalUsers = await User.find();
        var exists = false;
        for (var i = 0; i < totalUsers.length; i++) {
            if (totalUsers[i].email == user.email) {
                exists = true;
            }
        }

        if (exists == false) {
            const savedUser = await user.save();
            res.json(savedUser);
        } else {
            res.json({ message: "User already has an account" });
        }
        
    } catch (err) {
        res.json({ message: err });
    }
    
});


// **** Protected **** //
// deleting a user //
app.delete('/DeleteUser/:id', jwtCheck , async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);

        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }

});

// **** Protected **** //
// needs to be protected //
app.put('/UpdateUser/:id', jwtCheck , async (req, res) => {

    var dateTime = new Date().toISOString();

    try {
        const id = req.params.id;

        const user = await User.findByIdAndUpdate(id, {
            email: req.body.email,
            role: req.body.role,
            password: req.body.password,
            department: req.body.department,
            phone: req.body.phone,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            ext: req.body.ext,
            dateCreated: dateTime,
            userCreated: req.body.userCreated,
            dateUpdated: dateTime,
            userUpdated: req.body.userUpdated,
            active: req.body.active
        }, { new: false }, (error, response) => {
            if (error) {
                console.log("error " + error);
            } else {
                console.log("Good to go.");
            }
        });

        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }
});

// **** end of user stuff **** //





// **** start of IT section **** //
// getting all the tickets //


// **** Protected **** //
// needs to be protected //
app.get('/GetAllTickets', jwtCheck , async (req, res) => {
    try {
        const data = await Data.find();
        
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
});

// **** Protected **** //
// getting a specific ticket by email, department, or priority //
app.get('/GetTicket/:data', jwtCheck , async (req, res) => {

    try {
        const data = await Data.find();
        var tempArray = [];
        for (var i = 0; i < data.length; i++) {
            console.log(data[i].subject);
            var dataObject = data[i];
            var param = req.params.data;
            if (dataObject.fromEmail == param ||
                dataObject.department == param ||
                dataObject.priority == param ||
                dataObject._id == param) {

                tempArray.push(data[i]);
            }
        }
        res.json(tempArray);

    } catch (err) {
        res.json({ message: err });
    }
});


// does not need to be protected //
// adding a ticket //
app.post('/AddTicket', async (req, res) => {

    var dateTime = new Date().toISOString();
    var comments = [];
    var assigned = [];

    
    const data = new Data({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        subject: req.body.subject,
        fromEmail: req.body.fromEmail,
        phone: req.body.phone,
        dateCreated: dateTime,
        description: req.body.description,
        assigned: assigned,
        priority: req.body.priority,
        complete: req.body.complete,
        dateCompleted: req.body.dateCompleted,
        department: req.body.department,
        comments: comments
    });
    try {
        const savedData = await data.save();
        res.json(savedData);
    } catch (err) {
        res.json({ message: err });
    }
});


// **** Protected **** //
// deleting a ticket by ID //
app.delete('/DeleteTicket/:id', jwtCheck , async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Data.findByIdAndDelete(id);

        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }

});

// **** Protected **** //
app.put('/UpdateTicket/:id', jwtCheck ,async (req, res) => {

    try {
        const id = req.params.id;

        const data = await Data.findByIdAndUpdate(id, {
            subject: req.body.subject,
            fromEmail: req.body.fromEmail,
            dateCreated: req.body.dateCreated,
            body: req.body.body,
            assigned: req.body.assigned,
            priority: req.body.priority,
            complete: req.body.complete,
            dateCompleted: req.body.dateCompleted,
            department: req.body.department,
            comments: req.body.comments
        }, { new: false }, (error, response) => {
            if (error) {
                console.log("error " + error);
            } else {
                console.log("Good to go.");
            }
        });

        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
});

// **** end of IT stuff **** //

// **** start of Memos stuff **** //
// does not need to be protected //
app.get('/GetAllMemos', async (req, res) => {
    
    try {
        const data = await Memos.find();
        
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
});


// **** Protected **** //
// getting a specific memo by id //
app.get('/GetMemo/:id', jwtCheck ,async (req, res) => {
    try {
        const data = await Memos.find();
        var tempArray = [];
        for (var i = 0; i < data.length; i++) {
            var dataObject = data[i];
            var param = req.params.id;
            if (dataObject._id == param) {
                tempArray.push(data[i]);
            }
        }
        res.json(tempArray);

    } catch (err) {
        res.json({ message: err });
    }

});

// **** Protected **** //
// adding a memo //
app.post('/AddMemo', jwtCheck , async (req, res) => {

    var dateTime = new Date().toISOString();

    const data = new Memos({
        title: req.body.title,
        content: req.body.content,
        dateCreated: dateTime,
        media: req.body.media,
        archived: req.body.archived,
        department: req.body.department
    });
    try {
        const savedData = await data.save();
        res.json(savedData);
    } catch (err) {
        res.json({ message: err });
    }
});

// **** Protected **** //
app.delete('/DeleteMemos/:id', jwtCheck ,async (req, res) => {
    const id = req.params.id;
    try {
        const memo = await Memos.findByIdAndDelete(id);
        res.json(memo);
    } catch (err) {
        res.json({ message: err });
    }
});


// **** Protected **** //
app.put('/UpdateMemo/:id', jwtCheck , async (req, res) => {
    try {
        var dateTime = new Date().toISOString();
        const id = req.params.id;

        const data = await Memos.findByIdAndUpdate(id, {
            title: req.body.title,
            content: req.body.content,
            dateCreated: dateTime,
            media: req.body.media,
            archived: req.body.archived,
            department: req.body.department
        }, { new: false }, (error, response) => {
            if (error) {
                console.log("error " + error);
            } else {
                console.log("Good to go.");
            }
        });

        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
});


// Connect to DB //
mongoose.connect(process.env.DB_CONNECTION_DATA, { useNewUrlParser: true }, () => {
    console.log("connected! Database");
});


app.listen(3000);
