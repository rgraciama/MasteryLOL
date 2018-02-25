//VARS FROM WEBPAGE solo si no existen
if (typeof(MatchList_summonerPoints) == "undefined") {
  var MatchList_JSONmatchSumParticipant = [];
  var MatchList_summonerName = [];
  var MatchList_summonerPoints = [];
  var MatchList_summonerChamp = [];
  var MatchList_summonerAveragePoints = [];
  var CurrChampionLevels = [0,0,0,0,0,0,0,0];
  var namesChampionsLevel = [[],[],[],[],[],[],[]];
  var totalChampionPoints = 0;
  var nearDatePlayed = 0;
  var extraLevel = 0;
  var championId = 0;
}
//para poder pintar los tooltip's
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
var dataChart = {
  // A labels array that can contain any sort of values
  labels: MatchList_summonerChamp,
  // Our series array that contains series objects or in this case series data arrays
  series: [{
    name: 'ChamPoints',
    data: MatchList_summonerPoints
  }]
};
var myChart = new Chartist.Bar('#chart1', dataChart, {
  seriesBarDistance: 10,
  reverseData: true,
  horizontalBars: true,
  axisY: {
    offset: 100,
  },
  axisX: {
    type: Chartist.FixedScaleAxis,
    divisor: 4,
    ticks: [1800, 6000, 12600, 21600]
  },
  height: '3000px'
});

function main() {
    resetValues();
    var summoner_name = $("#userName").val().replace(" ", "").toLowerCase().trim();
    if (summoner_name !== "") {
        //get ID summoner
        var sumId = getSummonerIdByName(summoner_name);
        getChartInfo(sumId);
        drawChart();
        drawLevels();
        drawTooltips();
    } else {
        alert("Insert Summoner name");
    }
}
function drawLevels() {
  if (typeof(CurrChampionLevels) != "undefined") {
    //jQuery
    jQuery("#level1 > h5").html(CurrChampionLevels[0]+" ("+Math.round(CurrChampionLevels[0]/totalChampions*100)+"%)");
    jQuery("#level2 > h5").html(CurrChampionLevels[1]+" ("+Math.round(CurrChampionLevels[1]/totalChampions*100)+"%)");
    jQuery("#level3 > h5").html(CurrChampionLevels[2]+" ("+Math.round(CurrChampionLevels[2]/totalChampions*100)+")%");
    jQuery("#level4 > h5").html(CurrChampionLevels[3]+" ("+Math.round(CurrChampionLevels[3]/totalChampions*100)+"%)");
    jQuery("#level5 > h5").html(CurrChampionLevels[4]+" ("+Math.round(CurrChampionLevels[4]/totalChampions*100)+"%)");
    jQuery("#level6 > h5").html(CurrChampionLevels[5]+" ("+Math.round(CurrChampionLevels[5]/totalChampions*100)+"%)");
    jQuery("#level7 > h5").html(CurrChampionLevels[6]+" ("+Math.round(CurrChampionLevels[6]/totalChampions*100)+"%)");
    jQuery("#totalLevel > h5").html("LEVEL "+CurrChampionLevels[7]);
    var totalChampsPlayed = CurrChampionLevels[0]+CurrChampionLevels[1]+
                            CurrChampionLevels[2]+CurrChampionLevels[3]+
                            CurrChampionLevels[4]+CurrChampionLevels[5]+
                            CurrChampionLevels[6];

    jQuery("#totalLevel > h6").html(totalChampsPlayed+"/"+totalChampions+
                              " ("+Math.round(totalChampsPlayed/totalChampions*100)+"%)");
  } else {
    alert("Levels info is not working properly!");
  }
}

function drawChart() {
      myChart.update({
          // A labels array that can contain any sort of values
          labels: MatchList_summonerChamp,
          // Our series array that contains series objects or in this case series data arrays
          series: [{
            name: 'ChamPoints',
            data: MatchList_summonerPoints
          }]
      });
}

function drawTooltips() {
  if (typeof(namesChampionsLevel) != "undefined") {
    //jQuery
    jQuery("#level1").attr('data-original-title', namesChampionsLevel[0]);
    jQuery("#level2").attr('data-original-title', namesChampionsLevel[1]);
    jQuery("#level3").attr('data-original-title', namesChampionsLevel[2])
    jQuery("#level4").attr('data-original-title', namesChampionsLevel[3]);
    jQuery("#level5").attr('data-original-title', namesChampionsLevel[4]);
    jQuery("#level6").attr('data-original-title', namesChampionsLevel[5]);
    jQuery("#level7").attr('data-original-title', namesChampionsLevel[6]);
  } else {
    alert("Champion levels tooltips are not working properly!");
  }
}

function getChartInfo(sumId) {
    //get Mastery points from summoner
    var JSONmasterySumId = getChampionMasteryById(sumId);
    //order
    var order = $("input:radio[name='order']:checked").val();
    //sort JSON
    //si el orden es de nearest level orden ascendente
    var isAsc = (order==="championPointsUntilNextLevel")?'asc':'desc';
    jsonSortByChampionID = sortJSON(JSONmasterySumId, order, isAsc);
    //Every Champion to be setted to the cahr
    for (var i = 0; i < JSONmasterySumId.length; i++) {
      championId = jsonSortByChampionID[i].championId;
      MatchList_summonerChamp.push(JSONchampion.keys[this.championId]);
      MatchList_summonerPoints.push(jsonSortByChampionID[i].championPoints);
      //levels of championJson
      CurrChampionLevels[jsonSortByChampionID[i].championLevel-1]+=1;
      CurrChampionLevels[7]+=jsonSortByChampionID[i].championLevel;
      //draw tooltip
      namesChampionsLevel[jsonSortByChampionID[i].championLevel-1].push(JSONchampion.keys[this.championId]);
    }

}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

//ORDENAR JSON
function sortJSON(data, key, orden) {
    return data.sort(function(a, b) {
        var x = a[key],
            y = b[key];

        //Improvisación de como ordenar si el nearest level es = 0. Osea level7
        if (orden === 'asc') {
            if(x===0) {
              return 1;
            } else {
              return ((x < y) ? -1 : ((x > y) ? 1 : 0));            }
        }

        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

function resetValues() {
    nearDatePlayed = 0;
    totalChampionPoints = 0;
    CurrChampionLevels = [0,0,0,0,0,0,0,0];
    extraLevel = 0;

    MatchList_summonerChamp = [];
    MatchList_summonerName = [];
    MatchList_summonerPoints = [];
    MatchList_JSONmatchSumParticipant = [];
    namesChampionsLevel = [[],[],[],[],[],[],[]];

    drawChart();
}
