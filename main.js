const buttonClearInputs = document.getElementById("clear-inputs");
const buttonLoadSampleData = document.getElementById("load-sample-data");
const textareaInput = document.getElementById("textarea-input");
const tickboxesDictionaries = document.querySelectorAll("#dictionary-checkboxes input");
const textByCreateLink = document.getElementById("text-by-create-link");
const buttonCreateLink = document.getElementById("create-link");
const link = document.getElementById("link");


//// Sample data the user can load if they want to:
const sampleData = "arma vir cano Troia primus ab os Italia fatum profugus Lavinia venio litus multus ille et terra iacto altus vis superus saevus memor Iuno ob ira";


const dictionaries = [
    {
        "Dictionary": "Gaffiot",
        "Formula": "http://micmap.org/dicfro/search/gaffiot/INPUT" 
    },{
        "Dictionary": "Glosbe",
        "Formula": "https://glosbe.com/la/en/INPUT"
    },{
        "Dictionary": "LatDict",
        "Formula": "http://www.latin-dictionary.net/search/latin/INPUT#search-results-list"
    },{
        "Dictionary": "Liddell–Scott–Jones",
        "Formula": "https://lsj.gr/wiki/INPUT"
    },{
        "Dictionary": "Logeion",
        "Formula": "http://logeion.uchicago.edu/INPUT"
    },{
        "Dictionary": "Morganianum",
        "Formula": "http://neolatinlexicon.org/search/latin?search=INPUT"
    },{
        "Dictionary": "Numen",
        "Formula": "http://latinlexicon.org/browse_latin.php?p1=INPUT&p2=1"
    },{
        "Dictionary": "Packard Humanities",
        "Formula": "https://latin.packhum.org/concordance?q=%23INPUT%23"
    },{
        "Dictionary": "Perseus",
        "Formula": "http://www.perseus.tufts.edu/hopper/searchresults?target=la&all_words=INPUT&all_words_expand=on&phrase=&any_words=&exclude_words=&documents="
    },{
        "Dictionary": "Thesaurus Linguae Latinae",
        "Formula": "https://www.degruyter.com/databasecontent?dbf_0=tll-fulltext&dbid=tll&dbq_0=INPUT&dbsource=%2Fdb%2Ftll&dbt_0=fulltext&o_0=AND&sort=ttl-lemma-sort"
    },{
        "Dictionary": "Tower of Babel",
        "Formula": "http://starling.rinet.ru/cgi-bin/response.cgi?root=config&morpho=0&basename=%5Cdata%5Cie%5Cpiet&first=1&text_lat=INPUT&method_lat=substring&ww_lat=on&ic_lat=on&text_any=&method_any=substring&sort=proto&ic_any=on"
    },{
        "Dictionary": "velut",
        "Formula": "http://www.velut.co.uk/INPUT"
    },{
        "Dictionary": "Whitaker’s Words",
        "Formula": "http://archives.nd.edu/cgi-bin/wordz.pl?keyword=INPUT"
    },{
        "Dictionary": "Wiktionary",
        "Formula": "https://en.wiktionary.org/wiki/INPUT#Latin"
    }
]

let urlObjects = [];
let currentIndexInUrls = 0;


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
    textByCreateLink.textContent = "Please put text in the input!";
}

const warnOfEmptyOutput = () => {
    clearTextMessages();
    textByCopyToClipboard.textContent = "Nothing to copy!";
}

const changeHrefOfLink = () => {
    const currentUrlObject = urlObjects[currentIndexInUrls];
    link.textContent = `${currentUrlObject.Dictionary} — ${currentUrlObject.Word}`;
    link.href = currentUrlObject.URL;
    link.title = `${currentUrlObject.Dictionary} — ${currentUrlObject.Word}`;

    currentIndexInUrls++;
}

const createUrls = () => {
    clearTextMessages();
    urlObjects = [];
    currentIndexInUrls = 0;

    const words = getAffixesFromTextArea(textareaInput);

    words.forEach(word => {
        dictionaries.forEach(dictionary => {
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


//// Event listeners.

buttonClearInputs.addEventListener("click", ()=>{
    clearInputs();
});

buttonLoadSampleData.addEventListener("click", ()=>{
    textareaInput.value = sampleData;
    clearTextMessages();
});

buttonCreateLink.addEventListener("click", ()=>{
    if (textareaInput.value === "") {
        warnOfEmptyInput();
    }
    else {
        createUrls();
    }
});
