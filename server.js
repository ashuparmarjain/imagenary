// modules
var express 	= require('express');
var app 		= express();
var bodyParser 	= require('body-parser');
var path = require('path');
var multer = require('multer');
var cloudinary = require('cloudinary');
var fs = require('fs');
const Datauri = require('datauri');
const datauri = new Datauri();

var db = require('./config/db');

var mongoose = require('mongoose');
mongoose.connect(db.url);



var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('we are connected');
});


// route
require('./config/cloudinary')(cloudinary);

var Thumbnail = require('./models/thumbnail');

var storage = multer.memoryStorage();

var upload = multer({ storage: storage });

	app.post('/api/photo', upload.any(),function(req,res){  
	   	if(req.files.length < 4){
	   		res.end('Invalid File');
	   	} else{
	    req.files.forEach(function(arrayItem) {

			datauri.format(path.extname('imagenary').toString(), arrayItem.buffer);	

	        cloudinary.uploader.upload(datauri.content, function(result) { 
			  
			  		var t_image = new Thumbnail({thumbnail: result.url });
					t_image.save(function(err){
					if(err){
						console.log(err);
					}
				});

			});
		});
	    res.end("done");
	}
	});

	app.get("/api/thumbnails", function(req, res) {
		 Thumbnail.find(function(err, docs) {
		    if (err) {
		      res.send(err);
		    } else {
		      res.json(docs);
		    }
		  });	
	});





//port
var port = process.env.PORT || 8080;


app.use(bodyParser.json());

// to serve static file
app.use(express.static(path.join(__dirname, 'public')));

// route
require('./app/route')(app);

app.listen(port);
