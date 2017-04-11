//VARS FROM WEBPAGE
var totalChampionPoints = 0;
var nearDatePlayed = 0;
var championLevels = 0;
var extraLevel = 0;
var championId = 0;

function resetValues() {
    $('ul#chart').empty();
    for (var i = 0; i < 9; i++) {
        $('ul#p' + i + '_chart').empty();
    }
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
          data:MatchList_summonerPoints
        }]
    });
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
                    if ((championId === this.championId) && this.chestGranted) {
                        //TODO agregas championPoints al array
                        MatchList_summonerPoints.push(this.championPoints);

                        return "bar currentChest";
                    } else if (this.chestGranted) {
                        return "bar chest";
                    } else if (championId === this.championId) {
                        //TODO agregas championPoints al array
                        MatchList_summonerPoints.push(this.championPoints);

                        return "bar current"
                    } else {
                        return "bar";
                    }
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
    $('#summonerName').html("Name: " + $("#userName").val().replace(" ", "").toLowerCase().trim());
    $('#totalPoints').html("Total: " + totalChampionPoints);
    $('#totalChampionLevel').html("Level: " + championLevels + " [" + extraLevel + "]");
    $('#totalTimePlayed').html("Time: " + new Date(nearDatePlayed).toString());
    $("#top").toggle("slow");
    $("#tabs").show("slow");
}

function getTab2Info(sumId) {
    JSONmatchSumId = getCurrentMatchBySummonerId(sumId);

    //order
    var order = $("input:radio[name='order']:checked").val();

    //$("#prueba2").html(JSON.stringify(JSONmatchSumId));

    for (var i = 0; i < 10; i++) {
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
        MatchList_summonerChamp.push(JSONchampion.data[this.championId].name);

        //printbars
        printBars(jsonSortByChampionID, "#p" + i + "_chart");

        //Comprobar length de array para ver si se ha añadido champPoints
        if (MatchList_summonerChamp.length !== MatchList_summonerPoints.length) {
          MatchList_summonerPoints.push(0);
        }
        if (JSONmatchSumId.participants[i].summonerName == $("#userName").val()) {
            if (i < 5) {
                $("#tab-2_title").html("Team1 *");
                $("#tab-3_title").html("Team2");
            } else {
                $("#tab-2_title").html("Team1");
                $("#tab-3_title").html("Team2 *");
            }
        }
        $('#p' + i + '_summonerName').html("Name: " + JSONmatchSumId.participants[i].summonerName);
        $('#p' + i + '_totalPoints').html("Total: " + totalChampionPoints);
        $('#p' + i + '_totalChampionLevel').html("Level: " + championLevels + " [" + extraLevel + "]");
        $('#p' + i + '_totalTimePlayed').html("Time: " + new Date(nearDatePlayed).toString());

        //resetValues per every champ
        nearDatePlayed = 0;
        totalChampionPoints = 0;
        championLevels = 0;
        extraLevel = 0;
    }
}

function getTab4Info() {

    myChart.update({
        // A labels array that can contain any sort of values
        labels: MatchList_summonerChamp,
        // Our series array that contains series objects or in this case series data arrays
        series: [{
          name: 'ChamPoints',
          data:MatchList_summonerPoints
        }]
    });

    var $tooltip = $('<div class="tooltip tooltip-hidden"></div>').appendTo($('.ct-chart'));

    $(document).on('mouseenter', '.ct-point', function() {
      var seriesName = $(this).closest('.ct-series').attr('ct:series-name'),
          value = $(this).attr('ct:value');

      $tooltip.text(seriesName + ': ' + value);
      $tooltip.removeClass('tooltip-hidden');
    });

    $(document).on('mouseleave', '.ct-point', function() {
      $tooltip.addClass('tooltip-hidden');
    });

    $(document).on('mousemove', '.ct-point', function(event) {
      //console.log(event);
      $tooltip.css({
        left: (event.offsetX || event.originalEvent.layerX) - $tooltip.width() / 2,
        top: (event.offsetY || event.originalEvent.layerY) - $tooltip.height() - 20
      });
    });

}

function main() {
    var summoner_name = $("#userName").val().replace(" ", "").toLowerCase().trim();
    API_KEY = $("#apiKey").val();
    if (summoner_name !== "") {

        //get ID summoner
        var sumId = getSummonerIdByName(summoner_name);

        getTab1Info(sumId);
        getTab2Info(sumId);
        getTab4Info();

    } else {
        alert("Insert Summoner name");
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
