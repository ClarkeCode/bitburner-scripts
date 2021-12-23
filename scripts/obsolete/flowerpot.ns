import {formatAction, formatPercent, formatMoney} from "/util/format.ns";

function ratioToPercent(val) {
	return (val-1)*100;
}

/** @param {NS} ns **/
export async function flowerpot(ns, host, target, minMoney, maxMoney) {
	var gfactor;
	var newmoney;
	var oldmoney = ns.getServerMoneyAvailable(target);
	do {
		var exetime = ns.getGrowTime(target)/1000;
		
		ns.print(ns.sprintf("[%s]->%s Next growth in %d:%.2fs", host, target, exetime/60, exetime%60));
		gfactor = await ns.grow(target);

		newmoney = ns.getServerMoneyAvailable(target);
		if (gfactor != undefined)
		ns.print(ns.sprintf("Lastgrowth: (%.2f%%) $%s", ratioToPercent(gfactor), formatMoney(ns, newmoney-oldmoney)));
		ns.print(ns.sprintf(
			"%s has $%s / $%s (%s)",
			target,
			formatMoney(ns, newmoney),
			formatMoney(ns, maxMoney),
			formatPercent(ns, newmoney, maxMoney)
		));
	} while (minMoney > newmoney);
}

/** @param {NS} ns **/
export async function main(ns) {
	var host = ns.getHostname();
    var target = ns.args[0];
	ns.tail();
	ns.disableLog("ALL");

	var maxMoney = ns.getServerMaxMoney(target);
	
	while (true)
	await flowerpot(ns, host, target, maxMoney*0.75, maxMoney);

	ns.tprintf("[%s] Completed flowerpot script on target '%s'", host, target);
}