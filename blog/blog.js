window.onload = function(){
    loadPost(document.getElementById("first-card"));
    loadPost(document.getElementById("second-card"));
}

function loadPost(a){
    var div = a.childNodes[0];
    var txt = "";
    div.innerHTML = txt;

    // sample url used here, you can make it more dynamic as per your need.
    // used AJAX here to just hit the url & get the page source from those website. It's used here like the way CURL or file_get_contents (https://www.php.net/manual/en/function.file-get-contents.php) from PHP used to get the page source.
    $.ajax({
        url: a.href,
        error: function() {
          txt = "Unable to retrieve webpage source HTML";
        }, 
        success: function(response){
            // will get the output here in string format
            // used $.parseHTML to get DOM elements from the retrieved HTML string. Reference: https://api.jquery.com/jquery.parsehtml/
            response = $.parseHTML(response);
            $.each(response, function(i, el){
                if(el.nodeName.toString().toLowerCase() == 'meta' && $(el).attr("name") == "blog:title"){
                    txt += "<h2>" + ($(el).attr("content") ? $(el).attr("content") : ($(el).attr("value") ? $(el).attr("value") : "")) + "</h2>";
                }else if(el.nodeName.toString().toLowerCase() == 'meta' && $(el).attr("name") == "blog:date"){
                    txt += "<h5 style='margin-top: -20px;'>" + ($(el).attr("content") ? $(el).attr("content") : ($(el).attr("value") ? $(el).attr("value") : "")) + "</h5>";
                }else if(el.nodeName.toString().toLowerCase() == 'meta' && $(el).attr("name") == "blog:content1"){
                    txt += "<p>" + ($(el).attr("content") ? $(el).attr("content") : ($(el).attr("value") ? $(el).attr("value") : "")) + "</p>";
                }else if(el.nodeName.toString().toLowerCase() == 'meta' && $(el).attr("name") == "blog:content2"){
                    txt += "<p>" + ($(el).attr("content") ? $(el).attr("content") : ($(el).attr("value") ? $(el).attr("value") : "")) + "</p>";
                }
            });
        },
        complete: function(){
            div.innerHTML = txt;
        }
    });
}
