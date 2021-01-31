const mongoose = require('mongoose');
// const User=require('./user.js');


//creating the mongoose schema 
const taskSchema=mongoose.Schema({
    description: {
        type: String,
        required:true,
        trim:true
    },
    completed: {
        type: Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
});


// creating the task model 
const Task = mongoose.model('Task',taskSchema );
module.exports=Task;