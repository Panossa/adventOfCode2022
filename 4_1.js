const fileName = process.argv.slice(2)[0] || 'input.txt';

async function solve() {
    const lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(fileName)
    });
  
    let containedCount = 0;
  
    for await (const line of lineReader) {
      const pair = line.split(',').map(rangeString => {
        const rangeSplit = rangeString.split('-');
        return {
          start: Number(rangeSplit[0]), 
          end: Number(rangeSplit[1])
        };
      });

      const former = pair[0];
      const latter = pair[1];
      // if first range is larger or equal to second or second range is larger or equal to first
      if ((former.start <= latter.start && former.end >= latter.end)
          || (former.start >= latter.start && former.end <= latter.end)) {
        containedCount++;
      }
    }
    console.log(containedCount);
  }
  
  solve();