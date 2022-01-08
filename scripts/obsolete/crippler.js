/** @param {NS} ns **/
import {formatAction, formatPercent, formatMoney, formatTime} from "/util/format.ns";


export async function crippler(ns, host, target) {
	var nearMin = ns.getServerMinSecurityLevel(target) + 1;
	var secLevel;
	do {
		secLevel = ns.getServerSecurityLevel(target);
		ns.print(ns.sprintf("Reducing security from %.3f to %f", secLevel, nearMin));
		ns.print(formatAction(ns, host, target, "Next weaken", ns.getWeakenTime(target)/1000));
		await ns.weaken(target);
	} while (secLevel > nearMin);
}


export async function main(ns) {
	ns.tail();
	ns.disableLog("ALL");
	var host = ns.getHostname();
    var target = ns.args[0];

	await crippler(ns, host, target);

	ns.tprintf("[%s] Completed cripple script at target '%s'", host, target);
}