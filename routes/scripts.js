var express = require('express');
var router = express.Router();
var fs = require('../lib/lib')
var db = fs.d.db;

router.post('/register', function(req, res, next){
  db.open(function(err){
    if (!err) {
      console.log('Connecting to database...');
      db.collection('new_reg',function(err,collection){
          console.log('Trying to insert new records ...');
          collection.insert(req.body, {safe:true}, function(err,docs){
            if(!err){
              console.log('New records added.'); 
              console.log(docs);
              db.close();
              res.end('ok');
            } else {
			  db.close();
              res.end('no');
            }        
          })  
      })
    }
  });
});

//sends 'yes' if account is found
router.get('/verify', function(req, res){
  //composes query object for find method
  if(req.query.name =='email'){
    var query = {email : req.query.value};
  }else{
    var query = {username : req.query.value};
  }
  db.open(function(err,db){
    if (err) throw err;
    db.collection('new_reg',function(err,collection){
      if (err) throw err;
        collection.find(query).toArray(function(err,doc){
          if (err) throw err;
          if (doc.length) res.end('yes');
          else res.end('n');
        });
    });
  })
});

//sends 'yes' if theres a user with such username and pass
router.get('/login', function(req,res){
  db.open(function(err,db){
    db.collection('users', function(err, collection){
      collection.find(req.query).toArray(function(err,doc){
        console.log(doc.length);
        if(doc.length){
          console.log('found %s',req.query.username);
          req.session.un = req.query.username;
          res.send('yes');
          console.log('session username is %s',req.session.un);
        }else {
          res.send('no')
        }
      });
    })
  });
  
});
router.get('/signout', function(req,res){
  req.session.destroy();
  res.end('ok');
});

//activates a user account
/*
router.get('/activate', function(req, res, next) {
   db.open(function(err,db,req){
		db.new_reg.find({username:req.query.un}).toArry(function(err,docs) {
			if(!err) {
				var query ="{" +
							"username:" + docs[0].username + "," +
							"email:" + docs[0].email + "," +
							
					
					
				}";
			
				db.accounts.insertOne(query);
			}
		});
   }	
  res.render('admin');
});*/

module.exports = router