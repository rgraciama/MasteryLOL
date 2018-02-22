var JSONSummoner;
var JSONmatchSumId;
var MatchList_JSONmatchSumParticipant = [];
var MatchList_summonerName = [];
var MatchList_summonerPoints = [];
var MatchList_summonerChamp = [];
var MatchList_summonerAveragePoints = [];

//Welcome to the new branch
var sumName = "";
var API_KEY = "RGAPI-95c707ff-6dec-4c34-bdec-38fa326841c8"
var res;
/* get request to obtain summoner name by id */
function getSummonerIdByName(name) {
	var data;
	$.ajax({
		url: 'https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/'+name+'?api_key=' + API_KEY,
		type: 'GET',
		dataType: 'json',
		data: data,
		async: false,
		success: function (jsonSummonerId) {
			data =  jsonSummonerId.id;
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
		url: "https://euw1.api.riotgames.com//lol/champion-mastery/v3/champion-masteries/by-summoner/"+sumId+"?api_key=" + API_KEY,
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
		url: "https://euw1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/"+sumId+"?api_key=" + API_KEY,
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
