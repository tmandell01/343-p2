
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

let songInfo = {}
async function displaySearchResults(searchText) {
    let container = document.getElementById("row");
    const urlComponent = encodeURIComponent(searchText);

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5a9b32ac03msh2ec6a2fc5bd76c1p1b9f9fjsn9780802960eb',
            'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
    };

    const data = await fetch('https://genius-song-lyrics1.p.rapidapi.com/search?q='+urlComponent+'&per_page=20&page=1', options)
    const obj = await data.json();
    //console.log(obj.response.hits);
    const keyCount = Object.keys(obj.response.hits).length; 
    container.innerHTML =  ``;
    let rowCount = 2;
    for (let i = 0; i < keyCount; i++) {
        let element = obj.response.hits[i];
        let id = "" + element.result.id + "";
        let songName = "" + element.result.title + "";
        let artistName = "" + element.result.primary_artist.name + "";
        songInfo[id] = {songName, artistName};
        const displayCard = `<div class="col-bg-5" style="min-width: 100px; max-width: 500px;">
                            <div class="card">
                                <div class="card-body">
                                    <h1 class="card-title">${element.result.title}</h1>
                                    <p class="card-text">Artist: ${element.result.primary_artist.name}</p>
                                    <a id="${element.result.id}" onClick="clickLyricButton(this.id)" class="btn btn-primary">Open Lyrics</a>
                                </div>
                            </div>
                        </div>`
        container.innerHTML += displayCard;
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

    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '5a9b32ac03msh2ec6a2fc5bd76c1p1b9f9fjsn9780802960eb',
            'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
        }
    };
    
    console.log("Fetching lyrics for song id="+id+"...");
    
    const data = await fetch('https://genius-song-lyrics1.p.rapidapi.com/songs/'+id+'/lyrics', options)
    const obj = await data.json();
    if (!obj.response) {
        console.log("This song's lyrics cannot be found");
        lyricsDisplay.innerHTML = `<p>Sorry, but the lyrics to this song could not be found :'(</p>`;
    } else {
        let lyrics = obj.response.lyrics.lyrics.body.html
        console.log("Lyrics found!");
        lyrics.replace(/<a href="\/9234498\/Alan-walker-faded\/You-were-the-shadow-to-my-light-did-you-feel-us"/g, '').replace(/<\/a>/g, '')
        //console.log(obj.response.hits);
    console.log("Lyrics found!:\n", lyrics);
    lyricsDisplay.innerHTML = lyrics;
    }
    
}

function clickLyricButton(id) {
    //localStorage.clear();
    //console.log(id);
    //console.log("song info: ", songInfo);
    const obj = songInfo[id]
    const artistName = obj.artistName;
    const songName = obj.songName;

    //console.log("obj" , obj);
    //console.log("Button clicked!: " , artistName);
    //console.log("Button clicked: " , songName);
;
    localStorage.setItem('id', id);
    localStorage.setItem('artistName', artistName);
    localStorage.setItem('songName', songName);

    window.location.href = "song.html";
}