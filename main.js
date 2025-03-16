const buttonClearInputs = document.getElementById("clear-inputs");
const buttonLoadSampleData = document.getElementById("load-sample-data");
const textareaInput = document.getElementById("textarea-input");
const divDictionaryTickboxes = document.getElementById("dictionary-tickboxes");
const tickboxesDictionaries = document.querySelectorAll("#dictionary-tickboxes input");
const textByCreateLink = document.getElementById("text-by-create-link");
const form = document.getElementById("inputs");
const link = document.getElementById("link");


//// Sample data the user can load if they want to:
const sampleData = "arma vir cano Troia primus ab os Italia fatum profugus Lavinia venio litus multus ille et terra iacto altus vis superus saevus memor Iuno ob ira";

const dictionaries = [
    //// `Dictionary` must match the text content of the corresponding <label> in the HTML.
    {
        "Dictionary": "Gaffiot",
        "Formula": "https://micmap.org/dicfro/search/gaffiot/INPUT",
        "RemoveDiacritics": true,
    },{
        "Dictionary": "Glosbe",
        "Formula": "https://glosbe.com/la/en/INPUT",
        "RemoveDiacritics": true,
    },{
        "Dictionary": "LatDict",
        "Formula": "https://www.latin-dictionary.net/search/latin/INPUT#search-results-list",
        "RemoveDiacritics": true,
    },{
        "Dictionary": "Latinitas Recens",
        "Formula": "https://latinitas-recens.netlify.app/?q=INPUT",
        "RemoveDiacritics": true,
    },{
        "Dictionary": "Liddell–Scott–Jones",
        "Formula": "https://lsj.gr/wiki/INPUT",
        "RemoveDiacritics": true,
    },{
        "Dictionary": "Logeion",
        "Formula": "https://logeion.uchicago.edu/INPUT",
        "RemoveDiacritics": true,
    },{
        "Dictionary": "Numen",
        "Formula": "https://latinlexicon.org/browse_latin.php?p1=INPUT&p2=1",
        "RemoveDiacritics": true,
    },{
        "Dictionary": "PackHum (full word)",
        "Formula": "https://latin.packhum.org/concordance?q=%23INPUT%23",
        "RemoveDiacritics": true,
    },{
        "Dictionary": "PackHum (substring)",
        "Formula": "https://latin.packhum.org/concordance?q=INPUT",
        "RemoveDiacritics": true,
    },{
        "Dictionary": "Perseus",
        "Formula": "https://www.perseus.tufts.edu/hopper/searchresults?target=la&all_words=INPUT&all_words_expand=on&phrase=&any_words=&exclude_words=&documents=",
        "RemoveDiacritics": true,
    },{
        "Dictionary": "Thesaurus Linguae Latinae",
        "Formula": "https://www.degruyter.com/databasecontent?dbf_0=tll-fulltext&dbid=tll&dbq_0=INPUT&dbsource=%2Fdb%2Ftll&dbt_0=fulltext&o_0=AND&sort=ttl-lemma-sort",
        "RemoveDiacritics": true,
    },{
        "Dictionary": "Tower of Babel",
        "Formula": "https://starling.rinet.ru/cgi-bin/response.cgi?root=config&morpho=0&basename=%5Cdata%5Cie%5Cpiet&first=1&text_lat=INPUT&method_lat=substring&ww_lat=on&ic_lat=on&text_any=&method_any=substring&sort=proto&ic_any=on",
        "RemoveDiacritics": true,
    },{
        "Dictionary": "velut",
        "Formula": "https://www.velut.co.uk/INPUT",
        "RemoveDiacritics": false,
    },{
        "Dictionary": "Whitaker’s Words",
        "Formula": "https://archives.nd.edu/cgi-bin/wordz.pl?keyword=INPUT",
        "RemoveDiacritics": true,
    },{
        "Dictionary": "Wiktionary",
        "Formula": "https://en.wiktionary.org/wiki/INPUT#Latin",
        "RemoveDiacritics": true,
    }
]

let urlObjects = [];
let currentIndexInUrls = 0;


//// Functions:

const setWordsFromQueryString = (urlParams = new URLSearchParams(window.location.search)) => {
    const words = urlParams.get("words");
    if (words && !textareaInput.value.includes(words)) {
        textareaInput.value += words;
    }
}

const setDictionariesFromQueryString = (urlParams = new URLSearchParams(window.location.search)) => {
    const query = urlParams.get("dictionaries");
    if (query) {
        const queryArray = query.split(" ");
        for (const tickbox of tickboxesDictionaries) {
            const dictionaryName = tickbox.id.replace("tickbox-","");
            tickbox.checked = queryArray.includes(dictionaryName);
        }
    }
}

const interpretQueryString = () => {
    const urlParams = new URLSearchParams(window.location.search);
    setWordsFromQueryString(urlParams);
    setDictionariesFromQueryString(urlParams);
    if (urlParams.has("words")
        || urlParams.has("dictionaries"))
    {
        createLinkOrWarning();
    }
}

const generateTickboxesHtml = () => {
    divDictionaryTickboxes.innerHTML = "";

    for (let i = 0; i < dictionaries.length; i++) {
        const dictionary = dictionaries[i];
        newDiv = document.createElement("div");
        newDiv.innerHTML = `<input type="checkbox" id="tickbox${i}" ${dictionary.Dictionary=="velut" ? "checked" : ""}/><label for="tickbox${i}">${dictionary.Dictionary}</label>`;
        divDictionaryTickboxes.appendChild(newDiv);
    }
}

const getAffixesFromTextArea = (textarea) => {
    return textarea.value
        .split(/[\s\.,]/)
        .filter(string => {
            return string !== "";
        });
}

const getTickedDictionaries = () => {
    const tickedLabels = document.querySelectorAll("#dictionary-tickboxes input:checked + label");
    let tickedLabelsTextContent = [];
    for (let i = 0; i < tickedLabels.length; i++) {
        tickedLabelsTextContent.push(tickedLabels[i].textContent);
    }
    
    return dictionaries.filter(dictionaryObject => {
        return (tickedLabelsTextContent.includes(dictionaryObject.Dictionary));
    });
}

const areNoDictionariesSelected = () => {
    return document.querySelectorAll("#dictionary-tickboxes input:checked").length == 0
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
    textByCreateLink.textContent = "Please put text in the input!";
}

const warnOfNoDictionariesSelected = () => {
    clearTextMessages();
    textByCreateLink.textContent = "No dictionaries selected!";
}

// Most online dictionaries need diacritics to be removed for searching.
// (Eg, logeion.uchicago.edu/vocabulorum works
// but logeion.uchicago.edu/vocābulōrum doesn’t.)
// On velut, searching for (eg) "voca-bulo-rum" or "vocābulōrum" returns "vocābulōrum",
// so this method will convert both to "vocabulorum".
// Adapted from the /controllers folder of the velut codebase.
const removeDiacritics = (macronizedWord) => {
    // Macra are converted to hyphens (eg "ā" -> "a-").
    let toHyphens = macronizedWord.replace(/\u0100/g,"A-").replace(/\u0101/g,"a-").replace(/\u0112/g,"E-").replace(/\u0113/g,"e-").replace(/\u012A/g,"I-").replace(/\u012B/g,"i-").replace(/\u014C/g,"O-").replace(/\u014D/g,"o-").replace(/\u016A/g,"U-").replace(/\u016B/g,"u-").replace(/\u1E7B/g,"u-:").replace(/\u0232/g,"Y-").replace(/\u0233/g,"y-").replace(/\u1e17/g,"e-.")
    // Acutes are converted to dots (eg "á" -> "a.").
    let toDots = toHyphens.replace(/\u00C1/g,"A.").replace(/\u00C9/g,"E.").replace(/\u00CD/g,"I.").replace(/\u00D3/g,"O.").replace(/\u00DA/g,"U.").replace(/\u00DD/g,"Y.").replace(/\u00E1/g,"a.").replace(/\u00E9/g,"e.").replace(/\u00ED/g,"i.").replace(/\u00F3/g,"o.").replace(/\u00FA/g,"u.").replace(/\u00FD/g,"y.")
    // Diaereses are converted to cola (eg "ä" -> "a:").
    const toCola = toDots.replace(/\u00E4/g,"a:").replace(/\u00EB/g,"e:").replace(/\u00CF/g,"I:").replace(/\u00EF/g,"i:").replace(/\u00F6/g,"o:").replace(/\u00FC/g,"u:").replace(/\u00FF/g,"y:")
    // Remove all hyphens, dots, and cola.
    return toCola.replace(/-/g,"").replace(/\./g,"").replace(/:/g,"")

}

const changeHrefOfLink = () => {
    if (currentIndexInUrls < urlObjects.length) {
        const currentUrlObject = urlObjects[currentIndexInUrls];

        // Timeout is needed so the link’s href doesn’t change
        // until after the link has been executed.
        window.setTimeout(()=>{
            link.textContent = `${currentUrlObject.Dictionary} — ${currentUrlObject.Word}`;
            link.href = currentUrlObject.URL;
            link.title = `${currentUrlObject.Dictionary} — ${currentUrlObject.Word}`;
            link.removeAttribute('hidden');
        }, 50);

        currentIndexInUrls++;
    }
    else {
        // Timeout is needed so the link’s href doesn’t change
        // until after the link has been executed.
        window.setTimeout(()=>{
            link.href = "";
            link.title = "";
            link.textContent = "";
            link.setAttribute('hidden', '');
        }, 50);
        currentIndexInUrls = 0;
        textByCreateLink.textContent = "All links have been opened!";
    }
}


const createUrls = () => {
    clearTextMessages();
    urlObjects = [];
    currentIndexInUrls = 0;

    link.removeAttribute('hidden')

    const words = getAffixesFromTextArea(textareaInput);
    const tickedDictionaries = getTickedDictionaries();

    words.forEach(word => {
        const plainWord = removeDiacritics(word);

        tickedDictionaries.forEach(dictionary => {
            const wordToSearchFor = dictionary.RemoveDiacritics ? plainWord : word;

            urlObjects.push({
                Dictionary: dictionary.Dictionary,
                Word: wordToSearchFor,
                URL: dictionary.Formula.replace("INPUT", wordToSearchFor),
            });
        });
    });
    
    changeHrefOfLink();
    textByCreateLink.textContent = "";
}

const createLinkOrWarning = () => {
    if (textareaInput.value === "") {
        warnOfEmptyInput();
    }
    else if (areNoDictionariesSelected()) {
        warnOfNoDictionariesSelected();
    }
    else {
        createUrls();
    }
}

const getUrlFromInputs = () => {
    let urlParams = new URLSearchParams();
    let tickedDictIds = [];
    for (const tickbox of tickboxesDictionaries) {
        if (tickbox.checked) {
            tickedDictIds.push(tickbox.id.replace("tickbox-",""));
        }
    }

    urlParams.set("words", textareaInput.value);
    urlParams.set("dictionaries", tickedDictIds.join(" "));
    return `./?${urlParams.toString()}`;
}


//// Event listeners.

buttonClearInputs.addEventListener("click", ()=>{
    clearInputs();
});

buttonLoadSampleData.addEventListener("click", ()=>{
    textareaInput.value = sampleData;
    clearTextMessages();
});

form.addEventListener("submit", (event)=>{
    event.preventDefault();
    const newUrl = getUrlFromInputs();
    const historyApiIsDefined = window.history.pushState && true;
    if (historyApiIsDefined) {
        window.history.pushState({}, '', newUrl)
        createLinkOrWarning();
    }
    //// If History API is not available, we reload the page at the new URL.
    else {
        window.location.href = newUrl;
    }
});

link.addEventListener("click", ()=>{
    changeHrefOfLink();
})

//// Clicking with the mouse-wheel
link.addEventListener("auxclick", (event)=>{
    if (event.button === 1) {
        changeHrefOfLink();
    }
})

interpretQueryString();

//// Uncomment this to set the HTML according to the `dictionaries` array.
// generateTickboxesHtml();
