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

var mongoose = require('mongoose');
mongoose.connect('mongodb://ashu:test123@ds145892.mlab.com:45892/imagenary');

cloudinary.config({ 
  cloud_name: 'ashuparmarjain', 
  api_key: '454329337957173', 
  api_secret: '2iQCqrqHN4M_As0af8qAK2GDkwg' 
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('we are connected');
});


  var thumbnailSchema = mongoose.Schema({
    //Also creating index on field isbn
    thumbnail: {type: String},
    date: { type: Date, default: Date.now },
  });

var thumbnail = mongoose.model('thumbnail', thumbnailSchema);

var storage = multer.memoryStorage();

var upload = multer({ storage: storage });


	app.post('/api/photo', upload.any(),function(req,res){  
	   
	    req.files.forEach(function(arrayItem) {

			datauri.format(path.extname('TEST').toString(), arrayItem.buffer);	

	        cloudinary.uploader.upload(datauri.content, function(result) { 
			  
			  		var t_image = new thumbnail({thumbnail: result.url });
				t_image.save(function(err){
					if(err){
						console.log(err);
					}
				});

			});
		});
	    res.end("done");

	});

	app.get("/api/thumbnails", function(req, res) {
		 thumbnail.find(function(err, docs) {
		    if (err) {
		      res.send(err);
		    } else {
		      res.json(docs);
		    }
		  });	
	});



var db = require('./config/db');

//port
var port = process.env.PORT || 8080;


app.use(bodyParser.json());

// to serve static file
app.use(express.static(path.join(__dirname, 'public')));

// route
require('./app/route')(app);

app.listen(port);
