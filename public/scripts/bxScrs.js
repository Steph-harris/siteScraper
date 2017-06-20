$(document).ready(function(){
  var picObj, venDt, lnScr, lnScrDt, picDt, picLn, randNum;
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
    var gameID = $(this).attr("data-id").replace(/\/|\-/g, "");

    //send these 4 vars to Node as a req
    $.getJSON(`/foursquare/${place}/${city}/${gameID}`, function(results){
      lnScr = results[0].scores;
      lnScrDt = results[0].scores.data.game;
      venDt = results[1][0];
      picDt = results[2].photos;
      var venURL = venDt.url;
      var venAddr = venDt.location.address;
      var venPO = venDt.location.postalCode;
      var phone = venDt.contact.formattedPhone;
      var unforPhone = venDt.contact.phone;
      picLn = picDt.length;
console.log(lnScrDt);
      $('#venLink').attr("href", venURL).text(placeOG);
      $('#modAddress').text(venAddr);
      $('#modCity').text(city + " "+ venPO);
      $('#callVenue').attr("href", "tel:"+unforPhone).text(phone);
      $('#venueModal').foundation('open');
      $("#disclaimer").text(lnScr.copyright);
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
//modal background to Reveal Orbit
//CHANGE BOX COLORS BASED ON HOME TEAM OF CLICKED VENUE (AWAY TEAM IF CLICKED 2X)
//Make boxes more obviously clickable
//Set modal size based on picture
//add foundation preloader while modal loads
