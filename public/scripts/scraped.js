$(document).ready(function(){
  $("#dataGet").on("click", function(e){
    e.preventDefault();
    $.getJSON("/scrapedData", function(results){
      $("topNews").empty();
      results.forEach(function(headlines){
        //build li w/ href
      });
    });
  });
});
