 var beforeNum = 0;

 $(document).ready( function () { 
 
  //var socket = io.connect();
  var imageArray = [];
  var date = new Date();
  var pushCtn = 0;
  
  for(var i = 0; i < 120; i++) {
    $("#image-box").append('<img src="img/'+i+'.png?'+date.getTime()+'" id='+i+'>');
  }

  $("#startBtn").on("click",function(){
    pushCtn += 1;
    if(pushCtn == 2) {
	  $("#startBtn").css("display","none");
      pushCtn = 0;
      startConnect();
	}
  });

});

function startConnect(){
  var socket = io.connect();
  var myId;
  socket.on("id",function(id){
    myId = id;
    $("#showId").append("<h1>ID: "+id+"</h1>");
  });
  
  socket.on("click",function(frame) {
   console.log("come data");
   changeImg(frame);
   socket.emit('next',"my id :"+myId+"");
  });

  socket.on("connect_error",function(err){
    socket.disconnect();
	for (var i = 0; i < 120; i++) {
	  $("#"+i+"").css("display","none");
	}
    $("#showId h1").remove();
    $("#startBtn").css("display","block");
  });
}

function changeImg(num){
  $("img#"+beforeNum+"").css("display","none");
  $("img#"+num+"").css("display","block");
  beforeNum = num;
}


