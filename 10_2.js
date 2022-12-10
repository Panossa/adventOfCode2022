const fileName = process.argv.slice(2)[0] || 'input.txt';

async function solve() {
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileName)
    });

    let cycle = 1;
    let spriteMiddlePosition = 1;
    let currentLine = '';

    function checkPOI() {
        const position = cycle % 40;
        
        currentLine += Math.abs(spriteMiddlePosition - (position - 1)) > 1 ? '.' : '#';

        if (position === 0) {
            console.log(currentLine);
            currentLine = '';
        }
    }
  
    for await (const line of lineReader) {
        checkPOI();

        const params = line.split(' ');
        cycle++;
        
        if(params[0].charAt(0) === 'a') {
            checkPOI();
            spriteMiddlePosition += Number(params[1]);
            cycle++;
        }
    }
}
  
solve();