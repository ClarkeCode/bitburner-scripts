import { formatMoney } from "/util/format.js";

class Script {
	/** @param {NS} ns @param {String} scriptName **/
	constructor (ns, scriptName, timerFunc=(target)=>{return 0}) {
		this.name = scriptName;
		this.cost = ns.getScriptRam(scriptName);
		this.timer = timerFunc;
		this.availableThreads = (serv) => { return Math.floor((ns.getServerMaxRam(serv)-ns.getServerUsedRam(serv))/ns.getScriptRam(name)); }
	}
}

/** @param {NS} ns @param {Script} script @param {number} threads @param {any[]} args 
 * @return {Array<number>} The pid numbers of the dispatched processes */
function dispatchScript(ns, script, threads=1, ...args) {
	let pids = [];
	pids.push(ns.run(script.name, threads, ...args));
	return pids;
}

/** @param {NS} ns  @param {String} target Hostname of target server */
function targetString(ns, target) {
	return ns.sprintf("[%s]->[%s] %s/%s (%.2f/%d)", ns.getHostname(), target,
		formatMoney(ns, ns.getServerMoneyAvailable(target)), formatMoney(ns, ns.getServerMaxMoney(target)),
		ns.getServerSecurityLevel(target), ns.getServerMinSecurityLevel(target)
	);
}

/** @param {NS} ns **/
async function prepareServerForBatching(ns, target, crippler, flowerpot, timeOffset) {
	while (ns.getServerSecurityLevel(target) != ns.getServerMinSecurityLevel(target)) {
		ns.print(targetString(ns, target));
		ns.print("Weakening to null");
		const desiredThreads = Math.ceil((ns.getServerSecurityLevel(target)-ns.getServerMinSecurityLevel(target))/0.05);
		const clamped = Math.min(crippler.availableThreads("home"), desiredThreads);
		if (clamped > 0) dispatchScript(ns, crippler, clamped, target);
		await ns.sleep(crippler.timer(target)+timeOffset);
	}

	while (ns.getServerMoneyAvailable(target) != ns.getServerMaxMoney(target)) {
		ns.print(targetString(ns, target));
		ns.print("Filling up money");
		const desiredThreads = Math.ceil(ns.growthAnalyze(target, ns.getServerMaxMoney(target)/ns.getServerMoneyAvailable(target)));
		const clamped = Math.min(flowerpot.availableThreads("home"), desiredThreads);
		if (clamped > 0) dispatchScript(ns, flowerpot, clamped, target);
		await ns.sleep(flowerpot.timer(target)+timeOffset);
		dispatchScript(ns, crippler, Math.ceil(ns.growthAnalyzeSecurity(clamped)/0.05), target);
		await ns.sleep(crippler.timer(target)+timeOffset);
	}
}

/** @param {NS} ns **/
export async function main(ns) {
	const settings = ns.flags([
		["debug", false],
		["prepare", false]
	]);
	const target = settings._[0];
	const debug = settings.debug;

	const timeOffset = 250;
	const leech     = new Script(ns, "/util/leech.js",     ns.getHackTime);
	const crippler  = new Script(ns, "/util/crippler.js",  ns.getWeakenTime);
	const flowerpot = new Script(ns, "/util/flowerpot.js", ns.getGrowTime);

	if (!ns.serverExists(target)) { ns.tprintf("ERROR - '%s' is not a valid target", target); return; }
	ns.tail();
	ns.disableLog("ALL");
	if (debug) { ns.enableLog("sleep"); ns.enableLog("run"); }
	
	ns.print("INFO - Warming up...");
	await prepareServerForBatching(ns, target, crippler, flowerpot, timeOffset);

	ns.print("INFO - Ready...");

	const calcBatch = (target, desiredLeechThreads) => {
		const w1t = Math.ceil(ns.hackAnalyzeSecurity(desiredLeechThreads)/0.05);
		const expectedHackMoney = ns.getServerMoneyAvailable(target) * ns.hackAnalyze(target) * desiredLeechThreads;
		const gt = Math.ceil(
			ns.growthAnalyze(target, ns.getServerMaxMoney(target)/(ns.getServerMoneyAvailable(target)-expectedHackMoney))
		);
		const w2t = Math.ceil(ns.growthAnalyzeSecurity(gt)/0.05);
		return {
			"phaseA": desiredLeechThreads+0,
			"phaseB": w1t,
			"phaseC": gt,
			"phaseD": w2t,
			"totalRamCost": leech.cost * desiredLeechThreads + crippler.cost * (w1t + w2t) + flowerpot.cost * gt
		};
	}

	ns.print(targetString(ns, target));
	if (settings.prepare) { ns.tprintf("Finished preparing server '%s' for batching"); return; }

	const desiredPercentageToHack = 0.5;
	const freeMoney = (target) => {
		var minMoney = ns.getServerMaxMoney(target) * desiredPercentageToHack;
		if (ns.getServerMoneyAvailable(target) <= minMoney) return 0;
		return ns.getServerMoneyAvailable(target) - minMoney; 
	}
	
	while (true) {
		const desiredHackThreads = Math.floor(ns.hackAnalyzeThreads(target, freeMoney(target)));
		const batch = calcBatch(target, desiredHackThreads);

		// if (batch.totalRamCost >= ns.getServerMaxRam(target)-ns.getServerUsedRam(target)) {
		// 	ns.print(ns.sprintf("ERROR: not enough memory to run batch - requires %f GB", batch.totalRamCost));
		// 	return;
		// }

		const p1delay = ns.getWeakenTime(target) - (ns.getHackTime(target) + timeOffset);
		const p3delay = ns.getWeakenTime(target) + timeOffset - ns.getGrowTime(target);
		const p4delay = 2 * timeOffset;

		ns.print(ns.sprintf("Batch ready %s", batch.totalRamCost));
		const pid1 = dispatchScript(ns, leech,     batch.phaseA, target, "--delay", p1delay);
		const pid2 = dispatchScript(ns, crippler,  batch.phaseB, target, "--delay", 0);
		const pid3 = dispatchScript(ns, flowerpot, batch.phaseC, target, "--delay", p3delay);
		const pid4 = dispatchScript(ns, crippler,  batch.phaseD, target, "--delay", p4delay);
		if (pid3 == 0) { ns.kill(pid1); ns.kill(pid2); ns.kill(pid4); ns.print("ERROR: Too big"); return;}

		await ns.sleep(ns.getWeakenTime(target) - 2*timeOffset);
		ns.print(ns.sprintf("Batch beginning in %d ms", timeOffset));
		await ns.sleep(5 * timeOffset);
	}
}