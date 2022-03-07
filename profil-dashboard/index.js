
const express=require("express");
const expressLayouts = require('express-ejs-layouts');
const app=express();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const multer = require("multer");
const mogoose = require("mongoose");
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');
const skill = require("./models/skills");
const experance = require("./models/experance");
const works = require("./models/works");
const services = require("./models/services");
const persodata = require("./models/persodata");

app.use(express.static("public/"));
var path = require('path');
const { handle } = require("express/lib/application");
const server=require('http').createServer(app);


var usersRouter = require('./router/user');

require('./config/passport')(passport);

app.use(session({
  secret: 'codeforgeek',
  saveUninitialized: true,
  resave: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//imageadd code 

app.use(bodyParser.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use('/users', usersRouter);
app.use(express.static(path.join(__dirname, 'public')));
app.use('public/javascripts', express.static(path.join(__dirname, 'public/javascripts')));
  app.use('public/stylesheets', express.static(path.join(__dirname, 'public/stylesheets')));
  app.use('public/images', express.static(path.join(__dirname, 'public/images')));
 
  app.use('public/fonts', express.static(path.join(__dirname, 'public/fonts')));
  app.set('views', path.join(__dirname, 'views'));
  app.use(express.static("public/"))
  
 

  app.set('view engine','ejs');
  




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
   
  limits: 1024 * 1024 * 5,
});
//image code end

    




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
app.get('/skills',ensureAuthenticated,(req,res)=>{
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

req.flash('message', `تم التعديل بنجاح`)
res.redirect("/skills");
}
);
  //end update skill
  //delet skill
  app.get('/skills/delete/(:id)',ensureAuthenticated, function (req, res, next) {
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
app.get('/experance',ensureAuthenticated,(req,res)=>{
  experance.find().then((reslut)=>{
        console.log(experance.length);
        res.render('experance',{experance:reslut});
    });
  });
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
app.get('/',forwardAuthenticated,(req,res)=>{
  experance.find().then((reslut)=>{
        console.log(experance.length);
        res.render('home',{experance:reslut});
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
  app.get('/experance/delete/(:id)',ensureAuthenticated, function (req, res, next) {
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
app.get('/works',ensureAuthenticated,(req,res)=>{
  works.find().then((reslut)=>{
        console.log(works.length);
        res.render('works',{works:reslut});
    });
  });
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
app.get('/',forwardAuthenticated,(req,res)=>{
  works.find().then((reslut)=>{
        console.log(works.length);
        res.render('home',{works:reslut});
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
  app.get('/works/delete/(:id)',ensureAuthenticated, function (req, res, next) {
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
  //start services
  //add services
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
app.get('/',forwardAuthenticated,(req,res)=>{
  services.find().then((reslut)=>{
        console.log(services.length);
        res.render('home',{services:reslut});
       
    });
   
           
        
  });
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
app.get('/services',ensureAuthenticated,(req,res)=>{
  services.find().then((reslut)=>{
        console.log(services.length);
        res.render('services',{services:reslut});
       
    });
   
           
        
  });
 
  //end add services
  //update services
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
  app.get('/services/delete/(:id)',ensureAuthenticated, function (req, res, next) {
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
 
  //--------------------------------------------------//
  //start persodata
  //add persodata
 
  
app.get('/persodata',ensureAuthenticated,(req,res)=>{
  persodata.find().then((reslut)=>{
        console.log(reslut);
        res.render('persodata',{persodata:reslut});
    });
  });
  //end add persodata
  //update persodata
app.post(("/update/persodata"),upload.single('image'),function  (req,res){
  var doc={
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    phonenumber: req.body.phonenumber,
    major: req.body.majore,
    address: req.body.address,
    image: req.file.filename
    
   

}
var id = req.body.id;
persodata.updateOne({"_id":id}
,{$set:doc},doc,(err,result)=>{
  console.log(err)
})
res.redirect("/persodata");
}
);
app.get('/',(req,res)=>{
  persodata.find().then((reslut)=>{
        console.log(reslut);
        res.render('home',{persodata:reslut});
    });
  });
  //end update services
  
  //end services
   //start prtofilio
   
 
  
server.listen("4000");
console.log("server connected ");




