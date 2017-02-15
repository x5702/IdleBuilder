ConstData = {
	BaseCost : 100,
};

StaticData = {
	ManpowerPerSec : function() {
		return 20 + 2 * SaveData.Territory;
	},
	FuelPerSec : function() {
		return 5 + 1 * SaveData.OilMiner.Num;
	},
	SteelPerSec : function() {
		return 3 + 1 * SaveData.SteelMiner.Num;
	},
	BauxitePerSec : function() {
		return 3 + 1 * SaveData.BauxiteMiner.Num;
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
		OilMinerLevel : function() {
			return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
		},

	},
}