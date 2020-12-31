document.writeln("<script type='text/javascript' src='wordbook.js'></script>")
document.writeln("<script type='text/javascript' src='special-words.js'></script>")


function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


window.onload = function () {

    // set up the constants.
    const translateBtn = document.getElementById("translate")
    const english = document.getElementById("english")
    const anglish = document.getElementById("anglish")
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const specialCharacters = /[ `!@#$%^&*,.;?~()]/;

    translateToAnglish = function () {

        // Set up the variables.
        let englishText = english.value;
        let anglishText = ""
        let keys = [];
        let specialCharactersIndex = {};


        // Split the English text into seperate words based on the space character, and make the text all lowercase.
        let englishWords = englishText.split(" ").map(function (f) {
            return f.toLowerCase();
        });

        // Check if word contains special characters, if so handle them.

        englishWords.forEach((word, index) => {

            if (specialCharacters.test(word)) {
                let character = word.match(specialCharacters);
                Object.assign(specialCharactersIndex, {
                    [index]: [character]
                });
                englishWords[index] = word.replace(/[ `!@#$%^&*,.;?~()]/g, '');

            }

        });
        for (var k in specialCharactersIndex) keys.push(k);



        /* Check for special words (words that have spaces in them) by adding the index, plus word after it and checking for them in the special-words.js file, if that didn't work check to see if the index and the TWO words after it exist....yeah it's retarded I know */

        // I'm 99% sure there must be a better way to do this.
        englishWords.forEach((word, index) => {

            if (englishWords[index] + " " + englishWords[index + 1] in words) {

                englishWords[index] = words[englishWords[index] + " " + englishWords[index + 1]];
                englishWords[index + 1] = "";

            } else if (englishWords[index] + " " + englishWords[index + 1] + " " + englishWords[index + 2] in words) {

                englishWords[index] = words[englishWords[index] + " " + englishWords[index + 1] + " " + englishWords[index + 2]];
                englishWords[index + 1] = "";
                englishWords[index + 2] = "";

            }
        });



        // Check if an English word has an Anglish translation, if so swap the English word with its Anglish match.
        englishWords.forEach((word, index) => {

            if (word in wordbook) {
                englishWords[index] = wordbook[word]

            }

        });


        // Decide if "a" or "an" should be used.
        englishWords.forEach((word, index) => {

            if (word.toLowerCase() == "an" || word.toLowerCase() == "a") {

                if (englishWords[index + 1] != undefined && englishWords[index + 1][0] in vowels) {

                    englishWords[index] = "an"

                } else {

                    englishWords[index] = "a"
                }
            }

        });


        // Re-add special characters according to their position in the original text, if the character was the first, it's added to the beginning, else it is added to the end of the word.
        englishWords.forEach((word, index) => {

            if (index in keys) {

                word = englishWords[keys[index]];
                let wordWithCharacters = word;

                if (specialCharactersIndex[keys[index]][0]['index'] == 0) {

                    wordWithCharacters = [...word];
                    wordWithCharacters[0] = specialCharactersIndex[keys[index]][0][0] + wordWithCharacters[0];
                    wordWithCharacters = wordWithCharacters.join('');

                } else {

                    wordWithCharacters += specialCharactersIndex[keys[index]][0][0];
                }


                englishWords[keys[index]] = wordWithCharacters;

            }
        });

        // Parse the translated words into a string, and add spacing between words.
        englishWords.forEach((word, index) => {

            if (index == 0) {

                anglishText += word;

            } else {

                anglishText += " " + word;
            }

        });



        // Display the translated text.
        anglish.textContent = capitaliseFirstLetter(anglishText);

    }
}
