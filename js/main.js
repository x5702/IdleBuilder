//Utility Functions
function CheckResource(cost, count)
{
	count = count < 0 ? 0 : count;
	return SaveData.Manpower >= cost.Manpower * count &&
		SaveData.Fuel >= cost.Fuel * count &&
		SaveData.Steel >= cost.Steel * count &&
		SaveData.Bauxite >= cost.Bauxite * count;
}

function ConsumeResource(cost, count)
{
	count = count < 0 ? 0 : count;
	SaveData.Manpower -= cost.Manpower * count;
	SaveData.Fuel -= cost.Fuel * count;
	SaveData.Steel -= cost.Steel * count;
	SaveData.Bauxite -= cost.Bauxite * count;
}

function UsedTerritory()
{
	return SaveData.City + SaveData.OilMiner + SaveData.SteelMiner + SaveData.BauxiteMiner;
}

function CheckTerritory(count)
{
	return UsedTerritory() + count <= SaveData.Territory;
}


//UI stuff
function OnTab(name)
{
	$(".tab").hide();
	$("#" + name).show();
}

function OnBuildCity(n)
{
	if (CheckResource(StaticData.CityBuildCost(), n) && CheckTerritory(n))
	{
		ConsumeResource(StaticData.CityBuildCost(), n);
		SaveData.City += n;
	}
}

function OnBuildOilMiner(n)
{
	if (CheckResource(StaticData.OilMinerBuildCost(), n) && CheckTerritory(n))
	{
		ConsumeResource(StaticData.OilMinerBuildCost(), n);
		SaveData.OilMiner += n;
	}
}

function OnBuildSteelMiner(n)
{
	if (CheckResource(StaticData.SteelMinerBuildCost(), n) && CheckTerritory(n))
	{
		ConsumeResource(StaticData.SteelMinerBuildCost(), n);
		SaveData.SteelMiner += n;
	}
}

function OnBuildBauxiteMiner(n)
{
	if (CheckResource(StaticData.BauxiteMinerBuildCost(), n) && CheckTerritory(n))
	{
		ConsumeResource(StaticData.BauxiteMinerBuildCost(), n);
		SaveData.BauxiteMiner += n;
	}
}

function OnTick()
{
	//Update Resources
	SaveData.Manpower = SaveData.Manpower + StaticData.ManpowerPerSec();
	SaveData.Fuel = SaveData.Fuel + StaticData.FuelPerSec();
	SaveData.Steel = SaveData.Steel + StaticData.SteelPerSec();
	SaveData.Bauxite = SaveData.Bauxite + StaticData.BauxitePerSec();

	//Update Production

	//Update Battle
}

function OnRender()
{
	$("#Territory").text(UsedTerritory() + " / " + SaveData.Territory);

	$("#Manpower").text("Manpower: " + SaveData.Manpower + " + " + StaticData.ManpowerPerSec() + "/d");
	$("#Fuel").text("Fuel: " + SaveData.Fuel + " + " + StaticData.FuelPerSec() + "/d");
	$("#Steel").text("Steel: " + SaveData.Steel + " + " + StaticData.SteelPerSec() + "/d");
	$("#Bauxite").text("Bauxite: " + SaveData.Bauxite + " + " + StaticData.BauxitePerSec() + "/d");

	$("#City").text("City: " + SaveData.City);
	$("#OilMiner").text("Oil Miner: " + SaveData.OilMiner);
	$("#SteelMiner").text("Steel Miner: " + SaveData.SteelMiner);
	$("#BauxiteMiner").text("Bauxite Miner: " + SaveData.BauxiteMiner);

	$("#FleetSize").text("FleetSize: " + SaveData.FleetSize);
	$("#Destroyer").text("Destroyer: " + SaveData.Destroyer);
	$("#Cruiser").text("Cruiser: " + SaveData.Cruiser);
	$("#BattleShip").text("BattleShip: " + SaveData.BattleShip);
	$("#Carrier").text("Carrier: " + SaveData.Carrier);
	$("#Submarine").text("Submarine: " + SaveData.Submarine);
}

function OnSave()
{
	var string = JSON.stringify(SaveData);
	//string = LZString.compress(string);
	localStorage.setItem("IdleBuilderSave", string);
	
}

function OnLoad()
{
	var string = localStorage.getItem("IdleBuilderSave");
	//string = LZString.decompress(compressed);
	if (string)
	{
		SaveData = JSON.parse(SaveData);
	}
}

window.addEventListener("load", function(){
	//OnLoad();
	OnRender();
	setInterval(OnRender, 50);
	setInterval(OnTick, 1000);
	setInterval(OnSave, 1000 * 300);
})
