console.log('Loaded!');
/////////////////////////////////////////////////////////////////////////////

//Button Count
var button = document.getElementById('counter');

button.onclick = function(){
    //make a request object
var request = new XMLHttpRequest();

//Capture the response:
request.onreadystatechange = function(){    //if request changed :
    if(request.readyState == XMLHttpRequest.DONE){
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

////////////////////////////////////////////////////////////////////////////////
//Submit Name
var submit = document.getElementById('submit_btn');

submit.onclick = function(){
    //Make request to server and send name
    var request = new XMLHttpRequest();

    //Capture the response:
    request.onreadystatechange = function(){    //if request changed :
        if(request.readyState == XMLHttpRequest.DONE){
            if(request.status == 200){ //If request was successful
            //Capture a list of names and render it as a list
                var names = request.responseText;
                names = JSON.parse(names);
                var list = '';
                for(var i=0;i<names.length;i++){
                    list += '<li>'+names[i]+'</p>';
                }
        var ul = document.getElementById('name_list');
        ul.innerHTML = list;
            }
        }
    };

//Make and send the request:
var nameInput = document.getElementById('name');
var name = nameInput.value;
request.open('GET','http://prince4raphael.imad.hasura-app.io/submit-name?name='+name,true);
request.send(null);
    
};

//submit username/password to login:
var login = document.getElementById('login_btn');

login.onclick = function(){
    //Make request to server and send name
    var request = new XMLHttpRequest();

    //Capture the response:
    request.onreadystatechange = function(){    //if request changed :
        if(request.readyState == XMLHttpRequest.DONE){
            if(request.status == 200){ //If request was successful
                console.log("user logged in!");
                alert('Logged in successfully !');
                }
                else if(request.status===403){
                    alert("Invalid username/password");
                }
                else if(request.status===500){
                    alert("Something went wrong on the server");
                }
            }
        }
    

//Make and send the request:
var username = document.getElementById('username').value;
var password = document.getElementById('password').value;
console.log(username);
console.log(password);
request.open('POST','http://prince4raphael.imad.hasura-app.io/login',true);
request.setRequestHeader('Content-Type','application/json');
request.send(JSON.stringify({username:username,password:password}));
    
};














