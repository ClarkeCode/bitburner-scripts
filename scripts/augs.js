import { formatMoney } from "/util/format.js";

const allFactionNames = ["CyberSec", "NiteSec", "The Black Hand", "BitRunners", "Daedalus",	//Progression Factions
				"Sector-12", "Aevum", "Volhaven", "Tian Di Hui", "Chongqing", "New Tokyo", "Ishima", //Location Factions
				"Slum Snakes", "Tetrads", "The Covenant", //Crime Factions
				"Netburners", "Illuminati"
				];

// Aug price multiplier is 1.9 ^ (# of purchased augmentations)
const multi = [1.0, 1.9, 3.610, 6.859, 13.032, 24.761, 47.046]; 

/** @param {NS} ns */
function aaa(ns, name, faction) {
	var ag = ns.getAugmentationStats(name);
	ag.name = name;
	ag.faction = faction;
	ag.cost = ns.getAugmentationPrice(name);
	ag.reputation = ns.getAugmentationRepReq(name);
	ag.canBuy = ag.reputation <= ns.getFactionRep(faction);
	return ag;
}

/** @param {NS} ns */
function listAugment(ns, augment) {
	// ns.tprint(augment);
	ns.tprintf("[%11s] [%7s] %40s $%7s",
		augment.faction, augment.canBuy ? "✓" : formatMoney(ns, augment.reputation), augment.name, formatMoney(ns, augment.cost));
}

/** @param {NS} ns 
 *  NOTE: Requires SF 4-3
 * **/
export async function main(ns) {
	var playerFactions = ns.args.includes("all") ? allFactionNames : ns.getPlayer().factions;
	// ns.tprint(playerFactions);
	var augs = [];
	var myAugs = ns.getOwnedAugmentations(true);

	for (var nFaction of playerFactions) {
		var factionAugs = ns.getAugmentationsFromFaction(nFaction);
		factionAugs = factionAugs.filter(aug => !myAugs.includes(aug));
		factionAugs = factionAugs.map(aug => aaa(ns, aug, nFaction));
		// ns.tprint(factionAugs);
		augs = augs.concat(factionAugs);
	}

	const costAsc  = (a, b) => { return a.cost - b.cost; }
	const costDesc = (a, b) => { return b.cost - a.cost; }
	const repAsc   = (a, b) => { return a.reputation - b.reputation; }
	const repDesc  = (a, b) => { return b.reputation - a.reputation; }

	var selectedSort;
	if (ns.args.includes("cost")) { selectedSort = ns.args.includes("asc") ? costAsc : costDesc; }
	if (ns.args.includes("rep"))  { selectedSort = ns.args.includes("asc") ? repAsc  :  repDesc; }

	if (selectedSort != undefined)
		augs = augs.sort(selectedSort);

	// ns.tprint(augs);
	for (var aug of augs) {
		// ns.tprint(aug);
		listAugment(ns, aug);
	}
	// ns.tprint(ns.getAugmentationStats(augs[augs.length-1]));
}