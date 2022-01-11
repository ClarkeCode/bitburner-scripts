import { findLinksToServer } from "/util/find.js";

/** @param {NS} ns **/
export async function goto(ns, host, target) {
	var links = await findLinksToServer(ns, host, target);
	for (var link of links) {
		if (link != host) {
			ns.connect(link);
		}
	}
}

/** @param {NS} ns **/
export async function main(ns) {
    var host = ns.getHostname();
	var target = ns.args[0];

	await goto(ns, host, target);
}