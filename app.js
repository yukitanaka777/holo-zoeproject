var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  fs = require('fs');

var osc = require('node-osc');
var client = new osc.Client('0.0.0.0',4444);
app.use(express.static(__dirname + '/public'));


server.listen(3000);
console.log('Server listening on port 3000');
console.log('Point your browser to http://localhost:3000');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});


var fps = 1000;
var loginNumber = 0;
var frameCount = 0;
var player_list = [];
var oscServer = new osc.Server(3333, '0.0.0.0');
var OSCmsg;
var sendFrame;

io.sockets.on("connection", function(socket) {

  var player = {
    id : socket.id,
    loginNumber: loginNumber
  };
  player_list.push(player);
  console.log("entry player: "+socket.id+"  connect: "+player_list.length+"members");

  io.sockets.connected[socket.id].emit("id",player.loginNumber);

  socket.on("disconnect", function() {
      player_list.filter(function(item,index){
        if(item.id == socket.id){
          player_list.splice( index , 1);
        }
      });
   });

  socket.on("next",function(data){
    console.log(data);
    client.send('button','i');
  });

  loginNumber = player_list.length;

  sendFrame = function(sendNum){
	//console.log(frameCount % 120);
    io.sockets.connected[player_list[sendNum].id].emit('click', (frameCount + player_list[sendNum].loginNumber) % 120);
    //if (frameCount % 119 == 0 && frameCount != 0) {
    //  frameCount = 0;
    //} else {
    //  frameCount += 24;
    //}
  }
});

oscServer.on("send", function (msg, rinfo) {
  if(player_list[Number(msg[1])]){
    sendFrame(Number(msg[1]));
  }else{
    client.send('button','i');
  }
  if(Number(msg[1]) == 23){
   //console.log("next");
    if (frameCount % 119 == 0 && frameCount != 0) {
      frameCount = 0;
    } else {
      frameCount += 24;
    }
  }
});
