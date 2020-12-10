// Used to produce a JSON object from The Anglish Moot wordbook.

const tabledata = document.querySelectorAll("table tbody tr");
let wordsDict = {};

function splitNsplice(string, metric) {
    array = string.split(",");
    array = array.splice(0,1);
	array[0] = array[0].split(';')[0];
    return array;
}



for (i = 2; i <= tabledata.length; i++) {
	
    let words = tabledata[i].querySelectorAll("td");
    let keyName = words[0].textContent; 
	
	/* this conditional is used instead when extracting data from the unattested column
	
	if (words[3] != undefined) {
		var values = words[3].textContent;
	}
	
	*/
	
	let values = words[2].textContent;
	
	keyName = keyName.replace(/[^a-zA-Z0-9 ]/g, '');
	values = splitNsplice(values);
	values = values.toString();
    values = values.replace(/[^a-zA-Z0-9 ]/g, '');

	
	Object.assign(wordsDict, {[keyName]: values});
   
    if (tabledata.length - 1 == i) {

        console.log(wordsDict);
    }
}
