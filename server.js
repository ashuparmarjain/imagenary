// modules
var express 	= require('express');
var app 		= express();
var bodyParser 	= require('body-parser');
var path = require('path');
var multer = require('multer');


// multer storage
var storage = multer.diskStorage({
	destination : function (req,res,callback) {
		callback(null,'./uploads');
	},
	filename : function(req,file,callback){
		callback(null, file.fieldname + '-' + Date.now());
	}
});

var upload = multer({ storage: storage,limit:{fileSize:1200*1200} }).single('image');

	app.post('/api/photo',function(req,res){
	    upload(req,res,function(err) {
	        if(err) {
	            return res.end("Error uploading file." + err);
	        }
	        res.end("File is uploaded");
	    });
	});
//config
var db = require('./config/db');

//port
var port = process.env.PORT || 8080;


app.use(bodyParser.json());

// to serve static file
app.use(express.static(path.join(__dirname, 'public')));

// route
require('./app/route')(app);

app.listen(port);
