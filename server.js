// modules
var express 	= require('express');
var app 		= express();
var bodyParser 	= require('body-parser');
var path = require('path');
var multer = require('multer');
var cloudinary = require('cloudinary');
var fs = require('fs');

cloudinary.config({ 
  cloud_name: 'ashuparmarjain', 
  api_key: '454329337957173', 
  api_secret: '2iQCqrqHN4M_As0af8qAK2GDkwg' 
});



// // multer storage
var storage = multer.diskStorage({
	destination : function (req,res,callback) {
		callback(null,'./uploads');
	},
	filename : function(req,file,callback){
		callback(null, 'imagenary' + '-' + Date.now());
	}
});

var upload = multer({ storage: storage }).any();

	app.post('/api/photo',function(req,res){
		console.log(req);
	    upload(req,res,function(err) {
	        if(err) {
	            return res.end("Error uploading file." + err);
	        }
	        res.end("File is uploaded");
	    });
	});
// //config

// var upload = multer(); // for parsing multipart/form-data

// app.post('/api/photo', upload.array(), function(req, res) {
//     var base64Data = req.body.testdot;
//     console.log('writing file...', base64Data);
//     fs.writeFile(__dirname + "/uploads/out.png", base64Data, 'base64', function(err) {
//         if (err) console.log(err);
//         fs.readFile(__dirname + "/uploads/out.png", function(err, data) {
//             if (err) throw err;
//             console.log('reading file...', data.toString('base64'));
//             res.send(data);
//         });
//     });
// });

var db = require('./config/db');

//port
var port = process.env.PORT || 8080;


app.use(bodyParser.json());

// to serve static file
app.use(express.static(path.join(__dirname, 'public')));

// route
require('./app/route')(app);

app.listen(port);
