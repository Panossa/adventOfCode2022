const dict = {
  A: 0, 
  B: 1,
  C: 2,
  X: 0,
  Y: 1,
  Z: 2
}

const fileName = process.argv.slice(2)[0] || 'input.txt';

async function processFile() {
  let totalPoints = 0;
  const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(fileName)
  });

  for await (const line of lineReader) {
    const enemyInput = dict[line.charAt(0)];
    const ownInput = dict[line.charAt(2)];

    const draw = ownInput === enemyInput;
    // Only using modulo if needed or even setting it to 0 manually if it reaches 3 would be way faster but less smart-looking.
    const win = (enemyInput + 1) % 3 === ownInput;
    const gameResultPoints = win ? 6 : draw ? 3 : 0;
    totalPoints += ownInput + 1 + gameResultPoints;
  }

  console.log(totalPoints);
}

processFile();