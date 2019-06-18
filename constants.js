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
		partyList: partyInfo.tank
	},
	WHM: {
		abilities: [], // TODO
		partyList: partyInfo.healer
	},
	NIN: {
		abilities: [], // TODO
		partyList: partyInfo.dps
	}
}
