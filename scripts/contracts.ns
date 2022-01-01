//Merge Overlapping Intervals
/**
 * @param {Array} input
 * Merge Overlapping Intervals
 */
function merge_overlapping_intervals(input) {
	var output = [];
	// output.slice()

	var isOverlap = (p1, p2) => { return p2[0] <= p1[1]; }
	var mergeOverlap = (p1, p2) => { return [Math.min(p1[0], p2[0]), Math.max(p1[1], p2[1])]; }

	while (input.length != 0) {
		var coord = input[0];
		var overlaps = input.filter(c => isOverlap(coord, c));
		// ns.tprint(overlaps);
		output.push(overlaps.reduce(mergeOverlap));
		input = input.filter(c => !overlaps.includes(c));

		//If there are any overlaps in the output, place the output back in the processing tray
		for (var cd of output) {
			for (var ce of output.filter(c => c != cd)) {
				if (isOverlap(cd, ce)) {
					input = output;
					output = [];
					break;
				}
			}
		}
	}
	
	return output;
}

/** @param {NS} ns **/
export async function main(ns) {
	var list     = ns.args.includes("list");
	var host     = ns.args[list ? 1 : 0];
	var contract = ns.args[list ? 2 : 1];

	var ctType  = ns.codingcontract.getContractType(contract, host);
	var solvers = { "Merge Overlapping Intervals": merge_overlapping_intervals };

	if (list) {
		ns.tprintf("Contract: %s:/%s Attempts: %d\nType: '%s'\n%s", host, contract,
			ns.codingcontract.getNumTriesRemaining(contract, host),
			ns.codingcontract.getContractType(contract, host),
			ns.codingcontract.getDescription(contract, host)
		);
	}
	else if (Object.keys(solvers).includes(ctType)) {
		ns.tprint("Exists");
		var input = ns.codingcontract.getData(contract, host);
		var result = solvers[ctType](input);
		// ns.tprint(result);
		// ns.codingcontract.attempt(JSON.stringify())
		var att = ns.codingcontract.attempt(JSON.stringify(result), contract, host, {"returnReward": true});
		ns.tprint(att);
	}
	else {
		ns.tprintf("WARNING: %s does not have the ability to solve '%s' problems", ns.getScriptName(), ctType);
		return;
		// var test = [[1,3], [8,10], [2,6], [10,16]];
		var test = ns.codingcontract.getData(contract, host);
		ns.tprint(merge_overlapping_intervals(ns, test));
	}
}