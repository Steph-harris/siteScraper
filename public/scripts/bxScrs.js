$(document).ready(function(){
  $(document).foundation();
  $(document).on("click", ".game-boxes", function(){
    var place = $(this).attr("data-venue").replace(" ", "");
    var city = $(this).attr("data-city");

    //send these 3 vars to Node as a req
    $.getJSON("/foursquare/"+place+"/"+city, function(results){
      $.each(results, function(i){
        console.log(results[i]);

        $('#venueModal').foundation('open');
      })
    });
  });

  $(".game-boxes").hover(function(){
    $(this).attr("title", "Click for Stadium Info");
    $(this).css("background-color","#cecece");
    $(this).children(".status-tab").css("background-color","#ec8170");
  }, function(){
    $(this).attr("title", "");
    $(this).css("background-color","white");
    $(this).children(".status-tab").css("background-color","#F7742C");
  });
});
//SET PHOTO BACKGROUND BASED ON CLICKED VENUE
//CHANGE BOX COLORS BASED ON HOME TEAM OF CLICKED VENUE (AWAY TEAM IF CLICKED 2X)
//MODAL POPUP WITH VENUE INFO (stadium pic as background)
