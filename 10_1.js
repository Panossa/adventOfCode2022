const fileName = process.argv.slice(2)[0] || 'input.txt';

async function solve() {
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileName)
    });
  
    let cycle = 1;
    let register = 1;
    let signalStrengthSum = 0;

    function checkPOI() {
        if ((cycle - 20) % 40 == 0) {
            signalStrengthSum += (register * cycle);
        }
    }
  
    for await (const line of lineReader) {
        checkPOI();

        const params = line.split(' ');
        cycle++;
        
        if(params[0].charAt(0) === 'a') {
            checkPOI();
            register += Number(params[1]);
            cycle++;
        }
    }

    console.log(signalStrengthSum);
}
  
solve();