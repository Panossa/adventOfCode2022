const fileName = process.argv.slice(2)[0] || 'input.txt';

// One false for every possible char. Using a tuple for better performance. 
// Only better way would be storing it in a binary number but I ain't got no time for that in JS.
const EMPTY_TUPLE = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, 
  false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false];
// charCodeAt() vs. String.fromCharCode()
const FIRST_UPPER_CASE_LETTER_INDEX = 'A'.charCodeAt(0); // is 65 but this way there are no magic numbers
const FIRST_LOWER_CASE_LETTER_INDEX = 'a'.charCodeAt(0); // is 97
const ALPHABET_LENGTH = 26;

const GROUP_SIZE = 3;

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

async function lazySolution() {
  const lineReader = require('readline').createInterface({
    input: require('fs').createReadStream(fileName)
  });

  let sumOfValues = 0;
  let groupIndex = 0;
  let usedLetters;

  for await (const line of lineReader) {
    switch(groupIndex) {
        // first of a group fills usedLetters
        case 0: 
            // reset used letters
            usedLetters = [...EMPTY_TUPLE];

            // Fill in all used chars, don't check anything
            for (let i in line) {
                usedLetters[getLetterIndex(line.charCodeAt(i))] = true;
            }
            break;
        // second of a group removes all letters they're not using thems-elves - hah, get it?
        case 1: 
            // Falsify all letters from first backpack NOT used here
            for (let i in line) {
                const letterIndexInBackpack = getLetterIndex(line.charCodeAt(i));
                if (usedLetters[letterIndexInBackpack]) {
                // this already exists
                sumOfValues += letterIndexInBackpack + 1; // arrays start at 0, priorities at 1.
                break;
                }
            }
            break;
        case 2: break;
    }

    // Here, using binary numbers would be EVEN better because two ANDs would automatically check everything.
    if (groupIndex === 0) {
        
    } else {
        
    }
    
    //console.log(`Finding char ${firstHalf.charAt(0)} aka charCode ${firstHalf.charCodeAt(0)} aka our index ${getLetterIndex(firstHalf.charCodeAt(0))}`);
    groupIndex = (groupIndex + 1) % GROUP_SIZE;
  }
  console.log(sumOfValues);
}

lazySolution();