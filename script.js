document.writeln("<script type='text/javascript' src='wordbook.js'></script>")
document.writeln("<script type='text/javascript' src='special-words.js'></script>")


function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


window.onload = function () {

    // set up the constants.
    const translateBtn = document.getElementById("translate")
    const input = document.getElementById("input")
    const output = document.getElementById("output")
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const specialCharacters = /[ `!@#$%^&*,.;?~()]/;

    let translateToAnglish = true;

    translate = function () {

        // Set up the variables.
        let inputText = input.value;
        let outputText = ""
        let keys = [];
        let specialCharactersIndex = {};


        // Split the input text into seperate words based on the space character, and make the text all lowercase.
        let inputWords = inputText.split(" ").map(function (f) {
            return f.toLowerCase();
        });

        // Check if word contains special characters, if so handle them.

        inputWords.forEach((word, index) => {

            if (specialCharacters.test(word)) {
                let character = word.match(specialCharacters);
                Object.assign(specialCharactersIndex, {
                    [index]: [character]
                });
                inputWords[index] = word.replace(/[ `!@#$%^&*,.;?~()]/g, '');

            }

        });
        for (var k in specialCharactersIndex) keys.push(k);



        /* Check for special words (words that have spaces in them) by adding the index, plus word after it and checking for them in the special-words.js file, if that didn't work check to see if the index and the TWO words after it exist....yeah it's retarded I know */

        // I'm 99% sure there must be a better way to do this.
        inputWords.forEach((word, index) => {

            let twoWords = inputWords[index] + " " + inputWords[index + 1];
            let threeWords = inputWords[index] + " " + inputWords[index + 1] + " " + inputWords[index + 2];

            if (translateToAnglish) {
                // value by key (English->Anglish)
                if (twoWords in words) {

                    inputWords[index] = words[twoWords];
                    inputWords[index + 1] = "";

                } else if (threeWords in words) {

                    inputWords[index] = words[threeWords];
                    inputWords[index + 1] = "";
                    inputWords[index + 2] = "";

                }

            } else {
                // key by value (Anglish->English)
                if (Object.values(words).includes(twoWords)) {

                    inputWords[index] = Object.keys(words).find(key => words[key] === twoWords);
                    inputWords[index + 1] = "";

                } else if (Object.values(words).includes(threeWords)) {

                    inputWords[index] = Object.keys(words).find(key => words[key] === threeWords);
                    inputWords[index + 1] = "";
                    inputWords[index + 2] = "";
                
                }

            }
        });



        // Check if an input word has a translation, if so swap the input word with its match.
        inputWords.forEach((word, index) => {

            if (translateToAnglish) {
                // value by key (English->Anglish)
                if (word in wordbook) {
                    inputWords[index] = wordbook[word]

                }

            } else {
                // key by value (Anglish->English)
                if (Object.values(wordbook).includes(word)) {
                    inputWords[index] = Object.keys(wordbook).find(key => wordbook[key] === word)
                }

            }

        });

        // Decide if "a" or "an" should be used.
        inputWords.forEach((word, index) => {

            if (word.toLowerCase() == "an" || word.toLowerCase() == "a") {

                if (inputWords[index + 1] != undefined && inputWords[index + 1][0] in vowels) {

                    inputWords[index] = "an"

                } else {

                    inputWords[index] = "a"
                }
            }

        });


        // Re-add special characters according to their position in the original text, if the character was the first, it's added to the beginning, else it is added to the end of the word.
        inputWords.forEach((word, index) => {

            if (index in keys) {

                word = inputWords[keys[index]];
                let wordWithCharacters = word;

                if (specialCharactersIndex[keys[index]][0]['index'] == 0) {

                    wordWithCharacters = [...word];
                    wordWithCharacters[0] = specialCharactersIndex[keys[index]][0][0] + wordWithCharacters[0];
                    wordWithCharacters = wordWithCharacters.join('');

                } else {

                    wordWithCharacters += specialCharactersIndex[keys[index]][0][0];
                }


                inputWords[keys[index]] = wordWithCharacters;

            }
        });

        // Parse the translated words into a string, and add spacing between words.
        inputWords.forEach((word, index) => {

            if (index == 0) {

                outputText += word;

            } else {

                outputText += " " + word;
            }

        });



        // Display the translated text.
        output.textContent = capitaliseFirstLetter(outputText);

    }

    swap = function () {
        translateToAnglish = !translateToAnglish;

        if (translateToAnglish) {
            translateBtn.value = "Translate to Anglish";
            input.placeholder = "English goes here";
            output.placeholder = "Anglish translation will show here";
        } else {
            translateBtn.value = "Translate to English";
            input.placeholder = "Anglish goes here";
            output.placeholder = "English translation will show here";
        }

        
        let temp = input.value;
        input.value = output.textContent;
        output.textContent = temp;
    }
}
