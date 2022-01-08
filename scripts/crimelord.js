/** @param {NS} ns **/
export async function main(ns) {
	ns.tail();
	while (true) {
    	ns.commitCrime(ns.args[0]);
		await ns.sleep(3000);
	}
}