const fileName = process.argv.slice(2)[0] || 'input.txt';

// One false for every possible char. Using a tuple for better performance. 
// Only better way would be storing it in a binary number but I ain't got no time for that in JS.
const EMPTY_TUPLE = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 
  false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
// charCodeAt() vs. String.fromCharCode()
const FIRST_UPPER_CASE_LETTER_INDEX = 'A'.charCodeAt(0); // is 65 but this way there are no magic numbers
const FIRST_LOWER_CASE_LETTER_INDEX = 'a'.charCodeAt(0); // is 97
const ALPHABET_LENGTH = 26;

// In ASCII, upper case letters come first. We want them to be of a lower priority than lower case letters,
// meaning we need to swap where uppercase and lowercase letters are.
function getLetterIndex(charCode) {
  if (charCode < FIRST_LOWER_CASE_LETTER_INDEX) {
    // New range of uppercase letters: 26 through 51, offset by the alphabet length
    return charCode - FIRST_UPPER_CASE_LETTER_INDEX + ALPHABET_LENGTH;
  } else {
    // New range of lowercase letters: 0 through 25
    return charCode - FIRST_LOWER_CASE_LETTER_INDEX;
  }
}

async function semiPerformantSolution() {
  const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(fileName)
  });

  let sumOfValues = 0;

  for await (const line of lineReader) {
    // A theoretically faster way would be to create two binary trackers for which char was used and AND them.
    const firstHalfLetters = [...EMPTY_TUPLE];
    
    const halfPoint = line.length/2;
    const firstHalf = line.substring(0, halfPoint);
    const secondHalf = line.substring(halfPoint);

    // Fill in all used chars
    for (let i in firstHalf) {
      firstHalfLetters[getLetterIndex(firstHalf.charCodeAt(i))] = true;
    }

    // Check if any from first were used in the second
    for (let i in secondHalf) {
      const letterIndexOfSecondHalf = getLetterIndex(secondHalf.charCodeAt(i));
      if (firstHalfLetters[letterIndexOfSecondHalf]) {
        // this is the first duplicate char
        sumOfValues += letterIndexOfSecondHalf + 1; // arrays start at 0, priorities at 1.
        break;
      }
    }
  }
  console.log(sumOfValues);
}

semiPerformantSolution();