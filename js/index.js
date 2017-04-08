//VARS FROM WEBPAGE
var totalChampionPoints = 0;
var nearDatePlayed = 0;
var championLevels = 0;
var extraLevel = 0;

function resetValues() {
    $('ul#chart').empty();
    for (var i; i<9;i++) {
      $('ul#p'+i+'_chart').empty();
    }
    nearDatePlayed = 0;
    totalChampionPoints = 0;
    championLevels = 0;
    extraLevel = 0;
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

var transformsJSONsumChamMastery = {

    //Single bar in the bar chart
    "bar": [{
        "<>": "li",
        "class": "group",
        "title": function() {
            var d = new Date();
            var curr = d.getTime();
            //parse miliseconds to days
            var daysBetweenDates = Math.round((curr - this.lastPlayTime) / 1000 / 60 / 60 / 24);
            return (this.championPoints + " [" + daysBetweenDates + " days]");
        },
        "html": [{
                "<>": "div",
                "class": function() {
                    return (this.chestGranted ? "bar chest" : "bar");
                },
                "style": function() {
                    //Calculate the scale that we want this in
                    if (nearDatePlayed < this.lastPlayTime) {
                        nearDatePlayed = this.lastPlayTime;
                    }
                    totalChampionPoints += this.championPoints;
                    championLevels += this.championLevel;
                    extraLevel += ((this.championLevel > 5) ? this.championLevel - 5 : 0);
                    return ('height:' + this.championPoints / 250 + 'px;');
                },
                "html": "${championLevel}"
            },
            {
                "<>": "div",
                "class": "label",
                "html": function() {
                    return (JSONchampion.data[this.championId].name)
                }
            }
        ]
    }]
};

function printBars(data, cssLocation) {
    $(cssLocation).json2html(JSON.stringify(data), transformsJSONsumChamMastery.bar);
    //console.log(JSON.stringify(data));
}

function getTab1Info(sumId) {
  //print bars from mastery points
  resetValues();

  //order
  var order = $("input:radio[name='order']:checked").val();

  //get Mastery points from summoner
  var JSONmasterySumId = getChampionMasteryById(sumId);

  //sort JSON
  jsonSortByChampionID = sortJSON(JSONmasterySumId, order, 'desc');

  printBars(jsonSortByChampionID, "#chart");
  $('#summonerName').html("Name: " +  $("#userName").val().replace(" ", "").toLowerCase().trim());
  $('#totalPoints').html("Total: " + totalChampionPoints);
  $('#totalChampionLevel').html("Level: " + championLevels + " [" + extraLevel + "]");
  $('#totalTimePlayed').html("Time: " + new Date(nearDatePlayed).toString());
  $("#top").toggle("slow");
  $("#tabs").show("slow");
}

// sleep time expects milliseconds
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function getTab2Info(sumId) {
  JSONmatchSumId = getCurrentMatchBySummonerId(sumId);

  //order
  var order = $("input:radio[name='order']:checked").val();

  //$("#prueba2").html(JSON.stringify(JSONmatchSumId));

  for (var i = 0; i < 10; i++) {
    var currSumId = JSONmatchSumId.participants[i].summonerId;
    //get Mastery points from summoner
    var JSONmasterySumId = getChampionMasteryById(currSumId);
    //sort JSON
    jsonSortByChampionID = sortJSON(JSONmasterySumId, order, 'desc');

    printBars(jsonSortByChampionID, "#p"+i+"_chart");
    $('#p'+i+'_summonerName').html("Name: " +  JSONmatchSumId.participants[i].summonerName);
    $('#p'+i+'_totalPoints').html("Total: " + totalChampionPoints);
    $('#p'+i+'_totalChampionLevel').html("Level: " + championLevels + " [" + extraLevel + "]");
    $('#p'+i+'_totalTimePlayed').html("Time: " + new Date(nearDatePlayed).toString());

    //resetValues

    nearDatePlayed = 0;
    totalChampionPoints = 0;
    championLevels = 0;
    extraLevel = 0;
  }
}

function main() {
    var summoner_name = $("#userName").val().replace(" ", "").toLowerCase().trim();
    API_KEY = $("#apiKey").val();
    if (summoner_name !== "") {

        //get ID summoner
        var sumId = getSummonerIdByName(summoner_name);

        getTab1Info(sumId);
        getTab2Info(sumId);

    } else {
        alert("Insert Summoner name");
    }
}
