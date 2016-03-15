$(document).ready(function(){

  $.getJSON("/scrapedData", function(results){
    $("topNews").empty();

    for(var i = 0; i< results.length; i++){
      var newLink = "<p>";
      newLink += "<a href="
      newLink += results[i].headLink
      newLink += ">" + results[i].headline
      newLink += "</a></p>";

      var addNote = "<div><form method='POST' action='/newNote'>"
      addNote += "<button class='success button' href='#'>"
      addNote += "Add Note</button>"
      addNote += "</form></div>"

      // var delNote
      var delNote = "<div><form method='POST' action='/deleteNote'>"
      delNote += "<button class='alert button' href='#'>"
      delNote += "Delete Note</button>"
      delNote += "</form></div>"

      // "<button class="alert hollow button" href="#">Alert Color</button>"
      // $("newLink");
      $("#topNews").after(delNote).after(addNote).after(newLink);
    }
  });

  $("#dataGet").on("click", function(e){
  e.preventDefault();
  });
});
