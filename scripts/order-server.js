import { formatMoney } from "/util/format.js";

/** @param {NS} ns **/
export function largestPurchasableServer(ns) {
	var money = ns.getPlayer().money;
	var gigs = 2**20;
	while (money < ns.getPurchasedServerCost(gigs) && gigs != 2) { gigs /= 2; }
	return gigs;
}

/** @param {NS} ns **/
export async function main(ns) {
    const settings = ns.flags([
        ["upgrade", false]
    ]);

    const desiredRAM = largestPurchasableServer(ns);
    const hostname = settings._[0];

    if (hostname == undefined) {
        ns.tprintf("WARNING - Largest purchasable server is %d Gb at $%s%s%s", desiredRAM, 
            formatMoney(ns, ns.getPurchasedServerCost(desiredRAM)),
            desiredRAM == 2**20 ? "" : ". Next size at $",
            desiredRAM == 2**20 ? "" : formatMoney(ns, ns.getPurchasedServerCost(desiredRAM*2)));
        return;
    }

    if (settings.upgrade) { ns.deleteServer(hostname); }
    ns.purchaseServer(hostname, desiredRAM);
    ns.tprintf("INFO - Purchased '%s' of size %d Gb for $%s", hostname, desiredRAM, formatMoney(ns, ns.getPurchasedServerCost(desiredRAM)));
    ns.spawn("/util/setup-server.js", 1, hostname);
}