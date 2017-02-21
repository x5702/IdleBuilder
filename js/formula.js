const Formula = {
	GenerateEnemy : function() {
		for (var ship in StaticData.Ship)
		{
			
			//Ship Num Increase for each 25 Level in WorldArea.
			SaveData.Ship[ship][1].Num = StaticData.Ship[ship][1].Size();
			
			if (SaveData.Ship[ship][1].Num > 0)
			{
				//Ship HP increase per 5 Level
				SaveData.Ship[ship][1].HP = StaticData.Ship[ship][1].HP();
			}
			else
			{
				SaveData.Ship[ship][1].HP = 0;
			}
			//SaveData.Ship[ship][1].Equip = [
			//	"LightGun",
			//	"Torpedo",
			//];
		}
	},

	TotalRecon : function(side) {
		return 0;
	},

	TotalAirToAir : function(side) {
		return 0;
	},

	TotalShipAntiAir : function(side) {
		return 0;
	},

	WeaponsUsed : function(phase)	{
		switch(phase)
		{
			case 1: 	//Recon
				return {};
			case 2: 	//Air
				return {}; //{Fighter: 0, Bomber: 0, TorpedoBomber: 0};
			case 3: 	//Submarine and anti-sub
				return {}; //{SubmarineTorpedo: 0, DepthCharge: 0};
			case 4: 	//Long
				return {}; //{BattleshipMainGun: 0};
			case 5: 	//Short
				return {DestroyerGun: 0}; //{BattleshipMainGun: 0, BattleshipSubGun: 0, CruiserGun: 0, DestroyerGun: 0};
			case 6: 	//Torpedo
				return {DestroyerTorpedo: 0}; //{DestroyerTorpedo: 0, CruiserTorpedo: 0, SubmarineTorpedo: 0};
			default:
				return {};
		}
	},

	GetEquipNum : function(attacker, ship, equip)	{
		if (ship == "Destroyer")
		{
			if (equip == "DestroyerGun" || equip == "DestroyerTorpedo" || equip == "DepthCharge")
			{
				return 1;
			}
		}
		else if (ship == "Cruiser")
		{
			if (equip == "CruiserGun" || equip == "CruiserTorpedo")
			{
				return 2;
			}
		}
		else if (ship == "Battleship")
		{
			if (equip == "BattleshipMainGun" || equip == "BattleshipSubGun")
			{
				return 3;
			}
		}
		else if (ship == "Carrier")
		{
			if (equip == "Fighter" || equip == "Bomber" || equip == "TorpedoBomber")
			{
				return 2;
			}
		}
		else if (ship == "Submarine")
		{
			if (equip == "SubmarineTorpedo")
			{
				return 1;
			}
		}
		return 0;		//default
	},

	CalculateDamageWeight : function(side) {
		var weight = {Destroyer: 1, Cruiser: 1, Battleship: 1, Carrier: 1, Submarine : 0};
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
		damage = Math.min(damage, target.HP()); //Overkill
		return damage;
	},
};