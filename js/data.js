ConstData = {
	BaseCost : 100,
	ResourceBonusRate : 0.01,
	ResourceMultiRate : 0.01,
};

StaticData = {
	ManpowerPerSec : function() {
		return (20 + SaveData.Technology.Manpower_InitialPlan + (2 + ConstData.ResourceBonusRate * SaveData.Technology.Manpower_GrowthRate) * SaveData.Territory ) * ( 1 + ConstData.ResourceMultiRate * SaveData.Technology.Manpower_OutputEfficiency);
	},
	FuelPerSec : function() {
		return (5 + SaveData.Technology.Fuel_InitialPlan + (1 + ConstData.ResourceBonusRate * SaveData.Technology.Fuel_GrowthRate) * SaveData.OilMiner.Num ) * ( 1 + ConstData.ResourceMultiRate * SaveData.Technology.Fuel_OutputEfficiency);
	},
	SteelPerSec : function() {
		return (3 + SaveData.Technology.Steel_InitialPlan + (1 + ConstData.ResourceBonusRate * SaveData.Technology.Steel_GrowthRate) * SaveData.SteelMiner.Num ) * ( 1 + ConstData.ResourceMultiRate * SaveData.Technology.Steel_OutputEfficiency);
	},
	BauxitePerSec : function() {
		return (3 + SaveData.Technology.Bauxite_InitialPlan + (1 + ConstData.ResourceBonusRate * SaveData.Technology.Bauxite_GrowthRate) * SaveData.BauxiteMiner.Num ) * ( 1 + ConstData.ResourceMultiRate * SaveData.Technology.Bauxite_OutputEfficiency);
		},

	OilMinerBuildCost : function() {
		var ManpowerCost = ConstData.BaseCost;
		
		ManpowerCost *= Math.pow( 1.6, SaveData.OilMiner.Num);	
		
		return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0,  Time: 1 + (SaveData.OilMiner.Num) * 2};
	},
	OilStorageBuildCost : function() {
		var ManpowerCost = 5 * ConstData.BaseCost;
		
		ManpowerCost +=  (SaveData.OilStorage.Num) * ConstData.BaseCost;	
	
		return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0,  Time: 10};
	},
	SteelMinerBuildCost : function() {
		var ManpowerCost = ConstData.BaseCost;
		var FuelCost = 2 * ConstData.BaseCost;	
		
		ManpowerCost *= Math.pow( 1.6, SaveData.SteelMiner.Num);	
		FuelCost *= Math.pow( 1.6, SaveData.SteelMiner.Num);	
		
		return {Manpower : ManpowerCost, Fuel : FuelCost, Steel : 0, Bauxite : 0,  Time: 1 + (SaveData.SteelMiner.Num)* 2};
	},
	SteelStorageBuildCost : function() {
		var ManpowerCost = 5 * ConstData.BaseCost;
		
		ManpowerCost +=  (SaveData.SteelStorage.Num + SaveData.SteelStorage.Num )* ConstData.BaseCost;	
	
		return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0,  Time: 10};
	},
	BauxiteMinerBuildCost : function() {
		var ManpowerCost = 2 * ConstData.BaseCost;
		var FuelCost = ConstData.BaseCost;	
		
		ManpowerCost *= Math.pow( 1.6, (SaveData.BauxiteMiner.Num));	
		FuelCost *= Math.pow( 1.6, (SaveData.BauxiteMiner.Num));	
	
		return {Manpower : ManpowerCost, Fuel : FuelCost, Steel : 0, Bauxite : 0,  Time: 1 + (SaveData.BauxiteMiner.Num) * 2};
	},
	BauxiteStorageBuildCost : function() {
		var ManpowerCost = 5 * ConstData.BaseCost;
		
		ManpowerCost +=  (SaveData.BauxiteStorage.Num) * ConstData.BaseCost;	
	
		return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0,  Time: 10};
	},

	ManpowerMax : function() {
		return 1000 * SaveData.Territory;
	},

	FuelMax : function() {
		return 1000 + 1000 * SaveData.OilStorage.Num;
	},

	SteelMax : function() {
		return 1000 + 1000 * SaveData.SteelStorage.Num;
	},

	BauxiteMax : function() {
		return 1000 + 1000 * SaveData.BauxiteStorage.Num;
	},

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

	Technology : {
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
		OilMinerLevel : {
			Cost : function() {
				return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
			},
		},		
		
	},
}