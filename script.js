const form = document.querySelector("form");
const listItem = form.elements["listItem"];
const listContainer = document.querySelector(".list");

const LIST_DATA_KEY = "listData";
const listStorageManager = createStorageManager(LIST_DATA_KEY);

form.addEventListener("submit", event => {
    event.preventDefault();
    listStorageManager.add(listItem.value);
    listItem.value = "";
});

function generateList(list) {
    listContainer.innerHTML = "";
    for (let key in list) {
        if (list.hasOwnProperty(key)) {
            let li = document.createElement("li");
            li.innerText = list[key];
            let deleteButton = document.createElement("button");
            deleteButton.innerText = "DELETE";
            deleteButton.classList.add("delete-button");
            deleteButton.addEventListener("click", () => {
                listStorageManager.remove(key);
            });
            li.appendChild(deleteButton);
            listContainer.appendChild(li);
        }
    }
}

function getFromLocalStorage() {
    const listFromLocalStorage = listStorageManager.load();
    if (listFromLocalStorage) {
        generateList(listFromLocalStorage);
    }
}

function createStorageManager(storageKey) {

    function add(item) {
        let listFromLocalStorage = load();
        if (listFromLocalStorage !== null) {
            listFromLocalStorage[item] = item;
            const json = JSON.stringify(listFromLocalStorage);
            localStorage.setItem(storageKey, json);
            generateList(listFromLocalStorage);
        } else {
            let newObject = { [item]: item };
            const json = JSON.stringify(newObject);
            localStorage.setItem(storageKey, json);
            generateList(newObject);
        }
    }

    function remove(itemKey) {
        let listFromLocalStorage = load();
        delete listFromLocalStorage[itemKey];
        const json = JSON.stringify(listFromLocalStorage);
        localStorage.setItem(storageKey, json);
        generateList(listFromLocalStorage);

    }

    function load() {
        const json = localStorage.getItem(storageKey);
        try {
            return JSON.parse(json);
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    return { add, remove, load };
}

getFromLocalStorage();
