const fileName = process.argv.slice(2)[0] || 'input.txt';

async function solve() {
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileName)
    });

    const trees = [];
    for await (const line of lineReader) {
        trees.push(line.split(''));
    }

    const cornerCount = 4;
    let visibleTreeCount = trees.length * 2 + trees[0].length * 2 - cornerCount;

    // Exclude edge on the top and bottom
    for (let row = 1; row < trees.length - 1; row++) {
        // Exclude edge on the left and right
        for (let column = 1; column < trees[row].length - 1; column++) {
            const treeInQuestion = trees[row][column];
            // check if this tree is visible from the left or right
            const leftTrees = trees[row].slice(0, column);
            const anyLeftTreeEqualOrBigger = leftTrees.some(currentLeftTree => currentLeftTree >= treeInQuestion);
            if (!anyLeftTreeEqualOrBigger) {
                visibleTreeCount++;
                continue;
            }

            const rightTrees = trees[row].slice(column + 1, trees.length);
            const anyRightTreeEqualOrBigger = rightTrees.some(currentRightTree => currentRightTree >= treeInQuestion);
            if (!anyRightTreeEqualOrBigger) {
                visibleTreeCount++;
                continue;
            }

            // check trees on top
            let anyTopTreeEqualOrBigger = false;
            for (let rowPointer = 0; rowPointer < row && !anyTopTreeEqualOrBigger; rowPointer++) {
                const treePointer = trees[rowPointer][column];
                if (treePointer >= treeInQuestion) {
                    anyTopTreeEqualOrBigger = true;
                    break;
                }
            }
            if (!anyTopTreeEqualOrBigger) {
                visibleTreeCount++;
                continue;
            }

            let anyBottomTreeEqualOrBigger = false;
            for (let rowPointer = row + 1; rowPointer < trees.length && !anyBottomTreeEqualOrBigger; rowPointer++) {
                const treePointer = trees[rowPointer][column];
                if (treePointer >= treeInQuestion) {
                    anyBottomTreeEqualOrBigger = true;
                    break;
                }
            }
            if (!anyBottomTreeEqualOrBigger) {
                visibleTreeCount++;
            }
        }
    }
    console.log(visibleTreeCount);
}
  
solve();