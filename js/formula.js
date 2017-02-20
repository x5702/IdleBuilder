const Formula = {
	GenerateEnemy : function() {
		for (var ship in StaticData.Ship)
		{
			
			//Ship Num Increase for each 25 Level in WorldArea.
			SaveData.Ship[ship][1].Num = StaticData.Ship[ship][1].Size();
			
			//Ship HP increase per 5 Level
			SaveData.Ship[ship][1].HP = StaticData.Ship[ship][1].HP();
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

	GetEquipNum : function(attacker, ship, equip)	{
		if (ship == "Destroyer")
		{
			if (equip == "LightGun" || equip == "Torpedo")
			{
				return 1;
			}
		}
		else if (ship == "Cruiser")
		{
			if (equip == "LightGun" || equip == "Torpedo")
			{
				return 2;
			}
		}
		else if (ship == "Battleship")
		{
			if (equip == "HeavyGun" || equip == "LightGun")
			{
				return 3;
			}
		}
		else if (ship == "Carrier")
		{
			if (equip == "Fighter" || equip == "Bomber")
			{
				return 2;
			}
		}
		else if (ship == "Submarine")
		{
			if (equip == "Torpedo")
			{
				return 1;
			}
		}
		return 0;		//default
	},

	CalculateDamageWeight : function(side) {
		var weight = {Destroyer: 1}; //, Cruiser: 1, Battleship: 1, Carrier: 1, Submarine : 0};
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

	CalculateHitRate : function(attackside, equip, victimship) {
		var weapon = StaticData.Equip[equip][attackside];
		var target = StaticData.Ship[victimship][1-attackside];
		var reconBonus = SaveData.Initiative == attackside ? 1.2 : 0.8;
		var hitRate = reconBonus * weapon.Accuracy() * (1 - target.Evade() * weapon.Evadable());
		var randomness = 1 + (Math.random() - 0.5) * 0.2;		//Research to decrease scatter area?? increase critical???
		return Math.min(Math.max(hitRate*randomness, 0), 1);
	},

	CalculateDamagePerAttack : function(attackside, equip, victimship) {
		var weapon = StaticData.Equip[equip][attackside];
		var target = StaticData.Ship[victimship][1-attackside];
		var damage = Math.max((weapon.Attack() - target.Defend() * (1 - weapon.Piercing())), weapon.Attack() * 0.01);
		return damage;
	},
};