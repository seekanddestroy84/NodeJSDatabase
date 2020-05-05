// JavaScript source code
const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const Data = require('../models/Data');
const Memos = require('../models/Memos');


// **** start of users stuff **** //
// ROUTES //
// getting all users //
router.get('/GetAllUsers', async (req, res) => {
    console.log("getting to here ");
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

// getting a user by an attribute //
router.get('/GetUser/:data', async (req, res) => {
    console.log(req.params.data);
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



// user logs in //
router.get('/LoginWithEmailPassword/:email/password/:password/department/:department', async (req, res) => {

    try {
        const user = await User.find();
        var email = req.params.email;
        var password = req.params.password;
        var department = req.params.department;

        if (email == "" || password == "") {
            res.json({ message: "Email or password cannot be left blank" });
        } else {
            var exists = false;
            var tempUserObject;

            for (var i = 0; i < user.length; i++) {

                var userObject = user[i];

                if (userObject.department != undefined) {
                    if (userObject.email == email && userObject.password == password && userObject.department == department) {
                        exists = true;

                        const user = new User({
                            email: userObject.email,
                            role: userObject.role,
                            password: "",
                            department: userObject.department,
                            phone: userObject.phone,
                            firstName: userObject.firstName,
                            lastName: userObject.lastName,
                            ext: userObject.ext,
                            dateCreated: userObject.dateCreated,
                            userCreated: userObject.userCreated,
                            dateUpdated: userObject.dateUpdated,
                            userUpdated: userObject.userUpdated,
                            active: userObject.active
                        });


                        tempUserObject = user;
                    }
                }


            }

            if (exists) {
                console.log("exists");
                res.json({message: tempUserObject });
            } else {
                console.log("Does not exist");
                res.json({ message: null });
            }
        }


    } catch (err) {
        res.json({ message: err });
    }

});

// adding a new user //
router.post('/AddUser', async (req, res) => {

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


// deleting a user //
router.delete('/DeleteUser/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);

        res.json(user);
    } catch (err) {
        res.json({ message: err });
    }

});


router.put('/UpdateUser/:id', async (req, res) => {

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

// moving on to the IT section //
// getting all the tickets //
router.get('/GetAllTickets', async (req, res) => {
    console.log("getting to here yo...");
    try {
        const data = await Data.find();
        
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
});


// getting a specific ticket by email, department, or priority //
router.get('/GetTicket/:data', async (req, res) => {

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



// adding a ticket //
router.post('/AddTicket', async (req, res) => {

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



// deleting a ticket by ID //
router.delete('/DeleteTicket/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const data = await Data.findByIdAndDelete(id);

        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }

});

router.put('/UpdateTicket/:id', async (req, res) => {

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
router.get('/GetAllMemos', async (req, res) => {
    
    try {
        const data = await Memos.find();
        
        res.json(data);
    } catch (err) {
        res.json({ message: err });
    }
});



// getting a specific memo by id //
router.get('/GetMemo/:id', async (req, res) => {
    
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

// adding a ticket //
router.post('/AddMemo', async (req, res) => {

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

router.delete('/DeleteMemos/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const memo = await Memos.findByIdAndDelete(id);
        res.json(memo);
    } catch (err) {
        res.json({ message: err });
    }
});



router.put('/UpdateMemo/:id', async (req, res) => {


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


module.exports = router;


