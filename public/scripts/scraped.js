$(document).ready(function(){

  $.getJSON("/scrapedData", function(results){
    $("topNews").empty();

    for(var i = 0; i< results.length; i++){
      var newLink = "<li>";
      newLink += "<a href="
      newLink += results[i].headLink
      newLink += ">" + results[i].headline
      newLink += "</a></li>";

      $("#topNews").append(newLink);
    }
  });

  $("#dataGet").on("click", function(e){
  e.preventDefault();
  });
});
