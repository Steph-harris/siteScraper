$(document).ready(function(){
  $("#dataGet").on("click", function(e){
    e.preventDefault();
    $.getJSON("/scrapedData", function(results){
      $("topNews").empty();
      for(var i = 0; i< results.length; i++){
        var newLink = "<li>";
        newLink += "<a href=" + results[i].headLink + ">" + results[i].headline + "</a></li>";
        $("#topNews").append(newLink);
      }
    });
  });
});
