Formula = {
	GenerateEnemy : function() {
		for (var ship in StaticData.Ship)
		{
			SaveData.Ship[ship][1].Num = SaveData.WorldArea * 5;
			SaveData.Ship[ship][1].HP = SaveData.Ship[ship][1].HP;
			//SaveData.Ship[1].Destroyer.Equip = [
			//	"LightGun",
			//	"Torpedo",
			//];
		}
	},

	TotalRecon : function(side) {
		return 0;
	},

	TotalAirToAirPower : function(side) {
		return 0;
	},

	SubTorpedoDamage : function(side) {
		var result = {};
		for (var attacker in StaticData.Ship)
		{
			for (var victim in StaticData.Ship)
			{
				result[victim] = 0;
			}
		}
		return result;
	},

	LongRangeDamage : function(side) {
		var result = {};
		for (var attacker in StaticData.Ship)
		{
			for (var victim in StaticData.Ship)
			{
				result[victim] = 0;
			}
		}
		return result;
	},

	ShortRangeDamage : function(side) {
		var result = {};
		for (var attacker in StaticData.Ship)
		{
			for (var victim in StaticData.Ship)
			{
				var weapon = StaticData.LightGun;
				var weaponNum = 1;	//Todo: Calculate the number of equiped weapons per ship from savedata
				var target = StaticData[victim];
				var damagePerShell = Math.max((weapon.Attack() - target.Defend() * (1 - weapon.Piercing())), 1);
				var hitRate = weapon.Accuracy() * (1 - target.Evade() * weapon.Evadable());
				//Todo: Consider target priority
				var damage = damagePerShell * hitRate * weapon.Speed() * gunNum * SaveData.Ship[side].Num;
				result[victim] = damage;
			}
		}
		return result;
	},

	TorpedoDamage : function(side) {
		var result = {};
		for (var attacker in StaticData.Ship)
		{
			for (var victim in StaticData.Ship)
			{
				var weapon = StaticData.Torpedo;
				var weaponNum = 1;	//Todo: Calculate the number of equiped weapons per ship from savedata
				var target = StaticData[victim];
				var damagePerShell = Math.max((weapon.Attack() - target.Defend() * (1 - weapon.Piercing())), 1);
				var hitRate = weapon.Accuracy() * (1 - target.Evade() * weapon.Evadable());
				var damage = damagePerShell * hitRate * weapon.Speed() * gunNum * SaveData.Ship[side].Num;
				result[victim] = damage;
			}
		}
		return result;
	},
};