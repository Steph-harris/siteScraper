$(document).ready(function(){
  var picObj, venDt, picDt, picLn, randNum;
  var mainHgt = screen.height;
  var artHgt = mainHgt;
  var gmHgt = artHgt -50;

  if(artHgt>500){
    $("#articleDiv").css("height", artHgt);
    $("#gameScroll").css("height", gmHgt);
  } else {
    $("#articleDiv").css("height", 400);
    $("#gameScroll").css("height", 400);
  }

  $.getJSON("/", function(response){
    console.log(response);
  });

  $(document).foundation();
  $(document).on("click", ".game-boxes", function(){
    var placeOG = $(this).attr("data-venue");
    var place = $(this).attr("data-venue").replace(" ", "");
    var city = $(this).attr("data-city");

    //send these 3 vars to Node as a req
    $.getJSON("/foursquare/"+place+"/"+city, function(results){
      venDt = results[0][0];
      picDt = results[1];
      var venURL = venDt.url;
      var venAddr = venDt.location.address;
      var venPO = venDt.location.postalCode;
      var phone = venDt.contact.formattedPhone;
      var unforPhone = venDt.contact.phone;
      picLn = picDt.length;

console.log(venDt);
console.log(picDt);

      $('#venLink').attr("href", venURL).text(placeOG);
      $('#modAddress').text(venAddr);
      $('#modCity').text(city + " "+ venPO);
      $('#callVenue').attr("href", "tel:"+unforPhone).text(phone);
      $('#venueModal').foundation('open');
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

  $(document).on("closeme.zf.reveal", function(){
    randNum = Math.floor(Math.random() * picLn);

    //set pic as background
    $('#venueModal').css("background-image", "url("+picDt[randNum]+")");
  });
});
//SET PHOTO BACKGROUND BASED ON CLICKED VENUE
//CHANGE BOX COLORS BASED ON HOME TEAM OF CLICKED VENUE (AWAY TEAM IF CLICKED 2X)
//MODAL POPUP WITH VENUE INFO (stadium pic as background)
