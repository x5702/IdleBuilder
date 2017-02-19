Formula = {
	GenerateEnemy : function() {
		for (var ship in StaticData.Ship)
		{
			SaveData.Ship[ship][1].Num = SaveData.WorldArea * 5;
			SaveData.Ship[ship][1].HP = SaveData.Ship[ship][1].HP();
			//SaveData.Ship[ship][1].Equip = [
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

	WeaponsUsed : function(phase)	{
		switch(phase)
		{
			case 1: 	//Recon
				return {HeavyGun: false, LightGun: false, Torpedo: false, SubmarineTorpedo: false, DepthCharge: false, Fighter: false, Bomber: false, TorpedoBomber: false};
			case 2: 	//Air
				return {HeavyGun: false, LightGun: false, Torpedo: false, SubmarineTorpedo: false, DepthCharge: false, Fighter: true, Bomber: true, TorpedoBomber: true};
			case 3: 	//Submarine and anti-sub
				return {HeavyGun: false, LightGun: false, Torpedo: false, SubmarineTorpedo: true, DepthCharge: true, Fighter: false, Bomber: false, TorpedoBomber: false};
			case 4: 	//Long
				return {HeavyGun: true, LightGun: false, Torpedo: false, SubmarineTorpedo: false, DepthCharge: false, Fighter: false, Bomber: false, TorpedoBomber: false};
			case 5: 	//Short
				return {HeavyGun: true, LightGun: true, Torpedo: false, SubmarineTorpedo: false, DepthCharge: false, Fighter: false, Bomber: true, TorpedoBomber: true};
			case 6: 	//Torpedo
				return {HeavyGun: false, LightGun: false, Torpedo: true, SubmarineTorpedo: true, DepthCharge: false, Fighter: false, Bomber: false, TorpedoBomber: false};
			default:
				return {HeavyGun: false, LightGun: false, Torpedo: false, SubmarineTorpedo: false, DepthCharge: false, Fighter: false, Bomber: false, TorpedoBomber: false};
		}
	},

	CalculateDamageWeight : function(side) {
		var weight = {Destroyer: 1, Cruiser: 2, Battleship: 5, Carrier: 4, Submarine : 0};
		var totalWeight = 0;
		for (var ship in StaticData.Ship)
		{
			weight[ship] *= SaveData.Ship[ship][side].Num;
			totalWeight += weight[ship];
		}
		for (var ship in StaticData.Ship)
		{
			weight[ship] /= totalWeight;
		}
		return weight;
	},

	CalculateDamagePerAttack : function(attackside, equip, victimship) {
		var weapon = StaticData.Equip[equip][attackside];
		var target = StaticData.Ship[victimship][1-attackside];
		var damage = Math.max((weapon.Attack() - target.Defend() * (1 - weapon.Piercing())), weapon.Attack() * 0.01);
		var hitRate = weapon.Accuracy() * (1 - target.Evade() * weapon.Evadable());
		return damage * hitRate;
	},
};