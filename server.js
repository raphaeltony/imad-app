var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));



var articleOne = {
    
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
                </p>`
    
};

function createTemplate(data){
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;
    
var htmlTemplate `
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
                ${date}
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



app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/article1',function (req,res){
    res.send(createTemplate(articleOne));
});
app.get('/article2',function (req,res){
    res.sendFile(path.join(__dirname, 'ui', 'article2.html'));
});
app.get('/article3',function (req,res){
    res.sendFile(path.join(__dirname, 'ui', 'article3.html'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
