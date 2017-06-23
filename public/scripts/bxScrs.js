$(document).ready(function(){
  var picObj, venDt, lnScr, lnScrDt, picDt, picLn, randNum, mdlGameInfo;
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

    $("#gameInfo").empty();
    //send these 4 vars to Node as a req
    $.getJSON(`/foursquare/${place}/${city}/${gameID}`, function(results){
      lnScr = results[0].scores;
      lnScrDt = results[0].scores.data.game;
      venDt = results[1][0];
      picDt = results[2].photos;
      picLn = picDt.length;
      var venURL = venDt.url;
      var venAddr = venDt.location.address;
      var venPO = venDt.location.postalCode;
      var phone = venDt.contact.formattedPhone;
      var unforPhone = venDt.contact.phone;
      var WPInfo, LPInfo, SvInfo, topYN;

      //GAME INFO BASED ON STATUS
      if(lnScrDt.status == "Final" || lnScrDt.status == "Game Over"){
        mdlGameInfo = `<div title="final score"><br><h3>FINAL</h3>`
        mdlGameInfo += `<h4>${lnScrDt.away_team_city} ${lnScrDt.away_team_name} `;
        mdlGameInfo += `(${lnScrDt.away_win} - ${lnScrDt.away_loss}): ${lnScrDt.away_team_runs}</h4>`;
        mdlGameInfo += `<h4> ${lnScrDt.home_team_city} ${lnScrDt.home_team_name} `;
        mdlGameInfo += `(${lnScrDt.home_win} - ${lnScrDt.home_loss}): ${lnScrDt.home_team_runs}</h4></div>`;

        WPInfo  = `<div title="winning pitcher" id="WP">`;
        WPInfo += `<p>Win: ${lnScrDt.winning_pitcher.first} ${lnScrDt.winning_pitcher.last}`;
        WPInfo += ` (${lnScrDt.winning_pitcher.wins} - ${lnScrDt.winning_pitcher.wins}, `;
        WPInfo += `${lnScrDt.winning_pitcher.era})</p>`;
        WPInfo += `</div>`;

        LPInfo  = `<div title="losing pitcher" id="WP">`;
        LPInfo += `<p>Loss: ${lnScrDt.losing_pitcher.first} ${lnScrDt.losing_pitcher.last}`;
        LPInfo += ` (${lnScrDt.losing_pitcher.wins} - ${lnScrDt.losing_pitcher.wins}, `;
        LPInfo += `${lnScrDt.losing_pitcher.era})</p>`;
        LPInfo += `</div>`;

        if(lnScrDt.save_pitcher.last != ""){
          SvInfo  = `<div title="save pitcher" id="SP">`;
          SvInfo += `<p>Save: ${lnScrDt.save_pitcher.first} ${lnScrDt.save_pitcher.last}`;
          SvInfo += ` (${lnScrDt.save_pitcher.saves}, ${lnScrDt.save_pitcher.era})</p>`;
          SvInfo += `</div><br>`;
        }
      } else if(lnScrDt.status == "Preview" || lnScrDt.status == "Pre-Game" || lnScrDt.status == "Warmup"){
        // mdlGameInfo = `<div title="preview"><br><h3>${topYN} ${lnScrDt.inning} </h3>`
        // mdlGameInfo += `<h4>${lnScrDt.away_team_city} ${lnScrDt.away_team_name} `;
        // mdlGameInfo += `(${lnScrDt.away_win} - ${lnScrDt.away_loss})</h4>`;
        // mdlGameInfo += `<h4>vs ${lnScrDt.home_team_city} ${lnScrDt.home_team_name} `;
        // mdlGameInfo += `(${lnScrDt.home_win} - ${lnScrDt.home_loss})</h4></div>`;

      } else if(lnScrDt.status == "In Progress"){
        topYN = lnScrDt.top_inning == "Y" ? "TOP" : "BOTTOM";
        mdlGameInfo = `<div><table title="current score">
          <thead>
            <tr>
              <td>${topYN} ${lnScrDt.inning}</td>
              <td>R</td>
              <td>H</td>
              <td>E</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${lnScrDt.away_team_city} ${lnScrDt.away_team_name} (${lnScrDt.away_win} - ${lnScrDt.away_loss})</td>
              <td>${lnScrDt.away_team_runs}</td>
              <td>${lnScrDt.away_team_hits}</td>
              <td>${lnScrDt.away_team_errors}</td>
            </tr>
            <tr>
              <td>${lnScrDt.home_team_city} ${lnScrDt.home_team_name} (${lnScrDt.home_win} - ${lnScrDt.home_loss})</td>
              <td>${lnScrDt.home_team_runs}</td>
              <td>${lnScrDt.home_team_hits}</td>
              <td>${lnScrDt.home_team_errors}</td>
            </tr>
          </tbody>
        </table></div>`;
        playerInfo = `<div title="game progress">
          <p>STRIKES: ${lnScrDt.strikes} BALLS: ${lnScrDt.balls} OUTS: ${lnScrDt.outs}</p>
          <p>PITCHING: ${lnScrDt.current_pitcher.first} ${lnScrDt.current_pitcher.last}
            (${lnScrDt.current_pitcher.wins} - ${lnScrDt.current_pitcher.wins}, ${lnScrDt.current_pitcher.era})</p>
          <p>BATTING: ${lnScrDt.current_batter.first_name} ${lnScrDt.current_batter.last_name}
           (${lnScrDt.current_batter.avg})</p>
          <p>ON DECK: ${lnScrDt.current_ondeck.first_name} ${lnScrDt.current_ondeck.last_name}</p>
          <p>IN THE HOLE: ${lnScrDt.current_inhole.first_name} ${lnScrDt.current_inhole.last_name}</p>
        </div>`;
      }
      console.log(lnScrDt);

      $('#venLink').attr("href", venURL).text(placeOG);
      $('#modAddress').text(venAddr);
      $('#modCity').text(city + " "+ venPO);
      $('#callVenue').attr("href", "tel:"+unforPhone).text(phone);
      $('#venueModal').foundation('open');
      $("#disclaimer").text(lnScr.copyright);

      if(lnScrDt.status == "Final" || lnScrDt.status == "Game Over"){
        $("#gameInfo").append(mdlGameInfo).append(WPInfo).append(LPInfo).append(SvInfo);
      } else if(lnScrDt.status == "Preview" || lnScrDt.status == "Pre-Game" || lnScrDt.status == "Warmup"){

      } else if(lnScrDt.status == "In Progress"){
        $("#gameInfo").append(mdlGameInfo).append(playerInfo);
      }//Delayed Rain Delay Postponed
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
