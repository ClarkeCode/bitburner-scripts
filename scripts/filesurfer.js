import { allServers } from "./survey.js";

/** @param {NS} ns **/
async function foreignFiles(ns) {
	var output = [];
	var servers = (await allServers(ns)).map(serv => serv.hostname).filter(serv => serv != "home");

	for (var serv of servers) {
		var files = ns.ls(serv);
		// var screeps = ns.ls(serv, ".js");
		files = files.filter(
			file => !ns.ls(serv, ".js").includes(file) && !ns.ls(serv, "util").includes(file)
		);
		//
		output.push({"hostname":serv, "files":files});
	}

	return output;
}

/** @param {NS} ns **/
export async function main(ns) {

	var ff = await foreignFiles(ns);

	if (ns.args[0] != undefined) {
		ff = ff.map(f => {return {"hostname":f.hostname, "files":f.files.filter(n => n.endsWith(ns.args[0]))}});
	}

	for (var record of ff) {
		var fserv = ns.sprintf("[%s]", record.hostname);
		if (record.files.length != 0) {
			ns.tprintf("%20s -> %s", fserv, record.files.toString());
		}
	}
	
}