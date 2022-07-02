const API_KEY = 'RGAPI-7c8ee6f2-15d3-4544-b5b3-f29de18bd770';
const options = {
	"async": true,
	"crossDomain": true,
	"method": "GET",
	"headers": {
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36",
		"Accept-Language": "es-ES,es;q=0.9,en;q=0.8,en-GB;q=0.7",
		"Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
		"Origin": "https://developer.riotgames.com",
		"X-Riot-Token": API_KEY
	}
};
const SHEET_NAME = "LOL";
const HOURS_BACK_RETRIEVE_STATS = 24;
const LOSE_CHAR = 'X';
const WIN_CHAR = 'O';

function lolChallenge() {
	let mainSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
	let summoners = mainSheet.getRangeList(['B1:F1']).getRanges()[0].getValues()[0];

	let dataRange = mainSheet.getDataRange();
	let matrix = dataRange.getValues();

	for (const name of summoners) {
		let puuid = getPUUID(name);
		let matches = getMatchesIds(puuid).reverse();

		if (matches.length !== 0) {
			for (let i = 0; i < matches.length; i++) {
				Logger.log(getChampionWin(matches[i], puuid));

				let championWin = getChampionWin(matches[i], puuid);
				championWin.name = championWin.name.replaceAll(' ', '').toUpperCase();

				let champRow;
				for (let i = 0; i < matrix.length; i++) {
					if (championWin.name == matrix[i][0]) {
						champRow = i + 1;
					}
				}

				let summonerCol;
				for (let i = 0; i < matrix[0].length; i++) {
					if (name == matrix[0][i]) {
						summonerCol = i + 1;
					}
				}

        let targetCellRange = mainSheet.getRange(champRow, summonerCol);
        let targetCell = targetCellRange.getCell(1, 1).getValue();

				if (!targetCell.includes(WIN_CHAR)) {
					let result = LOSE_CHAR;

					if (championWin.win)
						result = WIN_CHAR;

					targetCellRange.setValue(targetCell + result);
				}
			}
		}
	}
}

function getPUUID(summonerName) {
	var data = getCalloutResponse('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName);
	return data.puuid;
}

function getMatchesIds(puuid) {
	var yesterday = Math.trunc(new Date().getTime() / 1000) - (HOURS_BACK_RETRIEVE_STATS * 60 * 60);
	var data = getCalloutResponse('https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/' + puuid + '/ids?startTime=' + yesterday + '&queue=400&start=0');

	return data;
}

function getChampionWin(matchId, puuid) {
	var data = getCalloutResponse('https://europe.api.riotgames.com/lol/match/v5/matches/' + matchId);
	var participants = data.info.participants

	for (let i = 0; i < participants.length; i++) {
		if (participants[i].puuid == puuid) {
			return {
				'name': participants[i].championName,
				'win': participants[i].win,
			};
		}
	}
}

function getCalloutResponse(endpoint){
	var response = UrlFetchApp.fetch(endpoint, options);
	return JSON.parse(response.getContentText());
}