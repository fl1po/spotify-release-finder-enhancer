function getData() {
    var storageKey = 'exclusions';
    var storageData = JSON.parse(localStorage.getItem(storageKey));
    if (!storageData) {
        localStorage.setItem(storageKey, JSON.stringify({
            artists: [],
            genres: [],
        }));
    }
    var { artists, genres } = storageData;
    return { artists, genres, storageData, storageKey };
}

var genreTags = [...document.getElementsByClassName('genrename')];
var artistTags = [...document.getElementsByTagName("b")];

function removeNodes(nodes) {
    nodes.forEach((tag) => tag.parentElement.parentElement.style.display = 'none');
}

function returnNodes(nodes) {
    nodes.forEach((tag) => tag.parentElement.parentElement.style.display = 'inline-block');
}

function removeNextNodes(nodes) {
    nodes.forEach((tag) => {
        tag.nextElementSibling.style.display = 'none';
        tag.style.display = 'none';
    });
}

function excludeArtist(artist) {
    const { storageData, artists, storageKey } = getData();
    const newData = {
        ...storageData,
        artists: [...artists, artist]
    };
    localStorage.setItem(storageKey, JSON.stringify(newData));
    removeNodes(artistTags.filter((tag) => tag.innerText === artist));
}

function excludeArtists() {
    const { artists } = getData();
    removeNodes(artistTags.filter((tag) => artists.includes(tag.innerText)));
}

function returnArtist(artist) {
    const { storageData, artists, storageKey } = getData();
    const newData = {
        ...storageData,
        artists: artists.filter((prevArtist) => prevArtist !== artist)
    };
    localStorage.setItem(storageKey, JSON.stringify(newData));
    returnNodes(artistTags.filter((tag) => tag.innerText === artist));
}

function excludeGenre(genre) {
    const { storageData, genres, storageKey } = getData();
    const newData = {
        ...storageData,
        genres: [...genres, genre]
    };
    localStorage.setItem(storageKey, JSON.stringify(newData));
    removeNextNodes(genreTags.filter((tag) => tag.children[0].innerText === genre));
}

function excludeGenres() {
    const { genres } = getData();
    removeNextNodes(genreTags.filter((tag) => genres.includes(tag.children[0].innerText)));
}

function appendRemoveNode(node, className, exclude) {
    const removeNode = document.createElement('button');
    removeNode.onclick = (e) => {
        e.preventDefault();
        exclude(node.children[0].innerText);
    }
    removeNode.className = className;
    applyRemoveNodeStyles(removeNode);
    node.append(removeNode);
}

function setStyle(node, styles) {
    Object.entries(styles).forEach(([style, value]) => {
        node.style[style] = value;
    })
}

function applyRemoveNodeStyles(removeNode) {
    const defaultStyles = {
        fontSize: '9px',
        width: '20px',
        height: '15px',
        marginLeft: '5px',
        cursor: 'pointer',
    };
    removeNode.innerHTML = 'x';
    setStyle(removeNode, defaultStyles);
}

function getClassName(node, i) {
    return node.children[0].innerText + i;
}

function setRemoveNodes({ tags, isGenre }) {
    tags.forEach((tag, i) => {
        const node = isGenre ? tag : tag.parentElement;
        const className = getClassName(node, i);
        const removeNode = node.getElementsByClassName(className)[0];
        if (!removeNode) {
            appendRemoveNode(node, className, isGenre ? excludeGenre : excludeArtist);
        } else {
            applyRemoveNodeStyles(removeNode);
        };
    });
}

function renderArtistsList() {
    const { artists } = getData();
    const label = document.createElement('label');
    const labelId = 'artist-select';
    let selectDiv = document.getElementsByClassName(labelId)[0];
    if (!selectDiv) {
        selectDiv = document.createElement('div');
        selectDiv.className = labelId;
        showButton = document.createElement('select');
        showButton.onchange = (e) => {
            const artistName = e.target.value;
            returnArtist(artistName);
            renderArtistsList();
        };
        label.innerText = 'Select an artist to remove from the blocked list';
        label.for = labelId;
        label.style.marginRight = '5px';
        showButton.id = labelId;
        selectDiv.style.position = 'absolute';
        selectDiv.style.right = 0;
        selectDiv.style.top = 0;
        document.querySelector('body').append(selectDiv);
        selectDiv.append(label);
        selectDiv.append(showButton);
    }
    artists.reverse().forEach(option => {
        const artistNode = document.createElement('option');
        artistNode.value = option;
        artistNode.text = option;
        artistNode.selected = false;
        showButton.appendChild(artistNode);
    })
}

function setData() {
    setRemoveNodes({ tags: artistTags, isGenre: false });
    excludeArtists();
    setRemoveNodes({ tags: genreTags, isGenre: true });
    excludeGenres();
}

setData();
renderArtistsList();