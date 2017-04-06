//VARS FROM WEBPAGE
var totalChampionPoints = 0;
var nearDatePlayed = 0;
var championLevels = 0;
var extraLevel = 0;

function resetValues() {
    $('ul#chart').empty();
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

var transforms = {

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

function printBars(data) {
    $('#chart').json2html(JSON.stringify(data), transforms.bar);
    //console.log(JSON.stringify(data));
}

function main() {
    var summoner_name = $("#userName").val().replace(" ", "").toLowerCase().trim();
    API_KEY = $("#apiKey").val();
    if (summoner_name !== "") {

        //get ID summoner
        var sumId = getSummonerIdByName(summoner_name);
        document.getElementById("sID").innerHTML = sumId;

        //get Mastery points from summoner
        getChampionMasteryById(sumId);

        //print bars from mastery points
        resetValues();

        //order
				var order = $("input:radio[name='order']:checked").val();

        var JSONmasterySumId = getChampionMasteryById(sumId);

        //sort JSON
        jsonSortByChampionID = sortJSON(JSONmasterySumId, order, 'desc');

        printBars(jsonSortByChampionID);
        $('#totalPoints').html("Total: " + totalChampionPoints);
        $('#totalChampionLevel').html("Level: " + championLevels + " [" + extraLevel + "]");
        $('#totalTimePlayed').html("Time: " + new Date(nearDatePlayed).toString());
    } else {
        alert("Insert Summoner name");
    }
}
