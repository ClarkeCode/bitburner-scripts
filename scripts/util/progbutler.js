const desiredProgs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe", "ServerProfiler.exe"];

/** Attempts to buy any missing exploits from the dark web
 * @param {NS} ns */
function buyMissingPrograms(ns, noisy=false) {
	try {
		if (!ns.getPlayer().tor) ns.purchaseTor();
		for (const prog of desiredProgs.filter(prog => !ns.fileExists(prog, "home"))) {
			if (ns.purchaseProgram(prog) && noisy) { ns.toast(ns.sprintf("Purchased program '%s'", prog), "info"); }
		}
	} catch {}
}

/** @param {NS} ns **/
export async function main(ns) {
	while (desiredProgs.filter(prog => !ns.fileExists(prog, "home")).length > 0) {
		buyMissingPrograms(ns, true);
		await ns.sleep(7500);
	}
	ns.toast("Desired programs purchased from the darkweb", "warning", 4000);
}