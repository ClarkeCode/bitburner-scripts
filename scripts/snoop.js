import {formatMoney, formatTime} from "/util/format.js";

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


    var output = ns.sprintf("[%s] (%s) Backdoor: %s\n", 
        target, ns.getServerRequiredHackingLevel(target), ns.getServer(target).backdoorInstalled ? "YES" : "NO"
    ); //Comment to lower by 2GB
    output += ns.sprintf("%s / %s RAM: %.2f\n",
        formatMoney(ns, ns.getServerMoneyAvailable(target)),
        formatMoney(ns, ns.getServerMaxMoney(target)),
        ns.getServerMaxRam(target)
    );
    output += ns.sprintf("Security: %.2f (Min %d)\n",
        ns.getServerSecurityLevel(target),
        ns.getServerMinSecurityLevel(target)
    );
    output += ns.sprintf("H: %s, G: %s, W: %s",
        formatTime(ns, ns.getHackTime(target)),
        formatTime(ns, ns.getGrowTime(target)),
        formatTime(ns, ns.getWeakenTime(target))
    );
    
    if (ns.args.includes("scan")) {
        output += "\n\nConnected to:\n";
        for (var hn of ns.scan(target)) {
            output += ns.sprintf("%s\n", hn);
        }
    }

    ns.tprint(output);
}