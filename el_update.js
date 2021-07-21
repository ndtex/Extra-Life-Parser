const request = require('request')
const fs = require('fs')
const axios = require('axios')
const readline = require('readline')
const rl= readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

//const clientID = require('./secrets.js')

let config = JSON.parse(fs.readFileSync('json/config.json'))

//const participantID = 400582 // ELU = 407343
//const teamID = '' -- Placeholder for now. Eventually will expand into team parsing too

const basicInfo = 'https://www.extra-life.org/api/participants/' + config.participantID
console.log("Attempting to use: " +basicInfo)
const donors = 'https://www.extra-life.org/api/participants/' + config.participantID + '/donors'
const donorDetails = 'https://www.extra-life.org/api/participants/' + config.participantID + '/donations'
const milestoneDetails = 'https://www.extra-life.org/api/participants/' + config.participantID + '/milestones'
const incentiveDetails = 'https://www.extra-life.org/api/participants/' + config.participantID + '/incentives'

//Initialize variables
let lastDonation = 0
let lastDonationString = ''
let topDonation = 0
let topDonationString = ''
let donationArray = []
let goalText = ''
let currentTotal = 0
let blitzText = ''
let blitzTotal = 0
//let blitzString = ''
let banText = ''
let banTextCheck = ''
let donorTicker = ''
let milestoneText = ''
let incentiveText = ''
//let loverText = ''
let creditsText = '\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nSpecial Thanks to the Following\r\n\r\n'
let donorList = 'Extra Life Donors\r\n\r\n'
//let subList = 'Subscribers\r\n\r\n\nugl33\nmilfy85\nfrsorinsramblers\ncalilax10\nndeddiemac\ndrothethedestoryer\nsapipa\nndeddiemac\nsiropsalot\nwojadawd\r\n\r\n'
let musicCredits = ''//'Music\r\n\r\nIntro: "The Prelude - Metal Version"\nPerformed by Dacian Grada\nand Psamathes\nLoop Edit by Ryan Ritter\r\n\r\nOutro: "Victory Fanfare\n(From Final Fantasy 7)"\nPerformed by Materia\nfeat. Lucio Baldomero\nand Tobias Solbakk\r\n\r\n'
//let fiftyDonationCount = 0
//let abilities = [] 
//let abilityBanIntro = '\r\nAbilities Banned ($25): \r\n'
//let abilityBan = ''
//let banArray = []
//let mechanicIntro = 'Hit Party with Mechanic ($10) x '
//let mechanicHits = 0 //Need to edit on every restart as well
//let killArray = []
//let killListIntro = '\r\n\r\nKill Party Member ($37): \r\n'
//let killList = ''
//let partyList = []

//vairable imports
let morality = JSON.parse(fs.readFileSync('json/memorality.json'))
let lover = JSON.parse(fs.readFileSync('json/me2love.json'))
//let nuke = JSON.parse(fs.readFileSync('json/me1nuke.json'))
//let ending = JSON.parse(fs.readFileSync('json/me3ending.json'))

let randMorality = 0
let randLove = 0
let remainLove = 0
let randEnding = 0
let remainEnding = 0
let randNuke = 0
let remainNuke = 0
let randArray = []

let numDonors = config.numberDonors
let offsetDonor = 0
let streamAmount = 0
let streamString = ''

let d = new Date()
let year = d.getFullYear()
let day = d.getDate()
let month = d.getMonth()+1
if (month < 10)
	month = "0"+month
let dateStr = year+"-"+month+"-"+day
//let dateStr = "2021-04-2" //for ELU only
console.log(dateStr)

//Text Input Vars


//Twitch Functions

/*axios.defaults.headers.common['Client-ID'] = clientId

async componentDidMount(){
	let {info} = await axios.get('https://api.twitch.tv/helix/streams?first=10')
	console.log(info)
}

function twitchToken() {
	var token = request({
		url: 'https://id.twitch.tv/oauth2/token?client_id=jx96l2b27kwjuhsl31cjliu4xfqo2e&client_secret=7wan4nm8k3trtxletnrnic0z1wkwye&grant_type=client_credentials&scope=bits:read+channel:read:subscriptions',
		method: 'POST'
	}, (error, response, body) => {
		if (error || response.statusCode !== 200) {
			console.log(`Error in updateGoal()obtaining Twitch token: ${error} (status code ${response.statusCode})`)
			return
		}
	})
	
	
	
}*/

//Used for donation "randomizing"	
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
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

		
		if (config.numberDonations == body.numDonations){
			
			console.log('No new donations. Current number of donations: ' + config.numberDonations)
			
		}
		else{
			
			
			//goalText = 'ELU Goal: $' + body.sumDonations.toFixed(2) + ' / $' + body.fundraisingGoal
			goalText = 'Goal: $' + body.sumDonations.toFixed(2) + ' / $' + body.fundraisingGoal
			//blitzTotal = body.sumDonations - 6195.64
			
			//blitzText = 'Blitz Total: $' + blitzTotal.toFixed(2)
			
			console.log("numDonations = " + body.numDonations)
			
			offsetDonor = body.numDonations - config.numberDonations
			config.numberDonations = body.numDonations
			currentTotal = body.sumDonations
			
			fs.writeFile('Text Output/Goal.txt', goalText, (err) => {
				if (err) {
					console.log(`Error when saving Goal.txt: ${err}`)
					return
				}

				console.log('Goal.txt Updated')
			})
			
			/*fs.writeFile('Text Output/Donation Blitz.txt', blitzText, (err) => {
				if (err) {
					console.log(`Error when saving Goal.txt: ${err}`)
					return
				}

				console.log('Donation Blitz.txt Updated')
			})*/
			
			updateEL()
			
		}
	})
}

function updateCredits(){
	
	request({
		url: donors,
		json: true
	}, (error, response, body) => {
		if (error || response.statusCode !== 200) {
			console.log(`Error in updateMilestone(): ${error} (status code ${response.statusCode})`)
			return
		}
		

		for (let i = 0; j = body.length, i < j; i++){
			switch (body[i].displayName){
				case "Gamin' 4 Aven":
				case "Royal Rumble For the Kids!":
				case "Ryan Ritter":
				case "Gamin' 4 Aven - Extra Life United":
				case "Facebook Donor":
				case "Michael Milford":
				case "Eddie McCarthy":
					break
				default:		
					donorList += body[i].displayName + '\n'
			}
			
		}
		
		donorList += 'And All Facebook Donors\r\n\r\n\r\n\r\n----------\r\n\r\n\r\n\r\n'
		
		//creditsText += musicCredits + subList + donorList
				
		fs.writeFile('Text Output/Credits.txt', creditsText, (err) => {
			if (err) {
				console.log(`Error when saving Goal.txt: ${err}`)
				return
			}

			console.log('Credits.txt Updated')
		})
		
		
			
		
	})

}

//Milestone update function
function updateMilestone() {
	request({
		url: milestoneDetails,
		json: true
	}, (error, response, body) => {
		if (error || response.statusCode !== 200) {
			console.log(`Error in updateMilestone(): ${error} (status code ${response.statusCode})`)
			return
		}

		for (let i = 0; j = body.length, i < j; i++){
			if (body[i].fundraisingGoal > currentTotal){
				milestoneText = 'Next Milestone: $' + body[i].fundraisingGoal.toFixed(2)
				break
			}
		}
		
				
		fs.writeFile('Text Output/Milestone.txt', milestoneText, (err) => {
			if (err) {
				console.log(`Error when saving Goal.txt: ${err}`)
				return
			}

			console.log('Milestone.txt Updated')
		})
			
		
	})
}

//Incentive update function
//To-Do: Create separate poll function(s)

/*function updateIncentive() {
	request({
		url: incentiveDetails,
		json: true
	}, (error, response, body) => {
		if (error || response.statusCode !== 200) {
			console.log(`Error in updateIncentive(): ${error} (status code ${response.statusCode})`)
			return
		}

		for (let i = 0; j = offsetDonor, i < j; i++){
			
			//Only execute if quantityClaimed has a value. Otherwise, math will show up as "undefined"
			if (body[i].quantityClaimed > 0) {
			
				if (body[i].description.toLowerCase().includes("paragon")){
					paragon += body[i].amount * body[i].quantityClaimed
				}
				
				else if (body[i].description.toLowerCase().includes("renegade")){
					renegade += body[i].amount * body[i].quantityClaimed
				}
				
			}
		}
		
		loverText = "\n\nLove Interest\nLiara: $" + liara + "\nJacob: $" + jacob + "\nGarrus: $" + garrus + "\nThane: $" + thane + "\nKelly: $" + kelly + "\nSamara: $" + samara
		
		incentiveText = "Morality\nParagon: $" + paragon + "\nRenegade: $" + renegade + loverText
		
				
		fs.writeFile('Text Output/Incentive.txt', incentiveText, (err) => {
			if (err) {
				console.log(`Error when saving Goal.txt: ${err}`)
				return
			}

			console.log('Incentive.txt Updated')
		})
			
	})
}*/


//Main update function
function updateEL() {
	
	console.log("Update function started")
	//Request and process all donor details
	
	request({
		url: donorDetails,
		json: true
	}, (error, response, body) => {
		if (error || response.statusCode !== 200) {
			console.log(`Error in main update function: ${error} (status code ${response.statusCode})`)
			return
		}
		
		lastDonation=body[0].amount.toFixed(2)
		lastDonationString= "$" + lastDonation
		
		console.log(offsetDonor)
		console.log(body.length)
		
		
	
		for (let i = 0; j = offsetDonor, i < j; i++){ //-1 for 2021 only as a duplicated donation was removed
			
			if (body[i].createdDateUTC.includes(dateStr)){
				numDonors++
				streamAmount+=body[i].amount
				console.log(streamAmount)
			}
			
			//push.donationArray(body[i].amount)
						
			//Check if donation has message. Otherwise, checking body[i].message will return an error if undefined
			
			if (body[i].message != undefined){
				
				
				//Morality Calculations
				
				if (body[i].message.toLowerCase().includes("paragon")){
					morality.paragon += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("renegade")){
					morality.renegade += body[i].amount
				}
				
				//If message has no morality keywords, randomize donation
				
				else {
					
					randMorality = Math.round(Math.random() * body[i].amount * 100)/100
					morality.paragon += randMorality
					morality.renegade += body[i].amount - randMorality
				}
				
				//Love interest Calculations
			
				/*if (body[i].message.toLowerCase().includes("garrus")){
					lover.garrus += body[i].amount
					if (lover.bonus > 0){
						if (body[i].amount < lover.bonus){
							lover.garrus += body[i].amount
							lover.bonus -= body[i].amount
						}
						else{
							lover.garrus += lover.bonus
							lover.bonus = 0
						}
					}
				}*/
				
				/*if (body[i].message.toLowerCase().includes("liara")){
					lover.liara += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("pretty blue lady")){
					lover.liara += body[i].amount
				}*/
				
				if (body[i].message.toLowerCase().includes("ashley")){
					lover.ashley += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("faithful")){
					lover.ashley += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("don't cheat")){
					lover.ashley += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("samara")){
					lover.samara += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("morinth")){
					lover.samara += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("tali")){
					lover.tali += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("best girl")){
					lover.tali += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("jack")){
					lover.jack += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("miranda")){
					lover.miranda += body[i].amount
				}
				else if (body[i].message.toLowerCase().includes("kelly")){
					lover.kelly += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("chambers")){
					lover.kelly += body[i].amount
				}
				
				/*else if (body[i].message.toLowerCase().includes("samantha")){
					lover.samantha += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("diana")){
					lover.diana += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("javik")){
					lover.javik += body[i].amount
					if (lover.bonus > 0){
						if (body[i].amount < lover.bonus){
							lover.javik += body[i].amount
							lover.bonus -= body[i].amount
						}
						else{
							lover.javik += lover.bonus
							lover.bonus = 0
						}
					}
				}
				
				else if (body[i].message.toLowerCase().includes("james")){
					lover.james += body[i].amount
					if (lover.bonus > 0){
						if (body[i].amount < lover.bonus){
							lover.james += body[i].amount
							lover.bonus -= body[i].amount
						}
						else{
							lover.james += lover.bonus
							lover.bonus = 0
						}
					}
				}*/
				
				//If donation message has no love interest keywords, randomize it
				
				else{
					
					randLove = Math.round(Math.random() * body[i].amount * 100)/100
					randArray.push(randLove)
					//randArray.push(body[i].amount - randLove)
					remainLove = body[i].amount - randLove
					randLove = Math.floor(Math.random() * remainLove)
					randArray.push(randLove)
					remainLove = remainLove - randLove
					randLove = Math.floor(Math.random() * remainLove)
					randArray.push(randLove)
					remainLove = remainLove - randLove
					randLove = Math.floor(Math.random() * remainLove)
					randArray.push(randLove)
					remainLove = remainLove - randLove
					randLove = Math.floor(Math.random() * remainLove)
					randArray.push(randLove)
					randArray.push(Math.round(remainLove - randLove))
					shuffle(randArray)
					//lover.garrus += randArray[0]
					//lover.liara += randArray[0]
					lover.tali += randArray[0]
					lover.ashley += randArray[1]
					lover.miranda += randArray[2]
					lover.jack += randArray[3]
					lover.samara += randArray[4]
					lover.kelly += randArray[5]
					//lover.samantha += randArray[2]
					//lover.diana += randArray[3]
					//lover.javik += randArray[4]
					//lover.james += randArray[5]
					randArray =[]
				}
				
				//Nuke Calculations for ME1
				
				/*if (body[i].message.toLowerCase().includes("nukea")){
					nuke.ashley += body[i].amount
				}
				
				else if (body[i].message.toLowerCase().includes("nukek")){
					nuke.kaidan += body[i].amount
				}
				
					
				//If message doesn't contain ending keyword, randomize donation
								
				
				else{
				
					//Nuke Calculations for ME1 
					randNuke = Math.round(Math.random() * body[i].amount * 100)/100
					randArray.push(randNuke)
					randArray.push(body[i].amount-randNuke)
					shuffle(randArray)
					nuke.ashley += randArray[0]
					nuke.kaidan += randArray[1]
					randArray = []
				
				}*/
				
					//Ending Calculations for ME3
					
					/*if (body[i].message.toLowerCase().includes("destroy")){
						ending.destroy += body[i].amount
					}
					
					else if (body[i].message.toLowerCase().includes("control")){
						ending.control += body[i].amount
					}
					
					else if (body[i].message.toLowerCase().includes("sythesis")){
						ending.synthesis += body[i].amount
					}
					
					//If message doesn't contain ending keyword, randomize donation
					else{
					
						randEnding = Math.floor(Math.random() * body[i].amount)
						randArray.push(randEnding)
						remainEnding = body[i].amount - randEnding
						randEnding = Math.floor(Math.random() * remainEnding)
						randArray.push(randEnding)
						randArray.push(Math.round(remainEnding - randEnding))
						shuffle(randArray)
						ending.destroy += randArray[0]
						ending.control += randArray[1]
						ending.synthesis += randArray[2]
						randArray = []
					}
				}*/					
			
			}
			
			//If donation has no message, randomize across all polls
			
			else{
				
				//Randomize Morality
				randMorality = Math.round(Math.random() * body[i].amount * 100)/100
				morality.paragon += randMorality
				morality.renegade += body[i].amount - randMorality
				
				randLove = Math.round(Math.random() * body[i].amount * 100)/100
				randArray.push(randLove)
				//randArray.push(body[i].amount - randLove)
				remainLove = body[i].amount - randLove
				randLove = Math.floor(Math.random() * remainLove)
				randArray.push(randLove)
				remainLove = remainLove - randLove
				randLove = Math.floor(Math.random() * remainLove)
				randArray.push(randLove)
				remainLove = remainLove - randLove
				randLove = Math.floor(Math.random() * remainLove)
				randArray.push(randLove)
				remainLove = remainLove - randLove
				randLove = Math.floor(Math.random() * remainLove)
				randArray.push(randLove)
				randArray.push(Math.round(remainLove - randLove))
				shuffle(randArray)
				//lover.garrus += randArray[0]
				//lover.liara += randArray[0]
				lover.tali += randArray[0]
				lover.ashley += randArray[1]
				lover.miranda += randArray[2]
				lover.jack += randArray[3]
				lover.samara += randArray[4]
				lover.kelly += randArray[5]
				//lover.samantha += randArray[2]
				//lover.diana += randArray[3]
				//lover.javik += randArray[4]
				//lover.james += randArray[5]
				randArray =[]
					
				//Nuke Calculations for ME1 
				/*randNuke = Math.round(Math.random() * body[i].amount * 100)/100
				randArray.push(randNuke)
				randArray.push(body[i].amount-randNuke)
				shuffle(randArray)
				nuke.ashley += randArray[0]
				nuke.kaidan += randArray[1]
				randArray = []*/
				
				//TODO: ME2 Calculations
				
				//Randomize ME3 Ending
				/*randEnding = Math.floor(Math.random() * body[i].amount)
				randArray.push(randEnding)
				remainEnding = body[i].amount - randEnding
				randEnding = Math.floor(Math.random() * remainEnding)
				randArray.push(randEnding)
				randArray.push(Math.round(remainEnding - randEnding))
				shuffle(randArray)
				ending.destroy += randArray[0]
				ending.control += randArray[1]
				ending.synthesis += randArray[2]
				randArray = []*/
			
			}
			
			
			//Update donor ticker text					
			if (body[i].message != undefined) {
				donorTicker += body[i].displayName + ': $' + body[i].amount + ' - ' + body[i].message + '... '
			} else {
				donorTicker += body[i].displayName + ': $' + body[i].amount + '... '			
			}
		}
		
		updateFiles()
		
		
		
	})
	
	updateMilestone()
	//updateIncentive()
	updateCredits()
	
	
}

function updateFiles(){
	//Update Text Files	for Overlays

	//loverText = "\n\nLove Interest\nGarrus: $" + lover.garrus + "\nLiara: $" + lover.liara + "\nJavik: $" + lover.javik + "\nJames: $" + lover.james + "\nMatching Left: $" + lover.bonus+ "\n\nEnding\nDestroy: $" + ending.destroy + "\nControl: $" + ending.control + "\nSynthesis: $" + ending.synthesis
	
	loverText = "\n\nLove InterestUse Name\nin Donation Message\nAshley: $" + lover.ashley.toFixed(2) + "\nMiranda: $" + lover.miranda.toFixed(2) + "\nTali: $" + lover.tali.toFixed(2) + "\nJack: $" + lover.jack.toFixed(2) + "\nKelly: $" + lover.kelly.toFixed(2) + "\nSamara: $" + lover.samara.toFixed(2) + '\n\nVote for Suicide Mission Roles with $5 Donation Incentives @ gamin4aven.com'
	
	//loverText = "\n\nLove Interest - Use Name\nin Donation Message\nLiara: $" + lover.liara.toFixed(2) + "\nAshley: $" + lover.ashley.toFixed(2) + '\n\nNuke - Use "nukea" or "nukek" \nin Donation Message\nAshley: $' + nuke.ashley.toFixed(2) + "\nKaidan: $" + nuke.kaidan.toFixed(2)
	
	//loverText = "\n\nLove Interest\nLiara: $" + lover.liara + "\n\nEnding\nDestroy: $" + ending.destroy + "\nControl: $" + ending.control + "\nSynthesis: $" + ending.synthesis
	
	incentiveText = 'Morality - Use "Paragon" or\n"Renegade" in Donation Message\nParagon: $' + morality.paragon.toFixed(2) + "\nRenegade: $" + morality.renegade.toFixed(2) + loverText
	
			
	fs.writeFile('Text Output/Incentive.txt', incentiveText, (err) => {
		if (err) {
			console.log(`Error when saving Goal.txt: ${err}`)
			return
		}

		console.log('Incentive.txt Updated')	
	})
	
	//Print Polls to Console as a failsafe
	console.log(morality)
	console.log(lover)
	//console.log(nuke)
	
	fs.writeFile('Text Output/Donor Ticker.txt', donorTicker, (err) => {
		if (err) {
			console.log(`Error when saving Donor Ticker.txt: ${err}`)
			return
		}

		console.log('Donor Ticker.txt Updated') 
	})
	
	//Update JSON files for variable persistence
	
	fs.writeFile('json/memorality.json',JSON.stringify(morality,null,2), (err) => {
		if (err) {
			console.log(`Error when saving Morality JSON Values: ${err}`)
			return
		}

		console.log('Morality Variables Updated') 
	})
	
	/*fs.writeFile('json/me3love.json',JSON.stringify(lover,null,2), (err) => {
		if (err) {
			console.log(`Error when saving Lover JSON Values: ${err}`)
			return
		}

		console.log('Lover Variables Updated') 
	})
	
	fs.writeFile('json/me3ending.json',JSON.stringify(ending,null,2), (err) => {
		if (err) {
			console.log(`Error when saving Ending JSON Values: ${err}`)
			return
		}

		console.log('Ending Variables Updated') 
	})*/
	
	/*fs.writeFile('json/me1nuke.json',JSON.stringify(nuke,null,2), (err) => {
		if (err) {
			console.log(`Error when saving Ending JSON Values: ${err}`)
			return
		}

		console.log('Nuke Variables Updated') 
	})*/
	
	/*fs.writeFile('json/me1love.json',JSON.stringify(lover,null,2), (err) => {
		if (err) {
			console.log(`Error when saving Lover JSON Values: ${err}`)
			return
		}

		console.log('ME 1 Lover Variables Updated') 
	})*/
	
	fs.writeFile('json/me2love.json',JSON.stringify(lover,null,2), (err) => {
		if (err) {
			console.log(`Error when saving Lover JSON Values: ${err}`)
			return
		}

		console.log('ME 2 Lover Variables Updated') 
	})
	
	fs.writeFile('json/config.json',JSON.stringify(config,null,2), (err) => {
		if (err) {
			console.log(`Error when saving Config JSON Values: ${err}`)
			return
		}

		console.log('Config Variables Updated') 
	})
	fs.writeFile('Last Donation.txt',lastDonationString, (err) => {
		if (err) {
			console.log(`Error when saving Config JSON Values: ${err}`)
			return
		}

		console.log('Last Donation Updated') 
	})
	
	streamString = "This Stream: $" + streamAmount + "\nDonors: " + numDonors		
	
	fs.writeFile('Text Output/ThisStream.txt', streamString, (err) => {
		if (err) {
			console.log(`Error when saving ThisStream.txt: ${err}`)
			return
		}

		console.log('DonorCount.txt Updated')
		console.log(numDonors)
	})
}

//Run update loop, check for new donations every 90 seconds
//twitchToken()
updateGoal()
setInterval(updateGoal, 70000)

//Text Input Handling
console.log(`Ready for real time input.`)
rl.on('line', (answer) => {
	console.log(`Received: ${answer}`)
	if (answer.toLowerCase().includes('paragon')){
		morality.paragon += 1
		updateFiles()
	}
	else if (answer.toLowerCase().includes('renegade')){
		morality.renegade += 1
		updateFiles()
	}
})