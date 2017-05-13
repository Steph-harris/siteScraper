$(document).ready(function(){

  $(document).on("click", ".game-boxes", function(){
    var place = $(this).attr("data-venue").replace(" ", "");
    var city = $(this).attr("data-city");

    //send these 3 vars to Node as a req
    $.getJSON("/foursquare/"+place+"/"+city, function(results){
      console.log(results);
    });
  });
});
