const ConstData = {
	BaseCost : 100,
	ResourceBonusRate : 0.01,
	ResourceMultiRate : 0.01,
	BuildTimer : 0.01,

	incCalc : function(num, base, ratio1, ratio2, ratio3 ) {
	var c = num;
	var cc = Math.max(0, Math.floor(num * 0.04 - 8));
	var ccc = Math.max(0, Math.floor(num * 0.01 - 10));
	var cccc = Math.min(4, Math.floor(num * 0.04));	
	
	return Math.floor((base * c * Math.pow(ratio1, cc * 2 / 3)) * Math.pow(ratio2, ccc * 2 / 3) * Math.pow(ratio3, cccc * 2 / 3)) ; 
	},


	costCalc: function(num, base, ratio1, ratio2, ratio3,ratio4 ) {
		var c = num;
		var cc = ((Math.max(0, num - 175) % 25) > 0) ? 1 : 0;
		var ccc = ((Math.max(0, num - 900) % 100) > 0) ? 1: 0;
		var cccc = ((num % 200 % 25) > 0 ) ? 1: 0;	
		
		return Math.floor((base + ratio1 * c) * Math.pow(ratio2, cc) * Math.pow(ratio3, ccc) * Math.pow(ratio4, cccc)); 
	},
};


const StaticData = {
	CombatRegion : function(){
		var Zone = Math.ceil(SaveData.WorldArea / 10);
		var Area = SaveData.WorldArea - (Zone - 1) * 10 ;

		return [Zone, Area];
	},

	Territory : function() {
		return 10 + SaveData.WorldArea - 1;
	},

	FleetSize : function() {
		return 10 + 10 * SaveData.Technology.FleetExpansion.Level;
	},

	ManpowerPerSec : function() {
		return (20 + SaveData.Technology.Manpower_InitialPlan.Level + (2 + ConstData.ResourceBonusRate * SaveData.Technology.Manpower_GrowthRate.Level) * StaticData.Territory() ) * ( 1 + ConstData.ResourceMultiRate * SaveData.Technology.Manpower_OutputEfficiency.Level);
	},
	FuelPerSec : function() {
		return (5 + SaveData.Technology.Fuel_InitialPlan.Level + (1 + ConstData.ResourceBonusRate * SaveData.Technology.Fuel_GrowthRate.Level) * SaveData.Building.OilMiner.Num ) * ( 1 + ConstData.ResourceMultiRate * SaveData.Technology.Fuel_OutputEfficiency.Level);
	},
	SteelPerSec : function() {
		return (3 + SaveData.Technology.Steel_InitialPlan.Level + (1 + ConstData.ResourceBonusRate * SaveData.Technology.Steel_GrowthRate.Level) * SaveData.Building.SteelMiner.Num ) * ( 1 + ConstData.ResourceMultiRate * SaveData.Technology.Steel_OutputEfficiency.Level);
	},
	BauxitePerSec : function() {
		return (3 + SaveData.Technology.Bauxite_InitialPlan.Level + (1 + ConstData.ResourceBonusRate * SaveData.Technology.Bauxite_GrowthRate.Level) * SaveData.Building.BauxiteMiner.Num ) * ( 1 + ConstData.ResourceMultiRate * SaveData.Technology.Bauxite_OutputEfficiency.Level);
		},

	ManpowerMax : function() {
		return 1000 * Math.pow(1.1, StaticData.Territory());
	},

	FuelMax : function() {
		return 1000 + 1000 * Math.pow(1.2, SaveData.Building.OilStorage.Num);
	},

	SteelMax : function() {
		return 1000 + 1000 * Math.pow(1.2, SaveData.Building.SteelStorage.Num);
	},

	BauxiteMax : function() {
		return 1000 + 1000 * Math.pow(1.2, SaveData.Building.BauxiteStorage.Num);
	},

	ExpPerBattle : function(win) {
		var exp = 100 * SaveData.WorldArea;
		if (win) exp *= 10;
		return exp;
	},

	Building : {
		OilMiner : {
			Cost : function() {
				var ManpowerCost = ConstData.BaseCost;
				
				ManpowerCost *= Math.pow( 1.6, SaveData.Building.OilMiner.Num);	
				
				return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0,  Time: (1 + (SaveData.Building.OilMiner.Num) * 2) * ConstData.BuildTimer, Exp: 10 * ConstData.BuildTimer, Exp: 0};
			},
		},
		OilStorage : {
			Cost : function() {
				var ManpowerCost = 5 * ConstData.BaseCost;
				
				ManpowerCost +=  (SaveData.Building.OilStorage.Num) * ConstData.BaseCost;	
			
				return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0,  Time: 10 * ConstData.BuildTimer, Exp: 0};
			},
		},
		SteelMiner : {
			Cost : function() {
				var ManpowerCost = 2 * ConstData.BaseCost;
				var FuelCost =  ConstData.BaseCost;	
				
				ManpowerCost *= Math.pow( 1.6, SaveData.Building.SteelMiner.Num);	
				FuelCost *= Math.pow( 1.6, SaveData.Building.SteelMiner.Num);	
				
				return {Manpower : ManpowerCost, Fuel : FuelCost, Steel : 0, Bauxite : 0,  Time: (1 + (SaveData.Building.SteelMiner.Num)* 2)* ConstData.BuildTimer, Exp: 0};
			},
		},
		SteelStorage : {
			Cost : function() {
				var ManpowerCost = 5 * ConstData.BaseCost;
				
				ManpowerCost +=  (SaveData.Building.SteelStorage.Num + SaveData.Building.SteelStorage.Num )* ConstData.BaseCost;	
			
				return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0,  Time: 10 * ConstData.BuildTimer, Exp: 0};
			},
		},
		BauxiteMiner : {
			Cost : function() {
				var ManpowerCost = 2 * ConstData.BaseCost;
				var FuelCost = ConstData.BaseCost;	
				
				ManpowerCost *= Math.pow( 1.6, (SaveData.Building.BauxiteMiner.Num));	
				FuelCost *= Math.pow( 1.6, (SaveData.Building.BauxiteMiner.Num));	
			
				return {Manpower : ManpowerCost, Fuel : FuelCost, Steel : 0, Bauxite : 0,  Time: (1 + (SaveData.Building.BauxiteMiner.Num) * 2 )* ConstData.BuildTimer, Exp: 0};
			},
		},
		BauxiteStorage : {
				Cost : function() {
				var ManpowerCost = 5 * ConstData.BaseCost;
				
				ManpowerCost +=  (SaveData.Building.BauxiteStorage.Num) * ConstData.BaseCost;	
			
				return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0,  Time: 10* ConstData.BuildTimer, Exp: 0};
			},
		},
	},

Ship : {				
	Destroyer : [			
		{		
			Size : function() {	
				return 10;
				},
			HP : function() {	
				return 120 + ConstData.incCalc(SaveData.Technology.Fleet_Destroyer_DeckImprove.Level, 5, 1.05, 1.2, 1.5);
				},
			Defend : function() {//defend * 100 to make sure value has an increment.	
				return 100 + ConstData.incCalc(SaveData.Technology.Fleet_Destroyer_Armor.Level, 2, 1.1 , 1.05, 1.2);
			},	
			Evade : function() {	
				return 0.5;
			},	
			Cost : function() {	
				return {Manpower :0, Fuel : 100, Steel : 100, Bauxite :100, Time: 10 * ConstData.BuildTimer, Exp: 0};
			},	
		},		
		{		
			Size : function() {	
				return 1 + Math.floor(SaveData.WorldArea * 0.04);
			},	
			HP : function() {	
				return Math.floor(100 + 2 * SaveData.WorldArea + 10 * StaticData.CombatRegion()[0]) * Math.pow(20, Math.floor(StaticData.CombatRegion()[1] /10)) ;
			},	
			Defend : function() {	
				return Math.min(100 * Math.pow(1.05,  (StaticData.CombatRegion()[0] -1) * 1), 200);
			},	
			Evade : function() {	
				return 0.5;
			},	
			Cost : function() {	
				return {Manpower : 0, Fuel : 0, Steel : 0, Bauxite : 0, Time: 0, Exp: 0};
			},	
		},		
	],			
				
	Cruiser : [			
		{		
			Size : function() {	
				return 25;
			},	
			HP : function() {	
				return 250 + ConstData.incCalc(SaveData.Technology.Fleet_Cruiser_DeckImprove.Level, 25, 1.25, 2, 1.5);
			},	
			Defend : function() {//defend * 100 to make sure value has an increment.	
				return 100 + ConstData.incCalc(SaveData.Technology.Fleet_Cruiser_Armor.Level, 2, 1.02, 1.05, 1.2);
			},	
			Evade : function() {	
				return 0.5;
			},	
			Cost : function() {	
				return {Manpower :0, Fuel : 250, Steel : 250, Bauxite :250, Time: 10 * ConstData.BuildTimer, Exp: 0};
			},	
		},		
		{		
			Size : function() {	
				return 0 + Math.floor(SaveData.WorldArea * 0.03);
			},	
			HP : function() {	
				return Math.floor(250 + 5 * SaveData.WorldArea + 50 * StaticData.CombatRegion()[0]) * Math.pow(30, Math.floor(StaticData.CombatRegion()[1] /10)) ;
			},	
			Defend : function() {	
				return 120 * Math.pow(1.05,  (StaticData.CombatRegion()[0] -1) * 1);
			},	
			Evade : function() {	
				return 0.5;
			},	
			Cost : function() {	
				return {Manpower : 0, Fuel : 0, Steel : 0, Bauxite : 0, Time: 0, Exp: 0};
			},	
		},		
	],			
				
	Battleship : [			
		{		
			Size : function() {	
				return 40;
			},	
			HP : function() {	
				return 500 + ConstData.incCalc(SaveData.Technology.Fleet_Battleship_DeckImprove.Level, 100, 1.05, 1.2, 1.5);
			},	
			Defend : function() {//defend * 100 to make sure value has an increment.	
				return 200 + ConstData.incCalc(SaveData.Technology.Fleet_Battleship_Armor.Level, 5, 1.02, 1.05, 1.2);
			},	
			Evade : function() {	
				return 0.5;
			},	
			Cost : function() {	
				return {Manpower :0, Fuel : 1000, Steel : 1000, Bauxite :1000, Time: 10 * ConstData.BuildTimer, Exp: 0};
			},	
		},		
		{		
			Size : function() {	
				return 0 + Math.floor(SaveData.WorldArea * 0.01);
			},	
			HP : function() {	
				return Math.floor(500 + 5 * SaveData.WorldArea + 100 * StaticData.CombatRegion()[0]) * Math.pow(20, Math.floor(StaticData.CombatRegion()[1] /10)) ;
			},	
			Defend : function() {	
				return Math.max(200 * Math.pow(1.05,  (StaticData.CombatRegion()[0] -1) * 1), 320);
			},	
			Evade : function() {	
				return 0.5;
			},	
			Cost : function() {	
				return {Manpower : 0, Fuel : 0, Steel : 0, Bauxite : 0, Time: 0, Exp: 0};
			},	
		},		
	],			
				
	Carrier : [			
		{		
			Size : function() {	
				return 50;
			},	
			HP : function() {	
				return 400 + ConstData.incCalc(SaveData.Technology.Fleet_Carrier_DeckImprove.Level, 80, 1.05, 1.2, 1.5);
			},	
			Defend : function() {//defend * 100 to make sure value has an increment.	
				return 50 + ConstData.incCalc(SaveData.Technology.Fleet_Carrier_Armor.Level, 1, 1.02, 1.05, 1.2);
			},	
			Evade : function() {	
				return 0.5;
			},	
			Cost : function() {	
				return {Manpower :0, Fuel : 2000, Steel : 2000, Bauxite :2000, Time: 10 * ConstData.BuildTimer, Exp: 0};
			},	
		},		
		{		
			Size : function() {	
				return 0 + Math.floor(SaveData.WorldArea * 0.005);
			},	
			HP : function() {	
				return Math.floor(400 + 4 * SaveData.WorldArea + 40 * StaticData.CombatRegion()[0]) * Math.pow(20, Math.floor(StaticData.CombatRegion()[1] /10)) ;
			},	
			Defend : function() {	
				return 30 * Math.pow(1.05,  (StaticData.CombatRegion()[0] -1) * 1);
			},	
			Evade : function() {	
				return 0.5;
			},	
			Cost : function() {	
				return {Manpower : 0, Fuel : 0, Steel : 0, Bauxite : 0, Time: 0, Exp: 0};
			},	
		},		
	],			
				
	Submarine : [			
		{		
			Size : function() {	
				return 5;
			},	
			HP : function() {	
				return 100 + ConstData.incCalc(SaveData.Technology.Fleet_Submarine_DeckImprove.Level, 1, 1.05, 1.2, 1.5);
			},	
			Defend : function() {//defend * 100 to make sure value has an increment.	
				return 100 + ConstData.incCalc(SaveData.Technology.Fleet_Submarine_Armor.Level, 1, 1.02, 1.05, 1.2);
			},	
			Evade : function() {	
				return 0.8;
			},	
			Cost : function() {	
				return {Manpower :0, Fuel : 500, Steel : 500, Bauxite :500, Time: 10 * ConstData.BuildTimer, Exp: 0};
			},	
		},		
		{		
			Size : function() {	
				return 0 + Math.floor(SaveData.WorldArea * 0.01);
			},	
			HP : function() {	
				return Math.floor(100 + 2 * SaveData.WorldArea + 10 * StaticData.CombatRegion()[0]) * Math.pow(20, Math.floor(StaticData.CombatRegion()[1] /10)) ;
			},	
			Defend : function() {	
				return 12 * Math.pow(1.1,  (StaticData.CombatRegion()[0] -1) * 1);
			},	
			Evade : function() {	
				return 0.8;
			},	
			Cost : function() {	
				return {Manpower : 0, Fuel : 0, Steel : 0, Bauxite : 0, Time: 0, Exp: 0};
			},	
		},		
	],			
},				

	Equip : {
		//Destroyer
		DestroyerGun : [
			{
				Attack : function() {
					return 100 + ConstData.incCalc(SaveData.Technology.Fleet_Destroyer_FireControl.Level, 5, 1.05, 1.2, 1.5);
				},
				Piercing : function() {
					return 0;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0;
				},
				Rounds : function() {
					return 2;
				},
			},
			{
				Attack : function() {
					return 100 * Math.pow(1.2,  StaticData.CombatRegion()[0]);
				},
				Piercing : function() {
					return 0;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0;
				},
				Rounds : function() {
					return 2;
				},
			},
		],

		DestroyerTorpedo : [
			{
				Attack : function() {
					return 80 + ConstData.incCalc(SaveData.Technology.Fleet_Destroyer_FireControl.Level, 4, 1.05, 1.2, 1.5);
				},
				Piercing : function() {
					return 0.6;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0.5;
				},
				Rounds : function() {
					return 1;
				},
			},
			{
				Attack : function() {
					return 50 * Math.pow(1.2,  StaticData.CombatRegion()[0]);
				},
				Piercing : function() {
					return 0.5;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0.5;
				},
				Rounds : function() {
					return 1;
				},
			},
		],

		DestroyerAAGun : [
			{
				AntiAir : function() {
					return 10;
				},
			},
			{
				AntiAir : function() {
					return 10;
				},
			},
		],

		DepthCharge : [
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0;
				},
				Accuracy : function() {
					return 0.7;
				},
				Evadable : function () {
					return 0.3;
				},
				Rounds : function() {
					return 1;
				},
			},
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0;
				},
				Accuracy : function() {
					return 0.7;
				},
				Evadable : function () {
					return 0.3;
				},
				Rounds : function() {
					return 1;
				},
			},
		],

		//Cruiser
		CruiserGun : [
			{
				Attack : function() {
					return 120 + ConstData.incCalc(SaveData.Technology.Fleet_Cruiser_FireControl.Level, 12, 1.05, 1.2, 1.5);
				},
				Piercing : function() {
					return 0;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0;
				},
				Rounds : function() {
					return 4;
				},
			},
			{
				Attack : function() {
					return 120 * Math.pow(1.2,  StaticData.CombatRegion()[0]);
				},
				Piercing : function() {
					return 0;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0;
				},
				Rounds : function() {
					return 4 + Math.floor(StaticData.CombatRegion()[0] * 0.01);
				},
			},
		],

		CruiserTorpedo : [
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0.5;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0.5;
				},
				Rounds : function() {
					return 1;
				},
			},
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0.5;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0.5;
				},
				Rounds : function() {
					return 1;
				},
			},
		],

		CruiserAAGun : [
			{
				AntiAir : function() {
					return 10;
				},
			},
			{
				AntiAir : function() {
					return 10;
				},
			},
		],

		//Battleship
		BattleshipMainGun : [
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0;
				},
				Rounds : function() {
					return 2;
				},
			},
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0;
				},
				Rounds : function() {
					return 2;
				},
			},
		],

		BattleshipSubGun : [
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0.5;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0.5;
				},
				Rounds : function() {
					return 1;
				},
			},
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0.5;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0.5;
				},
				Rounds : function() {
					return 1;
				},
			},
		],

		BattleshipAAGun : [
			{
				AntiAir : function() {
					return 10;
				},
			},
			{
				AntiAir : function() {
					return 10;
				},
			},
		],

		//Carrier
		Fighter : [
			{
				AntiAir : function() {
					return 10;
				},
				Durable : function () {
					return 10;
				},
				Maneuver : function() {
					return 0.2;
				},
			},
			{
				AntiAir : function() {
					return 10;
				},
				Durable : function () {
					return 10;
				},
				Maneuver : function() {
					return 0.2;
				},
			},
		],

		Bomber : [
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0.5;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0;
				},
				Durable : function () {
					return 10;
				},
				Maneuver : function() {
					return 0.2;
				},
			},
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0.5;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0;
				},
				Durable : function () {
					return 10;
				},
				Maneuver : function() {
					return 0.2;
				},
			},
		],

		TropedoBomber : [
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0.5;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0.5;
				},
				Durable : function () {
					return 10;
				},
				Maneuver : function() {
					return 0.2;
				},
			},
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0.5;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0.5;
				},
				Durable : function () {
					return 10;
				},
				Maneuver : function() {
					return 0.2;
				},
			},
		],

		CarrierAAGun : [
			{
				AntiAir : function() {
					return 10;
				},
			},
			{
				AntiAir : function() {
					return 10;
				},
			},
		],

		//Submarine
		SubmarineTorpedo : [
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0.5;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0.5;
				},
				Rounds : function() {
					return 1;
				},
			},
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0.5;
				},
				Accuracy : function() {
					return 0.8;
				},
				Evadable : function () {
					return 0.5;
				},
				Rounds : function() {
					return 1;
				},
			},
		],

		//Radar
		Radar : [
			{
				AntiAir : function() {
					return 1.1;
				},
			},
			{
				AntiAir : function() {
					return 1.1;
				},
			},
		],

		FireControlSystem : [
			{
				Accuracy : function() {
					return 1.1;
				},
			},
			{
				Accuracy : function() {
					return 1.1;
				},
			},
		],

		Sonar : [
			{
				Accuracy : function() {
					return 1.1;
				},
			},
			{
				Accuracy : function() {
					return 1.1;
				},
			},
		],

		//Misc
		SmokeScreen : [
			{
				Accuracy : function() {
					return 0.5;
				},
				Evade : function() {
					return 1.5;
				},
			},
			{
				Accuracy : function() {
					return 0.5;
				},
				Evade : function() {
					return 1.5;
				},
			},
		],
	},

	Technology : {
		FleetExpansion : {
			Cost : function() {
				var baseCost = Math.pow(1.05, SaveData.Technology.FleetExpansion.Level);

				return {Manpower : 100 * baseCost, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10, Exp : 50000};
			},
		},
		Manpower_InitialPlan :{
			Cost : function() {
				var baseCost = Math.pow(1.05, SaveData.Technology.Manpower_InitialPlan.Level);

				return {Manpower : 100 * baseCost, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10, Exp : 10000};
			},
		},
		Manpower_GrowthRate :  {
			Cost : function() {
				var baseCost = Math.pow(1.05, SaveData.Technology.Manpower_GrowthRate.Level);

				return {Manpower : 100 * baseCost, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10, Exp : 10000};
			},
		},
		Manpower_OutputEfficiency :{
			Cost : function() {
				var baseCost = Math.pow(1.05, SaveData.Technology.Manpower_OutputEfficiency.Level);

				return {Manpower : 100 * baseCost, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10, Exp : 10000};
			},
		},		
		Fuel_InitialPlan :  {
			Cost : function() {
				var baseCost = Math.pow(1.05, SaveData.Technology.Fuel_InitialPlan.Level);

				return {Manpower : 100 * baseCost, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10, Exp : 10000};
			},
		},		
		Fuel_GrowthRate : {
			Cost : function() {
				var baseCost = Math.pow(1.05, SaveData.Technology.Fuel_GrowthRate.Level);

				return {Manpower : 100 * baseCost, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10, Exp : 10000};
			},
		},		
		Fuel_OutputEfficiency :{
			Cost : function() {
				var baseCost = Math.pow(1.05, SaveData.Technology.Fuel_OutputEfficiency.Level);

				return {Manpower : 100 * baseCost, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10, Exp : 10000};
			},
		},		
		Steel_InitialPlan : {
			Cost : function() {
				var baseCost = Math.pow(1.05, SaveData.Technology.Manpower_GrowthRate.Level);

				return {Manpower : 100 * baseCost, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10, Exp : 10000};
			},
		},		
		Steel_GrowthRate : {
			Cost : function() {
				var baseCost = Math.pow(1.05, SaveData.Technology.Steel_GrowthRate.Level);

				return {Manpower : 100 * baseCost, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10, Exp : 10000};
			},
		},		
		Steel_OutputEfficiency : {
			Cost : function() {
				var baseCost = Math.pow(1.05, SaveData.Technology.Steel_OutputEfficiency.Level);

				return {Manpower : 100 * baseCost, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10, Exp : 10000};
			},
		},		
		Bauxite_InitialPlan :  {
			Cost : function() {
				var baseCost = Math.pow(1.05, SaveData.Technology.Bauxite_InitialPlan.Level);

				return {Manpower : 100 * baseCost, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10, Exp : 10000};
			},
		},
		Bauxite_GrowthRate :  {
			Cost : function() {
				var baseCost = Math.pow(1.05, SaveData.Technology.Bauxite_InitialPlan.Level);

				return {Manpower : 100 * baseCost, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10, Exp : 10000};
			},
		},
		Bauxite_OutputEfficiency :  {
			Cost : function() {
				var baseCost = Math.pow(1.05, SaveData.Technology.Bauxite_InitialPlan.Level);

				return {Manpower : 100 * baseCost, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10, Exp : 10000};
			},
		},
		Fleet_Destroyer_Armor : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Destroyer_Armor.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},
		Fleet_Cruiser_Armor :{
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Cruiser_Armor.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},
		Fleet_Battleship_Armor :  {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Battleship_Armor.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},
		Fleet_Carrier_Armor :{
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Carrier_Armor.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},		
		Fleet_Submarine_Armor :  {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Submarine_Armor.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},
		Fleet_Destroyer_DeckImprove : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Destroyer_DeckImprove.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},
		Fleet_Cruiser_DeckImprove : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Cruiser_DeckImprove.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},
		Fleet_Battleship_DeckImprove : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Battleship_DeckImprove.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},
		Fleet_Carrier_DeckImprove : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Carrier_DeckImprove.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},
		Fleet_Submarine_DeckImprove : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Submarine_DeckImprove.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},

		Fleet_Destroyer_FireControl : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Destroyer_FireControl.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},
		Fleet_Cruiser_FireControl : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Cruiser_FireControl.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},
		Fleet_Battleship_FireControl : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Battleship_FireControl.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 1000};
			},
		},
		Fleet_Carrier_FireControl : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Carrier_FireControl.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 1000};
			},
		},
		Fleet_Submarine_FireControl : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Submarine_FireControl.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},

		Fleet_Destroyer_AimSystem : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Destroyer_AimSystem.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},
		Fleet_Cruiser_AimSystem : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Cruiser_AimSystem.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},
		Fleet_Battleship_AimSystem : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Battleship_AimSystem.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000};
			},
		},
		Fleet_Carrier_AimSystem : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Carrier_AimSystem.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000 };
			},
		},
		Fleet_Submarine_AimSystem : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Submarine_AimSystem.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10, Exp : 10000 };
			},
		},
	},
};