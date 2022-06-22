const API_KEY = 'RGAPI-3421fc48-7add-4449-876c-bc21b41f1e5b';
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
const TIME_RETRIEVE_STATS = 24;

function lolChallenge() {

	let ss = SpreadsheetApp.getActiveSpreadsheet();
	let mainSheet = ss.getSheetByName(SHEET_NAME);

	let summonerRange = mainSheet.getRangeList(['B1:F1']);
	let summonerRang = summonerRange.getRanges();
	let summoners = summonerRang[0].getValues()[0];

	let dataRange = mainSheet.getDataRange();
	let matrix = dataRange.getValues();

	for (const name of summoners) {
		let puuid = getPUUID(name);
		let matches = getMatchesIds(puuid).reverse();

		if (matches.length !== 0) {
			for (let i = 0; i < matches.length; i++) {

				Logger.log(getWinsAndLoses(matches[i], puuid));

				let nameAndWin = getWinsAndLoses(matches[i], puuid);
				nameAndWin.name = nameAndWin.name.replaceAll(' ', '').toUpperCase();

				let champRow;
				for (let i = 0; i < matrix.length; i++) {
					if (nameAndWin.name == matrix[i][0]) {
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

				if (!targetCell.includes('O')) {
					let result = 'X';

					if (nameAndWin.win)
						result = 'O';

					targetCellRange.setValue(targetCell + result);
				}
			}
		}
	}
}

function getPUUID(summonerName) {
	var response = UrlFetchApp.fetch('https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/' + summonerName, options);
	var json = response.getContentText();
	var data = JSON.parse(json);

	return data.puuid;
}

function getMatchesIds(puuid) {
	var yesterday = Math.trunc(new Date().getTime() / 1000) - (TIME_RETRIEVE_STATS * 60 * 60);

	var response = UrlFetchApp.fetch('https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/' + puuid + '/ids?startTime=' + yesterday + '&queue=400&start=0', options);
	var json = response.getContentText();
	var data = JSON.parse(json);

	return data;
}

function getWinsAndLoses(matchId, puuid) {
	var response = UrlFetchApp.fetch('https://europe.api.riotgames.com/lol/match/v5/matches/' + matchId, options);
	var json = response.getContentText();
	var data = JSON.parse(json);
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