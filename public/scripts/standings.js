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
        var stStr = "(As of " + stDt.slice(5, 10) + ")";

        for(var i = 0; i<teamsLn; i++){
          console.log(teams[i].team_id);
        }

        removePreloader("#Standings");
    });
  }();
});
