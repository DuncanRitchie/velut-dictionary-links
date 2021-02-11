const buttonClearInputs = document.getElementById("clear-inputs");
const buttonLoadSampleData = document.getElementById("load-sample-data");
const textareaInput = document.getElementById("textarea-input");
const tickboxesDictionaries = document.querySelectorAll("#dictionary-checkboxes input");
const textByCreateLink = document.getElementById("text-by-create-link");
const buttonCreateLink = document.getElementById("create-link");
const link = document.getElementById("link");


//// Sample data the user can load if they want to:
const sampleData = "arma vir cano Troia primus ab os Italia fatum profugus Lavinia venio litus multus ille et terra iacto altus vis superus saevus memor Iuno ob ira";


//// Functions:

const getAffixesFromTextArea = (textarea) => {
    return textarea.value
        .split(/[\s\.,]/)
        .filter(string => {
            return string !== "";
        });
}

const clearTextMessages = () => {
    textByCreateLink.textContent = "";
}

const clearInputs = () => {
    textareaInput.value = "";
    link.textContent = "";
    clearTextMessages();
}

const warnOfEmptyInput = () => {
    clearTextMessages();
    textByCreateLink.textContent = "Please put text in both inputs!";
}

const warnOfEmptyOutput = () => {
    clearTextMessages();
    textByCopyToClipboard.textContent = "Nothing to copy!";
}

const concatenate = () => {
    clearTextMessages();
    textByCreateLink.textContent = "Concatenating, please wait...";
    let outputArray = [];

    const prefixes = getAffixesFromTextArea(textareaInputPrefixes);
    const suffixes = getAffixesFromTextArea(textareaInputSuffixes);

    prefixes.forEach(prefix => {
        const firstConcatenationWithPrefix = `${prefix}${suffixes[0]}`;
        suffixes.forEach(suffix => {
            outputArray.push({
                Concatenation: `${prefix}${suffix}`,
                Lemma: firstConcatenationWithPrefix,
            });
        });
    });
    
    displayOutput(outputArray);
    textByCreateLink.textContent = "";
}

const displayOutput = (outputArray) => {
    const getConcatenation = (object) => {
        return object.Concatenation;
    }

    const getDisplayStringWithLemma = (object) => {
        return `${object.Concatenation}\t${object.Lemma}`;
    }

    const getDisplayString = tickboxDisplayLemma.checked
                           ? getDisplayStringWithLemma
                           : getConcatenation;

    textareaOutput.value = outputArray
        .map(getDisplayString)
        .join("\n");
}

const copyToClipboard = () => {
    clearTextMessages();
    textByCopyToClipboard.textContent = "Copying to clipboard...";
    textareaOutput.select();
    document.execCommand("copy");
    textByCopyToClipboard.textContent = "Copied!";
}


//// Event listeners.

buttonClearInputs.addEventListener("click", ()=>{
    clearInputs();
});

buttonLoadSampleData.addEventListener("click", ()=>{
    textareaInput.value = sampleData;
    clearTextMessages();
});

buttonCreateLink.addEventListener("click", ()=>{
    if (textareaInputPrefixes.value === ""
     || textareaInputSuffixes.value === "") {
        warnOfEmptyInput();
    }
    else {
        concatenate();
    }
});
