var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var Pool = require('pg').Pool;
var config = {
    user : 'prince4raphael',
    database : 'prince4raphael',
    host : 'db.imad.hasura-app.io',
    port : '5432',
    password : process.env.DB_PASSWORD
};


var articles = {
    'article1' : {
        title : 'Article One by Ralph',
        heading : 'Article One',
        date : '11 Aug 2017',
        content : `
                    <p>
                        This is my first paragraph.Yada yadaYada yadaYada yadaYada yadaYada yadaYada yadaYada yadaYada yadaYada yadaYada yadaYada yadaYada yada
                        Yada yada
                        yada
                    </p>
                    
                    <p>
                        This is my second paragraph
                        Bleh bleh
                        bleh
                    </p>
                    
                    <p>
                        This is my third paragraph
                        I dont know any other word
                    </p>`},
    'article2' : {
        title : 'Article Two by Ralph',
        heading : 'Article Two',
        date : '11 Aug 2017',
        content : `
                    <p>
                        This is my second paragraph
                        Bleh bleh
                        bleh
                    </p>
                    
                    <p>
                        This is my third paragraph
                        I dont know any other word
                    </p>`},
    'article3' : {
        title : 'Article Three by Ralph',
        heading : 'Article Three',
        date : '11 Aug 2017',
        content : `
                    <p>
                        This is my third paragraph
                        I dont know any other word
                    </p>`}
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

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/articles/:articleName',function (req,res){
    var articleName = req.params.articleName;
    pool.query("SELECT * FROM articles WHERE title = '"+ articleName + "'",function(err,result){
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




// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
