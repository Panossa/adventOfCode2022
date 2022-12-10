const fileName = process.argv.slice(2)[0] || 'input.txt';

class Coordinate {
    constructor (x, y) {
        this.x = x;
        this.y = y;
    }

    isMoreThanOneAwayFrom(other) {
        return Math.abs(this.x - other.x) > 1 || Math.abs(this.y - other.y) > 1;
    }
}

const MOVEMENT_DICT = {
    "U": new Coordinate(0, 1),
    "R": new Coordinate(1, 0),
    "D": new Coordinate(0, -1),
    "L": new Coordinate(-1, 0)
}
const ORIGIN = new Coordinate(0, 0);
const tailVisitedCoordinates = [ORIGIN];

function wasVisitedByTail(newCoordinate) {
    return tailVisitedCoordinates.some(coord => coord.x === newCoordinate.x && coord.y === newCoordinate.y);
}

async function solve() {
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileName)
    });

    let headPosition = ORIGIN;
    let tailPosition = ORIGIN;
    let lastHeadPosition;

    for await (const line of lineReader) {
        const move = line.split(' ');
        const direction = MOVEMENT_DICT[move[0]];
        const amount = move[1];

        for (let moveCount = 0; moveCount < amount; moveCount++) {
            lastHeadPosition = headPosition;
            headPosition = new Coordinate(
                headPosition.x + direction.x, 
                headPosition.y + direction.y
            );

            if (headPosition.isMoreThanOneAwayFrom(tailPosition)) {
                tailPosition = lastHeadPosition;
                // Each time the tail moves, check if We Were Here before. (Good game, btw.)
                if (!wasVisitedByTail(tailPosition)) {
                    tailVisitedCoordinates.push(tailPosition);
                }
            }
        }
    }

    console.log(tailVisitedCoordinates.length);
}
  
solve();