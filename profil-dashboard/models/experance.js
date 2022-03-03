const mongoose = require("mongoose");

const schema =mongoose.Schema; 

var experanceSchema = new schema({
    name:{ 
                type:String,
                required:true
            },
            
            degree:{
                type:Number,
                required:true,
            },
           
        },
            {
                timestamps:true}
        
);
 
var experanceModel=mongoose.model('experance',experanceSchema);
 
module.exports = experanceModel;