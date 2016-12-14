// version 0.2;

var express = require('express'),
  app = express(),
  server = require('http').createServer(app),
  io = require('socket.io').listen(server),
  fs = require('fs');

var osc = require('node-osc');

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
var OSCmsg
var ctn = 0;

io.sockets.on("connection", function(socket) {

  var player = {
    id : socket.id,
    loginNumber: loginNumber
  };
  player_list.push(player);
  console.log("entry player: "+socket.id+"  connect: "+player_list.length+"members");

  socket.on("disconnect", function() {
      player_list.filter(function(item,index){
        if(item.id == socket.id){
          player_list.splice( index , 1);
        }
      });
   });

  loginNumber = player_list.length;

  oscServer.on("send", function (msg, rinfo) {
      console.log("msg: "+msg[1]);
	  console.log("msg length: "+msg.length);
      ctn ++;
      console.log("ctn: "+ctn);
      //if (io.sockets.connected[player_list[Number(msg[1])].id]) {
	  if (player_list[Number(msg[1])]){
          console.log("id="+player_list[Number(msg[1])].loginNumber);
          io.sockets.connected[player_list[Number(msg[1])].id].emit('click', (frameCount + player_list[Number(msg[1])].loginNumber) % 120);
      }

      if (frameCount % 119 == 0 && frameCount != 0) {
        frameCount = 0;
      } else {
        frameCount += 24;
      }
  });

});
