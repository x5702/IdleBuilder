ConstData = {
	BaseCost : 100,
	ResourceBonusRate : 0.01,
	ResourceMultiRate : 0.01,

	incCalc : function(num, base, ratio1, ratio2, ratio3 ) {
	var c = Math.max(0, Math.floor(num * 0.1));
	var cc = Math.max(0, Math.floor(num * 0.04 - 8));
	var ccc = Math.max(0, Math.floor(num * 0.01 - 10));
	var cccc = Math.min(4, Math.floor(num * 0.04));	
	
	return Math.floor((base + c * Math.pow(ratio1, cc)) * Math.pow(ratio2, ccc) * Math.pow(ratio3, cccc)) ; 
	},


	costCalc: function(num, base, ratio1, ratio2, ratio3,ratio4 ) {
		var c = num;
		var cc = ((Math.max(0, num - 175) % 25) > 0) ? 1 : 0;
		var ccc = ((Math.max(0, num - 900) % 100) > 0) ? 1: 0;
		var cccc = ((num % 200 % 25) > 0 ) ? 1: 0;	
		
		return Math.floor((base + ratio1 * c) * Math.pow(ratio2, cc) * Math.pow(ratio3, ccc) * Math.pow(ratio4, cccc)); 
	},
};


StaticData = {
	Territory : function() {
		return 10 + SaveData.WorldArea;
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
		return 1000 * StaticData.Territory();
	},

	FuelMax : function() {
		return 1000 + 1000 * SaveData.Building.OilStorage.Num;
	},

	SteelMax : function() {
		return 1000 + 1000 * SaveData.Building.SteelStorage.Num;
	},

	BauxiteMax : function() {
		return 1000 + 1000 * SaveData.Building.BauxiteStorage.Num;
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
				
				return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0,  Time: 1 + (SaveData.Building.OilMiner.Num) * 2};
			},
		},
		OilStorage : {
			Cost : function() {
				var ManpowerCost = 5 * ConstData.BaseCost;
				
				ManpowerCost +=  (SaveData.Building.OilStorage.Num) * ConstData.BaseCost;	
			
				return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0,  Time: 10};
			},
		},
		SteelMiner : {
			Cost : function() {
				var ManpowerCost = 2 * ConstData.BaseCost;
				var FuelCost =  ConstData.BaseCost;	
				
				ManpowerCost *= Math.pow( 1.6, SaveData.Building.SteelMiner.Num);	
				FuelCost *= Math.pow( 1.6, SaveData.Building.SteelMiner.Num);	
				
				return {Manpower : ManpowerCost, Fuel : FuelCost, Steel : 0, Bauxite : 0,  Time: 1 + (SaveData.Building.SteelMiner.Num)* 2};
			},
		},
		SteelStorage : {
			Cost : function() {
				var ManpowerCost = 5 * ConstData.BaseCost;
				
				ManpowerCost +=  (SaveData.Building.SteelStorage.Num + SaveData.Building.SteelStorage.Num )* ConstData.BaseCost;	
			
				return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0,  Time: 10};
			},
		},
		BauxiteMiner : {
			Cost : function() {
				var ManpowerCost = 2 * ConstData.BaseCost;
				var FuelCost = ConstData.BaseCost;	
				
				ManpowerCost *= Math.pow( 1.6, (SaveData.Building.BauxiteMiner.Num));	
				FuelCost *= Math.pow( 1.6, (SaveData.Building.BauxiteMiner.Num));	
			
				return {Manpower : ManpowerCost, Fuel : FuelCost, Steel : 0, Bauxite : 0,  Time: 1 + (SaveData.Building.BauxiteMiner.Num) * 2};
			},
		},
		BauxiteStorage : {
				Cost : function() {
				var ManpowerCost = 5 * ConstData.BaseCost;
				
				ManpowerCost +=  (SaveData.Building.BauxiteStorage.Num) * ConstData.BaseCost;	
			
				return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0,  Time: 10};
			},
		},
	},

	Ship : {
		Destroyer : [
			{
				Size : function() {
					return 2;
				},
				HP : function() {
					return ConstData.incCalc(SaveData.Technology.Fleet_Destroyer_DeckImprove.Level, 10, 1.01, 1.2, 1.5);
				},
				Defend : function() {//defend * 100 to make sure value has an increment.
					return ConstData.incCalc(SaveData.Technology.Fleet_Destroyer_Armor.Level, 0, 1.01, 1.05, 1.2);
				},
				Evade : function() {
					return 0.5;
				},
				Cost : function() {
					return {Manpower : 0, Fuel : 100, Steel : 100, Bauxite : 0, Time: 10};
				},
			},
			{
				Size : function() {
					return 1 + Math.floor(SaveData.WorldArea * 0.04, 0);
				},
				HP : function() {
					return Math.floor(10 + 0.2 * SaveData.WorldArea);
				},
				Defend : function() {
					return 0;
				},
				Evade : function() {
					return 0.5;
				},
				Cost : function() {
					return {Manpower : 0, Fuel : 0, Steel : 0, Bauxite : 0, Time: 0};
				},
			},
		],
	},

	Equip : {
		LightGun : [
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
				Speed : function() {
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
				Speed : function() {
					return 2;
				},
			},
		],

		Torpedo : [
			{
				Attack : function() {
					return 10;
				},
				Piercing : function() {
					return 0.5;
				},
				Accuracy : function() {
					return 0.2;
				},
				Evadable : function () {
					return 0.5;
				},
				Speed : function() {
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
					return 0.2;
				},
				Evadable : function () {
					return 0.5;
				},
				Speed : function() {
					return 1;
				},
			},
		],

		LightArmor : [
			{
				Defend : function() {
					return 2;
				},
			},
			{
				Defend : function() {
					return 2;
				},
			},
		],

		LightEngine : [
			{
				Evade : function() {
					return 0.1;
				},
			},
			{
				Evade : function() {
					return 0.1;
				},
			},
		],

		Radar : [
			{
				Recon : function(){
					return 10;
				},
			},
			{
				Recon : function(){
					return 10;
				},
			},
		],
	},

	Technology : {
		FleetExpansion : {
			Cost : function() {
				return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
			},
		},
		Manpower_InitialPlan :{
			Cost : function() {
				return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
			},
		},
		Manpower_GrowthRate :  {
			Cost : function() {
				return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
			},
		},
		Manpower_OutputEfficiency :{
			Cost : function() {
				return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
			},
		},		
		Fuel_InitialPlan :  {
			Cost : function() {
				return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
			},
		},		
		Fuel_GrowthRate : {
			Cost : function() {
				return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
			},
		},		
		Fuel_OutputEfficiency :{
			Cost : function() {
				return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
			},
		},		
		Steel_InitialPlan : {
			Cost : function() {
				return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
			},
		},		
		Steel_GrowthRate : {
			Cost : function() {
				return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
			},
		},		
		Steel_OutputEfficiency : {
			Cost : function() {
				return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
			},
		},		
		Bauxite_InitialPlan :  {
			Cost : function() {
				return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
			},
		},
		Fleet_Destroyer_Armor : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Destroyer_Armor.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Cruiser_Armor :{
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Cruiser_Armor.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Battleship_Armor :  {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Battleship_Armor.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Carrier_Armor :{
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Carrier_Armor.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},		
		Fleet_Submarine_Armor :  {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Submarine_Armor.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Destroyer_DeckImprove : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Destroyer_DeckImprove.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Cruiser_DeckImprove : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Cruiser_DeckImprove.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Battleship_DeckImprove : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Battleship_DeckImprove.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Carrier_DeckImprove : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Carrier_DeckImprove.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Submarine_DeckImprove : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Submarine_DeckImprove.Level, 10, 1, 3, 10, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},

		Fleet_Destroyer_FireControl : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Destroyer_FireControl.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Cruiser_FireControl : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Cruiser_FireControl.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Battleship_FireControl : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Battleship_FireControl.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Carrier_FireControl : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Carrier_FireControl.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Submarine_FireControl : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Submarine_FireControl.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},

		Fleet_Destroyer_AimSystem : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Destroyer_AimSystem.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Cruiser_AimSystem : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Cruiser_AimSystem.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Battleship_AimSystem : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Battleship_AimSystem.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Carrier_AimSystem : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Carrier_AimSystem.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
		Fleet_Submarine_AimSystem : {
			Cost : function() {
				var baseCost = ConstData.costCalc(SaveData.Technology.Fleet_Submarine_AimSystem.Level, 10, 1, 10, 100, 2 );
				
				return {Manpower : 10 * baseCost, Fuel : 0, Steel : 2 * baseCost, Bauxite : 2 * baseCost, Time : 10};
			},
		},
	},
};