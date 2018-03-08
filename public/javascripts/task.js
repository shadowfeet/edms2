$(document).ready(function(e){
	if(username) {
		var socket = io.connect();
		socket.emit('data',username);
		socket.on('data',function(doc){
			fs.u.initializeGUI(doc);
		});
	}
});