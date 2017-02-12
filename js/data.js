ConstData = {
	BaseCost : 100,
};

StaticData = {
	ManpowerPerSec : function() {
		return 20 + 2 * SaveData.City;
	},
	FuelPerSec : function() {
		return 5 + 1 * SaveData.OilMiner;
	},
	SteelPerSec : function() {
		return 3 + 1 * SaveData.SteelMiner;
	},
	BauxitePerSec : function() {
		return 3 + 1 * SaveData.BauxiteMiner;
	},

	CityBuildCost : function() {
		var ManpowerCost = ConstData.BaseCost;
		
		ManpowerCost *= Math.pow( 1.4, SaveData.City);	
			
		return {Manpower : ManpowerCost , Fuel : 0, Steel : 0, Bauxite : 0 ,  Time: 1 + SaveData.City * 2};
	},
	OilMinerBuildCost : function() {
		var ManpowerCost = ConstData.BaseCost;
		
		ManpowerCost *= Math.pow( 1.6, SaveData.City);	
		
		return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0,  Time: 1 + SaveData.City * 2};
	},
	SteelMinerBuildCost : function() {
		var ManpowerCost = ConstData.BaseCost;
		var FuelCost = 2 * ConstData.BaseCost;	
		
		ManpowerCost *= Math.pow( 1.6, SaveData.City);	
		FuelCost *= Math.pow( 1.6, SaveData.OilMiner);	
		
		return {Manpower : ManpowerCost, Fuel : FuelCost, Steel : 0, Bauxite : 0,  Time: 1 + SaveData.City * 2};
	},
	BauxiteMinerBuildCost : function() {
		var ManpowerCost = 2 * ConstData.BaseCost;
		var FuelCost = ConstData.BaseCost;	
		
		ManpowerCost *= Math.pow( 1.6, SaveData.City);	
		FuelCost *= Math.pow( 1.6, SaveData.OilMiner);	
	
		return {Manpower : ManpowerCost, Fuel : FuelCost, Steel : 0, Bauxite : 0,  Time: 1 + SaveData.City * 2};
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
		CityLevel : function() {
			return {Manpower : 100, Fuel : 0, Steel : 0, Bauxite : 0, Time : 10};
		},

	},
}