$(document).ready(function() {
    
    $("body *").mouseenter(function() {
        $(this).addClass("selected");
    });
    
    $("body *").mouseleave(function() {
        $(this).removeClass("selected");
    });
    
});
