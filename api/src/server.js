const path = require('path');
let configPath = path.resolve(__dirname , 'config.env')
const dotenv = require('dotenv');
dotenv.config({path: configPath});
const mongoose = require('mongoose');
const app = require('./app');
const delay = async (delaySeconds)=>{
    return new Promise((resolve)=>{
        setTimeout(resolve, delaySeconds * 100);
    })
}
module.exports =  connectToDatabase = async ()=>{
    while (true)
    {
        try {
            mongoose.set('strictQuery', true);
            await mongoose.connect(process.env.DATABASE , {
                useNewUrlParser: true,
                autoIndex:true,
            })
            console.log("Database connection successful");
            break;
        }
        catch (err)
        {   
            console.log("Database connection failed retry in 2 seconds");
            await delay(1);
        }
    }
}

app.listen(process.env.PORT , ()=>{
    console.log(`server listening on port ${process.env.PORT} `)
})
connectToDatabase();