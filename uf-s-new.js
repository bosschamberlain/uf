var http = require('http');
var Static = require('node-static');
var app = http.createServer(handler);
var io = require('socket.io').listen(app);

var port = 8080;
var active = false;
var update = false;
var type;
var viewers = [];
var operators = [];


var files = new Static.Server('./public');

function handler (request, response) {
	request.on('end', function() {
		files.serve(request, response);
	}).resume();
}

io.on('connection', (socket) => {

  socket.on('setup', (userdata) => {

    socket.username = userdata.username;
    console.log(userdata.username + ' has logged on!');

   var new_user={ 
    username : userdata.username,  
    active : true,
    lat : userdata.user_lat,
    lng : userdata.user_lng,
    update : true  
    }; 

  if (userdata.usertype === 'viewer') {
   viewers.push(new_user);
   console.log(viewers);
  }

  else if (userdata.usertype === 'operator') {
    operators.push(new_user);
    console.log(operators);
   };

   var msg = "Connected";
   socket.emit('connected', msg);
  });


  socket.on('updatestatus', (userdata) => {
  socket.broadcast.emit('update', userdata);  
  });
  



socket.on('disconnect', () => {

  for (var i =0; i < viewers.length; i++)
   if (viewers[i].username === socket.username) {
    viewers.splice(i,1);
    console.log('User ' + socket.username + " logged off");
       }
     

     for (var i =0; i < operators.length; i++)
     if (operators[i].username === socket.username) {
      operators.splice(i,1);
      console.log('Operator ' + socket.username + " logged off");
         }
       })



   });








// start app on specified port
app.listen(port);
console.log('Your server goes on localhost:' + port);