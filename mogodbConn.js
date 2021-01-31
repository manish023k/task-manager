// const mongodb = require('mongodb'); //take npm library of mongodb native driver to connect the node application with mongodb database
// const MongoClient = mongodb.MongoClient; // it contaon a function that help node app to connect with mongodb database  
const { MongoClient, ObjectID } = require('mongodb');
const connectionUrl = 'mongodb://127.0.0.1:27017'; //connectionurl to connect with the mongodb database
const databaseName = 'task-manager'; //collection name

// elaborate ObjectID
const id = ObjectID();
// console.log(id);
// console.log(id.getTimestamp());
// console.log(id.id.length);
// console.log(id.toHexString().length);
MongoClient.connect(connectionUrl, { useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log('unable to connect with database....');
    }
    const db = client.db(databaseName);
    // db.collection('user').insertOne({
    //     name: "jagdish kumar",
    //     age: 40
    // }, (error, result) => {

    //     if (error) {
    //         return console.log("please insert the data...");
    //     }
    //     console.log(result.ops);//ops is an array that contains all the documents
    // })
    db.collection('task').insertMany([{
        tname: "watring trees",
        completed: true
    },
    {
        tname: "morning walk",
        completed: true
    },
    {
        tname: "working on laptop",
        completed: false
    }
    ], (error, result) => {

        if (error) {
            return console.log("please enter some data to insert...")
        }
        console.log(result.ops);
    })


    //findone() is used to fetch the single document from the collection

    // db.collection('task').findOne({_id:new ObjectID("5ff8941eb73c781e2c7eccf2")},(error,tasks)=>
    // {
    //     if(error)
    //     {
    //         return console.log("try again....");
    //     }
    //     console.log(tasks);
    // })


    //find() is used to fetch the multiple documents from the collection

    // db.collection('task').find({completed:true}).toArray((error,completedTask)=>{
    //     console.log(completedTask);

    // })
    // db.collection('task').find({completed:true}).count((error,countTask)=>{
    //     console.log(countTask);
    // })

    //udateOne to update spicific field
    // db.collection('user').updateOne({
    //     _id: new ObjectID("5ff892cee49dab0410ca9e6b")
    // }, {
    //     $set: {
    //         name:"jagdish kumar"
    //     }
    // }).then((result) => { console.log(result) }).catch(error => console.log(error));


    //updateMany()

    // db.collection('task').updateMany({completed:false},{
    //     $set:{
    //         completed:true
    //     }
    // }).then(result=>console.log(result)).catch(error=>console.log(error));


    //delete the single task from task
    // db.collection('task').deleteOne({
    //     _id:new ObjectID("5ff8941eb73c781e2c7eccf1")
    // }).then(result=>console.log(result)).catch(error=>console.log(error));

})




