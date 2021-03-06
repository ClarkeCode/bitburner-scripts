import { formatMoney } from "/util/format.js";

/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog("ALL");

	var target = ns.args[0];

	var targetString = () => {
		return ns.sprintf("[%s]->[%s] %s/%s (%.2f/%d)", ns.getHostname(), target,
			formatMoney(ns, ns.getServerMoneyAvailable(target)), formatMoney(ns, ns.getServerMaxMoney(target)),
			ns.getServerSecurityLevel(target), ns.getServerMinSecurityLevel(target)
		);
	}

	var lastPrint = targetString();
	ns.print(lastPrint);
	while (true) {
		if (lastPrint != targetString()) {
			lastPrint = targetString();
			ns.print(lastPrint);
		}

		await ns.sleep(250);
	}
}