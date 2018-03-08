//namespace declaration

var edms = edms || {};

var mongo = require('mongodb'),
db_name = 'edms', 
mongo_port = 27017,
mongo_host ='127.0.0.1',
mongo_server = new mongo.Server(mongo_host,mongo_port,{});

edms.d = {
 db: new mongo.Db(db_name,mongo_server,{w:1}),
};
      
edms.u = {

 authorized: function(req){
   if (req.session.id) {
     return true;
   } 
 },
 findOne: function(obj,callback){
   var db = edms.d.db;
   db.open(function(err){
    db.collection('users',function(err,collection){
     collection.find(obj).toArray(function(err,doc){
      if(doc.length)
       callback(doc[0]);
      else
       callback(false);
     });
    });
   });
 }
};
module.exports = edms;