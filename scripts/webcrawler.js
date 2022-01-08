import { allServers } from "./survey.js";

/** @param {NS} ns **/
function _pwnString(ns, canHack, target) {
	return ns.sprintf("%s%s", canHack ? "y" : "n", ns.hasRootAccess(target) ? "*" : " ");
}

/** @param {NS} ns **/
export async function main(ns) {
	// ns.tail();
	// ns.disableLog("ALL");
	var minLevel = ns.args[0] == undefined ? 1 : ns.args[0];
	var maxLevel = ns.args[1] == undefined ? (ns.getHackingLevel() < 1000 ? ns.getHackingLevel()+100 : 99999999) : ns.args[1];
	ns.tprintf("\n\nWEBCRAWLER -> START");

	var servers = (await allServers(ns)).sort((a, b) => a.requiredHackingSkill - b.requiredHackingSkill).filter(
		serv => serv.requiredHackingSkill >= minLevel && serv.requiredHackingSkill <= maxLevel
	);
	// ns.getServer().requiredHackingSkill
	for (var serv of servers) {
		// if (serv.requiredHackingSkill < ns.getHackingLevel()+100) 
		ns.tprintf("[%s] (%3d) %s",
			_pwnString(ns, serv.requiredHackingSkill <= ns.getHackingLevel(), serv.hostname),
			ns.getServerRequiredHackingLevel(serv.hostname),
			serv.hostname
		);
	}
	
}