$(document).ready(function(){
  //transferred to handlebars 6/19
  $.getJSON("/scrapedNBA", function(results){
    console.log(results);
  });
});
