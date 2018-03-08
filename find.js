var mongo = require('mongodb');
var host = '127.0.0.1';
var mongo_port = 27017;
//creates mongo server instance
var server = new mongo.Server(host,mongo_port,{});
//creates mongo db instance
var db = new mongo.Db('edms',server,{w:1});
var email = 'juandela@yahoo.com';
//var query = {email:email};
var query = {username:'fsenglish'};
db.open();
//connect to a mongo database
/*
db.open(function(err){
	if (!err) {
    //console.log('Booya! We are connected.');
		db.collection('users',function(err,collection){
			//console.log('Finding Records from edms ...');
      collection.find(query).toArray(function(err,doc){
        if (doc.length){
          console.log('%s record (s) found', doc.length);
          flag = true;
        }else {
          console.log('Found no record.');
          flag = false;
        }

      });
    });
  }
});  
*/
var col = db.collection('users');
var a = col.find(query);
var b = a.toArray();
 
console.log(b.doc);
//var b = a.toArray();

//console.log(b.length);
//console.log(typeof b);