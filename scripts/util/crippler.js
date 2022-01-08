/** @param {NS} ns
 *  Arguments are 'target', 'threads'
 *  **/
export async function main(ns) {
	var fl = ns.flags([
		["loop", false],
		["stock", false]
	]);

	var target = fl._[0];
	if (target == undefined) { ns.tprint("ERROR: target not defined"); return; }
	if (fl.loop) { ns.tail(); }

	do {
		await ns.weaken(target, {"stock": fl.stock});
	} while (fl.loop);
}