const buttonClearInputs = document.getElementById("clear-inputs");
const buttonLoadSampleData = document.getElementById("load-sample-data");
const textareaInput = document.getElementById("textarea-input");
const divDictionaryTickboxes = document.getElementById("dictionary-tickboxes");
const tickboxesDictionaries = document.querySelectorAll("#dictionary-tickboxes input");
const textByCreateLink = document.getElementById("text-by-create-link");
const buttonCreateLink = document.getElementById("create-link");
const link = document.getElementById("link");


//// Sample data the user can load if they want to:
const sampleData = "arma vir cano Troia primus ab os Italia fatum profugus Lavinia venio litus multus ille et terra iacto altus vis superus saevus memor Iuno ob ira";


const dictionaries = [
    {
        "Dictionary": "Gaffiot",
        "Formula": "https://micmap.org/dicfro/search/gaffiot/INPUT" 
    },{
        "Dictionary": "Glosbe",
        "Formula": "https://glosbe.com/la/en/INPUT"
    },{
        "Dictionary": "LatDict",
        "Formula": "https://www.latin-dictionary.net/search/latin/INPUT#search-results-list"
    },{
        "Dictionary": "Liddell–Scott–Jones",
        "Formula": "https://lsj.gr/wiki/INPUT"
    },{
        "Dictionary": "Logeion",
        "Formula": "https://logeion.uchicago.edu/INPUT"
    },{
        "Dictionary": "Morganianum",
        "Formula": "https://neolatinlexicon.org/search/latin?search=INPUT"
    },{
        "Dictionary": "Numen",
        "Formula": "https://latinlexicon.org/browse_latin.php?p1=INPUT&p2=1"
    },{
        "Dictionary": "Packard Humanities",
        "Formula": "https://latin.packhum.org/concordance?q=%23INPUT%23"
    },{
        "Dictionary": "Perseus",
        "Formula": "https://www.perseus.tufts.edu/hopper/searchresults?target=la&all_words=INPUT&all_words_expand=on&phrase=&any_words=&exclude_words=&documents="
    },{
        "Dictionary": "Thesaurus Linguae Latinae",
        "Formula": "https://www.degruyter.com/databasecontent?dbf_0=tll-fulltext&dbid=tll&dbq_0=INPUT&dbsource=%2Fdb%2Ftll&dbt_0=fulltext&o_0=AND&sort=ttl-lemma-sort"
    },{
        "Dictionary": "Tower of Babel",
        "Formula": "https://starling.rinet.ru/cgi-bin/response.cgi?root=config&morpho=0&basename=%5Cdata%5Cie%5Cpiet&first=1&text_lat=INPUT&method_lat=substring&ww_lat=on&ic_lat=on&text_any=&method_any=substring&sort=proto&ic_any=on"
    },{
        "Dictionary": "velut",
        "Formula": "https://www.velut.co.uk/INPUT"
    },{
        "Dictionary": "Whitaker’s Words",
        "Formula": "https://archives.nd.edu/cgi-bin/wordz.pl?keyword=INPUT"
    },{
        "Dictionary": "Wiktionary",
        "Formula": "https://en.wiktionary.org/wiki/INPUT#Latin"
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
        newDiv.innerHTML = `<input type="checkbox" id="tickbox${i}" ${dictionary.Dictionary=="velut" ? "checked" : ""}/><label for="checkbox${i}">${dictionary.Dictionary}</label>`;
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

const changeHrefOfLink = () => {
    if (currentIndexInUrls < urlObjects.length) {
        const currentUrlObject = urlObjects[currentIndexInUrls];

        // Timeout is needed so the link’s href doesn’t change
        // until after the link has been executed.
        window.setTimeout(()=>{
            link.textContent = `${currentUrlObject.Dictionary} — ${currentUrlObject.Word}`;
            link.href = currentUrlObject.URL;
            link.title = `${currentUrlObject.Dictionary} — ${currentUrlObject.Word}`;
            link.style.display = "initial";
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
            link.style.display = "none";
        }, 50);
        currentIndexInUrls = 0;
        textByCreateLink.textContent = "All links have been opened!";
    }
}


const createUrls = () => {
    clearTextMessages();
    urlObjects = [];
    currentIndexInUrls = 0;

    const words = getAffixesFromTextArea(textareaInput);
    const tickedDictionaries = getTickedDictionaries();

    words.forEach(word => {
        tickedDictionaries.forEach(dictionary => {
            urlObjects.push({
                Dictionary: dictionary.Dictionary,
                Word: word,
                URL: dictionary.Formula.replace("INPUT", word)
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

buttonCreateLink.addEventListener("click", ()=>{
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

interpretQueryString();

//// Uncomment this to set the HTML according to the `dictionaries` array.
// generateTickboxesHtml();
