// https://imagenary.herokuapp.com

 // convert base64/URLEncoded data component to raw binary data held in a string
 function dataURItoBlob(dataURI) {
 
  var byteString;

  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else
    byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {
    type: mimeString
  });
}



 //Preview Image  only if it meeets the recommended size.


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
         // var blobObject = converFileToImage(dataURL);
          $(thumbnailID).attr('src',dataURL);   
          // console.log(blobObject);      
      }

  };   




  $('.setThumbnail  p').hide();

 $('#btn1').click(function(){
	createThumbnail(755,450,'#preview1','#thumbnail1','#target');
  $('.setThumbnail  p').hide();
  $(this).next().show();  
});

$('#btn2').click(function(){
	createThumbnail(365,450,'#preview2','#thumbnail2','#target');
    $('.setThumbnail  p').hide();
  $(this).next().show();  
});
$('#btn3').click(function(){
	createThumbnail(365,212,'#preview3','#thumbnail3','#target');
    $('.setThumbnail  p').hide();
  $(this).next().show();  
});
$('#btn4').click(function(){
	createThumbnail(380,380,'#preview4','#thumbnail4','#target');
    $('.setThumbnail  p').hide();
  $(this).next().show();  
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
            	$('#imageChoosen').hide();
              $('.thumbnailBlock').show();
            }else{
            	$('#imagePreview').empty();
            	$('#thumbnail_preview').empty();
            	
            	alert('Please select an image of size 1024*1024 to procede');
            	$('#imagePreview').append("<p><span>Please select an image of size 1024*1024 to procede</span></p>");
            }
        };        
    }    
});

 // ajax call to save image to backend
 $("#post-btn").click(function(e){
 	e.preventDefault(); 
 	var data = new FormData();

 	data.append('thumbnail_755x450',dataURItoBlob($('#thumbnail1').attr('src')),'thumbnail_755x450.jpg');
 	data.append('thumbnail_365x450',dataURItoBlob($('#thumbnail2').attr('src')),'thumbnail_365x450.jpg');
 	data.append('thumbnail_365x212',dataURItoBlob($('#thumbnail3').attr('src')),'thumbnail_365x212.jpg');
 	data.append('thumbnail_380x380',dataURItoBlob($('#thumbnail4').attr('src')),'thumbnail_380x380.jpg');
 	

    var url = '/api/photo';
    $.ajax({
    	type:"POST",
    	url: url,
    	data:data,
    	processData: false,
    	contentType: false,
    }).done(function(res){
    	 $('#uploaded_Modal').modal('show');
    });




});
