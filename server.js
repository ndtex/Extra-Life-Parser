const request = require('request')
const fs = require('fs')
const constants = require('./constants.js')

const participantID = 349568 //enter in specific DonorDrive ID
//const teamID = '' -- Placeholder for now. Eventually will expand into team parsing too

const basicInfo = 'https://extra-life.org/api/participants/' + participantID
const donorDetails = 'https://extra-life.org/api/participants/' + participantID + '/donations'

//Initialize variables
let goalText = ''
let banText = ''
let donorTicker = ''
let milestoneText = ''
let fiftyDonation = ''
let fiftyDonationStatus = 'Inactive'
let abilities = [] 
let abilityBan = '\r\nAbilities Banned ($25): \r\n'
let mechanicIntro = 'Hit Party with Mechanic ($10) x '
let mechanicHits = 0
let killListIntro = '\r\nKill Party Member ($37): \r\n'
let killList = ''
let partyList = []
let deathTaxString = ''

//TODO: Make variables dyanmic and read from file & able to edit via input of some kind
let fiftyDonationCount = 0
let deathCount = 0
let wipeCount = 0
let failCount = 0
let deathTax = 0


//Open files that can be appended to and update varibles with current contents
fs.readFile('Text Output/Donor Ticker.txt', 'utf8', (err, contents) => {
	donorTicker = contents
})


// Variables that are "dynamic" and need to be set before code starts/restarts

let currentJob = 'SCH' //current job in game
let partySize = 4 //current party size
let numberOfDonors = 0 //set to current number of donors to make sure we aren't repeating things

//Generate job specific lists and variables
// TODO - Let this change on the fly
let role = constants[currentJob].role
abilities = constants[currentJob].abilities
partyList = constants[currentJob].partyList[partySize]
fiftyDonation = constants[currentJob].fiftyDonation

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
		
		//Check for which donation milestone we are at
		if (body.sumDonations <  500){
			milestoneText = 'Next Milestone: $500\r\nAether (Cocktail)\r\n* 1.5 oz White Rum\r\n* .75 oz Everclear\r\n* .75 oz Blue Curaco\r\n* Sprite Fill'
		} else if (body.sumDonations < 1000){
			milestoneText = 'Next Milestone: $1,000\r\nInner Darkness (Shot)\r\n* .75 oz Dark Rum\r\n* .75 oz Jager\r\n* Dash Hot Sauce'
		} else if (body.sumDonations < 1369){
			milestoneText = 'Next Milestone: $1,369\r\n($10,000 All Time!)\r\n10,000 Needles (Cocktail)\r\n* 1.5 oz Peach Brandy\r\n* .5 oz Orange Juice\r\n* .Andre Rose Fill\r\n* 4 Dashes El Yucateco XXXtra Hot Habanero'
		} else if (body.sumDonations < 1500){
			milestoneText = 'Next Milestone: $1,500\r\nShadowbringer (Cocktail)\r\n* Aether (Cocktail):\r\n* 1.5 oz White Rum\r\n* .75 oz Everclear\r\n* .75 oz Blue Curaco\r\n* Sprite Fill\r\n+Inner Darkness (Shot):\r\n* .75 oz Dark Rum\r\n* .75 oz Jager\r\n* Dash Hot Sauce'
		} else if (body.sumDonations < 2000){
			milestoneText = 'Next Milestone: $2,000\r\nTriforce of Power (Shooter)\r\n* 1.5 oz Goldschlagger\r\n* .75 oz Grenadine\r\n* .75 oz Fireball\r\n* 151 Top Layer\r\n* Lit on Fire'
		} else if (body.sumDonations < 2500){
			milestoneText = 'Next Milestone: $2,500\r\nJager Bombchu (Double Bomb)\r\n* Shot 1: Jager\r\nShot 2: Bombchu\r\n* .75 oz Vodka\r\n* .75 oz Blue Curaco\r\n* Dropped in Red Bull'
		} else if (body.sumDonations < 3000){
			milestoneText = 'Next Milestone: $3,000\r\nTriforce of Wisdom (Shooter)\r\n* 1.5 oz Goldschlagger\r\n* 1.5 oz Hypnotic\r\n* Everclear Top Layer'
		} else if (body.sumDonations < 3500){
			milestoneText = 'Next Milestone: $3,500\r\nGanon (Cocktail)\r\n* 1 oz Khalua\r\n* 1 oz Vodka\r\n* Soda Water Fill\r\n* Float Triforce of Power (Shooter):\r\n* 1.5 oz Goldschlagger\r\n* .75 oz Grenadine\r\n* .75 oz Fireball\r\n* 151 Top Layer'
		} else if (body.sumDonations < 4000){
			milestoneText = 'Next Milestone: $4,000\r\nTriforce of Courage (Shooter)\r\n* 1.5 oz Goldschlagger\r\n* 1.5 oz Midori\r\n* Absnithe Top Layer'
		} else if (body.sumDonations < 4500){
			milestoneText = 'Next Milestone: $4,500\r\nYiga Clan (Cocktail)\r\n99 Proof Banana Schnapps\r\nFloated on Ganon (Cocktail):\r\n* 1 oz Khalua\r\n* 1 oz Vodka\r\n* Soda Water Fill\r\n* Float Triforce of Power (Shooter):\r\n* 1.5 oz Goldschlagger\r\n* .75 oz Grenadine\r\n* .75 oz Fireball\r\n* 151 Top Layer'
		} else if (body.sumDonations < 5000){
			milestoneText = 'Next Milestone: $5,000\r\nBlake Shelton\'s Hometown Special\r\n* 1 Can Bud Light\r\n* 1 Double Vodka Sprite\r\n* Combine in one glass\r\n* Chug in 9 seconds'
		} else if (body.sumDonations < 5500){
			milestoneText = 'Next Milestone: $5,500\r\nSilver Arrow Through the Heart of Ganon (Bomb)\r\n* Silver Arrow Shot:\r\n* 1.5 oz Bourbon\r\n* .75 oz Gin\r\n* Dropped in Ganon (Cocktail):\r\n* 1 oz Khalua\r\n* 1 oz Vodka\r\n* Soda Water Fill\r\n* Float Triforce of Power (Shooter):\r\n* 1.5 oz Goldschlagger\r\n* .75 oz Grenadine\r\n* .75 oz Fireball\r\n* 151 Top Layer'
		} else if (body.sumDonations < 6000){
			milestoneText = 'Next Milestone: $6,000\r\nThe Ultimate Power (Triple Shooter)\r\n* Combine all 3 Triforce Shooters\r\nTriforce of Power (Shooter)\r\n* 1.5 oz Goldschlagger\r\n* .75 oz Grenadine\r\n* .75 oz Fireball\r\n* 151 Top Layer\r\n* Lit on Fire\r\nTriforce of Wisdom (Shooter)\r\n* 1.5 oz Goldschlagger\r\n* 1.5 oz Hypnotic\r\n* Everclear Top Layer\r\nTriforce of Courage (Shooter)\r\n* 1.5 oz Goldschlagger\r\n* 1.5 oz Midori\r\n* Absnithe Top Layer'
		} else {
			milestoneText = ''
		}
		
		fs.writeFile('Text Output/Milestone.txt', milestoneText, (err) => {
			if (err) {
				console.log(`Error when saving Milestone.txt: ${err}`)
				return
			}

			console.log('Milestone.txt Updated')
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
				
				//TODO: Add stuff in here to try and stack the 50 donations because SURPRISE! IT HAPPENED!
				
				//Healer is a special case that needs a random party member picked
				if (role == 'Healer'){
					fiftyDonationStatus = 'Active - No Healing ' + partyList[randomIntInc(0, partyList.length)]
				}else {
					fiftyDonationStatus = 'Active'
				}
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
				donorTicker += body[i].displayName + ': $' + body[i].amount + ' - ' + body[i].message + '... '
			} else {
				donorTicker += body[i].displayName + ': $' + body[i].amount + '... '			
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

//TODO: Make this function able to be called via some kind of input
function deathDonation(input){
	
	if (input == 'death'){
		deathCount++
	} else if (input == 'wipe'){
		wipeCount++
	} else if (input == 'fail'){
		failCount++
	}
		   
	deathTax = (wipeCount + killCount) * 5 + deathCount
	deathTaxString = 'Death Tax: $' + deathTax
	
	fs.writeFile('Text Output/Death Tax.txt', deathTaxString, (err) => {
		if (err) {
			console.log(`Error when saving Death Tax.txt: ${err}`)
			return
		}

		console.log('Death Tax.txt Updated') 
	})
}

//Run update loop
updateEL()
setInterval(updateEL, 30000)
