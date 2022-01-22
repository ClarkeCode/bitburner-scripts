async function workOut(ns, fl) {
	function lowestStat() {
		const player = ns.getPlayer();
		const lowestCombatStat = Math.min(player.strength, player.defense, player.dexterity, player.agility);
		if (player.strength == lowestCombatStat) return "strength";
		else if (player.defense == lowestCombatStat) return "defense";
		else if (player.dexterity == lowestCombatStat) return "dexterity";
		else /*(player.agility == lowestCombatStat)*/ return "agility";
	}

	let x = 0;
	function roundRobin() {
		const stats = ["strength", "defense", "dexterity", "agility"];
		let output = stats[x++];
		x %= 4;
		return output;
	}
	
	const statPickingFunction = ((fl.lowest === false && fl.robin === false) || fl.lowest) ? lowestStat : roundRobin;

	try { ns.travelToCity("Sector-12"); } catch {}
	while (true) {
		ns.gymWorkout("Powerhouse Gym", statPickingFunction());
		await ns.sleep(fl.interval);
	}
}

/** @param {NS} ns **/
function researchHacking(ns) {
	try { ns.travelToCity("Aevum"); } catch {}
	ns.universityCourse("Summit University", "Algorithms");
}

/** @param {NS} ns **/
function researchChad(ns) {
	try { ns.travelToCity("Aevum"); } catch {}
	ns.universityCourse("Summit University", "Leadership");
}

/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	
	const fl = ns.flags([
		["lowest", false],
		["robin", false],
		["interval", 15000],
		["library", false],
		["chad", false]
	]);

	if (fl.library) { researchHacking(ns); return; }
	if (fl.chad) { researchChad(ns); return; }

	await workOut(ns, fl);
}