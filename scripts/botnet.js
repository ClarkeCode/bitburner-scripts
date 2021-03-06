import { allServers } from "./survey.js";


/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	var target = ns.args[0];
	var toRun = ns.args[1];
	if (target == undefined || !ns.serverExists(target)) { ns.tprint("ERROR: must provide a valid server"); return; }
	// ns.tprint(ns.getScriptRam("/util/crippler.js"));

	var servers = (await allServers(ns)).filter(server => server.hasAdminRights && !server.purchasedByPlayer);
	for (var server of servers.map(s => s.hostname)) {
		
		if (ns.fileExists(toRun, server)) {
			var availableRam = ns.getServerMaxRam(server)-ns.getServerUsedRam(server);
			var scriptCost = ns.getScriptRam(toRun, server);
			var threads = Math.floor(availableRam/scriptCost);
			//give an override for only one thread
			if (ns.args[2] != undefined) threads = 1;
			
			if (threads >= 1) {
				var pid = ns.exec(toRun, server, threads, target);
				ns.tprintf("[%15s] Started %dx %s (PID: %d)", server, threads, toRun, pid);
			}
			else {
				ns.tprintf("INFO - Could not run on [%s], memory not available", server);
			}
		}
	}
	await ns.sleep(500);
}