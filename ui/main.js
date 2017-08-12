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