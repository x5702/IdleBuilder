//Helper Structure
var Buildings = [
	"City",
	"OilMiner",
	"OilStorage",
	"SteelMiner",
	"SteelStorage",
	"BauxiteMiner",
	"BauxiteStorage",
	//"ShipFactory",
	//"EquipmentFactory",
	//"AircraftFactory",
	//"ResearchLab",
];

var Ships = [
	"Destroyer",
	"Cruiser",
	"Carrier",
	"Battleship",
	"Submarine",
];

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
	return SaveData.City.Planned + SaveData.OilMiner.Planned + SaveData.SteelMiner.Planned + SaveData.BauxiteMiner.Planned + 
		 SaveData.OilStorage.Planned + SaveData.SteelStorage.Planned + SaveData.BauxiteStorage.Planned;
}


//UI stuff
function OnTab(name)
{
	$(".tab").hide();
	$("#" + name).show();
}

function OnBuildBuilding(name, n)
{
	if (UsedTerritory() + n <= SaveData.Territory)
	{
		var min = (name == "City" ? 1 : 0);
		SaveData[name].Planned = Math.max(min, SaveData[name].Planned + n);
		if (SaveData[name].Num >= SaveData[name].Planned)
		{
			SaveData[name].Num = SaveData[name].Planned;
			SaveData[name].Progress = SaveData[name].Num > 0 ? 1 : 0;
		}
	}
}

function OnBuildShip(name, n)
{
	if (OccupiedFleetSize() + StaticData[name].Size() * n <= SaveData.FleetSize)
	{
		SaveData[name + "Planned"] = Math.max(0, SaveData[name + "Planned"] + n);
		if (SaveData[name][0].Num > SaveData[name + "Planned"])
		{
			SaveData[name][0].Num = SaveData[name + "Planned"];
			SaveData[name][0].HP = SaveData[name][0].Num > 0 ? 1 : 0;
		}
	}
}

function OnProductionPhase()
{
	if (SaveData.Destroyer[0].Num < SaveData.DestroyerPlanned)
	{
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
	$("#Manpower").text("Manpower: " + Math.floor(SaveData.Manpower) + " + " + Math.floor(StaticData.ManpowerPerSec()) + "/d / " + Math.floor(StaticData.ManpowerMax()));
	$("#Fuel").text("Fuel: " + Math.floor(SaveData.Fuel) + " + " + Math.floor(StaticData.FuelPerSec()) + "/d / " + Math.floor(StaticData.FuelMax()));
	$("#Steel").text("Steel: " + Math.floor(SaveData.Steel) + " + " + Math.floor(StaticData.SteelPerSec()) + "/d / " + Math.floor(StaticData.SteelMax()));
	$("#Bauxite").text("Bauxite: " + Math.floor(SaveData.Bauxite) + " + " + Math.floor(StaticData.BauxitePerSec()) + "/d / " + Math.floor(StaticData.BauxiteMax()));


	$("#Territory").text(UsedTerritory() + " / " + SaveData.Territory);

	//Update Infrastructure Building
	for(var i = 0; i < Buildings.length; i++)
	{
		var building = Buildings[i];
		if (SaveData[building].Num < SaveData[building].Planned)
		{
			var cost = StaticData[building+"BuildCost"]();
			if (SaveData[building].Progress >= 1)
			{
				SaveData[building].Progress = 0;
			}
			if (SaveData[building].Progress == 0)
			{
				if(CheckResource(cost, 1))
				{
					ConsumeResource(cost, 1);
					SaveData[building].Progress = Math.min(SaveData[building].Progress + 0.05 / cost.Time, 1);
				}
			}
			else if (SaveData[building].Progress < 1)
			{
				SaveData[building].Progress = Math.min(SaveData[building].Progress + 0.05 / cost.Time, 1);
				if (SaveData[building].Progress >= 1)
				{
					SaveData[building].Num++;
				}
			}
		}
		$("#"+building).text(building + ": " + SaveData[building].Num + " / " + SaveData[building].Planned);
		$("#"+building+"Progress").attr("value",SaveData[building].Progress);
	}

	$("#FleetSize").text("FleetSize: " + OccupiedFleetSize() + " / " + SaveData.FleetSize);

	//Update Ship Production
	if(SaveData.BattlePhase == 0)
	{
		for(var i = 0; i < 1/*Ships.length*/; i++)
		{
			var ship = Ships[i];
			if (SaveData[ship][0].Num <= SaveData[ship+"Planned"])
			{
				var cost = StaticData[ship].Cost();
				if (SaveData[ship][0].HP < 1 && SaveData[ship][0].Num > 0)
				{
					SaveData[ship][0].HP = Math.min(SaveData[ship][0].HP + 0.05 / cost.Time, 1);
				}
				else if (SaveData[ship][0].Num < SaveData[ship+"Planned"])
				{
					if(CheckResource(cost, 1))
					{
						ConsumeResource(cost, 1);
						SaveData[ship][0].HP = 0;
						SaveData[ship][0].Num++;
					}
				}
			}
			$("#"+ship).text(ship + ": " + SaveData[ship][0].Num + " / " + SaveData[ship+"Planned"]);
			$("#"+ship+"HP").attr("value",SaveData[ship][0].HP);
		}
	}


	$("#Cruiser").text("Cruiser: " + SaveData.Cruiser[0].Num + " / " + SaveData.CruiserPlanned);
	$("#Battleship").text("Battleship: " + SaveData.Battleship[0].Num + " / " + SaveData.BattleshipPlanned);
	$("#Carrier").text("Carrier: " + SaveData.Carrier[0].Num + " / " + SaveData.CarrierPlanned);
	$("#Submarine").text("Submarine: " + SaveData.Submarine[0].Num + " / " + SaveData.SubmarinePlanned);
}

function OnInit()
{
	var buildingTable = $("#Buildings");
	for(i = 0; i < Buildings.length; i++)
	{
		var building = Buildings[i];
		buildingTable.append("<tr>\n\
			<td id='" + building + "'></td>\n\
			<td rowspan=2><button onclick=OnBuildBuilding('" + building + "',1)>+</button></td>\n\
			<td rowspan=2><button onclick=OnBuildBuilding('" + building + "',-1)>-</button></td>\n\
			</tr>\n\
			<tr>\n\
			<td><progress value=1 id='" + building + "Progress'></progress></td>\n\
			</tr>\n");
	}
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
	OnInit();
	OnRender();
	setInterval(OnRender, 50);
	setInterval(OnTick, 1000);
	setInterval(OnSave, 1000 * 300);
})
