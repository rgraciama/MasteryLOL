var JSONSummoner;
var JSONmatchSumId;
var MatchList_JSONmatchSumParticipant = [];
var MatchList_summonerName = [];
var MatchList_summonerPoints = [];
var MatchList_summonerChamp = [];

var sumName = "";
var API_KEY = "";
var res;
/* get request to obtain summoner name by id */
function getSummonerIdByName(name) {
	var data;
	$.ajax({
		url: 'https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/'+name+'?api_key=' + API_KEY,
		type: 'GET',
		dataType: 'json',
		data: data,
		async: false,
		success: function (jsonSummonerId) {
			data =  jsonSummonerId[name].id;
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			alert("error getting Summoner data!");
		}
	});
	return data;
}

// 	var summonerId = 20937516; //Crowcito
//	var summonerId = 24242533; //XxHikaruxX
//	var summonerId = 28801599; //MelowMastah
//	var summonerId = 38768620; //xapher23
//	var summonerId = 39328659; //Raul
//	var summonerId = 39418130; //Neroo88
//	var summonerId = 39549464; //LosPerrosVuelan
//	var summonerId = 39681574; //Limguear
//	var summonerId = 58390305; //David3D

/* get request to mastery JSON by summonerId */
function getChampionMasteryById(sumId) {
	var data;
	$.ajax({
		url: "https://euw.api.pvp.net/championmastery/location/euw1/player/"+sumId+"/champions?api_key=" + API_KEY,
		dataType: 'json',
		data: data,
		async: false,
		success: function(json){
			data = json;
		}

	});
	return data;
};

/* get request to match JSON by summonerId */
function getCurrentMatchBySummonerId(sumId) {
	var data;
	$.ajax({
		url: "https://euw.api.pvp.net/observer-mode/rest/consumer/getSpectatorGameInfo/EUW1/"+sumId+"?api_key=" + API_KEY,
		dataType: 'json',
		data: data,
		async: false,
		success: function(json){
			data = json;
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			//alert("Summoner is not playing");
			$("#tabs-2").html("Summoner is not playing at this moment");
			$("#tabs-3").html("Summoner is not playing at this moment");
		}

	});
	return data;
};
