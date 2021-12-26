import { threadsToHackUntilPercent, threadsToRefillServer, threadsToMinSecurity} from "/util/util.ns";
import { formatTime, formatMoney } from "/util/format.ns";

function maxThreadsRAM(ns, targetScript, memoryAllocated) {
	return Math.floor(memoryAllocated / ns.getScriptRam(targetScript));
}
/** @param {NS} ns */
function ramCostThreads(ns, scriptName, numThreads) {
	return ns.getScriptRam(scriptName) * numThreads;
}

/** @param {NS} ns 
 *  Arguments are 'target' 'allocated RAM'
 * **/
export async function main(ns) {
	ns.tail();
	ns.disableLog("ALL");

	var target = ns.args[0];
	if (!ns.serverExists(target)) { ns.tprintf("ERROR: '%s' is not a valid server"); return; }
	var freeRAM = ns.getServerMaxRam(ns.getHostname())-ns.getServerUsedRam(ns.getHostname());
	var allocRAM = ns.args[1] == undefined ? freeRAM : ns.args[1];
	// ns.tprintf("%d %d", freeRAM, allocRAM);
	if (allocRAM < 2 || freeRAM < 2) { ns.tprintf("ERROR: Not enough resources to run, server has %dGB free", freeRAM); return; }
	if (ns.getServerMoneyAvailable(target) == 0) { ns.tprintf("ERROR: '%s' has $0 remaining"); return; }

	var leech = "/util/leech.ns";
	var crippler = "/util/crippler.ns";
	var flowerpot = "/util/flowerpot.ns";

	var securityLevelVariance = 5;
	var validHackThreshold = 0.9;
	var desiredPercentageToHack = 0.5;


	while (true) {
		var rationedRAM = allocRAM;
		var runTimes = [0];
		var moneyRatio = ns.getServerMoneyAvailable(target) / ns.getServerMaxMoney(target);
		
		
		//Keep security level low
		var securityToReduce = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
		// ns.print(securityToReduce);
		// ns.print(securityToReduce > securityLevelVariance);
		if (securityToReduce > securityLevelVariance) {
			var scriptName = crippler;
			var availableThreads = maxThreadsRAM(ns, scriptName, rationedRAM);
			var desiredThreads = threadsToMinSecurity(ns, target);
			var actualThreads = Math.min(availableThreads, desiredThreads);
// ns.print(availableThreads + " " + desiredThreads);
			if (actualThreads > 1) {
				ns.print("INFO - Weakening with "+actualThreads);
				rationedRAM -= ramCostThreads(ns, scriptName, actualThreads);
				runTimes.push(ns.getWeakenTime(target));
				ns.run(scriptName, actualThreads, target, actualThreads);
			}
		}

		//Keep high cash reserve 
		{
			// ns.print("WARNING grow "+rationedRAM);
			var scriptName = flowerpot;
			var availableThreads = maxThreadsRAM(ns, scriptName, rationedRAM);
			var desiredThreads = threadsToRefillServer(ns, target);
			var actualThreads = Math.min(availableThreads, desiredThreads);

			if (actualThreads > 1) {
				ns.print("INFO - Growing with "+actualThreads);
				rationedRAM -= ramCostThreads(ns, scriptName, actualThreads);
				runTimes.push(ns.getGrowTime(target));
				ns.run(scriptName, actualThreads, target, actualThreads);
			}
		}

		//Keep hack otherwise 
		if (moneyRatio >= validHackThreshold) {
			// ns.print("WARNING leech "+rationedRAM);
			var scriptName = leech;
			var availableThreads = maxThreadsRAM(ns, scriptName, rationedRAM);
			var desiredThreads = threadsToHackUntilPercent(ns, target, desiredPercentageToHack);
			var actualThreads = Math.min(availableThreads, desiredThreads);

			if (actualThreads > 1) {
				ns.print("INFO - Hacking with "+actualThreads);
				rationedRAM -= ramCostThreads(ns, scriptName, actualThreads);
				runTimes.push(ns.getHackTime(target));
				ns.run(scriptName, actualThreads, target, actualThreads);
			}
		}

		ns.print(ns.sprintf("[%s]->[%s] %s/%s (%.2f/%d)", ns.getHostname(), target,
			formatMoney(ns, ns.getServerMoneyAvailable(target)), formatMoney(ns, ns.getServerMaxMoney(target)),
			ns.getServerSecurityLevel(target), ns.getServerMinSecurityLevel(target)
		));


		// ns.tprint(runTimes.sort().reverse());
		var inactiveTime = runTimes.sort().reverse()[0] + 1000; //Await for 1 second longer than the longest runTime
		ns.print(ns.sprintf("Sleeping for %s", formatTime(ns, inactiveTime/1000)));
		await ns.sleep(inactiveTime);
		ns.print("Unused RAM: " + rationedRAM);
	}
}