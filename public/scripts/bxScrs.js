$(document).ready(function(){
  var picObj, venDt, lnScr, lnScrDt, picDt, picLn, randNum, mdlGameInfo, currInpdate;
  var mainHgt = screen.height;
  var artHgt = mainHgt;
  var gmHgt = artHgt -50;
  var teamColors = [{
    "name": "Arizona D-backs",
    "colors": {
      "hex": ["000000", "A71930", "E3D4AD"]
    }
  },
  {
    "name": "Atlanta Braves",
    "colors": {
      "hex": ["13274F", "CE1141"]
    }
  },
  {
    "name": "Baltimore Orioles",
    "colors": {
      "hex": ["000000", "DF4601"]
    }
  },
  {
    "name": "Boston Red Sox",
    "colors": {
      "hex": ["0D2B56", "BD3039"]
    }
  },
  {
    "name": "Chicago Cubs",
    "colors": {
      "hex": ["0E3386", "CC3433"]
    }
  },
  {
    "name": "Chicago White Sox",
    "colors": {
      "hex": ["000000", "C4CED4"]
    }
  },
  {
    "name": "Cincinnati Reds",
    "colors": {
      "hex": ["000000", "C6011F"]
    }
  },
  {
    "name": "Cleveland Indians",
    "colors": {
      "hex": ["002B5C", "E31937"]
    }
  },
  {
    "name": "Colorado Rockies",
    "colors": {
      "hex": ["231F20", "333366", "C4CED4"]
    }
  },
  {
    "name": "Detroit Tigers",
    "colors": {
      "hex": [ "0C2C56", "FA4614", "000000"]
    }
  },
  {
    "name": "Houston Astros",
    "colors": {
      "hex": ["002D62", "EB6E1F"]
    }
  },
  {
    "name": "Kansas City Royals",
    "colors": {
      "hex": ["004687", "C09A5B"]
    }
  },
  {
    "name": "Los Angeles Angels",
    "colors": {
      "hex": ["003263", "BA0021"]
    }
  },
  {
    "name": "Los Angeles Dodgers",
    "colors": {
      "hex": ["005A9C", "EF3E42"]
    }
  },
  {
    "name": "Miami Marlins",
    "colors": {
      "hex": ["000000", "FF6600", "FFD100", "0077C8"]
    }
  },
  {
    "name": "Milwaukee Brewers",
    "colors": {
      "hex": ["0A2351", "B6922E"]
    }
  },
  {
    "name": "Minnesota Twins",
    "colors": {
      "hex": ["002B5C", "D31145"]
    }
  },
  {
    "name": "New York Mets",
    "colors": {
      "hex": ["002D72", "FF5910"]
    }
  },
  {
    "name": "New York Yankees",
    "colors": {
      "hex": ["003087", "E4002B"]
    }
  },
  {
    "name": "Oakland Athletics",
    "colors": {
      "hex": ["003831", "EFB21E"]
    }
  },
  {
    "name": "Philadelphia Phillies",
    "colors": {
      "hex": ["284898", "E81828"]
    }
  },
  {
    "name": "Pittsburgh Pirates",
    "colors": {
      "hex": ["000000", "FDB827"]
    }
  },
  {
    "name": "San Diego Padres",
    "colors": {
      "hex": ["002D62", "7F411C", "FEC325",  "A0AAB2"]
    }
  },
  {
    "name": "San Francisco Giants",
    "colors": {
      "hex": ["000000", "FD5A1E", "8B6F4E"]
    }
  },
  {
    "name": "Seattle Mariners",
    "colors": {
      "hex": ["0C2C56", "005C5C", "C4CED4"]
    }
  },
  {
    "name": "St. Louis Cardinals",
    "colors": {
      "hex": ["000066", "C41E3A", "FEDB00"]
    }
  },
  {
    "name": "Tampa Bay Rays",
    "colors": {
      "hex": ["092C5C", "8FBCE6", "F5D130"]
    }
  },
  {
    "name": "Texas Rangers",
    "colors": {
      "hex": ["003278", "C0111F"]
    }
  },
  {
    "name": "Toronto Blue Jays",
    "colors": {
      "hex": ["1D2D5C", "134A8E", "E8291C"]
    }
  },
  {
    "name": "Washington Nationals",
    "colors": {
      "hex": ["11225B", "AB0003"]
    }
  }];

  function cleanGBxs(){
    var boxes = document.querySelectorAll(".game-boxes");

    boxes.forEach(function(itm){
      if(itm.attributes[3].value == ""){
        $(itm).remove();
      }
    });
  };

  function cityClean(city){
    var TwinTeamCities = {"Ch": "Chicago", "NY" : "New York", "LA" : "Los Angeles"};
    var citySl = city.slice(0,2);

    if(TwinTeamCities.hasOwnProperty(citySl)){
      return TwinTeamCities[citySl];
    }

    return city;
  }

  function binSearch(arrTm, searchVal){
    var floor = 0;
    var ceil = arrTm.length -1;
    var index, arMidLn;

    while (floor <= ceil){
      arMidLn = Math.floor((floor + ceil)/2);

      if(searchVal > arrTm[arMidLn]["name"]){
        floor = arMidLn +1;
      } else if(searchVal < arrTm[arMidLn]["name"]) {
        ceil = arMidLn -1;
      } else {
        index = arMidLn;
        return index;
      }
    }

    return -1;
  }

  function setHomeColors(homeTm){
    var i = binSearch(teamColors, homeTm);

    return {"main": teamColors[i]["colors"]["hex"][0], "alt": teamColors[i]["colors"]["hex"][1]};
  }

  if(artHgt>500){
    $("#articleDiv").css("max-height", artHgt);
    $("#gameScroll").css("max-height", gmHgt);
    $("#Standings").css("max-height", artHgt);
  } else {
    $("#articleDiv").css("height", 400);
    $("#gameScroll").css("height", 400);
  }

  $.getJSON("/", function(response){
    console.log(response);
  });

  $(document).foundation();
  $(document).on("click", ".game-boxes", function(){
    //start spinner '#venueModal'
    var placeOG = $(this).attr("data-venue");
    var place = $(this).attr("data-venue").replace(" ", "");
    var city = $(this).attr("data-city");
    var gameID = $(this).attr("data-id").replace(/\/|\-/g, "");

    preloader('#gameInfo');

    //SETTING NAMES FOR PARKS W/ ALTERNATE 4SQUARE NAMES
    if(place == "AT&TPark"){
      place = "att-park";
    } else if(place == "OaklandColiseum"){
      place = "oco-coliseum";
    }

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
      var away_city = cityClean(lnScrDt.away_team_city);
      var home_city = cityClean(lnScrDt.home_team_city);
      var homeCityAndTeam = setHomeColors(home_city +" "+lnScrDt.home_team_name);

      $("#gameInfo").empty();

      // console.log(homeCityAndTeam.main);

      //GAME INFO BASED ON STATUS
      if(lnScrDt.status == "Final" || lnScrDt.status == "Game Over"){
        mdlGameInfo = `<div title="final score" class="final"><br><h4>FINAL</h4>`
        mdlGameInfo += `<h3>${away_city} ${lnScrDt.away_team_name} `;
        mdlGameInfo += `(${lnScrDt.away_win} - ${lnScrDt.away_loss}): ${lnScrDt.away_team_runs}</h3>`;
        mdlGameInfo += `<h3> ${home_city} ${lnScrDt.home_team_name} `;
        mdlGameInfo += `(${lnScrDt.home_win} - ${lnScrDt.home_loss}): ${lnScrDt.home_team_runs}</h3></div>`;

        WPInfo  = `<br><div title="winning pitcher" class="WP">`;
        WPInfo += `<h5><b>Win:</b> ${lnScrDt.winning_pitcher.first} ${lnScrDt.winning_pitcher.last}`;
        WPInfo += ` (${lnScrDt.winning_pitcher.wins} - ${lnScrDt.winning_pitcher.losses}, `;
        WPInfo += `${lnScrDt.winning_pitcher.era})</h5>`;
        WPInfo += `</div>`;

        LPInfo  = `<div title="losing pitcher" class="LP">`;
        LPInfo += `<h5><b>Loss:</b> ${lnScrDt.losing_pitcher.first} ${lnScrDt.losing_pitcher.last}`;
        LPInfo += ` (${lnScrDt.losing_pitcher.wins} - ${lnScrDt.losing_pitcher.losses}, `;
        LPInfo += `${lnScrDt.losing_pitcher.era})</h5>`;
        LPInfo += `</div>`;

        if(lnScrDt.save_pitcher.last != ""){
          SvInfo  = `<div title="save pitcher" class="SP">`;
          SvInfo += `<h5><b>Save:</b> ${lnScrDt.save_pitcher.first} ${lnScrDt.save_pitcher.last}`;
          SvInfo += ` (${lnScrDt.save_pitcher.saves}, ${lnScrDt.save_pitcher.era})</h5>`;
          SvInfo += `</div><br>`;
        } else {
          LPInfo += "<br>";
        }
      } else if(lnScrDt.status == "Preview" || lnScrDt.status == "Pre-Game" || lnScrDt.status == "Warmup"){
        mdlGameInfo = `<div title="preview" class="preview"><br><h4>SCHEDULED FIRST PITCH: ${lnScrDt.time} ${lnScrDt.time_zone} </h4>`
        mdlGameInfo += `<h3>${away_city} ${lnScrDt.away_team_name} `;
        mdlGameInfo += `(${lnScrDt.away_win} - ${lnScrDt.away_loss})</h3>`;
        mdlGameInfo += `<h3 class="bold">@</h3>`;
        mdlGameInfo += `<h3>${home_city} ${lnScrDt.home_team_name} `;
        mdlGameInfo += `(${lnScrDt.home_win} - ${lnScrDt.home_loss})</h3></div><br>`;

        //add probable pitchers
        pPitchers = `<div title="probables" class="probables">
        <h4 class ="centered">PROBABLE PITCHERS</h4>
        <h5 class="bold">${lnScrDt.away_name_abbrev}: ${lnScrDt.away_probable_pitcher.throwinghand} #${lnScrDt.away_probable_pitcher.number}
         ${lnScrDt.away_probable_pitcher.first_name} ${lnScrDt.away_probable_pitcher.last_name}
        (${lnScrDt.away_probable_pitcher.wins} - ${lnScrDt.away_probable_pitcher.losses},
         ${lnScrDt.away_probable_pitcher.era})</h5>
         <h5 class="bold">${lnScrDt.home_name_abbrev}: ${lnScrDt.home_probable_pitcher.throwinghand} #${lnScrDt.home_probable_pitcher.number}
         ${lnScrDt.home_probable_pitcher.first_name} ${lnScrDt.home_probable_pitcher.last_name}
         (${lnScrDt.home_probable_pitcher.wins} - ${lnScrDt.home_probable_pitcher.losses},
         ${lnScrDt.home_probable_pitcher.era})</h5>
        </div><br>`;
      } else if(lnScrDt.status == "In Progress" || lnScrDt.status == "Delay"){
        topYN = lnScrDt.top_inning == "Y" ? "TOP" : "BOTTOM";
        mdlGameInfo = `<div class="started"><table title="current score" class="hover">
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
              <td class="bold">${away_city} ${lnScrDt.away_team_name} (${lnScrDt.away_win} - ${lnScrDt.away_loss})</td>
              <td class="bold">${lnScrDt.away_team_runs}</td>
              <td class="bold">${lnScrDt.away_team_hits}</td>
              <td class="bold">${lnScrDt.away_team_errors}</td>
            </tr>
            <tr>
              <td class="bold">${home_city} ${lnScrDt.home_team_name} (${lnScrDt.home_win} - ${lnScrDt.home_loss})</td>
              <td class="bold">${lnScrDt.home_team_runs}</td>
              <td class="bold">${lnScrDt.home_team_hits}</td>
              <td class="bold">${lnScrDt.home_team_errors}</td>
            </tr>
          </tbody>
        </table></div>`;
        playerInfo = `<div title="game progress">
          <p class="bold">STRIKES: ${lnScrDt.strikes} BALLS: ${lnScrDt.balls} OUTS: ${lnScrDt.outs}</p>
          <br>
          <p class="bold">LAST PLAY: ${lnScrDt.pbp_last}</p>
          <br>
          <p><b>PITCHING:</b> ${lnScrDt.current_pitcher.first} ${lnScrDt.current_pitcher.last}
            (${lnScrDt.current_pitcher.wins} - ${lnScrDt.current_pitcher.losses}, ${lnScrDt.current_pitcher.era})</p>
          <p><b>BATTING:</b> ${lnScrDt.current_batter.first_name} ${lnScrDt.current_batter.last_name}
           (${lnScrDt.current_batter.avg})</p>
          <p><b>ON DECK:</b> ${lnScrDt.current_ondeck.first_name} ${lnScrDt.current_ondeck.last_name}</p>
          <p><b>IN THE HOLE:</b> ${lnScrDt.current_inhole.first_name} ${lnScrDt.current_inhole.last_name}</p>
        </div><br>`;
      } else if(lnScrDt.status == "Postponed"){
        mdlGameInfo = `<div title="preview" class="preview"><h4>SCHEDULED FIRST PITCH: ${lnScrDt.time} ${lnScrDt.time_zone} </h4><br>`
        mdlGameInfo += `<h3>${away_city} ${lnScrDt.away_team_name} `;
        mdlGameInfo += `(${lnScrDt.away_win} - ${lnScrDt.away_loss})</h3>`;
        mdlGameInfo += `<h3 class="bold">@</h3>`;
        mdlGameInfo += `<h3>${home_city} ${lnScrDt.home_team_name} `;
        mdlGameInfo += `(${lnScrDt.home_win} - ${lnScrDt.home_loss})</h3></div><br>`;
        mdlGameInfo += `<br> <h3 class="bold">GAME POSTPONED (${lnScrDt.reason})</h3><br>`;
      }
      console.log(lnScrDt);

      $('#venLink').attr("href", venURL).text(placeOG.toUpperCase());
      $('#modAddress').text(venAddr);
      $('#modCity').text(city + " "+ venPO);
      $('#callVenue').attr("href", "tel:"+unforPhone).text(phone);
      $('#venueModal').css('color', `#${homeCityAndTeam.main}`);
      $('#venueModal a').css('color', `#${homeCityAndTeam.alt}`);
      $('#gameInfo h4').css('color', `#${homeCityAndTeam.alt}`);
      $("#disclaimer").text(lnScr.copyright);

      if(lnScrDt.status == "Final" || lnScrDt.status == "Game Over"){
        $("#gameInfo").append(mdlGameInfo).append(WPInfo).append(LPInfo).append(SvInfo);
      } else if(lnScrDt.status == "Preview" || lnScrDt.status == "Pre-Game" || lnScrDt.status == "Warmup"){
        $("#gameInfo").append(mdlGameInfo).append(pPitchers);
      } else if(lnScrDt.status == "In Progress"){
        $("#gameInfo").append(mdlGameInfo).append(playerInfo);
      } //Delayed Rain Delay Postponed
      else if(lnScrDt.status == "Postponed"){
        $("#gameInfo").append(mdlGameInfo);
      }
      $('#venueModal').foundation('open');
      //removePreloader("#gameInfo");
    });
  });

  $("#demoTrigger").click(function(e){
    e.preventDefault();
    $('#demoModal').foundation('open')
  });

  $(".game-boxes").hover(function(){
    $(this).attr("title", "Click for Game Information");
    $(this).css("background-color","#cecece");
    $(this).children(".status-tab").css("background-color","#ec8170");
  }, function(){
    $(this).attr("title", "");
    $(this).css("background-color","white");
    $(this).children(".status-tab").css("background-color","#F7742C");
  });

  $("#venueModal closeme.zf.reveal").on("click", function(){
    randNum = Math.floor(Math.random() * picLn);

    //set pic as background
    $('#venueModal').css("background-image", "url("+picDt[0]+")");
  });

  $(document).on("click", ".fa-angle-double-left", function(){
    date = "yesterday";

    $.getJSON("/gameDate/yesterday", function(results){
      console.log(results);
      $(".fa-angle-double-left").hide();
    });
  });

  $(document).on("click", ".fa-angle-double-right", function(){
    date = "tomorrow";
    $.getJSON("/gameDate/tomorrow", function(results){
      console.log(results);
      $(".fa-angle-double-left").show();
    });
  });

  cleanGBxs();
});
//modal background to Reveal Orbit
//CHANGE BOX COLORS BASED ON HOME TEAM OF CLICKED VENUE (AWAY TEAM IF CLICKED 2X)
//Make boxes more obviously clickable
//Set modal size based on picture
//add foundation preloader while modal loads
