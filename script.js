document.writeln("<script type='text/javascript' src='wordbook.js'></script>")


function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


const vowels = ['a', 'e', 'i', 'o', 'u']


window.onload = function () {

    // set up the constants.
    const translateBtn = document.getElementById("translate")
    const english = document.getElementById("english")
    const anglish = document.getElementById("anglish")

    
    translateBtn.onclick = function () {
        
        // Set up the variables.
        let englishText = english.value;
        let anglishText = ""

        
        // Split the English text into seperate words based on the space character, and make the text all lowercase.
        let englishWords = englishText.split(" ").map(function (f) {
            return f.toLowerCase();
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

                if (englishWords[index + 1][0] in vowels) {
                    
                    englishWords[index] = "an"
                    
                } else {

                    englishWords[index] = "a"
                }
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
