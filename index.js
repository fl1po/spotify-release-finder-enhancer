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

function setRemoveNodes(tags, isGenre) {
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

function setData() {
    setRemoveNodes(artistTags);
    excludeArtists();
    setRemoveNodes(genreTags, true);
    excludeGenres();
}

setData();