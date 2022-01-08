function exploits(ns) { return [
	{"name": "BruteSSH.exe",  "function": ns.brutessh},
	{"name": "FTPCrack.exe",  "function": ns.ftpcrack},
	{"name": "relaySMTP.exe", "function": ns.relaysmtp},
	{"name": "HTTPWorm.exe",  "function": ns.httpworm},
	{"name": "SQLInject.exe", "function": ns.sqlinject}
	]
};
/** Attempts to buy any missing exploits from the dark web
 * @param {NS} ns
 */
// function buyMissingPrograms(ns) {
// 	try {
// 		if (!ns.getPlayer().tor) ns.purchaseTor();
// 		for (var ex of exploits(ns).filter(ex => !ns.fileExists(ex.name, "home"))) {
// 			ns.purchaseProgram(ex.name);
// 		}
// 	} catch {}
// }

/** Number of ports you can curently open
 * @param {NS} ns 
 * @return {number}
 * **/
function crackLevel(ns) {
	// buyMissingPrograms(ns);
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

	var servPorts = ns.getServerNumPortsRequired(target);
	var canNuke = crackLevel(ns) >= servPorts;
	
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
	ns.tail();
	while (true) {
		var servers = (await allServers(ns)).filter(serv => serv.requiredHackingSkill <= ns.getHackingLevel() );
		for (var serv of servers) {
			var alreadyCracked = ns.hasRootAccess(serv.hostname);
			if (crack(ns, serv.hostname)) {
				await setupServer(ns, serv.hostname, !alreadyCracked);
			}
		}
		await ns.sleep(60 * 1000);
	}
}

/** @param {NS} ns **/
export async function main2(ns) {
	if (ns.args[0] == undefined || !ns.serverExists(ns.args[0])) {
		ns.tprint("ERROR: '"+ns.args[0]+"' is not a valid server");
		return;
	}
	var target = ns.args[0];

	// ns.tprint(crackLevel(ns));
	// ns.tail();
    // ns.run("/util/crack.js", 1, target);
	var isCracked = crack(ns, target);
	
	if (isCracked) {
		ns.run("/util/setup-server.js", 1, target);
		await ns.sleep(200);

		if (ns.args.includes("bd")) ns.spawn("/util/backdoor.js", 1, target);

		// try { await ns.installBackdoor(); } catch(err) {}
	}
	else {
		ns.tprintf("ERROR: Cannot nuke '%s', need more programs, current crack level: %d", target, crackLevel(ns));
	}
	// ns.run("councilor.js", 1, target);
}