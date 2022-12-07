const fileName = process.argv.slice(2)[0] || 'input.txt';

async function solve() {
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileName)
    });
  
    let overlapCount = 0;
  
    for await (const line of lineReader) {
      const pair = line.split(',').map(rangeString => {
        const rangeSplit = rangeString.split('-');
        return {
          start: Number(rangeSplit[0]), 
          end: Number(rangeSplit[1])
        };
      }).sort((a,b) => a.start - b.start);

      const former = pair[0];
      const latter = pair[1];
      // Since we already sorted them so that former starts earlier, a simple check suffices.
      if (former.end >= latter.start) {
        overlapCount++;
      }
    }
    console.log(overlapCount);
  }
  
  solve();