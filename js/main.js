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
	return SaveData.City.Num + SaveData.OilMiner.Num + SaveData.SteelMiner.Num + SaveData.BauxiteMiner.Num + 
		 SaveData.OilStorage.Num + SaveData.SteelStorage.Num + SaveData.BauxiteStorage.Num;
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
	var cost = StaticData.CityBuildCost();
	if (CheckResource(cost, n) && CheckTerritory(n))
	{
		ConsumeResource(cost, n);
		SaveData.City.Num += n;
	}
}

function OnBuildOilMiner(n)
{
	var cost = StaticData.OilMinerBuildCost();
	if (CheckResource(cost, n) && CheckTerritory(n))
	{
		ConsumeResource(cost, n);
		SaveData.OilMiner.Num += n;
	}
}

function OnBuildOilStorage(n)
{
	var cost = StaticData.OilStorageBuildCost();
	if (CheckResource(cost, n) && CheckTerritory(n))
	{
		ConsumeResource(cost, n);
		SaveData.OilStorage.Num += n;
	}
}

function OnBuildSteelMiner(n)
{
	var cost = StaticData.SteelMinerBuildCost();
	if (CheckResource(cost, n) && CheckTerritory(n))
	{
		ConsumeResource(cost, n);
		SaveData.SteelMiner.Num += n;
	}
}

function OnBuildSteelStorage(n)
{
	var cost = StaticData.SteelStorageBuildCost();
	if (CheckResource(cost, n) && CheckTerritory(n))
	{
		ConsumeResource(cost, n);
		SaveData.SteelStorage.Num += n;
	}
}

function OnBuildBauxiteMiner(n)
{
	var cost = StaticData.BauxiteMinerBuildCost();
	if (CheckResource(cost, n) && CheckTerritory(n))
	{
		ConsumeResource(cost, n);
		SaveData.BauxiteMiner.Num += n;
	}
}

function OnBuildBauxiteStorage(n)
{
	var cost = StaticData.BauxiteStorageBuildCost();
	if (CheckResource(cost, n) && CheckTerritory(n))
	{
		ConsumeResource(cost, n);
		SaveData.BauxiteStorage.Num += n;
	}
}

function OnAddDestroyer(n)
{
	if (OccupiedFleetSize() + StaticData.Destroyer.Size() * n <= SaveData.FleetSize)
	{
		SaveData.DestroyerPlanned += n;
		if(SaveData.Destroyer > SaveData.DestroyerPlanned)
		{
			SaveData.Destroyer = SaveData.DestroyerPlanned;
		}
	}
}

function OnProductionPhase()
{
	if (SaveData.Destroyer < SaveData.DestroyerPlanned)
	{
		var cost = StaticData.Destroyer.Cost();
		if(CheckResource(cost, 1))
		{
			ConsumeResource(cost, 1);
			//Add Build Time Delay
			SaveData.Destroyer++;
		}
	}
	else
	{
		SaveData.Phase++;
	}
}

function OnReconPhase()
{
	SaveData.Phase++;
}

function OnAirAttackPhase()
{
	SaveData.Phase++;
}

function OnSubmarineTorpedoPhase()
{
	SaveData.Phase++;
}

function OnLongRangeFirePhase()
{
	SaveData.Phase++;
}

function OnShortRangeFirePhase()
{
	SaveData.Phase++;
}

function OnTorpedoPhase()
{
	SaveData.Phase = 0;
}

function OnTick()
{
	//Update Resources
	SaveData.Manpower = Math.min(StaticData.ManpowerMax(), SaveData.Manpower + StaticData.ManpowerPerSec());
	SaveData.Fuel = Math.min(StaticData.FuelMax(), SaveData.Fuel + StaticData.FuelPerSec());
	SaveData.Steel = Math.min(StaticData.SteelMax(), SaveData.Steel + StaticData.SteelPerSec());
	SaveData.Bauxite = Math.min(StaticData.BauxiteMax(), SaveData.Bauxite + StaticData.BauxitePerSec());

	//Update Battle Phase
	switch(SaveData.BattlePhase)
	{
		case 0:
			OnProductionPhase();
			break;
		case 1:
			OnReconPhase();
			break;
		case 2:
			OnAirAttackPhase();
			break;
		case 3:
			OnSubmarineTorpedoPhase();
			break;
		case 4:
			OnLongRangeFirePhase();
			break;
		case 5:
			OnShortRangeFirePhase();
			break;
		case 6:
			OnTorpedoPhase();
			break;
	}
}

function OnRender()
{
	$("#Territory").text(UsedTerritory() + " / " + SaveData.Territory);

	$("#Manpower").text("Manpower: " + Math.floor(SaveData.Manpower) + " + " + Math.floor(StaticData.ManpowerPerSec()) + "/d / " + Math.floor(StaticData.ManpowerMax()));
	$("#Fuel").text("Fuel: " + Math.floor(SaveData.Fuel) + " + " + Math.floor(StaticData.FuelPerSec()) + "/d / " + Math.floor(StaticData.FuelMax()));
	$("#Steel").text("Steel: " + Math.floor(SaveData.Steel) + " + " + Math.floor(StaticData.SteelPerSec()) + "/d / " + Math.floor(StaticData.SteelMax()));
	$("#Bauxite").text("Bauxite: " + Math.floor(SaveData.Bauxite) + " + " + Math.floor(StaticData.BauxitePerSec()) + "/d / " + Math.floor(StaticData.BauxiteMax()));

	$("#City").text("City: " + SaveData.City.Num);
	$("#OilMiner").text("Oil Miner: " + SaveData.OilMiner.Num);
	$("#OilStorage").text("Oil Storage: " + SaveData.OilStorage.Num);
	$("#SteelMiner").text("Steel Miner: " + SaveData.SteelMiner.Num);
	$("#SteelStorage").text("Steel Storage: " + SaveData.SteelStorage.Num);
	$("#BauxiteMiner").text("Bauxite Miner: " + SaveData.BauxiteMiner.Num);
	$("#BauxiteStorage").text("Bauxite Storage: " + SaveData.BauxiteStorage.Num);

	$("#FleetSize").text("FleetSize: " + OccupiedFleetSize() + " / " + SaveData.FleetSize);
	$("#Destroyer").text("Destroyer: " + SaveData.Destroyer[0].Num + " / " + SaveData.DestroyerPlanned);
	$("#Cruiser").text("Cruiser: " + SaveData.Cruiser[0].Num + " / " + SaveData.CruiserPlanned);
	$("#Battleship").text("Battleship: " + SaveData.Battleship[0].Num + " / " + SaveData.BattleshipPlanned);
	$("#Carrier").text("Carrier: " + SaveData.Carrier[0].Num + " / " + SaveData.CarrierPlanned);
	$("#Submarine").text("Submarine: " + SaveData.Submarine[0].Num + " / " + SaveData.SubmarinePlanned);
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
