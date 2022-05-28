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
    return { artists, genres, storageData };
}

var genres = document.getElementsByClassName('genrename');
var artistTags = [...document.getElementsByTagName("b")];

function removeNodes(nodes) {
    nodes.forEach((tag) => tag.parentElement.parentElement.style.display = 'none');
}

function excludeArtist(artist) {
    const { storageData, artists } = getData();
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

function appendRemoveNode(tag, className) {
    const removeNode = document.createElement('button');
    removeNode.onclick = (e) => {
        e.preventDefault();
        excludeArtist(tag.innerText);
    }
    removeNode.className = className;
    applyRemoveNodeStyles(removeNode);
    tag.parentElement.append(removeNode);
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

function setData() {
    artistTags.forEach((tag, i) => {
        const className = tag.innerText + i;
        const removeNode = tag.parentElement.getElementsByClassName(className)[0];
        if (!removeNode) {
            appendRemoveNode(tag, className);
        } else {
            applyRemoveNodeStyles(removeNode);
        };
        
    });
    excludeArtists();
}

setData();