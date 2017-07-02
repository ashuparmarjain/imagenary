// https://imagenary.herokuapp.com
/**
 * Convert a base64 string in a Blob according to the data and contentType.
 * 
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}

function converFileToImage(ImageURL){
  var _URL = window.URL || window.webkitURL;
	var block = ImageURL.split(";");
	// Get the content type of the image
	var contentType = block[0].split(":")[1];// In this case "image/gif"
	// get the real base64 content of the file
	var realData = block[1].split(",")[1];
	var blob = b64toBlob(realData, contentType);
  var blobUrl = _URL.createObjectURL(blob);
	return blobUrl;
 }


// //Preview Image  only if it meeets the recommended size.


function previewImage(object) {
    $('#imagePreview').append(object);    
}


// Convert Image into 4 diffrent size 
 function createThumbnail(w,h,canvasID,thumbnailID,imageObj) {
 	var w = w;
 	var h = h;
 	var canvas = $(canvasID)[0]; 
 	var thumbnailID = thumbnailID;
 	var imageObj = $(imageObj)[0];

    $(imageObj).Jcrop({

      
      allowSelect: true,
      canResize : false,
      maxSize : [w,h],   
      minSize : [w,h],      
      onChange : updatePreview,
      bgColor: 'black'  
    });
    
    
    function updatePreview(c) {
        if(parseInt(c.w) > 0) {        
              var context = canvas.getContext("2d");
              canvas.width = w;
              canvas.height = h;
              context.drawImage(imageObj, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height);
              dataURL =  canvas.toDataURL("image/jpeg");
              savePreview(thumbnailID,dataURL);
        }
    };



      function savePreview(thumbnailID,dataURL){
         var blobObject = converFileToImage(dataURL);
          $(thumbnailID).attr('src',dataURL);   
          console.log(blobObject);      
      }

  };   






 $('#btn1').click(function(){
	createThumbnail(755,450,'#preview1','#thumbnail1','#target');
});

$('#btn2').click(function(){
	createThumbnail(365,450,'#preview2','#thumbnail2','#target');
});
$('#btn3').click(function(){
	createThumbnail(365,212,'#preview3','#thumbnail3','#target');
});
$('#btn4').click(function(){
	createThumbnail(380,380,'#preview4','#thumbnail4','#target');
});

var _URL = window.URL || window.webkitURL;
$("#imageChoosen").change(function (e) {
	
    var file, img;
    if ((file = this.files[0])) {
        img = new Image();
        img.src = _URL.createObjectURL(file);
        img.id = 'target';
        img.onload = function () {
            if((this.width&&this.height)==1024){
            	previewImage(this);
            	$('#uploadImage').show();
            }else{
            	$('#imagePreview').empty();
            	$('#thumbnail_preview').empty();
            	$('#uploadImage').hide();
            	alert('Please select an image of size 1024*1024 to procede');
            	$('#imagePreview').append("<p>Please select an image of size 1024*1024 to procede</p>");
            }
        };        
    }    
});

 // ajax call to save image to backend
 $("#post-btn").click(function(e){
 	e.preventDefault(); 
 	var form = $('#image')[0];
 	var data = new FormData();
  var test = $('#thumbnail1').attr('src');

 	data.append('thumbnail_755x450',test);
 	data.append('thumbnail_365x450',$('#thumbnail2').attr('src'));
 	data.append('thumbnail_365x212',$('#thumbnail3').attr('src'));
 	data.append('thumbnail_380x380',$('#thumbnail4').attr('src'));
 	
    // var url = '/api/photo';
    // $.ajax({
    // 	type:"POST",
    // 	url: url,
    // 	data:data,
    // 	processData: false,
    // 	contentType: false,
    // }).done(function(res){
    // 	console.log(res);
    // });

    var xhr = new XMLHttpRequest();
	xhr.open('POST', '/api/photo', true); //my url had the ID of the item that the blob corresponded to
	xhr.responseType = 'Blob';
	xhr.send(data);

});
