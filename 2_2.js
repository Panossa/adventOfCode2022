const dict = {
    A: 0, 
    B: 1,
    C: 2
};

const relativeDict = {
    X: 2, // X = lose, achieved by having a difference of 2
    Y: 0, // Y = draw, meaning we have to use the same
    Z: 1  // Z = win, meaning we need to go 1 up
};

const winDict = {
    X: 0,
    Y: 3,
    Z: 6
}

const fileName = process.argv.slice(2)[0] || 'input.txt';

async function processFile() {
    let totalPoints = 0;
    const lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(fileName)
    });

    for await (const line of lineReader) {
        const enemyInput = dict[line.charAt(0)];
        const ownRawInput = line.charAt(2);
        const ownInput = (enemyInput + relativeDict[ownRawInput]) % 3;

        totalPoints += ownInput + 1 + winDict[ownRawInput];
    }

    console.log(totalPoints);
}

processFile();