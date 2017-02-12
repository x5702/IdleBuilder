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

function OccupiedFleetSize()
{
	return SaveData.DestroyerPlanned * StaticData.Destroyer.Size();
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

function OnAddDestroyer(n)
{
	if (OccupiedFleetSize() + StaticData.Destroyer.Size() * n <= SaveData.FleetSize)
	{
		SaveData.DestroyerPlanned += n;
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

	$("#Manpower").text("Manpower: " + Math.floor(SaveData.Manpower) + " + " + Math.floor(StaticData.ManpowerPerSec()) + "/d");
	$("#Fuel").text("Fuel: " + Math.floor(SaveData.Fuel) + " + " + Math.floor(StaticData.FuelPerSec()) + "/d");
	$("#Steel").text("Steel: " + Math.floor(SaveData.Steel) + " + " + Math.floor(StaticData.SteelPerSec()) + "/d");
	$("#Bauxite").text("Bauxite: " + Math.floor(SaveData.Bauxite) + " + " + Math.floor(StaticData.BauxitePerSec()) + "/d");

	$("#City").text("City: " + SaveData.City);
	$("#OilMiner").text("Oil Miner: " + SaveData.OilMiner);
	$("#SteelMiner").text("Steel Miner: " + SaveData.SteelMiner);
	$("#BauxiteMiner").text("Bauxite Miner: " + SaveData.BauxiteMiner);

	$("#FleetSize").text("FleetSize: " + OccupiedFleetSize() + " / " + SaveData.FleetSize);
	$("#Destroyer").text("Destroyer: " + SaveData.Destroyer + " / " + SaveData.DestroyerPlanned);
	$("#Cruiser").text("Cruiser: " + SaveData.Cruiser + " / " + SaveData.CruiserPlanned);
	$("#Battleship").text("Battleship: " + SaveData.Battleship + " / " + SaveData.BattleshipPlanned);
	$("#Carrier").text("Carrier: " + SaveData.Carrier + " / " + SaveData.CarrierPlanned);
	$("#Submarine").text("Submarine: " + SaveData.Submarine + " / " + SaveData.SubmarinePlanned);
}

function ResetSave()
{
	localStorage.removeItem("IdleBuilderSave");
}

function OnSave()
{
	var string = JSON.stringify(SaveData);
	string = LZString.compress(string);
	localStorage.setItem("IdleBuilderSave", string);
}

function OnLoad()
{
	var string = localStorage.getItem("IdleBuilderSave");
	string = LZString.decompress(string);
	if (string)
	{
		SaveData = JSON.parse(string);
	}
}

window.addEventListener("load", function(){
	OnLoad();
	OnRender();
	setInterval(OnRender, 50);
	setInterval(OnTick, 1000);
	setInterval(OnSave, 1000 * 300);
})
