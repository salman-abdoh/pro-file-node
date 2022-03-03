
const express=require("express");
const app=express();
const multer = require("multer");
const mogoose = require("mongoose");
const skill = require("./models/skills");
const experance = require("./models/experance");
const works = require("./models/works");
const services = require("./models/services");
app.use(express.static("public/"));
var path = require('path');
const { handle } = require("express/lib/application");
const server=require('http').createServer(app);
const session = require('express-session');
const flash = require('connect-flash');

//imageadd code 



app.set('view engine','ejs');
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use('public/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
  app.use('public/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
  app.use('public/images', express.static(path.join(__dirname, 'public/images')));
 
  app.use('public/fonts', express.static(path.join(__dirname, 'public/fonts')));
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static("public/"))
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './public/images1'),
    filename: (req, file, cb) => 
    {
        var extension = file.originalname.split(".");
        var ext = extension[extension.length - 1];

        var uploaded_file_name =
        file.fieldname +
        "-" +
        Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        "." +
        ext;

        cb(null, uploaded_file_name);
    }
});

const upload =  multer({
    storage: storage,
    // fileFilter: (req, file, callback) => {
    //     if (file.mimetype == "image/png" ||
    //         file.mimetype == "image/jpg" ||
    //         file.mimetype == "image/svg" ) 
    //     {
    //         callback(null, true);
    //     } 
    //     else callback(null, false);
    // },
  limits: 1024 * 1024 * 5,
});
//image code end
app.get("/",(req,res)=>{
    res.render("home");
    
})

app.use(session({
  secret: 'codeforgeek',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());


///mongodb connect
mogoose
  .connect("mongodb://localhost:27017/profile_nodejs")
  .then((result) => {
    // console.log(result);
  })
  .catch((error) => {
    console.log(error);
  });
//end mongodb connect
//start sklills
  //add skils
  app.post("/skills/add", (req, res) => {
    const s = new skill({
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      place: req.body.place,
      marks: req.body.marks,
    });
    s.save((error,result)=>{
        if(error)
       console.log(error.message);
        else{
        console.log(result);
        }
    });
    console.log("data inserted successful");
    // message(); 
    req.flash('message', `تم الاضافة بنجاح`)
    res.redirect("/skills");    
    res.end();  
});
app.get('/skills',(req,res)=>{
skill.find().then((reslut)=>{
        console.log(skill.length);
        res.render('skills',{skill:reslut,message:req.flash('message')});
    });
  });
  //end add skill
  //update skill
app.post(("/update/skill"),function  (req,res){
  var doc={
 name:req.body.name,
description:req.body.description,
date:req.body.date,
place:req.body.place,
marks:req.body.marks,
}
var id = req.body.id;
skill.updateOne({"_id":id}
,{$set:doc},doc,(err,result)=>{
  console.log(err)
})
res.redirect("/skills");
}
);
  //end update skill
  //delet skill
  app.get('/skills/delete/(:id)', function (req, res, next) {
    skill.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
        res.redirect('/skills');
      } else {
        console.log('Failed to Delete user Details: ' + err);
      }
    });
  })
  //end delete skill
  //end skills
  //--------------------------------------------------//
  //start experance
  //add experance
  app.post("/experance/add", (req, res) => {
    const s = new experance({
      name: req.body.name,
      degree: req.body.degree,
      
    });
    s.save((error,result)=>{
        if(error)
       console.log(error.message);
        else{
        console.log(result);
        }
    });
    console.log("data inserted successful");
    // message(); 
    
    res.redirect("/experance");    
    res.end();  
});
app.get('/experance',(req,res)=>{
  experance.find().then((reslut)=>{
        console.log(experance.length);
        res.render('experance',{experance:reslut});
    });
  });
  //end add experance
  //update experance
app.post(("/update/experance"),function  (req,res){
  var doc={
 name:req.body.name,
degree:req.body.degree,

}
var id = req.body.id;
experance.updateOne({"_id":id}
,{$set:doc},doc,(err,result)=>{
  console.log(err)
})
res.redirect("/experance");
}
);
  //end update experance
  //delet experance
  app.get('/experance/delete/(:id)', function (req, res, next) {
    experance.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
        res.redirect('/experance');
      } else {
        console.log('Failed to Delete user Details: ' + err);
      }
    });
  })
  //end delete experance
  //end experance
  //--------------------------------------------------//
  //start works
  //add works
  app.post("/works/add",upload.single('image'), (req, res) => {
    const s = new works({
      name: req.body.name,
      image: req.file.filename,
      descr: req.body.descr,
      
    });
    s.save((error,result)=>{
        if(error)
       console.log(error.message);
        else{
        console.log(result);
        }
    });
    console.log("data inserted successful");
    // message(); 
    
    res.redirect("/works");    
    res.end();  
});
app.get('/works',(req,res)=>{
  works.find().then((reslut)=>{
        console.log(works.length);
        res.render('works',{works:reslut});
    });
  });
  //end add works
  //update works
app.post(("/update/works"),upload.single('image'),function  (req,res){
  var doc={
    name: req.body.name,
    image: req.file.filename,
    descr: req.body.descr

}
var id = req.body.id;
works.updateOne({"_id":id}
,{$set:doc},doc,(err,result)=>{
  console.log(err)
})
res.redirect("/works");
}
);
  //end update works
  //delet works
  app.get('/works/delete/(:id)', function (req, res, next) {
    works.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
        res.redirect('/works');
      } else {
        console.log('Failed to Delete user Details: ' + err);
      }
    });
  })
  //end delete works
  //end works
 
//--------------------------------------------------//
  //start works
  //add works
  app.post("/services/add",upload.single('image'), (req, res) => {
    const s = new services({
      name: req.body.name,
      image: req.file.filename,
      descr: req.body.descr,
      
    });
    s.save((error,result)=>{
        if(error)
       console.log(error.message);
        else{
        console.log(result);
        }
    });
    console.log("data inserted successful");
    // message(); 
    
    res.redirect("/services");    
    res.end();  
});
app.get('/services',(req,res)=>{
  services.find().then((reslut)=>{
        console.log(services.length);
        res.render('services',{services:reslut});
    });
  });
  //end add works
  //update works
app.post(("/update/services"),upload.single('image'),function  (req,res){
  var doc={
    name: req.body.name,
    image: req.file.filename,
    descr: req.body.descr

}
var id = req.body.id;
services.updateOne({"_id":id}
,{$set:doc},doc,(err,result)=>{
  console.log(err)
})
res.redirect("/services");
}
);
  //end update services
  //delet services
  app.get('/services/delete/(:id)', function (req, res, next) {
    services.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
        res.redirect('/services');
      } else {
        console.log('Failed to Delete user Details: ' + err);
      }
    });
  })
  //end delete services
  //end services
 
  
 
  
server.listen("4000");
console.log("server connected ");




