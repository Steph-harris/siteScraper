$(document).ready(function(){
  var getMLBStandings = function(){
    preloader("#Standings");

    $.ajax({
      headers: { "Accept": "application/json"},
      method: "GET",
      url: "https://cors-anywhere.herokuapp.com/https://erikberg.com/mlb/standings.json",
      crossDomain: true,
      dataType: "json",
    }).done(function(dt){
      console.log(dt);
      var newObj = {};
      var stDt = dt.standings_date;
      var teamsLn = dt.standing.length;
      var teams = dt.standing;
      var i = 0;
      var stStr = "(Standings as of " + stDt.substr(5, 5) + ")";
      var newTb = `<div id="tableDiv"><table id='Standings_Tbl'>
                    <thead>
                      <th>Team</th>
                      <th>W</th>
                      <th>L</th>
                      <th>G.B.</th>
                      <th>Last 10</th>
                      <th>Streak</th>
                    </thead>
                  </table></div>`;

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
            rowEntry += `<tr>
                        <td class="div_header" title="${newDiv} Division Standings">
                        <b>${newDiv}</b>
                        </td><td>
                        </td><td>
                        </td><td>
                        </td><td>
                        </td><td>
                        </td>
                      </tr>`;
          }
          rowEntry += `<tr title="${val.first_name} ${val.last_name } Standing">
                      <<td>${val.first_name} ${val.last_name }</td>
                      <td>${val.won}</td>
                      <td>${val.lost}</td>
                      <td>${val.games_back}</td>
                      <td>${val.last_ten}</td>
                      <td>${val.streak}</td>
                    </tr>`;

          newObj[newDiv] += rowEntry;
          i++;
        });

        $("#Standings").attr("title", stStr);
        $("#Standings").append(newTb);
        $("#Standings_Tbl").append(newObj['NL East']);
        $("#Standings_Tbl").append(newObj['NL Central']);
        $("#Standings_Tbl").append(newObj['NL West']);
        $("#Standings_Tbl").append(newObj['AL East']);
        $("#Standings_Tbl").append(newObj['AL Central']);
        $("#Standings_Tbl").append(newObj['AL West']);
        $(".div_header").parent().css("background-color", "#004685");
        removePreloader("#Standings");
    });
  }();
});
//add more detailed league
