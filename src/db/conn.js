const mongoose = require('mongoose');

//building connection with database using mongooose
mongoose.connect(process.env.MONGODB_URL , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify:false,
    useUnifiedTopology:true
});