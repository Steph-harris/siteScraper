$(document).ready(function(){
  $("#dataGet").on("click", function(e){
    e.preventDefault();
    $.getJSON("/scrapedData", function(results){
      $("topNews").empty();
      results.forEach(function(headline){
        //build li w/ href
      });
    });
  });
});
