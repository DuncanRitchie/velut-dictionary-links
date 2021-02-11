const buttonClearInputs = document.getElementById("clear-inputs");
const buttonLoadSampleData = document.getElementById("load-sample-data");
const textareaInputPrefixes = document.getElementById("textarea-input-prefixes");
const textareaInputSuffixes = document.getElementById("textarea-input-suffixes");
const tickboxDisplayLemma = document.getElementById("display-lemma");
const textByConcatenate = document.getElementById("text-by-concatenate");
const buttonConcatenate = document.getElementById("concatenate");
const textareaOutput = document.getElementById("textarea-output");
const textByCopyToClipboard = document.getElementById("text-by-copy-to-clipboard");
const buttonCopyToClipboard = document.getElementById("copy-to-clipboard");

textareaOutput.value = "";


//// Sample data the user can load if they want to:
const sampleDataPrefixes = "ab re super trāns";
const sampleDataSuffixes = "ferō lātiō lātīvus";


//// Functions:

const getAffixesFromTextArea = (textarea) => {
    return textarea.value
        .split(/[\s\.,]/)
        .filter(string => {
            return string !== "";
        });
}

const clearTextMessages = () => {
    textByConcatenate.textContent = "";
    textByCopyToClipboard.textContent = "";
}

const clearInputs = () => {
    textareaInputPrefixes.value = "";
    textareaInputSuffixes.value = "";
    textareaOutput.value = "";
    clearTextMessages();
}

const warnOfEmptyInput = () => {
    clearTextMessages();
    textByConcatenate.textContent = "Please put text in both inputs!";
}

const warnOfEmptyOutput = () => {
    clearTextMessages();
    textByCopyToClipboard.textContent = "Nothing to copy!";
}

const concatenate = () => {
    clearTextMessages();
    textByConcatenate.textContent = "Concatenating, please wait...";
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
    textByConcatenate.textContent = "Concatenated!";
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
    textareaInputPrefixes.value = sampleDataPrefixes;
    textareaInputSuffixes.value = sampleDataSuffixes;
    clearTextMessages();
});

buttonConcatenate.addEventListener("click", ()=>{
    if (textareaInputPrefixes.value === ""
     || textareaInputSuffixes.value === "") {
        warnOfEmptyInput();
    }
    else {
        concatenate();
    }
});

buttonCopyToClipboard.addEventListener("click", ()=>{
    if (textareaOutput.value === "") {
        warnOfEmptyOutput();
    }
    else {
        copyToClipboard();
    }
});
