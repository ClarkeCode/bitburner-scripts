import {formatMoney} from "/util/format.js";

/** @param {NS} ns **/

export async function main(ns) {
    var target = ns.args[0];
    ns.disableLog("ALL");
    // ns.tail();
    // ns.clearLog();
    if (!ns.serverExists(target)) {
        ns.print("ERROR: '" + target + " is not a server!");
    }
    // ns.print(ns.formulas.hacking);


    var output = ns.sprintf("[%s]\n%s / %s RAM: %.2f\n",
        target,
        formatMoney(ns, ns.getServerMoneyAvailable(target)),
        formatMoney(ns, ns.getServerMaxMoney(target)),
        ns.getServerMaxRam(target)
    );
    output += ns.sprintf("Backdoor: %s\n", ns.getServer(target).backdoorInstalled ? "YES" : "NO"); //Comment to lower by 2GB
    output += ns.sprintf("Requires Hacking LVL: %d\nSecurity: %.2f (Min %d)",
        ns.getServerRequiredHackingLevel(target),
        ns.getServerSecurityLevel(target),
        ns.getServerMinSecurityLevel(target)
    );
    
    if (ns.args.includes("scan")) {
        output += "\n\nConnected to:\n";
        for (var hn of ns.scan(target)) {
            output += ns.sprintf("%s\n", hn);
        }
    }

    ns.tprint(output);
}