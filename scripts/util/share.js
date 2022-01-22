/** @param {NS} ns
 *  **/
export async function main(ns) {
	var fl = ns.flags([
		["loop", false],
		["tail", false],
	]);

	if (fl.tail) { ns.tail(); }
	do {
		await ns.share();
	} while (fl.loop);
}