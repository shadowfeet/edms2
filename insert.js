var mongo = require('mongodb');
var host = '127.0.0.1';
var mongo_port = 27017;
//creates mongo server instance
var server = new mongo.Server(host,mongo_port,{});
//creates mongo db instance
var db = new mongo.Db('edms',server,{w:1});
//connect to a mongo database
db.open(function(err){
  		if (!err) {
        console.log('Booya! We are connected.');
    		db.collection('users',function(err,collection){
      			console.log('Inserting Records to edms ...');
            collection.remove({
              name:'Juanadela',
        			email: "juanadela@yahoo.com" },
        			{ safe:true }, 
        			function(err,docs){
                  if(!err){
                    console.log('Inserting of Record has succeeded'); 
            				console.log(docs);
            				db.close();
                  }        
        			})  
    		})
  		}
	});