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

//Button Count
var counter = 0;
var button = document.getElementById('counter');
button.onclick = function(){
    counter += 1;
    var span = document.getElementById('count');
    span.innerHTML = counter.toString();
    
}