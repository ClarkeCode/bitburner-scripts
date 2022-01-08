import { goto } from "goto.js";

/** @param {NS} ns **/
export async function main(ns) {
	var host = ns.getHostname();
	var target = ns.args[0];

	await goto(ns, host, target);
	try {
		await ns.installBackdoor();
		// ns.tprint("Backdoored");
	} catch {}
	finally {
		await goto(ns, target, host);
	}
}