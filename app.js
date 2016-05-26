var express = require('express');
var app = express();
var fs = require('fs'),
    path = require('path'),
    ejs = require('ejs');

app.set('view engine', 'ejs');

var movies = [];
var listingPage;
var path_name = "/Users/someshvyas/Downloads/";

fs.readdir(path_name, function(err, items){
    for (var i=0; i<items.length; i++) {
        if(path.extname(items[i]) == '.mp4') {
        	movies.push(items[i]);
        }
    }
});

// index page 
app.get('/', function(req, res) {
    res.render('listing', {
        movies: movies
    });
});

app.get('/movies/*', function(req, res) {
	console.log(req.path);
});

app.listen(8888);
console.log('8888 is the magic port');