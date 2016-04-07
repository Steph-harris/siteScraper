$(document).ready(function(){
  //transfer this to handlebars in the future
  $.getJSON("/scrapedData", function(results){
    $("topNews").empty();
    //loop starts adding headlines from newest entry
    for(var i = 4; i< 5; i--){
      //creates new headline paragraph link from route json
      var newLink = "<p>";
      newLink += "<a href="
      newLink += results[i].headLink
      newLink += ">" + results[i].headline
      newLink += "</a></p>";

      //displays notes associated w/ headline
      if(results[i].notes.length >= 1){
        for(var j=0; j<results[i].notes.length; j++){
          console.log(results[i].notes[j].title);
          console.log(results[i].notes[j].body);
          //build div w/ notes
          var notesDisplay = "<p><span>"
          notesDisplay += results[i].notes[j].title.toUpperCase()
          notesDisplay += ":</span> " + results[i].notes[j].body + "</p>"

          // creates delete button for corresponding note
          var delNote = "<div><form method='POST' action='/deleteNote/"
          delNote += results[i].notes[j]._id + "'>"
          delNote += "<button class='alert tiny button' href='#'>"
          delNote += "X</button>"
          delNote += "</form></div>"

         $("#topNews").after(delNote).after(notesDisplay);
        }
      }

      //creates form for inputting notes to this headline
      var addNote = "<div><form method='POST' action='/newNote/"+ results[i]._id +"'>"
      addNote += "<label>Title"
      addNote += '<input type="text" name= "title" placeholder="Enter text">'
      addNote += '</label><label>Description'
      addNote += '<textarea name= "body" placeholder="None"></textarea>'
      addNote += '</label>'
      addNote += "<button class='primary button' href='#'>"
      addNote += "Add Note</button>"
      addNote += "</form></div>"

      $("#topNews").after(addNote).after(newLink);
    }
  });
});
