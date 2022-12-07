
const fileName = process.argv.slice(2)[0] || 'input.txt';
const EMPTY = '_';

async function solve() {
	const lineReader = require('readline').createInterface({
		input: require('fs').createReadStream(fileName)
	});

	const moves = [];
	const stackLines = [];

	// --------
	// Strip data from lines
	// --------
	for await (const line of lineReader) {
		if (line.startsWith('m')) {
			moves.push({
				count: Number(line.substring(5, line.indexOf(' f'))),
				from: Number(line.substring(line.indexOf('om ')+3, line.indexOf(' t'))) - 1, // they really started indexing from 1?!
				to: Number(line.substring(line.indexOf('o ')+2, line.length)) - 1
			});
		} else {
			// two lines means it's a stack line, while the "1 2 3" line starts with one space
			if (line.startsWith('  ') || line.startsWith('[')) {
				// removes [], then extracts each single (uppercase) character and each occurrence of three spaces (indicating that slot is EMPTY)
				/* example of such a push: 
					[
						['_', 'D', '_']
					]
				 */
				stackLines.push(line.replace(/[\[\]]/g,'').replace(/\s{3,4}/g, EMPTY).match(new RegExp(`(${EMPTY}|[A-Z])`,'g')));
				/* 
				Alternative, which is probably easier to work with but looks less simple when used further: 
					lines.forEach(line => console.log(line.match(/.{2,4}/g)));
				*/
			}
		}
	}

	// revert lines so they're pointing in a way a stack would. This can be done more efficient but this is a quick way in code.
	stackLines.reverse();

	const stackList = [];
	
	// --------
	// Convert stripped data to actually usable stacks (in this case a 2D array)
	// --------
	for (let stackRowIndex in stackLines) {
		for (let stackColumnIndex in stackLines[stackRowIndex]) {
			const cellContent = stackLines[stackRowIndex][stackColumnIndex];
			if (cellContent === EMPTY) {
				continue;
			}
			if (!stackList[stackColumnIndex]) {
				// initialize two-dimensional array as JS has no native support for those.
				stackList[stackColumnIndex] = [];
			}
			stackList[stackColumnIndex][stackRowIndex] = cellContent;
		}
	}

	// --------
	// Apply series of moves
	// --------
	for (let move of moves) {
		for (let i = 0; i < move.count; i++) {
			const takenElement = stackList[move.from].pop();
			stackList[move.to].push(takenElement);
		}
	}
	
	// --------
	// Calculate result.
	// --------
	console.log(stackList.reduce((previousString, currentStack) => previousString + currentStack[currentStack.length-1], ''));
}

solve();
