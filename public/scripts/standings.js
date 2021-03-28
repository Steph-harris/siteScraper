$(document).ready(function(){
  $("#americanTbl").hide();

  $("#leagueSelect input").on("click", function(){
    $("table").toggle();
    $("#leagueSelect input").toggleClass("activeBtn fadeBtn");
  });

  var getMLBStandings = function(){
    preloader("#Standings");
    //do Ajax
    $.get("/standings")
      .done(function(dt){
      console.log(dt);
      var newObj = {};
      var stDt = dt.standings_date;
      var teamsLn = dt.standing.length;
      var teams = dt.standing;
      var i = 0;
      var standingsDate = "(Standings as of " + stDt.substr(5, 5) + ")";
      var nationalTb = `<table id='nationalTbl'>
                        </table>`;
      var americanTb = `<table id='americanTbl'>
                        </table>`;
        _.forEach(teams, function(val){
          switch(val.division){
            case "E":
              var division = "East"
              break;
            case "W":
              var division = "West"
              break;
            case "C":
              var division = "Central"
              break;
          }

          var newDiv = `${val.conference} ${division}`;
          var rowEntry = "";

          if(i%5 == 0){
            rowEntry += `<tr class="whiteColor">
                        <td class="div_header" title="${newDiv} Division Standings">
                          ${division}
                        </td>
                        <td>W</td>
                        <td>L</td>
                        <td>G.B.</td>
                        <td>Last 10</td>
                        <td>Streak</td>
                      </tr>`;
          }
          rowEntry += `<tr title="${val.first_name} ${val.last_name } Standing">
                        <td>${val.first_name} ${val.last_name }</td>
                        <td>${val.won}</td>
                        <td>${val.lost}</td>
                        <td>${val.games_back}</td>
                        <td>${val.last_ten}</td>
                        <td>${val.streak}</td>
                       </tr>`;

          newObj[newDiv] += rowEntry;
          i++;
        });

        $("#Standings").attr("title", standingsDate);
        $("#nationalTbl").append(newObj['NL East']);
        $("#nationalTbl").append(newObj['NL Central']);
        $("#nationalTbl").append(newObj['NL West']);
        $("#americanTbl").append(newObj['AL East']);
        $("#americanTbl").append(newObj['AL Central']);
        $("#americanTbl").append(newObj['AL West']);
        $(".div_header").parent().css("background-color", "#004685");
        removePreloader("#Standings");
    });
  }();
});
//add more detailed league
