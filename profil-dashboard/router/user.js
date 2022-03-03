
   
var express = require('express');
var router = express.Router();
const {check,validationResult}=require('express-validator');
const User=require('../models/User');
const passport=require('passport');
const multer=require('multer');



//middleware to check if user is login
isAuthenticated=(req,res,next)=>{
  if (req.isAuthenticated()) {
    return next();
    
  }
  res.redirect('/users/login');
}
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//login
router.get('/login', function(req, res, next) {
  var massagesError=req.flash('loginError');
  
  res.render('user/login', { massages : massagesError });
});
router.post('/login',[
  check('email').not().isEmpty().withMessage('please enter your email'),
  check('email').isEmail().withMessage('please enter valid email'),
  check('password').not().isEmpty().withMessage('please enter your password'),
  check('password').isLength({min : 5}).withMessage('password must be more than 5 char'),

],(req,res,next)=>{
  const errors=validationResult(req);
  if (! errors.isEmpty()) {
    var validationMassages=[];
    for (let i = 0; i < errors.errors.length; i++) {
      validationMassages.push(errors.errors[i].msg)
      
    }
    req.flash('loginError',validationMassages);
    res.redirect('login');
    console.log(validationMassages);
    return;
  }
  next();

},passport.authenticate('local-login',{
  successRedirect: 'profile',
  failureRedirect: 'login',
  failureFlash: true,

}));

// sign up form 
router.get('/signIn', (req,res)=> {
  res.render('user/signIn', {
      error: req.flash('error')
  })
})

// sign up post request

router.post('/signIn',
passport.authenticate('local-signup', {
  successRedirect: '/users/profile',
    failureRedirect: '/users/signIn',
    failureFlash: true })
    )


//profile
router.get('/profile', isAuthenticated,function(req, res, next) {
  res.render('user/profile', { title: 'sofan' });
  
});
//upload user img
router.post('/uploadavtar',upload.single('avatar'),function(req, res, next) {
  let newFields = {
    avatar: req.file.filename,
    name:req.body.name,
    email:req.body.email,
    password:req.body.password,
  }
  User.updateOne( {_id: req.user._id}, {$set:newFields}, (err)=> {
    if (!err) {
      res.redirect('/users/profile')
    }

  } )
  
});

//skills
router.get('/skills',isAuthenticated, function(req, res, next) {
  Skills.find({},(error,result)=>{
    if (error) {
      console.log(error);
      res.redirect('skills');
      
    }
    res.render('user/skills', { items: result });
    console.log(result[2]);
    
    

  })
});
router.post('/add', function(req, res, next) {
  var skills=new Skills({
    title : req.body.Atitle,
    level: req.body.Alevel,
  });
  skills.save((error,result)=>{
    if (error) {
      console.log(error);
      res.redirect('skills');
      return;
      
    }
    console.log(result);
    res.redirect('skills');
    

  });
  
  
});

//update skills
router.post('/update',isAuthenticated, function(req, res, next) {
  const ID=req.body.id;
  const updatedSkills={
    title:req.body.title,
    level:req.body.level,
  }
  Skills.updateOne({_id:ID},{$set:updatedSkills},(error,doc)=>{
    if (error) {
      console.log(error);
      res.redirect('skills');
      return;
      
    }
    console.log(doc);
    res.redirect('skills');

  })
  
});

//delete skills
router.post('/delete',isAuthenticated, function(req, res, next) {
  const ID=req.body.id;
  console.log(ID);
 
  Skills.deleteOne({_id:ID},(error,doc)=>{
    if (error) {
      console.log(error);
      res.redirect('skills');
      return;
      
    }
    console.log(doc);
    res.redirect('skills');

  })
  
});
//logout
router.get('/logout',(req,res)=>{
  req.logOut();
  res.redirect('/users/login');
})


//services 
router.get('/services',(req,res)=>{
  
  res.render('user/services');
})



module.exports = router;
