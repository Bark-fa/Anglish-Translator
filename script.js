function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


window.onload = function () {

    // set up the constants.
    const translateBtn = document.getElementById("translate")
    const input = document.getElementById("english")
    const output = document.getElementById("anglish")
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const specialCharacters = /[ `!@#$%^&*,.;?~()]/;

    // Language indicator
    let translateToAnglish = true;

    translateBtn.onclick = function () {

        // Set up the variables.
        let inputWords = english.value;
        let outputText = ""
        let keys = [];
        let specialCharactersIndex = {};
        let textSize = 0;
        let outputTextSize = 0;


        // Split the English text into separate words based on the space character, and make the text all lowercase.
        inputWords = inputWords.split(" ").map(function (f) {
            return f.toLowerCase();
        });

        textSize = inputWords.length
        // Check if word contains special characters, if so handle them.
        inputWords.forEach((word, index) => {
            word = word.trim();

            if (specialCharacters.test(word)) {
                let character = word.match(specialCharacters);
                Object.assign(specialCharactersIndex, {
                    [index]: [character]
                });
                inputWords[index] = word.replace(/[ `!@#$%^&*,.;?~()]/g, '');

            }

        });
        for (var k in specialCharactersIndex) keys.push(k);

        /* Check for special words (words that have spaces in them) by adding the index, plus word after it and checking for them in the wordbook file, if that didn't work check to see if the index and the TWO words after it exist....yeah it's retarded I know */

        // I'm 99% sure there must be a better way to do this.


        inputWords.forEach((word, index) => {

            let twoWords = inputWords[index] + " " + inputWords[index + 1];
            let threeWords = inputWords[index] + " " + inputWords[index + 1] + " " + inputWords[index + 2];

            if (translateToAnglish) {
                // value by key (English->Anglish)
                if (twoWords in wordbook) {
                    inputWords[index] = wordbook[twoWords];
                    inputWords[index + 1] = "";

                } else if (threeWords in wordbook) {

                    inputWords[index] = wordbook[threeWords];
                    inputWords[index + 1] = "";
                    inputWords[index + 2] = "";

                }

            } else {
                // key by value (Anglish->English)
                if (Object.values(wordbook).includes(twoWords)) {

                    inputWords[index] = Object.keys(wordbook).find(key => wordbook[key] === twoWords);
                    inputWords[index + 1] = "";

                } else if (Object.values(wordbook).includes(threeWords)) {

                    inputWords[index] = Object.keys(wordbook).find(key => wordbook[key] === threeWords);
                    inputWords[index + 1] = "";
                    inputWords[index + 2] = "";
                
                }

            }
        });



        // Check if an English word has an Anglish translation, if so swap the English word with its Anglish match.

        inputWords.forEach((word, index) => {
            word = word.trim();
            if (translateToAnglish) {
                // value by key (English->Anglish)
                if (word in wordbook) {
                    inputWords[index] = wordbook[word];
                } else if (singulariseThenPluralise(word) != undefined && singulariseThenPluralise(word) != "") {
                    console.log(`word in wordbook SINGULAR/PLURAL ${inputWords[index]} ${wordbook[word]}`)
                } else if (toPresentTenseThenPastTense(word) != undefined) {
                    console.log(`word in wordbook PRESENT ${inputWords[index]} ${wordbook[word]}`)
                } else if (presentContinuous(word) != undefined) {
                    console.log(`word in wordbook PRESENT CONTINUOUS ${inputWords[index]} ${presentContinuous(word)}`)
                    inputWords[index] = presentContinuous(word);
                } else {
                    inputWords[index] = word
                    outputTextSize++;
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

                if (inputWords[index + 1] != undefined && vowels.includes(inputWords[index + 1][0])) {

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
            index == 0 ? outputText += word : outputText += " " + word;
        });

        // Display the translated text.
        anglish.textContent = capitaliseFirstLetter(outputText);
        let percentage = Math.round((outputTextSize / textSize) * 100);
        let color;
        if (percentage >= 51) {
            color = "green";

        } else if (percentage >= 35 && percentage < 51) {

            color = "orange";

        } else if (percentage >= 0 && percentage < 35) {

            color = "red";

        }

        if(translateToAnglish) {

        document.getElementById('percentage').textContent = `The original text was ${percentage}% Germanic English`;
        }

        document.getElementById('percentage').style.color = color;

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

