
app.controller('UploadController',function($scope, fileReader) {
  var RecommendSize = false;
        getImageDimension = function () {
         
              var image = $('#imagePreview img');
              var originalWidth  = image[0].naturalWidth;
              var originalHeight = image[0].naturalHeight;

              if ( (originalWidth&&originalHeight) == 1024){             
               
                    RecommendSize = true;
                    
                
              } else{
               
                    RecommendSize = false;
                    

                            
              }
          
      };

    $scope.getFile = function () {
        fileReader.readAsDataUrl($scope.file, $scope)
        .then(function(result) {
            $scope.imageSrc = result;                      
            getImageDimension();
        });
    }; 
 


});

app.directive("ngFileSelect",function(){

  return {
    link: function($scope,el){
      
      el.bind("change", function(e){
      
        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      })
      
    }
    
  }
  
  
})