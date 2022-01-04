/** @param {string} target Hostname of the server object you want to extract
 *  @param {Array.<Server>} servers
 * **/
export function retrieveServer(target, servers) {
	return servers.filter(s => s.hostname == target)[0];
}

/** @param {NS} ns **/
export async function survey(ns, target="home", visited=[], depth=0, maxDepth=30) {
	var sTarget = ns.getServer(target);
	var canHack = ns.getHackingLevel() >= sTarget.hackDifficulty;

	var visitedNames = visited.map(serv => serv.hostname);
	var sc = ns.scan(target);
	sTarget.parent = sc.filter(hname => visitedNames.includes(hname));
	sTarget.children = sc.filter(hname => !visitedNames.includes(hname));
	visited.push(sTarget);

	if (depth < maxDepth) {
		for (var child of sTarget.children) {
			await survey(ns, child, visited, depth+1, maxDepth);
		}
	}
}

/** Gets all servers
 * @param {NS} ns
 * @return Server[]
 */
export async function allServers(ns) {
	var visited = [];
	await survey(ns, "home", visited);
	return visited;
}

/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	// ns.disableLog("ALL");
	var target = ns.args[0] == undefined ? ns.getHostname() : ns.args[0];
	
	var visited = [];
	await survey(ns, target, visited);
	
	visited.sort((a, b) => {return b.requiredHackingSkill - a.requiredHackingSkill;});
	for (var s of visited//visited.filter(serv => serv.requiredHackingSkill <= ns.getHackingLevel())
	) {
		ns.print(s.hostname + " " + s.requiredHackingSkill);
	}
	// ns.print(visited.map(serv => serv.hostname));
	// ns.print(visited);
}