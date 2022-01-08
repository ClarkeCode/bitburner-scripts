import { formatMoney } from "/util/format.js";

export function largestPurchasableServer(ns) {
	var money = ns.getPlayer().money;
	var gigs = 2**20;
	while (money < ns.getPurchasedServerCost(gigs) && gigs != 2) { gigs /= 2; }
	return gigs;
}

/** @param {NS} ns **/
export async function main(ns) {
    var hostname = ns.args[0];
    var desiredRAM = ns.args[1];
    if (desiredRAM == undefined) {
        desiredRAM = largestPurchasableServer(ns);
    }
    else if (desiredRAM % 2 != 0) {ns.tprint("ERROR: Server memory must be factorable by 2"); return; }
    var doPurchase = await ns.prompt(ns.sprintf("Do you want to by a server '%s' with %d GB of RAM?\n\
    Will cost %s, next size at %s", hostname, desiredRAM,
    formatMoney(ns, ns.getPurchasedServerCost(desiredRAM)), formatMoney(ns, ns.getPurchasedServerCost(desiredRAM*2))));
    
    if (doPurchase) {
        ns.tprint(ns.purchaseServer(hostname, desiredRAM));
        ns.tprint("INFO - Purchased " + hostname);
        ns.spawn("/util/setup-server.js", 1, hostname);
    }
    else {
        ns.tprint("INFO - Declined purchase");
    }
}