/** @param {NS} ns **/

//Money is in dollars, return is formatted string
export function formatMoney(ns, money){
	if (money > 1000*1000*1000)	return ns.sprintf("%.2fb", money/1000000000);
	if (money > 1000*1000)		return ns.sprintf("%.2fm", money/1000000);
	if (money > 1000)			return ns.sprintf("%.2fk", money/1000);
	return ns.sprintf("%.0f", money);
}

function ratioToPercent(val, oneIndexed=false) {
	return (val- (oneIndexed ? 1 : 0))*100;
}
export function formatPercent(ns, currentVal, maxVal) {
	return ns.sprintf("%.2f%%", ratioToPercent(currentVal/maxVal));
}

function twoDigit(ns, val) {
	return ns.sprintf(val < 10 ? "0%d" : "%d", val);
}
//Return string, time in seconds
/**
 * Returns formatted string of the time (provided in mili-seconds)
 */
export function formatTime(ns, time) {
	let timeval = time/1000;
	let hours   = Math.floor(timeval/(60**2));
	let minutes = Math.floor((timeval-(hours*60**2))/60);
	let seconds = timeval - hours*60**2 - minutes*60;

	if (timeval < 60) {
		return ns.sprintf("%2.2fs", seconds);
	}
	else if (timeval < 60**2) {
		return ns.sprintf("%d:%sm", minutes, twoDigit(ns, seconds));
	}

	return ns.sprintf("%d:%s:%shrs", hours, twoDigit(ns, minutes), twoDigit(ns, seconds));
}

export function formatAction(ns, host, target, action, actionTime=0) {
	var fstr = actionTime == 0 ? "[%s]->[%s] %s" : "[%s]->[%s] %s in %s";
	return ns.sprintf(fstr, host, target, action, formatTime(ns, actionTime));
}