//using object destructuring
const {MongoClient,ObjectID}=require('mongodb');

const connectionUrl="mongodb://127.0.0.1:27017";
const databaseName="student";
 
//making the connection using mongoclient
MongoClient.connect(connectionUrl,{useUnifiedTopology:true},(error,client)=>{
    if(error)
    {
        return console.log("unable to connect...");
    }
    // console.log("conected........");
    const db=client.db(databaseName);
    db.collection('enroll').insertOne({name:"manish kumar",class:"B.tech"},(error,result)=>{
        if(error)
        {
            return console.log("please check your connection....");
        }
        console.log(result.ops);
    })

})
