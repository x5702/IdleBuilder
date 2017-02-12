StaticData = {
	ManpowerPerUnitPerSec : function() {
		return 10 + 2 * SaveData.City;
	},
	FuelPerUnitPerSec : function() {
		return 5 + 1 * SaveData.OilMiner;
	},
	SteelPerUnitPerSec : function() {
		return 5 + 1 * SaveData.SteelMiner;
	},
	BauxitePerUnitPerSec : function() {
		return 5 + 1 * SaveData.BauxiteMiner;
	},

	CityBuildCost : function() {
		var ManpowerCost = 100;
		for (var i = 0; i < SaveData.City; i ++)
		{
			ManpowerCost += ManpowerCost * 0.1;
		}
		
		return {Manpower : ManpowerCost , Fuel : 0, Steel : 0, Bauxite : 0};
	},
	OilMinerBuildCost : function() {
		var ManpowerCost = 100;
		
		for (var i = 0; i < SaveData.OilMiner; i ++)
		{
			ManpowerCost += ManpowerCost * 0.2;
		}
		return {Manpower : ManpowerCost, Fuel : 0, Steel : 0, Bauxite : 0};
	},
	SteelMinerBuildCost : function() {
		var ManpowerCost = 50;
		var FuelCost = 100;	
		
		for (var i = 0; i < SaveData.SteelMiner; i ++)
		{
			ManpowerCost += ManpowerCost * 0.1;
			FuelCost += FuelCost * 0.2;
		}	
	
		return {Manpower : ManpowerCost, Fuel : FuelCost, Steel : 0, Bauxite : 0};
	},
	BauxiteMinerBuildCost : function() {
		var ManpowerCost = 100;
		var FuelCost = 50;	
		
		for (var i = 0; i < SaveData.BauxiteMiner; i ++)
		{
			ManpowerCost += ManpowerCost * 0.2;
			FuelCost += FuelCost * 0.1;
		}	
	
		return {Manpower : ManpowerCost, Fuel : FuelCost, Steel : 0, Bauxite : 0};
	},

	DestroyerSize : function() {
		return 2;
	},
	DestroyerBaseHP : function() {
		return 10;
	},
	DestroyerBaseDefend : function() {
		return 5;
	},
	DestroyerBaseEvade : function() {
		return 0.5;
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