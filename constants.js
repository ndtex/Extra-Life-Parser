const partyInfo = {
	tank: {
		4: ['Healer', 'DPS #1', 'DPS #2'],
		8: ['Tank #2', 'Healer #1', 'Healer #2', 'DPS #1', 'DPS #2', 'DPS #3', 'DPS #4']
	},
	healer: {
		4: ['Tank', 'DPS #1', 'DPS #2'],
		8: ['Tank #1', 'Tank #2', 'Healer #2', 'DPS #1', 'DPS #2', 'DPS #3', 'DPS #4']
	},
	dps: {
		4: ['Tank', 'Healer', 'DPS #2'],
		8: ['Tank #1', 'Tank #2', 'Healer #1', 'Healer #2', 'DPS #2', 'DPS #3', 'DPS #4']
	}
}

module.exports = {
	PLD: {
		abilities: ['Rampart', 'Interject', 'Shirk', 'Low Blow', 'Reprisal', 'Provoke', 'Arm\'s Length', 'Fight or Flight', 'Sheltron', 'Intervention', 'Sentinel', 'Divine Veil', 'Cover', 'Hallowed Ground', 'Passage of Arms', 'Sprits Within', 'Circle of Scorn', 'Intervene', 'Requiescat'],
		partyList: partyInfo.tank,
		fiftyDonation:'\r\nDrop Tank Stance ($50): \r\n',
		role: 'Tank'
	},
	SCH: {
		abilities: ['Swiftcast', 'Lucid Dreaming', 'Surecast', 'Rescue', 'Lustrate', 'Excogitation', 'Sacred Soil', 'Indomitability', 'Emergency Tactics', 'Dissipation', 'Deployment Tactics', 'Recitation', 'Chain Stratagem', 'Aetherflow', 'Summon Seraph'],
		partyList: partyInfo.healer,
		fiftyDonation:'\r\nStop Healing Target ($50): \r\n',
		role: 'Healer'
	},
	DNC: {
		abilities: ['Leg Graze', 'Second Wind', 'Foot Graze', 'Peloton', 'Head Graze', 'Arm\'s Length', 'Shield Samba', 'Flourish', 'Improvisation', 'Devilment', 'En Avant', 'Closed Position', 'Saber Dance', 'Curing Waltz'],
		partyList: partyInfo.dps,
		fiftyDonation: '\r\nDance in Place ($50): \r\n',
		role: 'DPS'
	}
	//TODO: More jobs
}
