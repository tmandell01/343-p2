
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
		'X-RapidAPI-Key': '543c299689msh38b3a0a51cc0ae2p16490bjsna5fc06d7f691',
		'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com'
	}
};

    const data = await fetch('https://genius-song-lyrics1.p.rapidapi.com/search?q='+urlComponent+'&per_page=20&page=1', options)
    const obj = await data.json();
    console.log(obj.response.hits);
    const keyCount = Object.keys(obj.response.hits).length; 

    let rowCount = 2;
    for (let i = 0; i < keyCount; i++) {
        let element = obj.response.hits[i];
        let id = "" + element.result.id + "";
        let songName = "" + element.result.title + "";
        let artistName = "" + element.result.primary_artist.name + "";
        songInfo[id] = {songName, artistName};
        console.log("element is: " + element);
        const displayCard = `<div class="col-bg-5" style="min-width: 100px; max-width: 500px;">
                            <div class="card">
                                <div class="card-body">
                                    <h1 class="card-title">${element.result.title}</h1>
                                    <p class="card-text">Artist: ${element.result.primary_artist.name}</p>
                                    <a id="${element.result.id}" onClick="clickLyricButton(this.id)" class="btn btn-primary">Open Lyrics</a>
                                </div>
                            </div>
                        </div>`
        console.log("container: " + document.getElementById("results-container"));
        container.innerHTML += displayCard;
    }
    
}

function loadSearch() {
    console.log("loading search...")
    let searchTextDisplay = document.getElementById("search-text-display");
    let currSearchText = localStorage.getItem('searchText');
    console.log(currSearchText);
    searchTextDisplay.textContent = `Showing results for '${currSearchText}'`

    displaySearchResults(currSearchText);
}

function clickLyricButton(id) {
    console.log("id: " + (typeof id));
    console.log("Song info: " + songInfo);
    //localStorage.clear();
    localStorage.setItem('id', id);

    window.location.href = "song.html"
}