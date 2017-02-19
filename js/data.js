ConstData = {
	BaseCost : 100,
	ResourceBonusRate : 0.01,
	ResourceMultiRate : 0.01,
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
				var ManpowerCost = ConstData.BaseCost;
				var FuelCost = 2 * ConstData.BaseCost;	
				
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
		Destroyer : {
			Size : function() {
				return 2;
			},
			HP : function() {
				return 10;
			},
			Defend : function() {
				return 5;
			},
			Evade : function() {
				return 0.5;
			},
			Cost : function() {
				return {Manpower : 0, Fuel : 100, Steel : 100, Bauxite : 0, Time: 10};
			},
		},
	},

	Equip : {
		LightGunAttack : function() {
			return 10;
		},
		LightGunAccuracy : function() {
			return 0.8;
		},
		LightGunSpeed : function() {
			return 1;
		},

		LightArmorDefend : function() {
			return 2;
		},

		LightEngineEvade : function() {
			return 0.1;
		},

		RadarRecon : function(){
			return 10;
		},
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
	},
};