var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/GoogleStreetView.html');
});

var userCount = 0;
io.on('connection', function(socket){
  userCount++;
  console.log('A User Connect...');
  console.log('Client Count: ' + userCount);
  var socketId = socket.id
  var clientIp = socket.request.socket.remoteAddress
  console.log('SocketID: ' + socketId + ', IP: ' + clientIp)
    
  // for streetView emit  
  socket.on('latlng', function(latlng){
    io.emit('latlng', latlng);
    console.log('New Lat: ' + latlng.lat + ', ' + 'Lng: ' + latlng.lng);
  });
    
  socket.on('pov', function(pov){
    io.emit('pov', pov);
    console.log('Rotate heading: ' + pov.heading + ' ,pitch: ' + pov.pitch);
  });

  socket.on('disconnect', function(){
    userCount--;
  	console.log('user disconnected');
    console.log('Client Count: ' + userCount);
  });
  
  socket.on('links', function(links) {
	  io.emit('links', links);
	  links.forEach(function(link) {
		  console.log('Direction: heading: ' + link.heading + ', description: ' + link.description + ', pano: ' + link.pano);
	  });
  });
  
  // for iOS mapView emit
  socket.on('iOSChange', function(message) {
	  io.emit('iOSChange', message);
	  console.log('From iOS: lat: ' + message.lat + ' lng: ' + message.lng + ' heading: ' + message.bearing + ' pitch: '+ message.pitch);
  });
  
  socket.on('setPano', function(panoID) {
	  io.emit('setPano', panoID);
	  console.log("Setting panoID: " + panoID);
  });

  socket.on('message', function (msg) {
  	console.log(msg);
  });
   
   
});


http.listen(4000, function(){
  console.log('listening on *:4000');
});
