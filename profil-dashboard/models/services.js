const mongoose = require("mongoose");

const schema =mongoose.Schema; 

var servicesSchema = new schema({
    name:{ 
        type:String,
        required:true
    },
    image:{
        type:String,
       
    },
    
    descr:{
        type:String,
        required:true,
    },
    
   
},
    {
        timestamps:true}

);
 
var servicesModel=mongoose.model('services',servicesSchema);
 
module.exports = servicesModel;