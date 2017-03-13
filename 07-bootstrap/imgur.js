
// First import jquery

window.addEventListener('load', function() {
    
    var body = document.querySelector("body");
    var jqueryScriptNode = document.createElement("script");
    jqueryScriptNode.src = "https://code.jquery.com/jquery-3.1.1.min.js";
    body.appendChild(jqueryScriptNode);

    var categories = document.querySelectorAll("li");
    console.log(categories);
    for(var i=0; i<categories.length; i++) {
        var item = categories.item(i);
        item.addEventListener('click', function(e) {
            var subreddit = e.target.innerHTML;
            console.log("Switching category to "+subreddit);
            fetchImgur('https://api.imgur.com/3/gallery/r/'+subreddit+'/top/0.json');
        });
    }
    
    jqueryScriptNode.addEventListener('load', function() {
        fetchImgur('https://api.imgur.com/3/gallery/r/aww/top/0.json');
    });    

    /*
    document.getElementById("album").addEventListener('updated', function() {
        var images = document.querySelectorAll("#album > div");
        console.log(images.length);
        for(var i=0; i<images.length; i++) {
            console.log("add classes!");            
            images[i].classList.add("col-md-4");
            images[i].classList.add("col-sm-6");
            images[i].classList.add("col-xs-12");            
            images[i].classList.add("thumbnail");
        }
    });
    */
    
});


function fetchImgur(url) {
    var numImages = $("#album").attr("num-images");
    var imageSize = $("#album").attr("image-size") || 's';        
    
    console.log(numImages, imageSize);
    
    $.ajax(url,
           {
               headers: {
                   Authorization: 'Client-ID c14a24f452ea28e'                         
               },
               success: function(res) {
                   console.log(res);
                   images = res.data;                
                   populateImage(images, numImages, imageSize);
               }   
           }
    );        
}

function populateImage(images, numImages, imageSize) {

    // first clear all images in #album
    $("#album").html("");
    
    var populated = 0;    
    images.filter(function(img) {
        return !img.is_album
            && !img.animated
            && ["image/png", "image/gif", "image/jpeg"].includes(img.type);
    }).forEach(function(img, idx, ary) {
        
        if (numImages && populated++ >= numImages) {
            console.log("album updated!");
            document.getElementById("album").dispatchEvent(new Event('updated'));            
            return;
        }
        
        var imgDiv = document.createElement("div");                
        var imgNode = document.createElement("img");
        imgNode.src = img.link.substr(0, img.link.lastIndexOf('.'))
                    + imageSize + img.link.substr(img.link.lastIndexOf('.'));                
        var textNode = document.createElement("p");
        textNode.innerHTML = img.title;
        
        imgDiv.appendChild(imgNode);
        imgDiv.appendChild(textNode);                
        $("#album").append(imgDiv);

    });

    
}
