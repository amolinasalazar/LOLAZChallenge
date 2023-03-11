# LOLAZChallenge
Play all the champions in League of Legends from A to Z, if you don't win the game, you cannot go to the next champion.

## Setup
To setup and run this script, you have to create a new Google Sheet and load the script along with your own Developer API ket from https://developer.riotgames.com.

In the ribbon menu you'll see Extensions > AppScript. From there, you create two .gs files:

- Main.gs holds the main script
- Const.gs hold the API key
![image](https://user-images.githubusercontent.com/8297398/224480621-6286c106-b086-47cf-bcda-02840bd06a0e.png)

Then, you populate all the champion names in the first column A and the summoner names in the first row 1:
![image](https://user-images.githubusercontent.com/8297398/224481369-66767779-16b6-412d-8531-4ec0961e2909.png)

You can get the updated names of all the champions in League of Legends by extracting the data from DataDragon: http://ddragon.leagueoflegends.com/cdn/12.6.1/data/en_US/champion.json

* IMPORTANT: Wukong's name is MonkeyKing :) please don't ask.

Now, try to run the script and see if you start seeing O and X in the sheet. You can set the script to run periodically using AppScript.

Enjoy!
