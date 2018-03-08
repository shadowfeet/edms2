var express = require('express');
var app = express();

app.get('/endpoint', function(request, response) {
    var id = request.query.id;
    response.end("I have received the ID: " + id);
});

app.listen(3000);
console.log("node express app started at http://localhost:3000");