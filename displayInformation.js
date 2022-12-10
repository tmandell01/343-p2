    languageCodes = {};
    languageCodes["English"] = "en";
    languageCodes["Spanish"] = "es";
    languageCodes["Italian"] = "it";
    languageCodes["Arabic"] = "ar";
    languageCodes["Chinese"] = "zh-TW";
    languageCodes["Hawaiian"] = "haw";

    CodetoLanguage = {};
    CodetoLanguage["en"] = "English";
    CodetoLanguage["es"] = "Spanish";
    CodetoLanguage["it"] = "Italian";
    CodetoLanguage["ar"] = "Arabic";
    CodetoLanguage["zh-TW"] = "Chinese";
    CodetoLanguage["haw"] = "Hawaiian";
let searchButtonIndex = document.getElementById("search-button-index")

if (searchButtonIndex) {
    console.log("Store called!");
    let searchBarIndex = document.getElementById("search-bar-index")
    searchButtonIndex.addEventListener("click", function(e) {
        e.preventDefault();
        
        if (searchBarIndex.value) {
            let currSearchText = searchBarIndex.value;
        
            localStorage.setItem('searchText', currSearchText);
            window.location.href = "search.html"
            console.log("Button pressed! search was: " + searchBarIndex.value);
        }
        
    })
} else {
    console.log("Search button not found!");
}


async function translatePage() {
    const langOptions = document.querySelector('#language-options');
    const currLang = langOptions.value;
    console.log("translating to " + currLang);
    console.log("The code is  " + languageCodes[currLang]);

    const lyricWindow = document.getElementById("song-lyrics");
    let input = '';

    for (let i = 0; i < 1500; i++) 
    {
        input += lyricWindow.innerHTML[i];
    }


    console.log("the length of this song is " , input.length);
    const encodedParams = new URLSearchParams();
    encodedParams.append("source_language", localStorage.getItem('currLang'));
    encodedParams.append("target_language", languageCodes[currLang]);
    encodedParams.append("text", input);
    localStorage.setItem('currLang', languageCodes[currLang]);

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '7c058e2848msh211adb167583bcdp18be5bjsn3804aca137ee',
            'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
        },
        body: encodedParams
    };

    const loading = `<h3 id="song-lyrics">
                    <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                    </div>
                    </h3>`
    lyricWindow.innerHTML = loading;
    const data = await fetch('https://text-translator2.p.rapidapi.com/translate', options)
    const obj = await data.json();
    console.log(obj);
    lyricWindow.innerHTML = obj.data.translatedText;

}

let songInfo = {}
async function displaySearchResults(searchText) {
    let container = document.getElementById("row");
    const urlComponent = encodeURIComponent(searchText);

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '7c058e2848msh211adb167583bcdp18be5bjsn3804aca137ee',
            'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
    };

    const data = await fetch('https://genius-song-lyrics1.p.rapidapi.com/search?q='+urlComponent+'&per_page=3&page=1', options)
    const obj = await data.json();
    //console.log(obj.response.hits);
    const keyCount = Object.keys(obj.response.hits).length; 
    const MAX_CARDS = 4;
    let currCards = 0;
    let cardHolder = ``;

    for (let i = 0; i < keyCount; i++) {
        if (currCards == MAX_CARDS) {
            break;
        }

        let element = obj.response.hits[i];
        let id = "" + element.result.id + "";
        let songName = "" + element.result.title + "";
        let artistName = "" + element.result.primary_artist.name + "";
        let languageCode = "" + element.result.language + "";
        let isExplicit = "" + element.result.language + "";
        const displayCard = `<div class="col-bg-5" style="min-width: 100px; max-width: 500px;">
                            <div class="card">
                                <div class="card-body">
                                    <h1 class="card-title">${element.result.title}</h1>
                                    <p class="card-text">Artist: ${element.result.primary_artist.name}</p>
                                    <a id="${element.result.id}" onClick="clickLyricButton(this.id)" class="btn btn-primary">Open Lyrics</a>
                                </div>
                            </div>
                        </div>`
        
        // Now check if the lyrics exist, and if they do, display the card

        const options2 = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '7c058e2848msh211adb167583bcdp18be5bjsn3804aca137ee',
                'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
            }
        };
        
        console.log("Fetching lyrics for song id="+id+"...");
        
        const data2= await fetch('https://genius-song-lyrics1.p.rapidapi.com/songs/'+id+'/lyrics', options2)
        const obj2 = await data2.json();
        if (!obj2.response) {
            console.log("This song's lyrics cannot be found");
        } else {
            let lyrics = obj2.response.lyrics.lyrics.body.html
            songInfo[id] = {songName, artistName, languageCode, lyrics};
            //lyrics.replace(/<a href="\/9234498\/Alan-walker-faded\/You-were-the-shadow-to-my-light-did-you-feel-us"/g, '').replace(/<\/a>/g, '')
            //console.log(obj.response.hits);
            console.log("Lyrics found!:\n", lyrics);
            cardHolder += displayCard;
            console.log("Song displayed!")
            currCards++;
        }
    }
    if (currCards == 0)
    {
        container.innerHTML = `<h1 class="error-message">Sorry, but it looks like this artist's lyrics arent available on this API :(</h1>`;
    } else {
        container.innerHTML = cardHolder;
    }
}

function loadSearch() {
    console.log("loading search...")
    let searchTextDisplay = document.getElementById("search-text-display");
    let currSearchText = localStorage.getItem('searchText');
    //console.log(currSearchText);
    searchTextDisplay.textContent = `Showing results for '${currSearchText}'`

    displaySearchResults(currSearchText);
}

async function loadLyricsPage() {
    

    const id = localStorage.getItem('id');
    console.log("id key found: " + id);
    const songName = localStorage.getItem('songName');
    console.log("songName key found: " + songName);
    const artistName = localStorage.getItem('artistName');
    console.log("artistName key found: " + artistName);
    const language = localStorage.getItem('languageCode');
    console.log("language key found: " + language);
    const lyrics = localStorage.getItem('lyrics');
    console.log("lyrics found: ");


    const artistTitleDisplay = document.getElementById("song-artist");
    const songTitleDisplay = document.getElementById("song-title");
    const lyricsDisplay = document.getElementById("song-lyrics");
    
    if (songTitleDisplay) {
        songTitleDisplay.innerHTML = `<p>${songName}</p>`;
        //songTitleDisplay.textContent = songName;
    } else {
        console.log("cannot find title display");
    }
    
    if (artistTitleDisplay) {
        artistTitleDisplay.innerHTML = `<p>Artist: ${artistName}</p>`;
    }

    var optionsList = document.getElementById("language-options").options;
    for (var i = 0; i < optionsList.length; i++) {
        if (optionsList[i].text == CodetoLanguage[language]) {
            optionsList[i].selected = true;
        localStorage.setItem('currLang', language);
        break;
        }
    }
    
    lyricsDisplay.innerHTML = lyrics;
    
}

function clickLyricButton(id) {
    //localStorage.clear();
    //console.log(id);
    //console.log("song info: ", songInfo);
    const obj = songInfo[id]
    const artistName   = obj.artistName;
    const songName     = obj.songName;
    const languageCode = obj.languageCode;
    const lyrics       = obj.lyrics

    //console.log("obj" , obj);
    //console.log("Button clicked!: " , artistName);
    //console.log("Button clicked: " , songName);
;
    localStorage.setItem('id', id);
    localStorage.setItem('artistName', artistName);
    localStorage.setItem('songName', songName);
    localStorage.setItem('languageCode', languageCode);
    localStorage.setItem('lyrics', lyrics);

    window.location.href = "song.html";
}