var fs = require('fs'),
    http = require('http'),
    url = require('url'),
    path = require('path'),
    ejs = require('ejs');


var indexPage, movie_webm, movie_mp4, movie_ogg;

var path_name = "/Users/someshvyas/Downloads/";

var movies = [];
var listingPage;

fs.readdir(path_name, function(err, items){
    for (var i=0; i<items.length; i++) {
        movies.push(items[i]);
        // console.log(items[i]);
        // console.log(path.extname(items[i]));
        // console.log('------------------------- ');
    }
});

// load the video files and the index html page
fs.readFile(path.resolve(__dirname,"movie.webm"), function (err, data) {
    if (err) {
        throw err;
    }
    movie_webm = data;
});
fs.readFile(path.resolve(__dirname,"movie.mp4"), function (err, data) {
    if (err) {
        throw err;
    }
    movie_mp4 = data;
});
fs.readFile(path.resolve(__dirname,"movie.ogg"), function (err, data) {
    if (err) {
        throw err;
    }
    movie_ogg = data;
});

fs.readFile(path.resolve(__dirname,"index.html"), function (err, data) {
    if (err) {
        throw err;
    }
    indexPage = data;    
});

fs.readFile(path.resolve(__dirname,"listing.ejs"), function (err, data) {
    if (err) {
        throw err;
    }
    listingPage = data;    
});

// create http server
http.createServer(function (req, res) {
    
    // console.log(JSON.stringify(req));
    var reqResource = url.parse(req.url).pathname;
    //console.log("Resource: " + reqResource);

    if(reqResource == "/"){
        res.writeHead(200, {'Content-Type': 'text/html'});   
        var renderedHtml = ejs.render(listingPage, {movies: movies});  //get redered HTML code
        res.end(renderedHtml);
    } else if (reqResource == "/favicon.ico"){
    
        res.writeHead(404);
        res.end();
    
    } else if (reqResource == "/movies") {

    } else {

            var total;
            if(reqResource == "/movie.mp4"){
                total = movie_mp4.length;
            } else if(reqResource == "/movie.ogg"){
                total = movie_ogg.length;
            } else if(reqResource == "/movie.webm"){
                total = movie_webm.length;
            } 
                
            var range = req.headers.range;

            var positions = range.replace(/bytes=/, "").split("-");
            var start = parseInt(positions[0], 10);
            // if last byte position is not present then it is the last byte of the video file.
            var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
            var chunksize = (end-start)+1;

            if(reqResource == "/movie.mp4"){
                res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                                     "Accept-Ranges": "bytes",
                                     "Content-Length": chunksize,
                                     "Content-Type":"video/mp4"});
                res.end(movie_mp4.slice(start, end+1), "binary");

            } else if(reqResource == "/movie.ogg"){
                res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                                     "Accept-Ranges": "bytes",
                                     "Content-Length": chunksize,
                                     "Content-Type":"video/ogg"});
                res.end(movie_ogg.slice(start, end+1), "binary");

            } else if(reqResource == "/movie.webm"){
                res.writeHead(206, { "Content-Range": "bytes " + start + "-" + end + "/" + total, 
                                     "Accept-Ranges": "bytes",
                                     "Content-Length": chunksize,
                                     "Content-Type":"video/webm"});
                res.end(movie_webm.slice(start, end+1), "binary");
            }
    }
}).listen(8888); 