import { threadsToHackUntilPercent, threadsToRefillServer, threadsToMinSecurity, performHack} from "/util/util.js";
import { formatMoney } from "/util/format.js";
import { allServers } from "./survey.js";


/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog("ALL");
	var host = ns.getHostname();
	var target = ns.args[0];
	
	var noisy = true;
	var desiredPercentageToHack = 0.5;
	var additionalUpdateTime = 500;

	var servers = (await allServers(ns)).filter(serv => ns.hasRootAccess(serv.hostname)).map(serv => serv.hostname).reverse();
	// ns.tprint(servers);
	const freeMoney = (target) => {
		var minMoney = ns.getServerMaxMoney(target) * desiredPercentageToHack;
		if (ns.getServerMoneyAvailable(target) <= minMoney) return 0;
		return ns.getServerMoneyAvailable(target) - minMoney; 
	}

	const leech     = {"name": "/util/leech.js",     
		"desiredThreads": (target)=>{
			// if (freeMoney(target) != 0) ns.print("Free$: " + formatMoney(ns, freeMoney(target)));
			return Math.floor(ns.hackAnalyzeThreads(target, 
				freeMoney(target)
			))
		}, //(target)=>{return threadsToHackUntilPercent(ns, target, desiredPercentageToHack)}, 
		"timer": (target)=>{return ns.getHackTime(target)+additionalUpdateTime}
	};
	const crippler  = {"name": "/util/crippler.js",  "desiredThreads": (target)=>{return threadsToMinSecurity(ns, target)}, "timer": (target)=>{return ns.getWeakenTime(target)+additionalUpdateTime}};
	const flowerpot = {"name": "/util/flowerpot.js", "desiredThreads": (target)=>{return threadsToRefillServer(ns, target)}, "timer": (target)=>{return ns.getGrowTime(target)+additionalUpdateTime}};

	//Math.floor(ns.hackAnalyzeThreads(targetHost,targetServer.moneyMax * 5e-1))

	var targetString = () => {
		return ns.sprintf("[%s]->[%s] %s/%s (%.2f/%d)", ns.getHostname(), target,
			formatMoney(ns, ns.getServerMoneyAvailable(target)), formatMoney(ns, ns.getServerMaxMoney(target)),
			ns.getServerSecurityLevel(target), ns.getServerMinSecurityLevel(target)
		);
	}

	var runProg = (script, threads) => {
		ns.run(script, threads, target, threads);
		ns.print(ns.sprintf("- %-18s x%-3d [%s]", script, threads, ns.getHostname()));
	}

	var clampToMemoryConstraints = (serv, script, desiredThreads) => {
		var possibleThreads = Math.floor((ns.getServerMaxRam(serv)-ns.getServerUsedRam(serv))/ns.getScriptRam(script));
		return Math.min(possibleThreads, desiredThreads);
	}

	var route = (target, scriptInfo) => {
		var dthreads = scriptInfo.desiredThreads(target); //desired
		var othreads = scriptInfo.desiredThreads(target); //original
		if (othreads <= 0) return 0;

		for (var serv of servers) {
			var availibleThreads = clampToMemoryConstraints(serv, scriptInfo.name, dthreads);
			dthreads -= availibleThreads;
			
			if (availibleThreads > 0) {
				ns.exec(scriptInfo.name, serv, availibleThreads, target);
				ns.print(ns.sprintf("- %-18s x%-3d [%s]", scriptInfo.name, availibleThreads, serv));
			}
			if (dthreads <= 0) { break; }
		}
		return othreads - dthreads;
	}

	var lastWeak = ns.getTimeSinceLastAug();
	var lastGrow = ns.getTimeSinceLastAug();
	var lastHack = ns.getTimeSinceLastAug();
	var lastPrint = targetString();
	ns.print(lastPrint);
	while (true) {
		if (ns.getTimeSinceLastAug() > lastWeak && route(target, crippler) != 0) { lastWeak = ns.getTimeSinceLastAug() + crippler.timer(target); }
		if (ns.getTimeSinceLastAug() > lastGrow && route(target, flowerpot) != 0) { lastGrow = ns.getTimeSinceLastAug() + flowerpot.timer(target); }
		if (ns.getTimeSinceLastAug() > lastHack && route(target, leech) != 0) {
			lastHack = ns.getTimeSinceLastAug() + leech.timer(target);
		}
		
		if (lastPrint != targetString()) {
			lastPrint = targetString();
			ns.print(lastPrint);
		}

		await ns.sleep(500);
	}
}