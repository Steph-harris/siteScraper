$(document).ready(function(){
  var getMLBStandings = function(){
    preloader("#Standings");
    //do Ajax
    $.ajax({
      method: "GET",
      url: "https://erikberg.com/mlb/standings.json",
      dataType: "json",
    }).done(function(dt){
        var stDt = dt.standings_date;
        var teamsLn = dt.standing.length;
        var teams = dt.standing;
        var newRws;
        var i =0;
        var stStr = "(Standings as of " + stDt.slice(5, 10) + ")";
        var newTb = `<table id='Standings_Tbl'><thead>
        <th>Division</th>
        <th>Team</th>
        <th>W</th>
        <th>L</th>
        <th>G.B.</th>
        </thead></table>`;

        _.forEach(teams, function(val){
          if(i%5 == 0){
            newRws += `<tr><td></td><td>${val.conference}</td><td>${val.division}</td><td></td></tr>`;
          }
          newRws += `<tr><td>${val.conference} ${val.division}</td><td>${val.first_name} ${val.last_name }</td><td>${val.won}</td><td>${val.lost}</td><td>${val.games_back}</td></tr>`;
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
