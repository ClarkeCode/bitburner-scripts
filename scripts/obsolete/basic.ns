import { leech } from "/util/leech.ns";
import { flowerpot } from "/util/flowerpot.ns";
import { crippler } from "/util/crippler.ns";

/** @param {NS} ns **/
export async function main(ns) {
	ns.clearLog();
	ns.tail();
	ns.disableLog("ALL");
	
	var host = ns.getHostname();
	var target = ns.args[0] == undefined ? ns.getHostname() : ns.args[0];
	var maxMoney = ns.getServerMaxMoney(target);
	var moneyThresh = maxMoney * 0.5;
	var securityThresh = ns.getServerMinSecurityLevel(target) + 5;
	
	var lastHack;
	while(true) {
		var currentSec = ns.getServerSecurityLevel(target);
		var curMoney = ns.getServerMoneyAvailable(target);
		if (currentSec > securityThresh) {
			await crippler(ns, host, target);
		} else if (curMoney < moneyThresh) {
			await flowerpot(ns, host, target, moneyThresh, maxMoney);
		} else {
			lastHack = await leech(ns, host, target, curMoney, maxMoney, lastHack);
		}
	}
}