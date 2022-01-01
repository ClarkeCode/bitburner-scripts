/** @param {NS} ns **/
function defuse(ns, target) {
	if (ns.fileExists("BruteSSH.exe", "home")) { ns.brutessh(target); }
	if (ns.fileExists("FTPCrack.exe", "home")) { ns.ftpcrack(target); }
	if (ns.fileExists("relaySMTP.exe", "home")) { ns.relaysmtp(target); }
	if (ns.fileExists("HTTPWorm.exe", "home")) { ns.httpworm(target); }
	if (ns.fileExists("SQLInject.exe", "home")) { ns.sqlinject(target); }
}

/**
 * @param {NS} ns
 * @param {Server} targetServer
 */
export async function crack(ns, targetServer) {
	defuse(ns, targetServer.hostname);
	if (targetServer.numOpenPortsRequired <= targetServer.openPortCount) {ns.nuke(targetServer.hostname);}
	await ns.sleep(500);
	return ns.hasRootAccess(targetServer.hostname);
}

export async function main(ns) {
	// ns.tail();
	var target = ns.args[0];
	
	// defuse(ns, target);

	var tserv = ns.getServer(target);
	var gotRoot = await crack(ns, tserv);

	if (gotRoot) { ns.tprint("Got root"); }
	else { ns.tprint("ERROR: could not crack"); }
}