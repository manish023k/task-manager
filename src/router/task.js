const express=require('express');
const Task =require('../db/task');
 const router=new express.Router();
 const auth=require('../midleware/auth');
 
//creating a new task
router.post('/tasks',auth, async (req, res) => {

    // const task = new Task(req.body);
    const task = new Task({
        ...req.body,
        owner:req.user._id
    });
    // task.save().then(() => {
    //     res.status(201).send(task);
    // }).catch(e => res.status(400).send(e));
    try {
        task.save();
        res.status(201).send(task);

    } catch (error) {
        res.status(400).send(error);
    }
})



//read all tasks by query string /tastks?completed=true or false 
router.get('/tasks',auth,async (req, res) => {

    // Task.find().then((tasks) => {
    //     res.send(tasks);
    // }).catch(e => res.status(500).send())


    try {
        const match={};
        const sort={};

        if(req.query.completed)
        {
            match.completed=req.query.completed === 'true';
        }
        if(req.query.sortBy)
        {
            const parts=req.query.sortBy.split(',');
            sort[parts[0]]=parts[1] === 'asc' ? 1 : -1;
        }
        // const task=await Task.find({owner:req.user._id});
        // alternate way to do above 
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.status(200).send(req.user.tasks);
        // res.status(200).send(task);
        
    } catch (error) {
        res.status(500).send();
    }
})


//read user by id
router.get('/tasks/:id',auth,async (req, res) => {

    const _id = req.params.id;
    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send()
    //     }
    //     res.send(task);Task
    // }).catch(e => res.status(500).send());


    try {
        const ta=await Task.findOne({_id,owner:req.user._id});  //we check that the auth user id ===_id and owner _id
        if(!ta)
        {
            return res.status(404).send();
        }
        res.send(ta);
        
    } catch (error) {
        res.status(500).send();
    }
})

//update the task by id
router.patch('/tasks/:id',auth,async (req,res)=>{
    const wantToUpdates=Object.keys(req.body);
    const allowUpdate=["completed","description"];
    const granted=wantToUpdates.every((wantToUpdate)=>allowUpdate.includes(wantToUpdate))

    if(!granted)
    {
        res.status(400).send({Error:"invalid Parameter..."});
    }
    const _id=req.params.id;
    try {
        // const task= await Task.findById(_id);
        const task= await Task.findOne({_id,owner:req.user._id});
        // const task=await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true});
        if(!task)
        {
            res.status(404).send();
        }
        wantToUpdates.forEach((update)=>task[update]=req.body[update]);
        await task.save();
        res.status(200).send(task);
    } catch (error) {
        res.status(400).send();
    }
})

//delete the task by id
router.delete('/tasks/:id',auth,async (req,res)=>{
    const _id=req.params.id;
    try {
        // const task=await Task.findByIdAndDelete(_id);
        const task=await Task.findOneAndDelete({_id,owner:req.user._id}); //choose the single task that is auth and _id=req.params.id
        // await Task.remove()
        if(!task)
        {
            return res.status(404).send()
        }
        res.send(task);
    } catch (error) {
        res.status(500).send();
    }
})

//logging in system in task
router.patch('')
module.exports=router;