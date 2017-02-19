var SaveData;
var RenderInterval = 0.05;
var TickInterval = 1;

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
	var total = 0;
	for (var ship in StaticData.Ship)
	{
		total += SaveData.Ship[ship][0].Planned * StaticData.Ship[ship][0].Size();
	}
	return total;
}

//Don't call this on the end of last phase, simply do /SaveData.Phase = 0;/
function BattlePhaseStep()
{
	for(var i = 0; i < 2; i++)
	{
		for (var ship in StaticData.Ship)
		{
			if (SaveData.Ship[ship][i].Num > 0)
			{
				SaveData.Phase++;
				return;
			}
		}
	}
	SaveData.Phase = 0;
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

function OnBuildBuilding(name)
{
	if (SaveData.Building[name].Progress == 0)
	{
		var cost = StaticData.Building[name].Cost();
		if(CheckResource(cost, 1))
		{
			ConsumeResource(cost, 1);
			SaveData.Building[name].Progress = Math.min(SaveData.Building[name].Progress + 0.05 / cost.Time, 1);
		}
	}
}

function OnResearchTech(name)
{
	if (SaveData.Technology[name].Progress == 0)
	{
		var cost = StaticData.Technology[name].Cost();
		if(CheckResource(cost, 1))
		{
			ConsumeResource(cost, 1);
			SaveData.Technology[name].Progress = Math.min(SaveData.Technology[name].Progress + 0.05 / cost.Time, 1);
		}
	}
}

function OnBuildShip(name, n)
{
	if (OccupiedFleetSize() + StaticData.Ship[name][0].Size() * n <= StaticData.FleetSize())
	{
		SaveData.Ship[name][0].Planned = Math.max(0, SaveData.Ship[name][0].Planned + n);
		if (SaveData.Ship[name][0].Num > SaveData.Ship[name][0].Planned)
		{
			SaveData.Ship[name][0].Num = SaveData.Ship[name][0].Planned;
			SaveData.Ship[name][0].HP = SaveData.Ship[name][0].Num > 0 ? StaticData.Ship[name][0].HP() : 0;
		}
	}
}

function OnProductionPhase()
{
	for (var ship in StaticData.Ship)
	{
		if (SaveData.Ship[ship][0].Num < SaveData.Ship[ship][0].Planned || SaveData.Ship[ship][0].HP < StaticData.Ship[ship][0].HP())
		{
			return;
		}
	}

	SaveData.Phase++;
}

function OnReconPhase()
{
	SaveData.Initiative = TotalRecon(0) >= TotalRecon(1) ? 0 : 1;

	//Should be no ship loss, skip check
	SaveData.Phase++;
}

function OnAirAttackPhase()
{
	SaveData.Initiative = TotalAirToAirPower(0) >= TotalAirToAirPower(1) ? 0 : 1;

	BattlePhaseStep();
}

function OnSubmarineTorpedoPhase()
{
	BattlePhaseStep();
}

function OnLongRangeFirePhase()
{
	BattlePhaseStep();
}

function OnShortRangeFirePhase()
{
	var a = 1 - SaveData.Initiative;

	var damage = Formula.ShortRangeDamage(SaveData.Initiative);
	var shiploss = Math.floor(damage / 1);

	BattlePhaseStep();
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
	switch(SaveData.Phase)
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
	$("#Manpower").html("M: " + Math.floor(SaveData.Manpower) + "<span class='hidden-xs'> + " + Math.floor(StaticData.ManpowerPerSec()) + "/s / " + Math.floor(StaticData.ManpowerMax()) + "</span>");
	$("#Fuel").html(Math.floor(SaveData.Fuel) + "<span class='hidden-xs'> + " + Math.floor(StaticData.FuelPerSec()) + "/s / " + Math.floor(StaticData.FuelMax()) + "</span>");
	$("#Steel").html(Math.floor(SaveData.Steel) + "<span class='hidden-xs'> + " + Math.floor(StaticData.SteelPerSec()) + "/s / " + Math.floor(StaticData.SteelMax()) + "</span>");
	$("#Bauxite").html(Math.floor(SaveData.Bauxite) + "<span class='hidden-xs'> + " + Math.floor(StaticData.BauxitePerSec()) + "/s / " + Math.floor(StaticData.BauxiteMax()) + "</span>");
	$("#Exp").html(Math.floor(SaveData.Exp));

	$("#Territory").text(SaveData.Territory);

	//Update Infrastructure Building
	for(var building in StaticData.Building)
	{
		var cost = StaticData.Building[building].Cost();
		if (SaveData.Building[building].Progress >= 1)
		{
			SaveData.Building[building].Progress = 0;
			SaveData.Building[building].Num++;
			$("#"+building+"Build").removeAttr("disabled");
		}
		else if (SaveData.Building[building].Progress > 0)
		{
			SaveData.Building[building].Progress = Math.min(SaveData.Building[building].Progress + 0.05 / cost.Time, 1);
			$("#"+building+"Build").attr("disabled", "disabled");
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

		$("#"+building).text(building + ": " + SaveData.Building[building].Num);
		$("#"+building+"Progress").css("width", Math.ceil(SaveData.Building[building].Progress*100) + "%");
	}

	//Update Technology
	for(var tech in StaticData.Technology)
	{
		var cost = StaticData.Technology[tech].Cost();
		if (SaveData.Technology[tech].Progress >= 1)
		{
			SaveData.Technology[tech].Progress = 0;
			SaveData.Technology[tech].Level++;
			$("#"+tech+"Research").removeAttr("disabled");
		}
		else if (SaveData.Technology[tech].Progress > 0)
		{
			SaveData.Technology[tech].Progress = Math.min(SaveData.Technology[tech].Progress + 0.05 / cost.Time, 1);
			$("#"+tech+"Research").attr("disabled", "disabled");
		}
		else
		{
			var researchbutton = $("#"+tech+"Research");
			if(CheckResource(cost, 1))
			{
				researchbutton.removeAttr("disabled");
				researchbutton.text("Research");
			}
			else
			{
				researchbutton.attr("disabled", "disabled");
				researchbutton.text(EstimateTimeToGetResource(cost));
			}
		}

		$("#"+tech).text(tech + ": " + SaveData.Technology[tech].Level);
		$("#"+tech+"Progress").css("width", Math.ceil(SaveData.Technology[tech].Progress*100) + "%");
	}

	//Update Ship Production
	$("#FleetSize").text("FleetSize: " + OccupiedFleetSize() + " / " + StaticData.FleetSize());
	
	if(SaveData.Phase == 0)
	{
		for(var ship in StaticData.Ship)
		{
			if (SaveData.Ship[ship][0].Num <= SaveData.Ship[ship][0].Planned)
			{
				var cost = StaticData.Ship[ship][0].Cost();
				if (SaveData.Ship[ship][0].HP < StaticData.Ship[ship][0].HP() && SaveData.Ship[ship][0].Num > 0)
				{
					var maxhp = StaticData.Ship[ship][0].HP();
					SaveData.Ship[ship][0].HP = Math.min(SaveData.Ship[ship][0].HP + 0.05 / cost.Time * maxhp, maxhp);
				}
				else if (SaveData.Ship[ship][0].Num < SaveData.Ship[ship][0].Planned)
				{
					if(CheckResource(cost, 1))
					{
						ConsumeResource(cost, 1);
						SaveData.Ship[ship][0].HP = 0;
						SaveData.Ship[ship][0].Num++;
					}
				}
			}
			$("#"+ship).text(ship + ": " + SaveData.Ship[ship][0].Num + " / " + SaveData.Ship[ship][0].Planned);
			$("#"+ship+"HP").attr("value",SaveData.Ship[ship][0].HP / StaticData.Ship[ship][0].HP());
		}
	}
}

function OnInit()
{
	var buildingTable = $("#Build");
	for (var building in StaticData.Building)
	{
		buildingTable.append("<div class='btn-group btn-block' role='group'>\n" +
			"  <button type='button' class='btn btn-default' style='width: 70%' id='" + building + "' data-toggle='collapse' data-target='#" + building + "Detail'></button>\n" +
			"  <button type='button' class='btn btn-primary' style='width: 30%' id='" + building + "Build' onclick=OnBuildBuilding('" + building + "')>Build</button>\n" +
			"</div>\n" +
			"<div class='progress progress-striped active'>\n" +
			"  <div class='progress-bar progress-bar-warning' role='progressbar' style='width: 80%;' id='" + building + "Progress'></div>\n" +
			"</div>\n" +
			"<div class='collapse' id='" + building + "Detail'><div class='well'><small>\n" +
			"	  <u>Detail info here</u>\n" +
			"	</small></div></div>\n");
	}

	var researchTable = $("#Research");
	for (var tech in StaticData.Technology)
	{
		researchTable.append("<div class='btn-group btn-block' role='group'>\n" +
			"  <button type='button' class='btn btn-default' style='width: 65%' id='" + tech + "' data-toggle='collapse' data-target='#" + tech + "Detail'></button>\n" +
			"  <button type='button' class='btn btn-primary' style='width: 35%' id='" + tech + "Research' onclick=OnResearchTech('" + tech + "')>Research</button>\n" +
			"</div>\n" +
			"<div class='progress progress-striped active'>\n" +
			"  <div class='progress-bar progress-bar-warning' role='progressbar' style='width: 80%;' id='" + tech + "Progress'></div>\n" +
			"</div>\n" +
			"<div class='collapse' id='" + tech + "Detail'><div class='well'><small>\n" +
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
