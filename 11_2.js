const fileName = process.argv.slice(2)[0] || 'input.txt';

class ItemMove {
    constructor(itemWorryLevel, monkeyTo) {
        this.itemWorryLevel = itemWorryLevel;
        this.monkeyTo = monkeyTo;
    }
}

class Monkey {
    constructor(itemWorryLevels, operation, divisor, monkeyIfTrue, monkeyIfFalse) {
        this.itemWorryLevels = itemWorryLevels;
        this.operation = operation;
        this.divisor = divisor;
        this.monkeyIfTrue = monkeyIfTrue;
        this.monkeyIfFalse = monkeyIfFalse;
        this.inspectionCount = 0;
    }

    calculateMove() {
        // returns Item Move array. Example: [{itemWorryLevel: 500, monkeyTo: 0}]
        const result = this.itemWorryLevels.map(worryLevel => {
            const newWorryLevel = this.operation(worryLevel) % globalDivisor;
            this.inspectionCount++;
            return new ItemMove(newWorryLevel, newWorryLevel % this.divisor === 0 ? this.monkeyIfTrue : this.monkeyIfFalse);
        });
        // Reset worry levels as the monkey gives every item away
        this.itemWorryLevels = [];
        return result;
    }
}

const OPERATION_COUNT = 10000;
let globalDivisor;

async function solve() {
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileName)
    });
  
    const monkeys = [];

    let startingItems;
    let operation;
    let divisor;
    let monkeyIfTrue;

    for await (const line of lineReader) {
        const lineContents = line.replaceAll('  ', '').split(' ');
        switch(lineContents[0]) {
            case "Starting": 
                // starting from index 2 because 0 = "Starting", 1 = "items"
                startingItems = lineContents.slice(2, lineContents.length).map(numberString => BigInt(numberString.replace(',', '')));
                continue;
            case "Operation:": 
                const operationSign = lineContents[4];
                const value = lineContents[5];
                if (operationSign === '*') {
                    if (value === 'old') {
                        operation = (worryLevel) => worryLevel * worryLevel;
                    } else {
                        operation = (worryLevel) => worryLevel * BigInt(value);
                    }
                } else {
                    if (value === 'old') {
                        operation = (worryLevel) => worryLevel + worryLevel;
                    } else {
                        operation = (worryLevel) => worryLevel + BigInt(value);
                    }
                }
                continue;
            case "Test:": 
                divisor = BigInt(lineContents[3]);
                continue;
            case "If": 
                if(lineContents[1].startsWith('t')) {
                    monkeyIfTrue = Number(lineContents[5]);
                } else {
                    monkeys.push(new Monkey(startingItems, operation, divisor, monkeyIfTrue, Number(lineContents[5])));
                }
                break;
        }
    }

    globalDivisor = monkeys.reduce((product, currentMonkey) => product * currentMonkey.divisor, 1n);

    for (let count = 0; count < OPERATION_COUNT; count++) {
        monkeys.forEach((monkey, index) => {
            const result = monkey.calculateMove();
            for (const move of result) {
                monkeys[move.monkeyTo].itemWorryLevels.push(move.itemWorryLevel);
            }
        });
    }

    console.log(
        monkeys
            .map(monkey => monkey.inspectionCount) // set up for simple sort
            .sort().reverse() // no custom sort needed as the array only contains numbers at this point
            .slice(0, 2) // first two monkeys
            .reduce((monkeyBusiness, currentNumber) => monkeyBusiness * currentNumber, 1) // calculate "monkey business"
    );

}
  
solve();
