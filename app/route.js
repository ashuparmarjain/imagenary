module.exports = function(app) {

	app.get('/',function(req,res){
		res.sendfile('./public/index.html');
	});		

	app.get('/thumbnails',function(req,res){
		res.sendfile('./public/thumbnails.html');
	});			


	
};