/** @param {NS} ns **/
function exploits(ns) { return [
	{"name": "BruteSSH.exe",  "function": ns.brutessh},
	{"name": "FTPCrack.exe",  "function": ns.ftpcrack},
	{"name": "relaySMTP.exe", "function": ns.relaysmtp},
	{"name": "HTTPWorm.exe",  "function": ns.httpworm},
	{"name": "SQLInject.exe", "function": ns.sqlinject}
	]
};

/** Number of ports you can curently open
 * @param {NS} ns 
 * @return {number}
 * **/
function crackLevel(ns) {
	return exploits(ns).map(ex => ns.fileExists(ex.name, "home")).reduce((a, b) => a+b);
}

/** Runs all purchased exploits on the target server
 * @param {NS} ns
 * @param {string} Hostname of target
 * **/
function defuse(ns, target) {
	for (var exploit of exploits(ns)) {
		if (ns.fileExists(exploit.name, "home")) { exploit.function(target); };
	}
}

/**
 * @param {NS} ns
 * @param {string} target Hostname of server
 */
export function crack(ns, target) {
	const servPorts = ns.getServerNumPortsRequired(target);
	const canNuke = crackLevel(ns) >= servPorts;
	
	if (canNuke) {
		defuse(ns, target);
		ns.nuke(target);
	}
	return canNuke;
}

import { allServers } from "survey.js";
import { setupServer } from "/util/setup-server.js";

/** @param {NS} ns **/
export async function main(ns) {
	// ns.tail();
	ns.run("/util/progbutler.js");

	const allServ = await allServers(ns);
	while (allServ.map(serv => ns.hasRootAccess(serv.hostname)).includes(false)) {
		const servers = allServ.filter(serv => serv.requiredHackingSkill <= ns.getHackingLevel());
		for (const serv of servers) {
			const alreadyCracked = ns.hasRootAccess(serv.hostname);
			if (crack(ns, serv.hostname)) {
				await setupServer(ns, serv.hostname, !alreadyCracked);
			}
		}
		await ns.sleep(20 * 1000);
	}
	ns.toast("Jackercrack has cracked all existing servers", "success", 10000);
}