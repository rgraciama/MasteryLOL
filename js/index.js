//VARS FROM WEBPAGE
var totalChampionPoints = 0;
var nearDatePlayed = 0;
var championLevels = 0;
var extraLevel = 0;
var championId = 0;

var dataChart = {
  // A labels array that can contain any sort of values
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  // Our series array that contains series objects or in this case series data arrays
  series: [
    [5000, 4000, 3000, 70000, 50000, 10000, 30000],
    [300, 20000, 90000, 5000, 4000, 6000, 40000]
  ]
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
  height: '3000px',
});

function main() {
    resetValues();
    var summoner_name = $("#userName").val().replace(" ", "").toLowerCase().trim();
    if (summoner_name !== "") {
        //get ID summoner
        var sumId = getSummonerIdByName(summoner_name);
        getChartInfo(sumId);
        drawChart();
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
      //jQuery(".ct-grids").append("<line x1='2100' x2='2100' y1='15' y2='2965' class='ct-grid ct-horizontal'></line>");
}

function getChartInfo(sumId) {

  //order
  var order = $("input:radio[name='order']:checked").val();

  //get Mastery points from summoner
  var JSONmasterySumId = getChampionMasteryById(sumId);

    //sort JSON
    jsonSortByChampionID = sortJSON(JSONmasterySumId, order, 'desc');

    //Every Champion to be setted to the cahr
    for (var i = 0; i < JSONmasterySumId.length; i++) {
      championId = jsonSortByChampionID[i].championId;
      MatchList_summonerChamp.push(JSONchampion.keys[this.championId]);
      MatchList_summonerPoints.push(jsonSortByChampionID[i].championPoints);
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

        if (orden === 'asc') {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        }

        if (orden === 'desc') {
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        }
    });
}

function resetValues() {
    nearDatePlayed = 0;
    totalChampionPoints = 0;
    championLevels = 0;
    extraLevel = 0;

    MatchList_summonerChamp = [];
    MatchList_summonerName = [];
    MatchList_summonerPoints = [];
    MatchList_JSONmatchSumParticipant = [];

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
