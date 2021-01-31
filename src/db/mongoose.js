const mongoose = require('mongoose');
const validator = require('validator');

//building connection with database using mongooose
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true
});


//creating the scheme for the class user  or validate class User
const User = mongoose.model('User', {
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Please Enter the correct email.")
            }

        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 6) {
                throw new Error('password should be contains 6 or more characters');
            } else if (value.toLowerCase().includes('password')) {
                throw new Error('password cannot be a password');
            }
        }

    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age should be +ve");
            }
        }
    }
});



//creating the instance of the User 
// const me = new User({
//     name: "   manish kumar    ",
//     email: "MANIsHKumar023k@gmail.com   ",
//     password:'      manish1234'
// });

// saving me to database using save() that return promise
// me.save().then(resolve => console.log(resolve)).catch(error => console.log(error));

// creating the task model 
const Task = mongoose.model('Task', {
    description: {
        type: String,
        required:true,
        trim:true
    },
    completed: {
        type: Boolean,
        default:false
    }
});

// creating Task constructor to create the first document that you store in the mongodb
const shopping=new Task({
    description:"   mongoose  ",
    // completed:false
   
});


//now save to mongodb
shopping.save().then(result=>console.log(result)).catch(error=>console.log(error));
