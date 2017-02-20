
// First import jquery

window.addEventListener('load', function() {
    
    var body = document.querySelector("body");
    var jqueryScriptNode = document.createElement("script");
    jqueryScriptNode.src = "https://code.jquery.com/jquery-3.1.1.min.js";
    body.appendChild(jqueryScriptNode);

    jqueryScriptNode.addEventListener('load', function() {
        
        fetchImgur('https://api.imgur.com/3/gallery/r/aww/top/0.json');

        var numImages = $("#album").attr("num-images");
        var imageSize = $("#album").attr("image-size") || 's';
        
        console.log(numImages, imageSize);
        
        function fetchImgur(url) {
            $.ajax(url,
                   {
                       headers: {
                           Authorization: 'Client-ID c14a24f452ea28e'                         
                       },
                       success: function(res) {
                           console.log(res);
                           images = res.data;                
                           populateImage(images);
                       }   
                   }
            );        
        }
        
        function populateImage(images) {
            var populated = 0;
            
            images.filter(function(img) {
                return !img.is_album
                    && !img.animated
                    && ["image/png", "image/gif", "image/jpeg"].includes(img.type);
            }).forEach(function(img) {
                
                if (numImages && populated++ >= numImages) return;
                
                var imgDiv = document.createElement("div");                
                var imgNode = document.createElement("img");
                imgNode.src = img.link.substr(0, img.link.lastIndexOf('.'))
                            + imageSize + img.link.substr(img.link.lastIndexOf('.'));                
                var textNode = document.createElement("span");
                textNode.innerHTML = img.title;
                
                imgDiv.appendChild(imgNode);
                imgDiv.appendChild(textNode);                
                $("#album").append(imgDiv);
                //$("#album").append(imgNode);
                //$("#album").append(textNode);
                    
            });
        }
    });
    
});

