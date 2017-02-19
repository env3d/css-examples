
$(document).ready(function() {

    fetchImgur('https://api.imgur.com/3/gallery/r/aww/top/0.json');
    //fetchImgur('https://api.imgur.com/3/gallery/r/aww/top/1.json');

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
        images.filter(function(img) {
            return !img.is_album
                && !img.animated
                && ["image/png", "image/gif", "image/jpeg"].includes(img.type);
        }).forEach(function(img) {
            var imgDiv = document.createElement("div");
            
            var imgNode = document.createElement("img");
            imgNode.src = img.link.substr(0, img.link.lastIndexOf('.'))
                + "s" + img.link.substr(img.link.lastIndexOf('.'));

            var textNode = document.createElement("span");
            textNode.innerHTML = img.title;

            imgDiv.appendChild(imgNode);
            imgDiv.appendChild(textNode);
            
            //console.log(imgNode.src);
            $("#album").append(imgDiv);
            //$("#album").append(textNode);
        });
    }
    
});
