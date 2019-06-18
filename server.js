const request = require('request')
const fs = require('fs')
const constants = require('./constants.js')

const participantID = 349568 //enter in specific DonorDrive ID
//var teamID = '' -- Placeholder for now. Eventually will expand into team parsing too

const basicInfo = 'https://extra-life.org/api/participants/' + participantID
const donorDetails = 'https://extra-life.org/api/participants/' + participantID + '/donations'

//Initialize variables
let goalText = ''
let banText = ''
let donorTicker = ''
let fiftyDonation = ''
let fiftyDonationStatus = 'Inactive'
let abilities = [] 
let abilityBan = 'Abilities Banned ($25): \r\n'
let mechanicIntro = 'Hit Party with Mechanic ($10) x '
let mechanicHits = 0
let killListIntro = 'Kill Party Member ($37): \r\n'
let killList = ''
let partyList = []


//Open files that can be appended to and update varibles with current contents
fs.readFile('Text Output/Donor Ticker.txt', 'utf8', (err, contents) => {
	donorTicker = contents
})


// Variables that are "dynamic" and need to be set before code starts/restarts

let currentJob = 'PLD' //current job in game
let partySize = 4 //current party size
let numberOfDonors = 0 //set to current number of donors to make sure we aren't repeating things

//Generate job specific lists and variables
// TODO - Let the change on the fly
abilites = constants[currentJob].abilities
partyList = constants[currentJob].partyList[partySize]

//Generate random integer between the "low" and "high" values
function randomIntInc(low, high) {
	return Math.floor(Math.random() * (high - low + 1) + low)
}

//Function to update overall donation goal progress		
function updateGoal() {
	request({
		url: basicInfo,
		json: true
	}, (error, response, body) => {
		if (error || response.statusCode !== 200) {
			console.log(`Error in updateGoal(): ${error} (status code ${response.statusCode})`)
			return
		}

		goalText = 'Goal: $' + body.sumDonations + ' / $' + body.fundraisingGoal
		fs.writeFile('Text Output/Goal.txt', goalText, (err) => {
			if (err) {
				console.log(`Error when saving Goal.txt: ${err}`)
				return
			}

			console.log('Goal.txt Updated')
		})
	})
}

//Main update function
function updateEL() {
	//Request and process all donor details
	request({
		url: donorDetails,
		json: true
	}, (error, response, body) => {
		if (error || response.statusCode !== 200) {
			console.log(`Error in main update function: ${error} (status code ${response.statusCode})`)
			return
		}

		//Check for new donations, otherwise, break out of function
		if (numberOfDonors == body.length) {
			console.log('No new donations')
			return
		}
		
		for (let i = numberOfDonors; j = body.length, i < j; i++) {
			/******* Check donation value to determine in-game bans and actions--EVENTUALLY MAKE THIS A FUNCTION/INCLUDE??? ********/
			if (body[i].amount >= 50) {
				fiftyDonationStatus = 'Active'
			} else if (body[i].amount >= 37) {
				killList += partyList[randomIntInc(0, partyList.length)] + '\r\n'
			} else if (body[i].amount >= 25) {
				abilityBan += abilities[randomIntInc(0, abilities.length)] + '\r\n'
			} else if (body[i].amount >= 10) {
				mechanicHits++
			}
			
			//Update Ban/Incentive Text
			banText = mechanicIntro + mechanicHits + '\r\n' + abilityBan + killListIntro + killList + fiftyDonation + fiftyDonationStatus //end FFXIV specific function
			
			//Update donor ticker text					
			if (body[i].message != undefined) {
				donorTicker += body[i].displayName + ': $' + body[i].amount + body[i].message + ', '
			} else {
				donorTicker += body[i].displayName + ': $' + body[i].amount + ', '			
			}
		}
		
		//Update files				
		fs.writeFile('Text Output/Donor Ticker.txt', donorTicker, (err) => {
			if (err) {
				console.log(`Error when saving Donor Ticket.txt: ${err}`)
				return
			}

			console.log('Donor Ticket.txt Updated') 
		})
		fs.writeFile('Text Output/Bans.txt', banText, (err) => {
			if (err) {
				console.log(`Error when saving Bans.txt: ${err}`)
				return
			}

			console.log('Bans.txt Updated') 
		})
		
		//Update number of donors and goal				
		updateGoal()
		numberOfDonors = body.length
		console.log('Current number of donors: ' + numberOfDonors)
	})
}

//Run update loop
updateEL()
setInterval(updateEL, 30000)
