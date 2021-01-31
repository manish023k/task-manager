const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const Task=require('./task');

//creating the mongoose schema
const userSchema=mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique:true,
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
    },
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
    ,
avtor:{
    type:Buffer
}
}
,{
    timestamps:true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


//to hide the password and token
userSchema.methods.toJSON=function(){
    const user=this;
    const userObj=user.toObject();
    delete userObj.password;
    delete userObj.tokens;

    return userObj;
}

//to genrate the token 
userSchema.methods.genToken=async function(){
    const user =this;
    const token=await jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET);
    user.tokens=user.tokens.concat({token});
    await user.save();
    return token;
}

//makeing the user loging system in user statics is used to create the shecma methods  
userSchema.statics.findByCredentials= async (email,password)=>{

    const user=await User.findOne({email});
    if(!user)
    {
        throw new Error("Unable to LogIn");
    }
    const isEmail=await bcrypt.compare(password,user.password);
    if(!isEmail)
    {
        throw new Error("Unable to LogIn");
    }

    return user;
}

//creating the midleware to update the password
// Hash the plain text password before saving
userSchema.pre('save',async function (next){
// console.log('userschema code runinig');
const user=this;
if(user.isModified('password'))
{
    user.password=await bcrypt.hash(user.password,8);
    await Task.deleteMany({owner:user._id});
    next();
}


next();
})


//delete all tasks when user remove
userSchema.pre('remove',async function(next){
const user=this;

})

//creating the scheme for the class user  or validate class User
const User = mongoose.model('User',userSchema );

module.exports=User;