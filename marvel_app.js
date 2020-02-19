//1. Prepare: URL, private key, public key, MarvelKey
var url = 'https://gateway.marvel.com:443/v1/public/characters';
var publicKey = '95f0a6a9843aefa2a59c4b0608321175';
var privateKey = '04e4c01cefcd8db71a51b202c7d81067de0987e0';

// https://gist.github.com//qhuydtvt/976eaa377647543b662a47258deae3b7
function renderCharacter(characters) {
    var content = document.getElementById('content');
    content.textContent = '';
    for (var i = 0; i < characters.length; i++) {
        var character = characters[i];
        //link image, name, comics available
        var imgSrc = character.thumbnail.path + '.' + character.thumbnail.extension;
        var name = character.name;
        var comicsAvailable = character.comics.available;
        var character_id = character.id;
        var characterHTML = `
    <div id="${character.id}" onclick="characterUnique(this)">
        <img src="${imgSrc}" width="300px" height="300px"/>
        <h3>${name}</h3>
        <h3>Comics: ${comicsAvailable}</h3>
    </div>
    `;
        content.insertAdjacentHTML("beforeend", characterHTML);
        // content.innerHTML += characterHTML;
    }
}

function renderCharacterId(characters) {
    var content = document.getElementById('content');
    content.textContent = '';
    for (var i = 0; i < characters.length; i++) {
        var character = characters[i];
        //link image, name, comics available
        var imgSrc = character.thumbnail.path + '.' + character.thumbnail.extension;
        var comics = character.comics.items;
        var events = character.events.items;
        var characterHTML = `
    <div id="${character.id}" onclick="characterUnique(this)">
        <img src="${imgSrc}" width="300px" height="300px"/>
        <h3>${name = character.name}</h3>
        <div>${character.description}</div>
        <h3 id="related-comics">Related comics</h3>
        <h3 id="related-events">Related events</h3>
        <h2>References:
            <br>
            <span>
                <a href=${character.urls[1].url}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Wikipedia%27s_W.svg/1024px-Wikipedia%27s_W.svg.png" width="80px" height="80px">
                </a>
            </span>
            <span>
                <a href=${character.urls[2].url}>
                <img src="http://thetechnews.com/wp-content/uploads/2018/03/1_Old-Marvel-Comics-logo.jpg" width="80px" height="80px">
                </a>
            </span>
        </h2>
    </div>
    `;
        var root = document.getElementById('root');
        root.innerHTML = characterHTML;
        var related_comics = document.getElementById('related-comics');
        var related_events = document.getElementById('related-events');
        for (var i = 0; i < comics.length; i++) {
            var key = marvelKey(privateKey, publicKey);
            comic_url = `${comics[i].resourceURI}?${key}`;
            comic_name = comics[i].name;
            related_comics.innerHTML += `
            <a style = 'background: #6FC558' href="${comic_url}">${comic_name}</a>
            `
        }
        for (var i = 0; i < events.length; i++) {
            var key = marvelKey(privateKey, publicKey);
            events_url = `${events[i].resourceURI}?${key}`;
            events_name = events[i].name;
            related_events.innerHTML += `
            <a style = 'background: #6FC558' href="${events_url}">${events_name}</a>
            `
        }
    }
}

function fetchCharacters() {
    //2. Generate key, key+url -> full url
    var key = marvelKey(privateKey, publicKey);
    var fullUrl = `${url}?${key}`;

    //3. Send request, handle request
    //  https://gist.github.com/qhuydtvt/dd7aa8076bc7035a6d5a29732bc0fd78\
    // sendGetRequest(fullUrl, function(responseData) {
    //     var characters = responseData.data.results;
    //     renderCharacter(characters);
    // });

    async function dotheFecth() {
        var data = await fetch(fullUrl);
        var responseData = await data.json();
        var characters = responseData.data.results;
        renderCharacter(characters);
    }
    dotheFecth();
}

function fetchCharacterId(id) {
    //2. Generate key, key+url -> full url
    var url_id = 'https://gateway.marvel.com:443/v1/public/characters/' + id;
    var key = marvelKey(privateKey, publicKey);
    var fullUrl = `${url_id}?${key}`;
    console.log(fullUrl);
    //3. Send request, handle request
    //  https://gist.github.com/qhuydtvt/dd7aa8076bc7035a6d5a29732bc0fd78\
    sendGetRequest(fullUrl, function(responseData) {
        var characters = responseData.data.results;
        renderCharacterId(characters);
    }); //CHANGE THIS INTO FETCH
}

function setupEvents() {
    var btnSearch = document.getElementById('btnSearch');
    btnSearch.addEventListener('click', function(e) {
        var search_bar = document.getElementById('search_bar');
        var searchString = search_bar.value;
        var key = marvelKey(privateKey, publicKey);
        var fullUrl = `${url}?${key}`;
        if (searchString != '') {
            fullUrl += `&nameStartsWith=${searchString}`;
        }
        sendGetRequest(fullUrl, function(responseData) {
            var characters = responseData.data.results;
            renderCharacter(characters);
        });
    });
}

fetchCharacters();
setupEvents();

function characterUnique(ele) {
    var id = ele.getAttribute('id');
    console.log(id);
    fetchCharacterId(id);
}