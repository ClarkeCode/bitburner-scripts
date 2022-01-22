//Need 1,953,125.00 respect to hire all gang members
const desiredMembers = ["Rico","Vinny","Jessie","Tony","Tiny","Sven","Carl","Gary","Evan","Johnny","Ronnie","Celica"];


/** @param {NS} ns **/
export async function main(ns) {
	let settings = ns.flags([
		["ascendall", false],
		["upgradeall", false]
	]);

	if (!ns.gang.inGang()) { ns.tprintf("ERROR - Must be a member of a gang"); return; }
	// ns.tprint(ns.gang.getMemberNames())
	// ns.tprint(ns.gang.getTaskNames());

	for (const member of desiredMembers.filter(name => !ns.gang.getMemberNames().includes(name))) {
		if (ns.gang.recruitMember(member)) ns.tprintf("INFO - Recruited %s", member);
	}


	if (ns.args[0] == undefined) {
		const tasks = ns.gang.getTaskNames();
		for (const x in tasks) {
			ns.tprintf("%2d - %s", x, tasks[x]);
		}
		return;
	}

	if (settings.ascendall) {
		for (const member of ns.gang.getMemberNames()) {
			ns.gang.ascendMember(member);
			ns.gang.setMemberTask(member, "Train Combat");
		}
		// return;
	}
	else if (settings.upgradeall) {
		for (const member of ns.gang.getMemberNames()) {
			for (const tool of ns.gang.getEquipmentNames())
				ns.gang.purchaseEquipment(member, tool);
		}
	}
	else {
		const chosenTask = ns.gang.getTaskNames()[ns.args[0]];
		for (const member of ns.gang.getMemberNames()) {
			ns.gang.setMemberTask(member, chosenTask);
		}
		ns.tprintf("INFO: All gang members set to '%s'", chosenTask);
	}
}