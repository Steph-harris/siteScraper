  function setDate(){
    var curDate = new Date();
    curDate.setHours(today.getHours() - 4);

    tomorrow.setDate(today.getDate() + 1);

    setYesterdaysDate = function (){
      curDate.setDate(today.getDate() - 1);
    },
    setTodaysDate = function (){

    },

    setTomorrowsDate = function (){

    }
  }

  function preloader(targetID){
    var divIn = '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i><span class="sr-only">Loading...</span>';

    $(targetID).append('<div class="loadingEff"><div class="waitToLoadText">'+divIn+'</div></div>');
  }

  function removePreloader(targetID){
    $(targetID).find('.loadingEff').remove();
  }
