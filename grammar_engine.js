// grammar_engine.js

function singulariseThenPluralise(word) {
    let base;

    if (word.endsWith('ies')) {
        base = word.slice(0, -3) + 'y';
    } else if (word.endsWith('es')) {
        base = word.slice(0, -2);
    } else if (word.endsWith('s')) {
        base = word.slice(0, -1);
    } else {
        return undefined;
    }

    if (base in wordbook) {
        return pluralise(wordbook[base]);
    }

    return undefined;
}


function pluralise(word) {
    if (word.endsWith('y')) {
        return word.slice(0, -1) + 'ies';
    } else if (!word.endsWith('s')) {
        return word + 's';
    }
    return undefined;
}


function presentContinuous(word) {
    if (!word.endsWith('ing')) return undefined;

    let base = word.slice(0, -3);

    if (base in wordbook) {
        return wordbook[base] + "ing";
    }

    if ((base + "e") in wordbook) {
        let withoutE = wordbook[base + "e"].slice(0, -1);
        return withoutE + "ing";
    }

    return undefined;
}


function toPastTense(word) {
    if (word.endsWith('ed')) return undefined;

    if (word.endsWith('y') && word.length > 1 && !isVowel(word[word.length - 2])) {
        return word.slice(0, -1) + 'ied';
    }

    if (word.endsWith('e')) {
        return word + 'd'; //
    }

    return word + 'ed';
}


function toPresentTenseThenPastTense(word) {
    const originalWord = word;

    if (!word.endsWith('ed')) return undefined;

    let base = word.slice(0, -2);

    if (!(base in wordbook) && originalWord.endsWith('d')) {
        base = originalWord.slice(0, -1);
    }

    if (!(base in wordbook)) return undefined;

    return toPastTense(wordbook[base]);
}


// helper
function isVowel(ch) {
    return 'aeiou'.includes(ch.toLowerCase());
}
