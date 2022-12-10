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

const KNOT_COUNT = 10;
const MOVEMENT_DICT = {
    "U": new Coordinate(0, 1),
    "R": new Coordinate(1, 0),
    "D": new Coordinate(0, -1),
    "L": new Coordinate(-1, 0)
}
const ORIGIN = new Coordinate(0, 0);
const tailVisitedCoordinates = new Set().add(new Coordinate(ORIGIN.x, ORIGIN.y));

function asTendency(number) {
    return number < 0 ? -1 : number > 0 ? 1 : 0;
}

function directionFrom(from, to) {
    return new Coordinate(
        asTendency(to.x - from.x),
        asTendency(to.y - from.y)
    );
}

async function solve() {
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileName)
    });

    // 0 = head, 9 = tail
    const positions = new Array(KNOT_COUNT).fill().map(() => new Coordinate(ORIGIN.x, ORIGIN.y));

    for await (const line of lineReader) {
        const move = line.split(' ');
        const amount = move[1];

        for (let moveCount = 0; moveCount < amount; moveCount++) {
            for (let knotIndex = 0; knotIndex < positions.length; knotIndex++) {
                const knot = positions[knotIndex];
                let direction = new Coordinate(0, 0);
                if (knotIndex === 0) {
                    // moving head, without looking at previous knots
                    direction = MOVEMENT_DICT[move[0]];
                } else {
                    const previousKnot = positions[knotIndex - 1];
                    if (knot.isMoreThanOneAwayFrom(previousKnot)) {
                        // Moving any of the other ones by looking at the previous one
                        direction = directionFrom(knot, previousKnot);
                    } // else not move at all!
                }

                knot.x += direction.x;
                knot.y += direction.y;

                if (knotIndex === KNOT_COUNT - 1) {
                    // Last knot is the tail, we need to note down where it goes.
                    if (!wasVisitedByTail(knot)) {
                        tailVisitedCoordinates.add(new Coordinate(knot.x, knot.y));
                    }
                }
            }
        }
    }

    console.log(tailVisitedCoordinates.length);
}
  
solve();