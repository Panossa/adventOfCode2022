let input = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

// O(n^3) or something?
function oneLineSolution(input) {
	return input.split('\n\n').reduce((previousValue, currentString) => Math.max(previousValue, currentString.split('\n').reduce((previous, current) => Number(previous)+Number(current), 0)), 0);
}

// O(n) solution, afaik
function performantSolution(input) {
	// any other solution to process the last number I found made the code below incomprehensible. :/
	input += '\n\n';

	let biggestSum = 0;
	let currentString = '';
	let lastChar = '';
	let currentSum = 0;
	for(let stringIndex = 0; stringIndex < input.length; stringIndex++) {
		const currentChar = input[stringIndex];
		if (currentChar === '\n') {
			if(lastChar === '\n') {
				// means current sum is now "final", can be compared to biggestSum
				biggestSum = Math.max(biggestSum, currentSum);
				// ... and reset
				currentSum = 0;
			} else {
				// means current string can be added to current sum
				currentSum += Number(currentString);
				// ... and reset
				currentString = '';
			}
		} else {
			currentString += currentChar;
		}
		lastChar = currentChar;
	}
	return biggestSum;
}