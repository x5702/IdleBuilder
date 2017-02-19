var SaveDataInit = {
	Manpower: 0,
	Fuel: 0,
	Steel: 0,
	Bauxite: 0,
	Exp: 0,

	WorldArea: 1,
	Phase: 0,	// 0 = Production, 1 = Recon, 2 = Air, 3 = Sub, 4 = Long, 5 = Short, 6 = Torpedo
	Initiative: -1,	//0 = ally first, 1 = enemy first, -1 = not set
	AirSupremacy: -1,	//0 = ally, 1 = enemy, -1 = not set

	Building: {
		OilMiner: {
			Num: 0,
			Progress: 0,
		},
		OilStorage: {
			Num: 0,
			Progress: 0,
		},
		SteelMiner: {
			Num: 0,
			Progress: 0,
		},
		SteelStorage: {
			Num: 0,
			Progress: 0,
		},
		BauxiteMiner: {
			Num: 0,
			Progress: 0,
		},
		BauxiteStorage: {
			Num: 0,
			Progress: 0,
		},
		//ShipFactory: {
		//	Num: 0,
		//	Progress: 0,
		//},
		//EquipmentFactory: {
		//	Num: 0,
		//	Progress: 0,
		//},
		//ResearchLab: {
		//	Num: 0,
		//	Progress: 0,
		//},
	},

	Ship: {
		Destroyer: [
			{
				Num: 0,
				HP: 0,
				Equip: {
					Main: {Gun: 1, Torpedo: 1},
					Side: {AAGun: 2},
					Armor: 1,
					Engine: 1,
					Radar: 1,
				},
				Planned: 0,
			},
			{
				Num: 0,
				HP: 0,
				Equip: [
					"LightGun",
					"Torpedo",
				],
			},
		],
		Cruiser: [
			{
				Num: 0,
				HP: 0,
				Equip: {

				},
				Planned: 0,
			},
			{
				Num: 0,
				HP: 0,
				Equip: {

				},
			},
		],
		Battleship: [
			{
				Num: 0,
				HP: 0,
				Equip: {

				},
				Planned: 0,
			},
			{
				Num: 0,
				HP: 0,
				Equip: {

				},
			},
		],
		Carrier: [
			{
				Num: 0,
				HP: 0,
				Equip: {

				},
				Planned: 0,
			},
			{
				Num: 0,
				HP: 0,
				Equip: {

				},
			},
		],
		Submarine: [
			{
				Num: 0,
				HP: 0,
				Equip: {

				},
				Planned: 0,
			},
			{
				Num: 0,
				HP: 0,
				Equip: {

				},
			},
		],
	},

	Technology: {
		FleetExpansion: {
			Level: 0,
			Progress: 0,
		},
		Manpower_InitialPlan: {
			Level: 0,
			Progress: 0,
		},
		Manpower_GrowthRate: {
			Level: 0,
			Progress: 0,
		},
		Manpower_OutputEfficiency: {
			Level: 0,
			Progress: 0,
		},
		Fuel_InitialPlan: {
			Level: 0,
			Progress: 0,
		},
		Fuel_GrowthRate: {
			Level: 0,
			Progress: 0,
		},
		Fuel_OutputEfficiency: {
			Level: 0,
			Progress: 0,
		},
		Steel_InitialPlan: {
			Level: 0,
			Progress: 0,
		},
		Steel_GrowthRate: {
			Level: 0,
			Progress: 0,
		},
		Steel_OutputEfficiency: {
			Level: 0,
			Progress: 0,
		},
		Bauxite_InitialPlan: {
			Level: 0,
			Progress: 0,
		},
		Bauxite_GrowthRate: {
			Level: 0,
			Progress: 0,
		},
		Bauxite_OutputEfficiency: {
			Level: 0,
			Progress: 0,
		},
		Fleet_Destroyer_DeckImprove : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Cruiser_DeckImprove : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Battleship_DeckImprove : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Carrier_DeckImprove : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Submarine_DeckImprove : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Destroyer_Armor : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Cruiser_Armor : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Battleship_Armor : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Carrier_Armor : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Submarine_Armor : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Destroyer_FireControl : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Cruiser_FireControl : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Battleship_FireControl : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Carrier_FireControl : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Submarine_FireControl : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Destroyer_AimSystem : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Cruiser_AimSystem : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Battleship_AimSystem : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Carrier_AimSystem : {
			Level : 0,
			Progress : 0,
		},
		Fleet_Submarine_AimSystem : {
			Level : 0,
			Progress : 0,
		},
	},
};