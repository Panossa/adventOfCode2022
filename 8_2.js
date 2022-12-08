const fileName = process.argv.slice(2)[0] || 'input.txt';

function calculateScore(treeArray, treeInQuestion) {
    let score = 0;
    
    for (const tree of treeArray) {
        score++;
        if (tree >= treeInQuestion) {
            break;
        }
    }
    // At least one tree is always visible
    return Math.max(1, score);
}

async function solve() {
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileName)
    });

    const trees = [];
    for await (const line of lineReader) {
        trees.push(line.split(''));
    }

    let highestScore = 0;

    // Exclude edge on the top and bottom
    for (let row = 1; row < trees.length - 1; row++) {
        // Exclude edge on the left and right
        for (let column = 1; column < trees[row].length - 1; column++) {
            const treeInQuestion = trees[row][column];
            let scores = [];

            const currentRow = trees[row];
            const currentColumn = trees.map(row => row[column]);

            const leftTrees = currentRow.slice(0, column).reverse();
            const rightTrees = currentRow.slice(column + 1, trees[0].length);
            const topTrees = currentColumn.slice(0, row).reverse();
            const bottomTrees = currentColumn.slice(row + 1, trees.length);
            
            scores[0] = calculateScore(leftTrees, treeInQuestion);
            scores[1] = calculateScore(rightTrees, treeInQuestion);
            scores[2] = calculateScore(topTrees, treeInQuestion);
            scores[3] = calculateScore(bottomTrees, treeInQuestion);
        
            const treeScore = scores.reduce((previous, current) => previous * current, 1);
            highestScore = Math.max(highestScore, treeScore);
        }
    }
    console.log(highestScore);
}
  
solve();