/** @param {NS} ns
 *  Arguments are 'target', 'threads'
 *  **/
export async function main(ns) {
	var fl = ns.flags([
		["loop", false],
		["delay", 0],
		["tail", false],
		["stock", false]
	]);

	var target = fl._[0];
	if (target == undefined) { ns.tprint("ERROR: target not defined"); return; }
	if (fl.tail) { ns.tail(); }
	do {
		if (fl.delay > 0) { await ns.sleep(fl.delay); }
		await ns.weaken(target, {"stock": fl.stock});
	} while (fl.loop);
}