document.writeln("<script type='text/javascript' src='wordbook.js'></script>")


function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


window.onload = function () {

    // set up the constants.
    const translateBtn = document.getElementById("translate")
    const english = document.getElementById("english")
    const anglish = document.getElementById("anglish")
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    const specialCharacters = /[ `!@#$%^&*,.;?~]/;

    translateBtn.onclick = function () {

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
                englishWords[index] = word.replace(/[ `!@#$%^&*,.;?~]/g, '');

            }

        });
        for (var k in specialCharactersIndex) keys.push(k);
        
        

        // Some words may require exceptions, capital city is one of them; i'll figure out a better way once we have more words that need exceptions, this is temporary.
        englishWords.forEach((word, index) => {

            if (word.toLowerCase() == "capital") {

                if (englishWords[index + 1] != undefined && englishWords[index + 1] == "city") {

                    englishWords[index] = "headburg"
                    englishWords[index + 1] = ""

                }

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


        // Re add special characters
        englishWords.forEach((word, index) => {

            if (index in keys) {
                englishWords[keys[index]] += specialCharactersIndex[keys[index]][0][0];
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
