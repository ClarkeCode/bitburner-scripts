/** @param {NS} ns **/
export async function main(ns) {
	// var contract = ns.args[0];
	// var host = ns.args[1];
	// ns.tprint(ns.codingcontract.getContractType(contract, host));
	// ns.tprint(ns.codingcontract.getDescription(contract, host));
	// ns.tprint(ns.codingcontract.getData(contract, host));
	
	// ns.tprint(0 + true + true + true);

	// ns.tprint( 0 +
	// ns.fileExists("BruteSSH.exe",  "home") +
	// ns.fileExists("FTPCrack.exe",  "home") +
	// ns.fileExists("relaySMTP.exe", "home") +
	// ns.fileExists("HTTPWorm.exe",  "home") +
	// ns.fileExists("SQLInject.exe", "home") );

	// while (ns.getHackingLevel() < ns.args[0]) {
	// 	await ns.sleep(15 * 1000);
	// }
	// ns.alert(ns.sprintf("Reached level %d", ns.args[0]));
	
	var test = ns;
	

	// ns.tprint(Object.keys(test));
	// ns.tprint(typeof(test));
	// ns.tprint(Object.getOwnPropertyNames(test));

	for (var prop of Object.keys(ns)) {
		ns.tprintf("%10s - %s", typeof(ns[prop]), prop);
	}

	ns.tprint(ns.exploit());
	var myHook = {"name": 70};
	// ns.tprint(ns.bypass("111"))//ns.bypass(myHook));
	// ns.tprint(ns.bypass(myHook));
	// ns.tprint(ns.alterReality(0x6C1));

	// ns.tprint(myHook.completely_unused_field);

	// ns.tprint();
	
	// ns.tprint(ns.heart.break());
	// ns.heart.break();

	ns.tprint(ns.ps());
	var sc = ns.ps()[0];
	// ns.tprint(ns.getRunningScript(sc.filename, ns.getHostname(), sc.args));
	// ns.getScriptExpGain(sc.filename, )
	ns.tprint(ns.getScriptExpGain("overlord.js", "home", ...["foodnstuff"]));
	ns.tprint(ns.hackAnalyze("ecorp"));
}