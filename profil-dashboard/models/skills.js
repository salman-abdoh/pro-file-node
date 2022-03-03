const mongoose = require("mongoose");

const schema =mongoose.Schema; 

var skillsSchema = new schema({
    name:{ 
                type:String,
                required:true
            },
            description:{
                type:String,
                required:true,
            },
            date:{
                type:String,
                required:true,
            },
            place:{
                type:String,
                required:true,
            },
            marks:{
                type:Number,
                required:true,
            },
        },
            {
                timestamps:true}
        
);
 
var skillsModel=mongoose.model('skills',skillsSchema);
 
module.exports = skillsModel;