var express = require('express');
var router = express.Router();
var edms = require('../lib/lib');

router.get('/', function(req, res){
  if( typeof req.session.un === "undefined"){
	console.log('Session is not set.');
    res.render('index',{title:'Home'});	
  }
  else {
	console.log('Session is set.');  
	res.render('index',{un:req.session.un, title:'Home'});  
  }
});

router.get('/task',function(req,res){
 if( typeof req.session.un === "undefined"){
	res.render('task',{title:'Task'}); 
 } else {
	res.render('task',{un:req.session.un,title:'Task'});
 }
   
});

router.get('/guide',function(req,res){
 if( typeof req.session.un === "undefined"){
	res.render('guide',{title:'Guide'}); 
 } else {
	res.render('guide',{un:req.session.un,title:'Guide'}); 
 }
});

router.get('/contact',function(req,res){
 if( typeof req.session.un === "undefined"){
   res.render('contact',{title:'Contact'});
 } else {
   res.render('contact',{un:req.session.un,title:'Contact'});	 
 }
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/admin', function(req, res, next) {
  edms.d.db.open(function(err,db){
	  if(err) throw err; 
	  db.collection('new_reg',function(err,collection){
		if(err) throw err;
		collection.find({},{username:1}).toArray(function(err,docs){
		  console.log(docs);
		  if (err) throw err;
		  res.render('admin',{users:docs});
		});
	  });
  });
});

module.exports = router;