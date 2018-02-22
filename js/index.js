  // Initialize a Line chart in the container with the ID chart1
  new Chartist.Bar('.ct-chart', {
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

  function main() {
      var summoner_name = $("#userName").val().replace(" ", "").toLowerCase().trim();
      if (summoner_name !== "") {
          //get ID summoner
          var sumId = getSummonerIdByName(summoner_name);
          alert(sumId);

      } else {
          alert("Insert Summoner name");
      }
  }
