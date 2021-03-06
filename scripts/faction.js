/** @param {NS} ns 
 *  NOTE: Requires SF 4-3
 * **/
function factionHighestAug (ns, factionName) {
	var augs = ns.getAugmentationsFromFaction(factionName);
	var largestRep = 0;
	for (var aug of augs) {
		// ns.tprintf("%s : %f", aug, ns.getAugmentationRepReq(aug));
		largestRep = largestRep > ns.getAugmentationRepReq(aug) ? largestRep : ns.getAugmentationRepReq(aug);
	}

	return largestRep;
}

const workIntervalSeconds = 60;
var workAquiresFocus = true;

//Note: Requires SF 4-2
async function workUntilRep(ns, factionName, desiredReputation) {
	while (ns.getFactionRep(factionName) < desiredReputation) {
		ns.workForFaction(factionName, "Hacking Contracts", workAquiresFocus);
		await ns.sleep(workIntervalSeconds * 1000);
		ns.print(ns.sprintf("[%s] Rep: %.2f / %.2f", factionName, ns.getFactionRep(factionName), desiredReputation));
	}
	ns.tprintf("--FINISHED WORK AT [%s] Reputation: %d --", factionName, ns.getFactionRep(factionName));
}

//Note: Requires SF 4-2
async function workUntilHighest(ns, factionName) {
	await workUntilRep(ns, factionName, factionHighestAug(ns, factionName));
}

/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog("ALL");
	workAquiresFocus = ns.args.includes("focus");
	// await workUntilHighest(ns, "CyberSec");
	// await workUntilHighest(ns, "Tian Di Hui");
	// await workUntilHighest(ns, "Volhaven");
	// await workUntilRep(ns, "Chongqing", 37500);
	// await workUntilRep(ns, "Ishima", 7500);
	// await workUntilRep(ns, "Chongqing", 6250);
	// await workUntilRep(ns, "New Tokyo", 6250);
	// await workUntilRep(ns, "NiteSec", 50000);
	// await workUntilHighest(ns, "NiteSec");
	// await workUntilHighest(ns, "The Black Hand");

	// await workUntilRep(ns, "Chongqing", 37500);
	// await workUntilHighest(ns, "Tian Di Hui");
	// await workUntilHighest(ns, "NiteSec");
	// await workUntilHighest(ns, "The Black Hand");
	// await workUntilRep(ns, "NiteSec", 50000);

	await workUntilRep(ns, "The Black Hand", 100000);
	await workUntilHighest(ns, "BitRunners");


	// while (!ns.joinFaction("Daedalus")) {
	// 	ns.print("Waiting for Daedalus");
	// 	await ns.sleep(10000);
	// }
	// await workUntilHighest(ns, "Daedalus");
	// // ns.workForFaction("Daedalus", "Hacking Contracts", true);

	
}