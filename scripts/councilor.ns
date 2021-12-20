/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0] == undefined ? ns.getHostname() : ns.args[0];
    var servProgs = ns.ls(target).filter(a => {return a.endsWith(".ns"); });
    ns.tprint(servProgs);

    var targetRAM = ns.getServerMaxRam(target);
    var remainingRAM = targetRAM - ns.getServerUsedRam(target);

    ns.tprintf("%16s :: %-12s :: %s", "Script", "Maxthreads", "Current consumption");
    ns.tprintf("%s", "==".repeat(30));
    for (var prog of servProgs) {
        var progCost = ns.getScriptRam(prog);
        ns.tprintf("%16s :: %-12.2f :: %-12.2f", prog, targetRAM/progCost, remainingRAM/progCost);
    }
}