/** @param {NS} ns **/
function hireMaxEmployees(ns, division, silent=false) {
	for (const city of ns.corporation.getDivision(division).cities) {
		let office = ns.corporation.getOffice(division, city);
		if (office.size > office.employees.length)  {
			if (!silent) { ns.tprintf("INFO - Hiring employees in '%s' to a maximum of %d", city, office.size); }
			while (office.size - office.employees.length != 0) {
				ns.corporation.hireEmployee(division, city);
				office = ns.corporation.getOffice(division, city)
			}
		}
	}
}

function listCorpDivisions(ns) {
	let i = 0;
	for (const division of ns.corporation.getCorporation().divisions) {
		ns.tprintf("%2d - %s", i++, division.name);
	}
}

function maximumBuyback(ns) {
	ns.tprintf("INFO - You can buy back %d stocks", Math.floor(Math.min(
		ns.corporation.getCorporation().issuedShares, //Issued stocks
		ns.getPlayer().money / (ns.corporation.getCorporation().sharePrice*1.1))) //Amount of stocks you could buy
	);
}

/** @param {NS} ns **/
function standardOfficeSize(ns, division, desiredSize, silent=false) {
	if (desiredSize <= 0) return;
	if (!silent) { ns.tprintf("INFO - Standardizing '%s' employees to %d minimum per office", division, desiredSize);}
	for (const city of ns.corporation.getDivision(division).cities) {
		const currSize = ns.corporation.getOffice(division, city).size;
		if (currSize < desiredSize) {
			ns.corporation.upgradeOfficeSize(division, city, desiredSize-currSize);
		}
	}
}
/** @param {NS} ns **/
function standardWarehouseSize(ns, division, desiredLevel, silent=false) {
	if (desiredSize <= 0) return true;
	if (!silent) { ns.tprintf("INFO - Standardizing '%s' warehouses to size %d", division, desiredLevel); }
	for (const city of ns.corporation.getDivision(division).cities) {
		let whouse = ns.corporation.getWarehouse(division, city);
		while (whouse.level < desiredLevel) {
			if (ns.corporation.getUpgradeWarehouseCost(division, city) > ns.corporation.getCorporation().funds) {
				ns.tprintf("ERROR - Not enough money to standardize warehouse size");
				return false;
			}
			ns.corporation.upgradeWarehouse(division, city);
			whouse = ns.corporation.getWarehouse(division, city);
		}
	}
	return true;
}


/** @param {NS} ns **/
async function autoJobsByRatio(ns, division, city, ratio="1/1/1/1/1") {
	await ns.corporation.setAutoJobAssignment(division, city, job, number);
}

/** @param {NS} ns **/
export async function main(ns) {
	// ns.corporation.getDivision("Nutra-Foods");
	// ns.corporation.getDivision("Fume-R-Gate");

	const settings = ns.flags([
		["div", -1],
		["office-size", 0],
		["silent", false],
		["buyback", false],
	]);

	if (settings.buyback) { maximumBuyback(ns); return; }
	if (settings.div < 0) { listCorpDivisions(ns); return; }

	const division = ns.corporation.getCorporation().divisions[settings.div].name;	

	standardOfficeSize(ns, division, settings["office-size"], settings.silent);
	hireMaxEmployees(ns, division, settings.silent);

	// ns.corporation.setAutoJobAssignment(division, "", "",10)
	ns.tprint(ns.corporation.getWarehouse(division, "Sector-12"));

	const whouse = ns.corporation.getWarehouse(division, "Sector-12");
	if (whouse.sizeUsed / whouse.size >= 0.85) {
	}
	
	//Optimal ratio for product development 26 Engi : 66 Manag : 8 R&D or approx. 3:8:1
}