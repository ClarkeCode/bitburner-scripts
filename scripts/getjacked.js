/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	
	var fl = ns.flags([
		["lowest", false],
		["robin", false],
		["interval", 15000]
	]);

	function lowestStat() {
		var player = ns.getPlayer();
		// var strxp = player.strength
		var lowestCombatStat = Math.min(player.strength, player.defense, player.dexterity, player.agility);
		if (player.strength == lowestCombatStat) return "strength";
		else if (player.defense == lowestCombatStat) return "defense";
		else if (player.dexterity == lowestCombatStat) return "dexterity";
		else /*(player.agility == lowestCombatStat)*/ return "agility";
	}

	var x = 0;
	function roundRobin() {
		const stats = ["strength", "defense", "dexterity", "agility"];
		var output = stats[x++];
		x %= 4;
		return output;
	}
	
	var statPickingFunction = ((fl.lowest === false && fl.robin === false) || fl.lowest) ? lowestStat : roundRobin;

	try { ns.travelToCity("Sector-12"); } catch {}
	while (true) {
		ns.gymWorkout("Powerhouse Gym", statPickingFunction());
		await ns.sleep(fl.interval);
	}
}