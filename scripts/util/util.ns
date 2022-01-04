/** @param {NS} ns
 *  @param {string} target Hostname of the server to hack
 *  @param {number} threadCount Number of threads with which to hack
 *  @param {boolean} affectMarket Should this action affect the stock market
 * */
export async function performHack(ns, target, threadCount=1, affectMarket=false) {
	return ns.hack(target, {"threads": threadCount, "stock": affectMarket});	
}

/** @param {NS} ns
 *  @param {string} target Hostname of the server to grow
 *  @param {number} threadCount Number of threads with which to grow
 *  @param {boolean} affectMarket Should this action affect the stock market
 * */
export async function performGrow(ns, target, threadCount=1, affectMarket=false) {
	return ns.grow(target, {"threads": threadCount, "stock": affectMarket});	
}

/** @param {NS} ns
 *  @param {string} target Hostname of the server to weaken
 *  @param {number} threadCount Number of threads with which to weaken
 *  @param {boolean} affectMarket Should this action affect the stock market
 * */
export async function performWeaken(ns, target, threadCount=1, affectMarket=false) {
	return ns.weaken(target, {"threads": threadCount, "stock": affectMarket});
}

/** @param {NS} ns */
function getGrowthMulti(ns, target) {
	return ns.getServerMaxMoney(target) / ns.getServerMoneyAvailable(target);
}
/** @param {NS} ns 
 *  @param {string} target Hostname
 * **/
export function threadsToRefillServer(ns, target, cores=1) {
	return Math.ceil(ns.growthAnalyze(target, getGrowthMulti(ns, target), cores));
}
/** @param {NS} ns 
 *  @param {string} target Hostname
 * **/
export function threadsToMinSecurity(ns, target, cores=1.0) {
	var levelsToMinSecurity = ns.getServerSecurityLevel(target) - ns.getServerMinSecurityLevel(target);
	// ns.print(levelsToMinSecurity);
	// ns.print(ns.weakenAnalyze(target, cores));
	// ns.print(target);
	//TODO: figure out the NaN error when calling ns.weakenAnalyze
	return Math.ceil(levelsToMinSecurity / 0.05);// ns.weakenAnalyze(target, cores);
}

/** @param {NS} ns
 *  @param {string} target Hostname
 *  @param {number} desiredPercent Percentage to hack until eg: 0.5 = 50%
 * **/
export function threadsToHackUntilPercent(ns, target, desiredPercent) {
	var minMoney = ns.getServerMaxMoney(target) * desiredPercent;
	return Math.ceil(ns.hackAnalyzeThreads(target, ns.getServerMoneyAvailable(target)-minMoney));
}

/** @param {NS} ns **/
export async function main(ns) {
	ns.tprint(ns.weakenAnalyze(1));
	ns.tprint(threadsToRefillServer(ns, ns.args[0]));
}