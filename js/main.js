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
	while(n >= 10000 && suffixid < suffix.length)
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

function BattlePhaseStep()
{
	if (SaveData.Phase == 0)
	{
		if (OccupiedFleetSize() <= 0)
		{
			return;
		}
		for (var ship in StaticData.Ship)
		{
			if (SaveData.Ship[ship][0].Planned > 0 && 
				(SaveData.Ship[ship][0].Num < SaveData.Ship[ship][0].Planned || SaveData.Ship[ship][0].HP < StaticData.Ship[ship][0].HP()))
			{
				return;
			}
		}
		SaveData.Phase++;
		RenderPhase();
	}
	else
	{
		//Check if enemy all destroyed
		var alldestroyed = true;
		for (var ship in StaticData.Ship)
		{
			if (SaveData.Ship[ship][1].Num > 0)
			{
				alldestroyed = false;
				break;
			}
		}
		if (alldestroyed)
		{
			SaveData.Phase = 0;
			SaveData.Exp += StaticData.ExpPerBattle(true);		//Add exp before go to next area
			SaveData.WorldArea++;
			Formula.GenerateEnemy();
			RenderPhase();
			return;		//In this case, we don't care how many ally ships survived, just go back and repair ships
		}

		//Check if ally all destroyed
		alldestroyed = true;
		for (var ship in StaticData.Ship)
		{
			if (SaveData.Ship[ship][0].Num > 0)
			{
				alldestroyed = false;
				break;
			}
		}
		if (alldestroyed)
		{
			SaveData.Phase = 0;
			SaveData.Exp += StaticData.ExpPerBattle(false);
		}
		else
		{
			SaveData.Phase++;
			if (SaveData.Phase > 6)
			{
				SaveData.Phase = 0;
				SaveData.Exp += StaticData.ExpPerBattle(false);
			}
		}
		RenderPhase();
	}
}

function TotalAttackCount(attacker, weaponused)
{
	for (var weapon in weaponused)
	{
		for (var ship in StaticData.Ship)
		{
			weaponused[weapon] += Formula.GetEquipNum(attacker, ship, weapon) * SaveData.Ship[ship][attacker].Num * StaticData.Equip[weapon][attacker].Rounds();
		}
	}

	return weaponused;
}

function CalculateShipLoss(damage, side, ship)
{
	var maxhp = StaticData.Ship[ship][side].HP();
	var shiploss = Math.floor(damage / maxhp);
	var extradamage = damage - shiploss * maxhp;

	var saveship = SaveData.Ship[ship][side];
	saveship.Num -= shiploss;
	saveship.HP -= extradamage;
	if (saveship.HP <= 0)
	{
		saveship.HP += maxhp;
		saveship.Num--;
	}
	if (saveship.Num <= 0)
	{
		saveship.Num = 0;
		saveship.HP = 0;
	}
}

function Attack(phase, attacker)
{
	var weaponused = Formula.WeaponsUsed(phase);
	var totalattackcount = TotalAttackCount(attacker, weaponused);
	return totalattackcount;
}

function Hit(phase, attacker, totalattackcount)
{
	var weights = Formula.CalculateDamageWeight(1 - attacker);
	
	for (var ship in weights)
	{
		if (weights[ship] > 0)
		{
			var damagetext = "";
			for (var weapon in totalattackcount)
			{
				if (totalattackcount[weapon] > 0)
				{
					var damage = Formula.CalculateDamagePerAttack(attacker, weapon, ship);
					var totalhit = Formula.CalculateHitRate(attacker, weapon, ship, totalattackcount[weapon] * weights[ship]);
					var totaldamage = totalhit * damage;
					CalculateShipLoss(totaldamage, 1 - attacker, ship);
					damagetext += (" -" + ShortNumber(damage) + " * " + ShortNumber(totalhit));
				}
			}
			var display = attacker == 0 ? $("#Enemy" + ship + "Damage") : $("#" + ship + "Damage");
			display.text(damagetext);
			display.show();
			display.fadeOut(1000);
		}
	}
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
}

function OnReconPhase()
{
	SaveData.Initiative = Formula.TotalRecon(0) >= Formula.TotalRecon(1) ? 0 : 1;
}

function OnAirAttackPhase()
{
	SaveData.Initiative = Formula.TotalAirToAir(0) >= Formula.TotalAirToAir(1) ? 0 : 1;
}

function OnSubmarineTorpedoPhase()
{

}

function OnLongRangeFirePhase()
{

}

function OnShortRangeFirePhase()
{
	var totalattack0 = Attack(5, 0);
	var totalattack1 = Attack(5, 1);
	Hit(5, 0, totalattack0);
	Hit(5, 1, totalattack1);
}

function OnTorpedoPhase()
{
	var totalattack0 = Attack(6, 0);
	var totalattack1 = Attack(6, 1);
	Hit(6, 0, totalattack0);
	Hit(6, 1, totalattack1);
}

function OnTick()
{
	//Update Resources
	SaveData.Manpower = Math.min(StaticData.ManpowerMax(), SaveData.Manpower + StaticData.ManpowerPerSec());
	SaveData.Fuel = Math.min(StaticData.FuelMax(), SaveData.Fuel + StaticData.FuelPerSec());
	SaveData.Steel = Math.min(StaticData.SteelMax(), SaveData.Steel + StaticData.SteelPerSec());
	SaveData.Bauxite = Math.min(StaticData.BauxiteMax(), SaveData.Bauxite + StaticData.BauxitePerSec());

	BattlePhaseStep();

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

function RenderPhase()
{
	for (var i = 0; i < 7; i++)
	{
		$("#Phase" + i).removeClass("btn-danger");
		$("#Phase" + i).addClass("btn-default");
	}
	$("#Phase" + SaveData.Phase).removeClass("btn-default");
	$("#Phase" + SaveData.Phase).addClass("btn-danger");
}

function OnRender()
{
	$("#Manpower").html("M: " + ShortNumber(Math.floor(SaveData.Manpower)) + "<span class='hidden-xs'> + " + Math.floor(StaticData.ManpowerPerSec()) + "/s / " + ShortNumber(Math.floor(StaticData.ManpowerMax())) + "</span>");
	$("#Fuel").html(ShortNumber(Math.floor(SaveData.Fuel)) + "<span class='hidden-xs'> + " + Math.floor(StaticData.FuelPerSec()) + "/s / " + ShortNumber(Math.floor(StaticData.FuelMax())) + "</span>");
	$("#Steel").html(ShortNumber(Math.floor(SaveData.Steel)) + "<span class='hidden-xs'> + " + Math.floor(StaticData.SteelPerSec()) + "/s / " + ShortNumber(Math.floor(StaticData.SteelMax())) + "</span>");
	$("#Bauxite").html(ShortNumber(Math.floor(SaveData.Bauxite)) + "<span class='hidden-xs'> + " + Math.floor(StaticData.BauxitePerSec()) + "/s / " + ShortNumber(Math.floor(StaticData.BauxiteMax())) + "</span>");
	$("#Exp").html(ShortNumber(Math.floor(SaveData.Exp)));
	$("#Territory").text(StaticData.Territory());

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
	var area = StaticData.CombatRegion();
	$("#WorldArea").text("World Area: " + area[0] + "-" + area[1]);
	$("#FleetSize").text("FleetSize: " + OccupiedFleetSize() + " / " + StaticData.FleetSize());

	for(var ship in StaticData.Ship)
	{
		if (SaveData.Phase == 0)
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
		}
		$("#"+ship).text(ship + ": " + SaveData.Ship[ship][0].Num + " / " + SaveData.Ship[ship][0].Planned);
		$("#"+ship+"HP").css("width", Math.ceil(SaveData.Ship[ship][0].HP / StaticData.Ship[ship][0].HP()*100) + "%");
		$("#"+ship+"HPDetail").text("HP: " + ShortNumber(StaticData.Ship[ship][0].HP()) + " * " + SaveData.Ship[ship][0].Num);
		$("#Enemy"+ship).text(ship + ": " + SaveData.Ship[ship][1].Num);
		$("#Enemy"+ship+"HP").css("width", Math.ceil(SaveData.Ship[ship][1].HP / StaticData.Ship[ship][1].HP()*100) + "%");
		$("#Enemy"+ship+"HPDetail").text("HP: " + ShortNumber(StaticData.Ship[ship][1].HP()) + " * " + SaveData.Ship[ship][1].Num);
	}
}

function OnInit()
{
	var buildingTable = $("#Build");
	for (var building in StaticData.Building)
	{
		buildingTable.append("<div class='btn-group btn-block btn-group-sm' role='group'>\n" +
			"  <button type='button' class='btn btn-default info' style='width: 80%' id='" + building + "' data-toggle='collapse' data-target='#" + building + "Detail'></button>\n" +
			"  <button type='button' class='btn btn-primary' style='width: 20%' id='" + building + "Build' onclick=OnBuildBuilding('" + building + "')>Build</button>\n" +
			"</div>\n" +
			"<div class='progress progress-striped active'>\n" +
			"  <div class='progress-bar progress-bar-warning notransition' role='progressbar' style='width: 80%;' id='" + building + "Progress'></div>\n" +
			"</div>\n" +
			"<div class='collapse' id='" + building + "Detail'><div class='well'><small>\n" +
			"	  <u>Detail info here</u>\n" +
			"	</small></div></div>\n");
	}

	var researchTable = $("#Research");
	for (var tech in StaticData.Technology)
	{
		researchTable.append("<div class='btn-group btn-block btn-group-sm' role='group'>\n" +
			"  <button type='button' class='btn btn-default info' style='width: 80%' id='" + tech + "' data-toggle='collapse' data-target='#" + tech + "Detail'></button>\n" +
			"  <button type='button' class='btn btn-primary' style='width: 20%' id='" + tech + "Research' onclick=OnResearchTech('" + tech + "')>Research</button>\n" +
			"</div>\n" +
			"<div class='progress progress-striped active'>\n" +
			"  <div class='progress-bar progress-bar-warning notransition' role='progressbar' style='width: 80%;' id='" + tech + "Progress'></div>\n" +
			"</div>\n" +
			"<div class='collapse' id='" + tech + "Detail'><div class='well'><small>\n" +
			"	  <u>Detail info here</u>\n" +
			"	</small></div></div>\n");
	}

	RenderPhase();

	var allyShipTable = $("#Ally");
	var enemyShipTable = $("#Enemy");
	for (var ship in StaticData.Ship)
	{
		allyShipTable.append("<div class='btn-group btn-block btn-group-sm' role='group'>\n" +
			"  <button type='button' class='btn btn-danger' style='width: 15%' onclick=OnBuildShip('" + ship + "',-1)>-</button>\n" +
			"  <button type='button' class='btn btn-default info' style='width: 70%' id='" + ship + "' data-toggle='collapse' data-target='#" + ship + "Detail'></button>\n" +
			"  <button type='button' class='btn btn-primary' style='width: 15%' onclick=OnBuildShip('" + ship + "',1)>+</button>\n" +
			"</div>\n" +
			"<div class='progress'>\n" +
			"  <div class='progress-bar progress-bar-success notransition' role='progressbar' style='width: 80%;' id='" + ship + "HP'></div>\n" +
			"</div>\n" +
			"<div class='collapse' id='" + ship + "Detail'><div class='well'><small>\n" +
			"	  <u>Detail info here</u>\n" +
			"	</small></div></div>\n" + 
			"<div><span id='" + ship + "HPDetail'></span><span class='text-danger' id='" + ship + "Damage' style='display: none'>-</span></div>\n");

		enemyShipTable.append("<div class='btn-group btn-block btn-group-sm' role='group'>\n" +
			"  <button type='button' class='btn btn-default info' style='width: 100%' id='Enemy" + ship + "' data-toggle='collapse' data-target='#Enemy" + ship + "Detail'></button>\n" +
			"</div>\n" +
			"<div class='progress'>\n" +
			"  <div class='progress-bar progress-bar-success' role='progressbar' style='width: 80%;' id='Enemy" + ship + "HP'></div>\n" +
			"</div>\n" +
			"<div class='collapse' id='Enemy" + ship + "Detail'><div class='well'><small>\n" +
			"	  <u>Detail info here</u>\n" +
			"	</small></div></div>\n" + 
			"<div><span id='Enemy" + ship + "HPDetail'></span><span class='text-danger' id='Enemy" + ship + "Damage' style='display: none'>-</span></div>\n");
	}
}

function Reset()
{
	SaveData = JSON.parse(JSON.stringify(SaveDataInit));
	Formula.GenerateEnemy();
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
		Reset();
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
