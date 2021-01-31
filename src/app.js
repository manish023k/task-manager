const express = require('express');
require('./db/conn.js');
const userRouter = require('../src/router/user');
const taskRouter = require('../src/router/task');
const bcrypt = require('bcrypt');
const multer = require('multer');


const app = express();
const port = process.env.PORT;

//creating the mildleware function that helps to authenticate the user
// app.use((req,res,next)=>{
//     if(req.method=='GET' || req.method=='PATCH' || req.method=='DELETE') {
//         res.status(503).send('you cant access these pages');
//  }
//  else{
//      next();
//  }
// })

app.use(express.json());//change the json input coming from the client into object so that req handler can access it.
app.use(userRouter); //registered the user all router in app
app.use(taskRouter);


//uploading files from postman
const allowUpload = multer({
    dest: 'documents',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return callback(new Error('please! select the document file..'));
        }
        callback(undefined, true);
    }
})
app.post('/users/me/upload', allowUpload.single('upload'), (req, res) => {
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({
        Error: error.message
    })
})


app.listen(port, () => {
    console.log("the app is serving on port " + port);

})

const fun = async () => {
    const password = 'manish123';
    const hashPassword = await bcrypt.hash(password, 8);
    console.log(password, hashPassword);
    const re = await bcrypt.compare('manish123', hashPassword);
    console.log(re);
}
// fun();