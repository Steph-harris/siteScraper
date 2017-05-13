$(document).ready(function(){
  $(document).on("click", ".game-boxes", function(){
    console.log($(this).attr("data-venue")+", "+ $(this).attr("data-city"));
  });
});
