import { survey, retrieveServer } from "survey.js";

/** @param {NS} ns **/
function linksToHomeOrTarget(current, target, servers) {
	var path = [];

	var curHost = current;
	//Work up from target to home or the host
	do {
		path.push(curHost);
		if (curHost == "home") { break;}
		curHost = retrieveServer(curHost, servers).parent[0];
	} while (curHost != target);
	if (curHost == target) path.push(curHost);
	
	return path;
}

/**
 * @param {string} origin Hostname of the starting location
 * @param {string} destination Hostname of the desired ending location
 * @param {Array.<Server>} servers Array of Server objects with scan links
 */
export function linksBetween(origin, destination, servers) {
	var fullPath = [];
	var destPath = linksToHomeOrTarget(destination, origin, servers);
	var isDecendent = destPath.includes(origin);
	fullPath = destPath;
	if (isDecendent) {
		return fullPath.reverse();
	}

	var fromPath = linksToHomeOrTarget(origin, "home", servers);
	fromPath.pop(); //Remove duplicate 'home' entry
	fullPath = fullPath.concat(fromPath.reverse());
	return fullPath.reverse();
}

export async function findLinksToServer(ns, host, target) {
	if (target == undefined || !ns.serverExists(target)) {
		ns.tprint("ERROR: '"+target+"' is not a server");
	}

    var servers = [];
	await survey(ns, "home", servers);
	// ns.print(servers);

	var links = [];
	for (var link of linksBetween(host, target, servers)) {
		links.push(link);
	}
	return links;
}

/** @param {NS} ns **/
export async function main(ns) {
	// ns.tail();
	var host = ns.getHostname();
	var target = ns.args[0];

	if (target == undefined || !ns.serverExists(target)) {
		ns.tprint("ERROR: '"+target+"' is not a server");
	}

    var servers = [];
	await survey(ns, "home", servers);
	// ns.print(servers);

	
	for (var link of await findLinksToServer(ns, host, target)) {
		ns.tprint(link);
	}
}