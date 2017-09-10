var express = require('express');
var morgan = require('morgan');
var path = require('path');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json())
app.use(session({
    secret : 'someRandomSecret',
    cookie : {maxAge : 1000*60*60*24*30} //for a month
}))

var Pool = require('pg').Pool;
var config = {
    user : 'prince4raphael',
    database : 'prince4raphael',
    host : 'db.imad.hasura-app.io',
    port : '5432',
    password : process.env.DB_PASSWORD
};

function createTemplate(data){
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    
    var htmlTemplate = `
    <html>
        <head>
            <title>
                ${title}
            </title>
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <link href="/ui/style.css" rel="stylesheet" />
        </head>
        
        <body>
            <div class="container">
                <div>
                    <a href='/'>HOME</a>
                </div>
                <hr/>
                
                <h3>
                    ${heading}
                </h3>
                
                <div>
                    ${date.toDateString()}
                </div>
                
                <div>
                    ${content}
                </div>
            </div>
        </body>
        
    </html>
    `;
    return htmlTemplate;
}


var names = [];
app.get('/submit-name',function(req,res){ //using query : /submit-name?name=raph
    var name = req.query.name; //Get name from request. Can also use - req.params.name;
    names.push(name);
    //JSON - Javascript Object Notation
    //Helps converts js objects into strings
    res.send(JSON.stringify(names));
    
});

var pool = new Pool(config);
app.get('/test-db', function(req,res){
    pool.query('SELECT * FROM test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            res.send(JSON.stringify(result.rows));
        }
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

var counter = 0;
app.get('/counter', function (req,res) {
    counter = counter + 1;
    res.send(counter.toString());
});

app.get('/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui','style.css'));
});

app.get('/main.js', function (req, res) {
    console.log(__dirname);
  res.sendFile(path.join(__dirname, 'ui','main.js'));
});

app.get('/assets/css/bootstrap.min.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui','assets','css','bootstrap.min.css'));
});

app.get('/assets/images/new.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui','assets','images','new.jpg'));
});

app.get('/assets/images/seperator.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui','assets','images','seperator.png'));
});

//Getting Articles
app.get('/articles/:articleName',function (req,res){
    var articleName = req.params.articleName;
    pool.query("SELECT * FROM articles WHERE title = $1",[articleName],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }else{
            if(result.rows.length===0){
                res.status(404).send('Article not found');
            }else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
});

//Hashing Strings
app.get('/hash/:input',function(req,res){
   var hashedString = hash(req.params.input,'this-is-a-salt');
   res.send(hashedString);
});
function hash(input,salt){
    var hashed = crypto.pbkdf2Sync(input, salt, 10000, 512, 'sha512');
    return ['pbkdf2',10000,salt,hashed.toString('hex')].join('$');
}

//Creating Users
app.post('/create-user',function(req,res){
   var username = req.body.username;
   var password = req.body.password;
   
   var salt = crypto.randomBytes(128).toString('hex');
   var dbString = hash(password,salt);
   pool.query('INSERT INTO "users"(username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
       if(err){
            res.status(500).send(JSON.stringify({error:err.toString()}));
        }else{
            res.send(JSON.stringify({message:'User successfully created : '+username}));
        }
   });
});

//Logging Users:
app.post('/login',function(req,res){
    var username = req.body.username;
   var password = req.body.password;
   
   pool.query('SELECT * FROM "users" WHERE username=$1',[username],function(err,result){
       if(err){
            res.status(500).send(JSON.stringify({error:err.toString()}));
        }else{
            if(result.rows.length===0){
                res.status(403).send(JSON.stringify({error:'Invalid username/password'}));
            }else{
                //match the password
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassword = hash(password,salt);
                
                if(hashedPassword===dbString){
                    //creating a session
                    req.session.auth = {userId:result.rows[0].id};
                    res.send(JSON.stringify({message:'credentials correct !'}));
                }else{
                    res.status(403).send(JSON.stringify({error:'Invalid username/password'}));
                }
            }
            
        }
   });
});
app.get('/check-login',function(req,res){
    if(req.session && req.session.auth && req.session.auth.userId){
        res.send("You are logged in as : "+ req.session.auth.userId.toString());
    }else{
        res.send("You are not logged in!");
    }
});
app.get('/logout',function(req,res){
    delete req.session.auth;
    res.send("You are logged out");
});




// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
