//VARS FROM WEBPAGE
var totalChampionPoints = 0;
var nearDatePlayed = 0;
var championLevels = 0;
var extraLevel = 0;
var championId = 0;

  // Initialize a Line chart in the container with the ID chart1
/*var myChart = new Chartist.Bar('.ct-chart', {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    series: [
      [5, 4, 3, 7, 5, 10, 3],
      [3, 2, 9, 5, 4, 6, 4]
    ]
  }, {
    seriesBarDistance: 10,
    reverseData: true,
    horizontalBars: true,
    axisY: {
      offset: 70
    }
  });
*/
var dataChart = {
  // A labels array that can contain any sort of values
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  // Our series array that contains series objects or in this case series data arrays
  series: [
    [5, 4, 3, 7, 5, 10, 3],
    [3, 2, 9, 5, 4, 6, 4]
  ]
};
var myChart = new Chartist.Bar('.ct-chart', dataChart, {
  seriesBarDistance: 10,
  reverseData: true,
  horizontalBars: true,
  axisY: {
    offset: 70
  }
});

function main() {
    var summoner_name = $("#userName").val().replace(" ", "").toLowerCase().trim();
    if (summoner_name !== "") {
        //get ID summoner
        var sumId = getSummonerIdByName(summoner_name);
        getChartInfo(sumId);
        drawChart();
        alert("Venga loco!");

    } else {
        alert("Insert Summoner name");
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

function getChartInfo(sumId) {
    JSONmatchSumId = getCurrentMatchBySummonerId(sumId);
    for (var i = 0; i < 10; i++) {
        //resetValues per every champ
        nearDatePlayed = 0;
        totalChampionPoints = 0;
        championLevels = 0;
        extraLevel = 0;
        sleep(1100);
        var currSumId = JSONmatchSumId.participants[i].summonerId;

        //get Mastery points from summoner
        var JSONmasterySumId = getChampionMasteryById(currSumId);
        //sort JSON
        jsonSortByChampionID = sortJSON(JSONmasterySumId, order, 'desc');

        championId = JSONmatchSumId.participants[i].championId;

        //Control summonerMatch
        MatchList_JSONmatchSumParticipant.push(JSONmasterySumId);
        MatchList_summonerName.push(JSONmatchSumId.participants[i].summonerName);
        MatchList_summonerChamp.push(JSONchampion.keys[this.championId]);

        //Comprobar length de array para ver si se ha añadido champPoints
        if (MatchList_summonerChamp.length !== MatchList_summonerPoints.length) {
            MatchList_summonerPoints.push(0);
        } else {
            MatchList_summonerPoints.push(this.championPoints);
        }
        console.log(MatchList_summonerPoints);
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
