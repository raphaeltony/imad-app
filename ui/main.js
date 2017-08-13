console.log('Loaded!');

//move madi
var img = document.getElementById('madi');

img.onclick = function(){
    var interval = setInterval(moveRight,25);
}

var marginLeft = 0;

function moveRight(){
    marginLeft = marginLeft + 5;
    img.style.marginLeft = marginLeft + 'px';
}
/////////////////////////////////////////////////////////////////////////////

//Button Count
var button = document.getElementById('counter');

button.onclick = function(){
    //make a request object
var request = new XMLHttpRequest();

//Capture the response:
request.onreadystatechange = function(){    //if request changed :
    if(request.readyState == XMLHttpResponse.DONE){
        if(request.status == 200){ //If request was successful
           var counter = request.responseText; 
           var span = document.getElementById('count');
            span.innerHTML = counter.toString();
        }
    }
};

//Make and send the request:
request.open('GET','http://prince4raphael.imad.hasura-app.io/counter',true);
request.send(null);
    
    
};













