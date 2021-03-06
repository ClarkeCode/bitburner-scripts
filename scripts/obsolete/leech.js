/** @param {NS} ns **/
import {formatAction, formatPercent, formatMoney} from "/util/format.ns";

export async function leech(ns, host, target, curMoney, maxMoney, lastHack=undefined) {
	var curMoney = ns.getServerMoneyAvailable(target);
	if (lastHack != undefined) {
		ns.print(ns.sprintf(
			"Last hack: %s", lastHack == 0 ? "FAILED" : ("+$"+formatMoney(ns, lastHack))
		));
	}

	ns.print(ns.sprintf(
		"%s has $%s / $%s (%s)",
		target,
		formatMoney(ns, curMoney),
		formatMoney(ns, maxMoney),
		formatPercent(ns, curMoney, maxMoney)
	));

	var htime = ns.getHackTime(target)/1000;
	ns.print(formatAction(ns, host, target, "Next hack", htime));
	return await ns.hack(target);
}

export async function main(ns) {
	ns.tail();
	ns.disableLog("ALL");
	var host = ns.getHostname();
	var target = ns.args[0] == undefined ? ns.getHostname() : ns.args[0];
	var maxMoney = ns.getServerMaxMoney(target);
	var moneyThresh = maxMoney * 0.75;

	var hackThresh = 0.4;//0.03;
	
	var lastHack;
	do {
		var curMoney = ns.getServerMoneyAvailable(target);
		// if ((curMoney/maxMoney) < hackThresh) {
		// 	ns.print("Below threshold, sleeping 60s...");
		// 	await ns.sleep(60*1000);
		// 	continue;
		// }
		lastHack = await leech(ns, host, target, curMoney, maxMoney, lastHack);
	} while (true);
}