//Helper Structure
var Buildings = [
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

var SaveData;

//Utility Functions
function TimeDisplay(sec)
{
	sec = Math.floor(sec);
	var h = Math.floor(sec / 3600);
	var m = Math.floor((sec % 3600) / 60);
	var s = sec % 60;
	var hs = (h > 0) ? (h + "h") : "";
	var ms = (h > 0 || m > 0) ? (m + "m") : "";
	var ss = s + "s";
	return hs + ms + ss;
}

function ShortNumber(n)
{
	var suffix = ['', 'K', 'M', 'B', 'T'];
	var suffixid = 0;
	while(n >= 1000 && suffixid < suffix.length)
	{
		n = n / 1000;
		suffixid++;
	}
	return Math.floor(n*10)/10 + suffix[suffixid];
}

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

function EstimateTimeToGetResource(cost)
{
	if (cost.Manpower > StaticData.ManpowerMax() || 
		cost.Fuel > StaticData.FuelMax() || 
		cost.Steel > StaticData.SteelMax() || 
		cost.Bauxite > StaticData.BauxiteMax() )
	{
		return "inf";
	}
	else
	{
		var time = Math.max((cost.Manpower - SaveData.Manpower) / StaticData.ManpowerPerSec(), (cost.Fuel - SaveData.Fuel) / StaticData.FuelPerSec());
		time = Math.max(time, (cost.Steel - SaveData.Steel) / StaticData.SteelPerSec());
		time = Math.max(time, (cost.Bauxite - SaveData.Bauxite) / StaticData.BauxitePerSec());
		return TimeDisplay(Math.ceil(time));
	}
}

function OccupiedFleetSize()
{
	return SaveData.DestroyerPlanned * StaticData.Destroyer.Size();
}

//UI stuff
function CopyToClipboard(selector)
{
  var copyTextarea = $(selector);
  copyTextarea.select();
  document.execCommand('copy');
}

function OnTab(name)
{
	$(".tab").addClass("hidden-xs");
	$("#" + name).removeClass("hidden-xs");
}

function OnBuildBuilding(name, n)
{
	if (SaveData[name].Progress == 0)
	{
		var cost = StaticData[name+"BuildCost"]();
		if(CheckResource(cost, 1))
		{
			ConsumeResource(cost, 1);
			SaveData[name].Progress = Math.min(SaveData[name].Progress + 0.05 / cost.Time, 1);
			$("#"+name+"Build").attr("disabled", "disabled");
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
	$("#Manpower").html("M: " + Math.floor(SaveData.Manpower) + "<span class='hidden-xs'> + " + Math.floor(StaticData.ManpowerPerSec()) + "/d / " + Math.floor(StaticData.ManpowerMax()) + "</span>");
	$("#Fuel").html(Math.floor(SaveData.Fuel) + "<span class='hidden-xs'> + " + Math.floor(StaticData.FuelPerSec()) + "/d / " + Math.floor(StaticData.FuelMax()) + "</span>");
	$("#Steel").html(Math.floor(SaveData.Steel) + "<span class='hidden-xs'> + " + Math.floor(StaticData.SteelPerSec()) + "/d / " + Math.floor(StaticData.SteelMax()) + "</span>");
	$("#Bauxite").html(Math.floor(SaveData.Bauxite) + "<span class='hidden-xs'> + " + Math.floor(StaticData.BauxitePerSec()) + "/d / " + Math.floor(StaticData.BauxiteMax()) + "</span>");
	$("#Exp").html(Math.floor(SaveData.Exp));

	$("#Territory").text(SaveData.Territory);

	//Update Infrastructure Building
	for(var i = 0; i < Buildings.length; i++)
	{
		var building = Buildings[i];

		var cost = StaticData[building+"BuildCost"]();
		if (SaveData[building].Progress >= 1)
		{
			SaveData[building].Progress = 0;
			SaveData[building].Num++;
			$("#"+building+"Build").removeAttr("disabled");
		}
		else if (SaveData[building].Progress > 0)
		{
			SaveData[building].Progress = Math.min(SaveData[building].Progress + 0.05 / cost.Time, 1);
		}
		else
		{
			var buildbutton = $("#"+building+"Build");
			if(CheckResource(cost, 1))
			{
				buildbutton.removeAttr("disabled");
				buildbutton.text("Build");
			}
			else
			{
				buildbutton.attr("disabled", "disabled");
				buildbutton.text(EstimateTimeToGetResource(cost));
			}
		}

		$("#"+building).text(building + ": " + SaveData[building].Num);
		$("#"+building+"Progress").css("width", Math.ceil(SaveData[building].Progress*100) + "%");
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
	var buildingTable = $("#Build");
	for(i = 0; i < Buildings.length; i++)
	{
		var building = Buildings[i];
		buildingTable.append("<div class='btn-group btn-block' role='group'>\n" +
			"  <button type='button' class='btn btn-default' style='width: 70%' id='" + building + "' data-toggle='collapse' data-target='#" + building + "Detail'></button>\n" +
			"  <button type='button' class='btn btn-primary' style='width: 30%' id='" + building + "Build' onclick=OnBuildBuilding('" + building + "',1)>Build</button>\n" +
			"</div>\n" +
			"<div class='progress progress-striped active'>\n" +
			"  <div class='progress-bar progress-bar-warning' role='progressbar' style='width: 80%;' id='" + building + "Progress'></div>\n" +
			"</div>\n" +
			"<div class='collapse' id='" + building + "Detail'><div class='well'><small>\n" +
			"	  <u>Detail info here</u>\n" +
			"	</small></div></div>\n");
	}
}

function Reset()
{
	SaveData = JSON.parse(JSON.stringify(SaveDataInit));
}

function OnSave()
{
	var string = JSON.stringify(SaveData);
	string = LZString.compressToEncodedURIComponent(string);
	localStorage.setItem("IdleBuilderSave", string);
	var savedtext = $("#Saved");
	savedtext.show();
	savedtext.fadeOut(2000);
}

function OnLoad()
{
	var string = localStorage.getItem("IdleBuilderSave");
	if (string)
	{
		string = LZString.decompressFromEncodedURIComponent(string);
		SaveData = JSON.parse(string);
	}
	else
	{
		SaveData = JSON.parse(JSON.stringify(SaveDataInit));
	}
}

function OnImport(selector)
{
	var string = $(selector).val();
	if (string)
	{
		string = LZString.decompressFromEncodedURIComponent(string);
		SaveData = JSON.parse(string);
	}
}

$('#ModalExport').on('show.bs.modal', function (event) {
	var string = localStorage.getItem("IdleBuilderSave");
	if (string)
	{
		var textarea = $("#ModalExport textarea");
		textarea.val(string);
		textarea.select();
	}
});

$("#ModalImport").on("show.bs.modal", function (event) {
  $("#ModalImport textarea").val("");
});

window.addEventListener("load", function(){
	OnLoad();
	OnInit();
	OnRender();
	setInterval(OnRender, 50);
	setInterval(OnTick, 1000);
	setInterval(OnSave, 1000 * 300);
});
