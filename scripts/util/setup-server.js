/** Copies desired programs to the target server
 * @param {NS} ns
 * @param {String} target Hostname of the server
 */
export async function setupServer(ns, target, noisy=true) {
    var programs = ns.ls("home", "util");
	programs.push("bootstrap.js", "jackercrack.js",
    "survey.js", "goto.js", "overlord.js", "webcrawler.js");
    
    var copied = (await ns.scp(programs, "home", target));
    // ns.tprint(copied);
    var copied = true;
    if (noisy) ns.toast(ns.sprintf(
            "Server '%s' was %s set up",
            target, (copied ? "" : "not ")
        ), 
        copied ? "success" : "error", 3000);
}

/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];
    await setupServer(ns, target);
}