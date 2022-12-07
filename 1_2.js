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

// oneLineSolution would be similar but way more complex because reduce() 
// would need to reduce an array down to an array containing the top 3 elves

function performantSolution(input) {
	input += `\n\n`;
	let topThree = []; // ordered; 0 = smallest, 2 = biggest
	let currentString = '';
	let lastChar = '';
	let currentSum = 0;
	for(let stringIndex = 0; stringIndex < input.length; stringIndex++) {
		const currentChar = input[stringIndex];
		if (currentChar === '\n') {
			if(lastChar === '\n') {
				// means current sum is now "final", top 3 can be updated
				if (topThree.length < 3) {
					const isComplete = topThree.length === 2;
					topThree.push(currentSum);
					if (isComplete) {
						topThree.sort((a,b) => a-b);
					}
				} else {
					// compare to lowest number
					if (topThree[0] < currentSum) {
						// can be written without the if but saves the sort() operation in the else case
						topThree[0] = currentSum;
						// can possibly be made more performant without sort but sorting this is 
						// already at a time complexity of O(n log(n)) = O(3 log(3)) = O(1,43)
						topThree.sort((a, b) => a-b);
					}
				}
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
	return topThree[0] + topThree[1] + topThree[2];
}