var request = require("request")
var fs = require("fs")

var participantID = 349568 //enter in specific DonorDrive ID
//var teamID = "" -- Placeholder for now. Eventually will expand into team parsing too

var basicInfo = "https://extra-life.org/api/participants/" + participantID
var donorDetails = "https://extra-life.org/api/participants/" + participantID + "/donations"

//Initialize variables
var goalText = ""
var banText = ""
var donorTicker = ""
var fiftyDonation = ""
var fiftyDonationStatus = "Inactive"
var abilities = [] 
var abilityBan = "Abilities Banned ($25): \r\n"
var mechanicIntro = "Hit Party with Mechanic ($10) x "
var mechanicHits = 0
var killListIntro = "Kill Party Member ($37): \r\n"
var killList = ""
var partyList = []


//Open files that can be appended to and update varibles with current contents
fs.readFile('Text Output/Donor Ticker.txt', 'utf8', function(err, contents) {
    donorTicker = contents;
});


// Variables that are "dynamic" and need to be set before code starts/restarts

var currentJob = "PLD" //current job in game
var partySize = 4; //current party size
var numberOfDonors = 0 //set to current number of donors to make sure we aren't repeating things

//Generate job specific lists and variables
switch (currentJob){
	case "PLD":
		abilities.push("Rampart","Interject","Shirk","Low Blow","Reprisal","Provoke","Arm's Length","Fight or Flight","Sheltron","Intervention","Sentinel","Divine Veil","Cover","Hallowed Ground","Passage of Arms","Sprits Within","Circle of Scorn","Intervene","Requiescat");
		fiftyDonation = "Drop Tank Stance ($50): "
		if (partySize == 4){
			partyList.push("Healer","DPS #1","DPS #2");
		} else{
			partyList.push("Tank #2", "Healer #1","Healer #2","DPS #1","DPS #2","DPS #3","DPS #4");
		}
		break;
}

//Generate random integer between the "low" and "high" values
function randomIntInc(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}

//Function to update overall donation goal progress		
function updateGoal(){
	request({
		url: basicInfo,
		json: true
	}, function (error, response, body) {

		if (!error && response.statusCode === 200) {
			goalText = "Goal: $" + body.sumDonations + " / $" + body.fundraisingGoal
			fs.writeFile("Text Output/Goal.txt", goalText, (err) => {
				if (err) console.log(err);
				console.log("Goal.txt Updated");
			});
		}
	})
}

//Main update function
function updateEL(){
	
	//Request and process all donor details
	
	request({
		url: donorDetails,
		json: true
	}, function (error, response, body) {
		
		if (!error && response.statusCode === 200) {
			
			//Check for new donations, otherwise, break out of function
			if (numberOfDonors == body.length) {
				return console.log ("No new donations");
			} else {
			
				for(var i=numberOfDonors; j=body.length, i<j; i++){
					
					/******* Check donation value to determine in-game bans and actions--EVENTUALLY MAKE THIS A FUNCTION/INCLUDE??? ********/
					
					if (body[i].amount >= 10){ //ignore for donations less than $10
						
						if (body[i].amount >= 10 && body[i].amount < 25){
							mechanicHits++
						} else if (body[i].amount >= 25 && body[i].amount < 37){
							abilityBan += abilities[randomIntInc(0,abilities.length)] + "\r\n"
						} else if (body[i].amount >= 37 && body[i].amount < 50){
							killList += partyList[randomIntInc(0,partySize-1)] + "\r\n"
						} else {
							fiftyDonationStatus = "Active"
						}
					}
					
					//Update Ban/Incentive Text
					banText = mechanicIntro + mechanicHits + "\r\n" + abilityBan + killListIntro + killList + fiftyDonation + fiftyDonationStatus //end FFXIV specific function
					
					//Update donor ticker text					
					if(body[i].message != undefined)
						donorTicker += body[i].displayName + ": $" + body[i].amount + body[i].message + ", "
					else
						donorTicker += body[i].displayName + ": $" + body[i].amount + ", "			
				}
				
				//Update files				
				fs.writeFile("Text Output/Donor Ticker.txt", donorTicker, (err) => {
					if (err) console.log(err);
					console.log("Donor Ticket.txt Updated");	
				});
				fs.writeFile("Text Output/Bans.txt", banText, (err) => {
					if (err) console.log(err);
					console.log("Bans.txt Updated");	
				});
				
				//Update number of donors and goal				
				updateGoal();
				numberOfDonors = body.length
				console.log("Current number of donors: " + numberOfDonors);
		}}
		})
}

//Run update loop
updateEL();
setInterval(updateEL,30000)