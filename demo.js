const apikey = "537b641d27415d26a221d4f9cd736b2e";
const apiToken = "ATTA2aded428541342740a1e740389d73a90e8b6b943e5c1cbdf04788548355d5801612FEE20";

const lasturl = `key=${apikey}&token=${apiToken}`;

const boardId = "6517aa320f4ac347ee5824b6";
const trashBoardId = "651bb25756deffba12797492";

const loader = document.querySelector('.loading');



async function fun() {
    // e.preventDefault();
    const app = await fetch(`https://api.trello.com/1/boards/${boardId}/lists?${lasturl}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
    const jsondata = await app.json();
    // console.log(jsondata);
    // let masterObj = {};
    // for (const elem of jsondata) {
    //     masterObj.{ }
    // }

    let mainWrapper = document.getElementsByClassName('main-wrapper')[0];
    while (mainWrapper.hasChildNodes()) {
        mainWrapper.removeChild(mainWrapper.firstChild);
    }
    // console.log(mainWrapper);
    const addNewListElement = document.createElement('div');
    addNewListElement.className = "add-list";
    addNewListElement.innerHTML = `
        <div class="input-new-list">
            <div class="input-dumy">
                <a>+ Add a list</a>
            </div>
            <div class="input-field" action="post">
                <input type="text" placeholder="add a list">
                <button type="submit" class="add-list-btn">ADD</button>
            </div>
        </div>
    `
    const listholder = document.createElement('div');
    listholder.className = "lists-holder";
    for (const elem of jsondata) {
        console.log(elem.name);
        console.log(elem.id);
        let list = document.createElement('div');
        list.classList.add('list');
        list.setAttribute('data-id', elem.id)
        list.innerHTML = `
            <h3 class="list-name">${elem.name}<span class="list-del"><span class="material-symbols-outlined delete-list">
            delete
        </span></span></h3>
            <ul class="card-list">
            </ul>
            <div class="input-dumy">
                <a>+ Add a card</a>
            </div>
            <div class="input-field">
                <input type="text" placeholder="add a card">
                <button class="add-card-btn">ADD</button>
            </div>
        `;
        listholder.appendChild(list);
    }

    listholder.appendChild(addNewListElement);
    console.log(listholder)
    mainWrapper.appendChild(listholder);
    await displayAllCards();
    listen();
}

async function createNewList(value) {
    console.log(value);
    let newvalue = value.replace(" ", "%20");
    console.log(newvalue);
    // console.log(`https://api.trello.com/1/boards/${boardId}/lists?name=${value}&${lasturl}`);
    const response = await fetch(`https://api.trello.com/1/boards/${boardId}/lists?name=${newvalue}&${lasturl}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    });
    console.log(response);
    fun();
}

async function getAllCards(listId) {
    const cardsString = await fetch(`https://api.trello.com/1/lists/${listId}/cards?${lasturl}`, {
        method: "GET",
        headers: {
            'Accept': 'application/json'
        }
    });
    const card = await cardsString.json();
    return card;
}


async function displayAllCards() {
    const listsArray = Array.from(document.querySelectorAll('.list'));

    for (const lists of listsArray) {
        await displayAllCardsInList(lists);
    }
}

async function displayAllCardsInList(listElement) {
    loader.style.display = "block";
    // console.log(listElement)
    const listId = listElement.getAttribute("data-id");
    // console.log(listElement.getAttribute("data-id"));
    const cardlist = listElement.children[1];
    while (cardlist.hasChildNodes()) {
        cardlist.removeChild(cardlist.firstChild);
    }
    const cards = await getAllCards(listId);
    for (const card of cards) {
        // console.log(card.name);
        const newcard = document.createElement('li');
        newcard.className = 'card';
        newcard.setAttribute("data-id", card.id);
        newcard.innerHTML = `
                        ${card.name} 
                        <span  class="editing">
                            <span class="material-symbols-outlined edit-card">
                                edit
                            </span>
                            <span class="material-symbols-outlined delete-card">
                                delete
                            </span>
                        </span>
                    `
        cardlist.appendChild(newcard);
    }
    loader.style.display = "none";
}

async function createNewCard(cardName, listId, listElement) {
    try {
        console.log("asld", cardName)
        const cardsString = await fetch(`https://api.trello.com/1/cards?name=${cardName}&idList=${listId}&${lasturl}`, {
            "method": "POST",
            "headers": {
                "Accept": "application/json"
            }
        });
        const card = await cardsString.json();
        console.log(card);
        await displayAllCardsInList(listElement);
        listen();
        return;
    } catch (error) {
        console.log(err);
    }

}

async function deleteCard(cardElement) {
    try {
        const listElement = cardElement.parentElement.parentElement;
        console.log(cardElement.getAttribute("data-id"));
        const cardId = cardElement.getAttribute("data-id");
        const res = await fetch(`https://api.trello.com/1/cards/${cardId}?${lasturl}`, {
            method: 'DELETE',
        })
        const dataRes = await res.json();
        console.log(dataRes);
        await displayAllCardsInList(listElement);
        listen();
        return;
    } catch (err) {
        console.log(err);
    }
}

async function updateCard(editingPallet, cardId) {
    try {
        console.log(cardId)
        const cardsString = await fetch(`https://api.trello.com/1/cards/${cardId}?${lasturl}`, {
            method: "GET",
            headers: {
                'Accept': 'application/json'
            }
        });
        const card = await cardsString.json();
        cardName = card.name;
        cardDesc = card.desc;
        // console.log(
        //     card.desc
        // )

        editingPallet.setAttribute("data-id", cardId);

        while (editingPallet.hasChildNodes()) {
            editingPallet.removeChild(editingPallet.firstChild);
        }

        const newInnerHtml = document.createElement('div');
        newInnerHtml.className = "editable-container";
        newInnerHtml.innerHTML = `
                    <div class="card-name-edit editable">
                        <label for="name">Card Name</label>
                        <textarea name="name" id="" cols="30" rows="2">${cardName}</textarea>
                    </div>
                    <div class="card-desc-edit editable">
                        <label for="desc">Description</label>
                        <textarea name="desc" id="" cols="30" rows="2">${cardDesc}</textarea>
                    </div>
                    <div class="edit-btn">
                        update
                    </div>
                `
        editingPallet.appendChild(newInnerHtml);
        editingPallet.style.display = "flex";
        listenEditBtn();
        editingPallet.parentElement.addEventListener("click", (e) => {
            if (e.target.contains(editingPallet) && e.target !== editingPallet) {
                editingPallet.style.display = "none";
            }
        })
        listen();

    } catch (error) {
        console.log(error);
    }


}

async function updateOnTrello(cardId, desc, cardName, editingPallet) {
    try {
        const res = await fetch(`https://api.trello.com/1/cards/${cardId}?name=${cardName}&desc=${desc}&${lasturl}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json'
            }
        });
        const resData = await res.json();
        editingPallet.style.display = "none";
        await displayAllCards();
        listen();
        // return resData;

    } catch (error) {
        console.log(error);
    }
}


function listenEditBtn() {

    const editingPallet = document.getElementsByClassName('edit-cards-area')[0];

    editingBtn = document.querySelector('.edit-btn');
    console.log(editingBtn);
    editingBtn.addEventListener('mouseover', (e) => {
        editingBtn.style.cursor = 'pointer';
    })
    editingBtn.addEventListener('mouseleave', (e) => {
        editingBtn.style.cursor = 'default';
    })
    editingBtn.addEventListener('click', (e) => {
        console.log(editingBtn.previousElementSibling.previousElementSibling.lastElementChild.value);
        console.log(editingBtn.previousElementSibling.lastElementChild.value);
        console.log(editingBtn.parentElement.parentElement.getAttribute('data-id'));
        const cardId = editingBtn.parentElement.parentElement.getAttribute('data-id');
        const desc = editingBtn.previousElementSibling.lastElementChild.value;
        const cardName = editingBtn.previousElementSibling.previousElementSibling.lastElementChild.value;
        if (cardName !== "") {
            updateOnTrello(cardId, desc, cardName, editingPallet);
        }
    })
    return;
}

async function deleteList(listId) {
    try {
        console.log(`https://api.trello.com/1/lists/${listId}/idBoard?value=651bb25756deffba12797492&${lasturl}`);
        const res = await fetch(`https://api.trello.com/1/lists/${listId}/?idBoard=${trashBoardId}&pos=1024&dsc=95fc72f6c3cc2ae5c01cc429ebc434152f4cce63ed4dd2a83512a27d1db56a19&${lasturl}`, {
            method: 'PUT'
        })
        const resData = await res.json();
        console.log(resData);
        listen();
    } catch (error) {
        console.log(error);
    }
}



function listen() {

    let cards = document.querySelectorAll('.card');

    let cardArray = Array.from(cards);
    // console.log(cards);

    cardArray.forEach(elem => {
        // console.log(elem);
        elem.addEventListener('mouseenter', (e) => {
            elem.style.backgroundColor = "rgb(220, 250, 256)";
        })
        elem.addEventListener('mouseleave', (e) => {
            elem.style.backgroundColor = "aliceblue";
        })
    });



    let dummyInputButton = document.querySelectorAll('.input-dumy');
    // console.log(dummyInputButton);
    let inputDummyArray = Array.from(dummyInputButton);
    // console.log(inputDummyArray);

    inputDummyArray.forEach((inputDummy) => {
        // console.log(inputDummy)
        inputDummy.addEventListener('mouseenter', (e) => {
            inputDummy.style.backgroundColor = "rgb(143, 157, 168)";
            document.body.style.cursor = "pointer";
            // console.log("mouseendter")
        })
        inputDummy.addEventListener('click', (e) => {
            inputDummy.style.display = "none";
            inputDummy.parentElement.lastElementChild.style.display = "block";
            inputDummy.parentElement.lastElementChild.firstElementChild.focus();
            // console.log(inputDummy.nextElementSibling)
            window.addEventListener("click", (e) => {
                if (e.target.contains(inputDummy.parentElement.parentElement) && e.target !== inputDummy.parentElement && e.target !== inputDummy.nextElementSibling) {
                    inputDummy.parentElement.lastElementChild.style.display = "none";
                    inputDummy.style.display = "block";
                }
            })
        })

        inputDummy.addEventListener('mouseleave', (e) => {
            inputDummy.style.backgroundColor = "rgb(205, 223, 238)";
            document.body.style.cursor = "default";
            // console.log("mouseleave")
        })
    })

    const addCardBtns = document.querySelectorAll('.add-card-btn');

    const addCardBtnsArray = Array.from(addCardBtns);

    addCardBtnsArray.forEach((addCardBtn) => {

        addCardBtn.addEventListener('click', (e) => {
            cardNameValue = e.target.previousElementSibling.value;
            listId = e.target.parentElement.parentElement.getAttribute("data-id");
            if (cardNameValue != "") {
                console.log(cardNameValue);
                console.log(listId);
                createNewCard(cardNameValue, listId, e.target.parentElement.parentElement);
                e.target.previousElementSibling.value = "";
                addCardBtn.parentElement.style.display = "none";
                addCardBtn.parentElement.previousElementSibling.style.display = "block";
                // return listen();
                // return displayAllCardsInList(e.target.parentElement.parentElement);
            }
            else {
                addCardBtn.previousElementSibling.focus();
                // return listen();
            }
        })
    });

    const addListBtns = document.querySelectorAll('.add-list-btn');
    const addListBtnArray = Array.from(addListBtns);
    addListBtnArray.forEach((addListBtn) => {
        addListBtn.addEventListener('click', (e) => {
            if (e.target.previousElementSibling.value != "") {
                listNameValue = e.target.previousElementSibling.value
                console.log(listNameValue)
                // console.log("true");
                createNewList(listNameValue);
                return listen();
            }
            else {
                console.log("false")
                e.target.previousElementSibling.focus();
            }
        })
    })
    const deleteCardBtns = document.querySelectorAll(".delete-card");
    // console.log(deleteCardBtns);
    let deleteBtnArray = Array.from(deleteCardBtns);
    // console.log(cards);
    deleteBtnArray.forEach(elem => {
        // console.log(elem);
        elem.addEventListener('mouseenter', (e) => {
            elem.style.color = "red";
            elem.style.cursor = "not-allowed"
        })
        elem.addEventListener('click', (e) => {
            // console.log(e.target.parentElement.parentElement);
            deleteCard(e.target.parentElement.parentElement);
            // return listen();
        })
        elem.addEventListener('mouseleave', (e) => {
            elem.style.color = "black";
        })
    });



    const updateCardBtns = document.querySelectorAll(".edit-card");
    // console.log(updateCardBtns);
    let updateBtnArray = Array.from(updateCardBtns);
    // console.log(cards);
    updateBtnArray.forEach(elem => {
        // console.log(elem);
        elem.addEventListener('mouseenter', (e) => {
            elem.style.color = "blue";
            elem.style.cursor = "pointer"
        })
        elem.addEventListener('click', (e) => {
            let editingPallet = document.getElementsByClassName('edit-cards-area')[0];
            cardId = elem.parentElement.parentElement.getAttribute("data-id");
            updateCard(editingPallet, cardId);
        })
        elem.addEventListener('mouseleave', (e) => {
            elem.style.color = "black";
        })
    });

    const deleteListBtn = Array.from(document.querySelectorAll('.list-del'));

    deleteListBtn.forEach(elem => {
        elem.addEventListener('mouseenter', (e) => {
            elem.style.color = "red";
            elem.style.cursor = "not-allowed"
        })
        elem.addEventListener('click', (e) => {
            const listId = elem.parentElement.parentElement.getAttribute("data-id");
            // console.log(listId);
            deleteList(listId);
        })
        elem.addEventListener('mouseleave', (e) => {
            elem.style.color = "black";
        })
    })
}

listen();

document.getElementById('btn').addEventListener('click', fun);