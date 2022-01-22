/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	ns.disableLog("sleep");
	while (true) {
    	ns.commitCrime(ns.args[0]);
		while (ns.isBusy()) await ns.sleep(1000);
	}
}