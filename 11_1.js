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
            const newWorryLevel = parseInt(this.operation(worryLevel) / 3);
            this.inspectionCount++;
            return new ItemMove(newWorryLevel, newWorryLevel % this.divisor === 0 ? this.monkeyIfTrue : this.monkeyIfFalse);
        });
        // Reset worry levels as the monkey gives every item away
        this.itemWorryLevels = [];
        return result;
    }
}

const OPERATION_COUNT = 20;

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
                startingItems = lineContents.slice(2, lineContents.length).map(numberString => Number(numberString.replace(',', '')));
                continue;
            case "Operation:": 
                const operationSign = lineContents[4];
                const value = lineContents[5];
                if (operationSign === '*') {
                    if (value === 'old') {
                        operation = (worryLevel) => worryLevel * worryLevel;
                    } else {
                        operation = (worryLevel) => worryLevel * Number(value);
                    }
                } else {
                    if (value === 'old') {
                        operation = (worryLevel) => worryLevel + worryLevel;
                    } else {
                        operation = (worryLevel) => worryLevel + Number(value);
                    }
                }
                continue;
            case "Test:": 
                divisor = Number(lineContents[3]);
                continue;
            case "If": 
                if(lineContents[1].startsWith('t')) {
                    monkeyIfTrue = Number(lineContents[5]);
                } else {
                    monkeys.push(new Monkey(startingItems, operation, divisor, monkeyIfTrue, lineContents[5]));
                }
                break;
        }
    }

    for (let count = 0; count < OPERATION_COUNT; count++) {
        monkeys.forEach(monkey => {
            const result = monkey.calculateMove();
            for (const move of result) {
                monkeys[move.monkeyTo].itemWorryLevels.push(move.itemWorryLevel);
            }
        });
    }

    console.log(
        monkeys
            .sort((a,b) => b.inspectionCount - a.inspectionCount) // highest to the front
            .slice(0, 2) // first two monkeys
            .reduce((monkeyBusiness, currentMonkey) => monkeyBusiness * currentMonkey.inspectionCount, 1) // calculate "monkey business"
    );

}
  
solve();
