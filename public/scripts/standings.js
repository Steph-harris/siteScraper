$(document).ready(function(){
  var getMLBStandings = function(){
    preloader("#Standings");
    //do Ajax
    $.ajax({
      headers: { "Accept": "application/json"},
      method: "GET",
      url: "https://cors-anywhere.herokuapp.com/https://erikberg.com/mlb/standings.json",
      crossDomain: true,
      dataType: "json",
    }).done(function(dt){
      console.log(dt);
        var stDt = dt.standings_date;
        var teamsLn = dt.standing.length;
        var teams = dt.standing;
        var newRws;
        var i =0;
        var stStr = "(Standings as of " + stDt.substr(5, 5) + ")";
        var newTb = `<table id='Standings_Tbl'><thead>
        <th>Team</th>
        <th>W</th>
        <th>L</th>
        <th>G.B.</th>
        </thead></table>`;

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

          if(i%5 == 0){
            newRws += `<tr><td class="div_header" title="${val.conference} ${division} Division Standings"><b>${val.conference} ${division}</b></td><td></td><td></td></tr>`;
          }
          newRws += `<tr title="${val.first_name} ${val.last_name } Standing"><<td>${val.first_name} ${val.last_name }</td><td>${val.won}</td><td>${val.lost}</td><td>${val.games_back}</td></tr>`;
          i++;
        });

        $("#Standings").attr("title", stStr);
        $("#Standings").append(newTb);
        $("#Standings_Tbl").append(newRws);
        removePreloader("#Standings");
    });
  }();
});
//adjust length for standings
//add more detailed league
