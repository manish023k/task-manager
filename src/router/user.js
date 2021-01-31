const express = require('express');
const multer = require('multer');
const sharp=require('sharp');
const User = require('../db/user');
const auth = require('../midleware/auth');
const router = new express.Router()


router.post('/users', async (req, res) => {

    const user = new User(req.body);
    // user.save().then(()=>{
    //     res.status(201).send(user);
    // }).catch(e=>res.status(400).send(e));


    //using async await
    try {
        await user.save();
        const token = await user.genToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
})

// loggingin system in User 
router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.genToken();
        res.status(200).send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
})


//logout user
router.post('/users/logout', auth, async (req, res) => {

    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token

        })
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})


//logout from all tokens
router.post('/users/logoutAll', auth, async (req, res) => {

    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
})


//read all users 
router.get('/users/me', auth, async (req, res) => {
    // User.find().then((users)=>{
    //    res.send(users);
    // }).catch(e=>res.status(500).send())

    // doing with async await 
    // try {
    //     const users = await User.find();
    //     res.status(200).send(users);

    // } catch (error) {
    //     res.status(500).send();
    // }
    res.send(req.user);

})


//read user by id
// router.get('/users/:id', async (req, res) => {  //replace with /users/me
//     const _id = req.params.id;
//     // User.findById(_id).then((user) => {
//     //     if (!user) {
//     //         return res.status(404).send();
//     //     }

//     //     res.send(user);
//     // }).catch((e) => {
//     //     res.status(500).send();
//     // })

//     //using async await
//     try {

//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send();
//         }
//         res.status(200).send(user);
//     } catch (error) {
//         res.status(500).send();
//     }

// })


//updating the user by id
router.patch('/users/me', auth, async (req, res) => {

    const wantToUpdates = Object.keys(req.body);
    const allowUpdate = ["name", "password", "age", "email"];
    const granted = wantToUpdates.every((wantToUpdate) => allowUpdate.includes(wantToUpdate));
    if (!granted) {
        return res.status(400).send({ Error: "Invalid Parameter.." });
    }
    // const _id=req.params.id;
    //  const _id=rq.user._id;

    try {
        // const user=await User.findByIdAndUpdate(_id);
        wantToUpdates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save();
        // const user=await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true});
        // if(!user)
        // {
        //     return res.status(404).send();
        // }
        // res.status(200).send(user);
        res.send(req.user);
    } catch (error) {
        res.status(400).send();
    }
})


//delete the user by id
router.delete('/users/me', auth, async (req, res) => {
    // const _id=req.params.id;
    try {
        // const user=await User.findByIdAndDelete(_id);
        // if(!user)
        // {
        //     return res.status(404).send()
        // }
        // res.send(user);

        await req.user.remove();
        res.send(req.user);
    } catch (error) {
        res.status(500).send();
    }
})


//uploading the files from the endpoint
const upload = multer({
    // dest: 'avtars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {

        if (!file.originalname.match(/\.(jpg|png|jpeg)$/)) {
            return callback(new Error('file must be a image'));
        }
        callback(undefined, true);
    }

})
router.post('/users/me/avtar', auth, upload.single('avtar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avtor =buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({
        Error: error.message
    })

})


//delete the uploaded files
router.delete('/users/me/avtar', auth, async (req, res) => {

    req.user.avtor = undefined;
    await req.user.save();
    res.send();
})

//send back the files
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avtor) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avtor)
    } catch (e) {
        res.status(404).send()
    }
})
module.exports = router;