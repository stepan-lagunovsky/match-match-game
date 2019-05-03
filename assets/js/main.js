// DOMstrings
const DOMstrings = {
    cardBoard: 'cardBoard',
    startBtn: 'jsStartBtn',
    difficultyRadio: 'difficulty',
    cardSkirtRadio: 'cardskirt',
    dropDown: '.dropdown'
}

// Framework
var F = {
    Get: {
		byId: id => document.getElementById(id),
        byName: name => document.getElementsByName(name),
        byQuery: query => document.querySelector(query),
        byQueryAll: queryAll => document.querySelectorAll(queryAll),
    },
    Event: {
		add: (type, elem, func) => elem.addEventListener(type, func),
    },
};

// Dropdowns
F.Get.byQueryAll(DOMstrings.dropDown).forEach(dropdown => {
    F.Event.add('click', dropdown, event => {
        event.target.parentNode.classList.toggle('opened')
    })
})

F.Event.add('mouseup', document, event => {
    if (!event.target.parentNode.classList.contains('opened')) {
        for (let  dropdown of document.querySelectorAll(DOMstrings.dropDown)) {
            dropdown.classList.remove('opened')
        }
    }
})

// TIMER
let totalSeconds = 0;

function Timer() {
    let timerId, start, remaining

    this.pause = function() {
        window.clearTimeout(timerId);
        remaining -= Date.now() - start;
    }

    this.resume = function() {
        start = Date.now();
        window.clearTimeout(timerId);
        timerId = window.setInterval(() => {
            ++totalSeconds

            F.Get.byId('timer').innerHTML = `${Math.floor( (totalSeconds/1000) * 2.5 )}`;
        }, remaining);
    };

    this.pause();
}

const timer = new Timer();

// Play/pause
F.Event.add('change', F.Get.byId('playPause'), (event) => {
    const labelText = event.target.checked ? 'Continue' : 'Pause';
    F.Get.byId('playPause').nextElementSibling.textContent = labelText;

    if (event.target.checked) {
        timer.pause();
    } else {
        timer.resume();
    }
});

// Load cards
let cardImages = [];

window.onload = () => {
    fetch('./cards.json')
    .then(response => {
        return response.json()
    })
    .then(cards => {
        cardImages = cards
    });
}

// Shuffle cards
const shuffleCards = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Set game options
let gameOptions = {};

F.Get.byName(DOMstrings.difficultyRadio).forEach((cur) => {
    F.Event.add('change', cur, (event) => {
        gameOptions.cardsTotal = event.target.value / 2;
    })
})

F.Get.byName(DOMstrings.cardSkirtRadio).forEach((cur) => {
    F.Event.add('change', cur, (event) => {
        gameOptions.cardSkirt = `assets/img/cards/back/${event.target.value}.png`
    })
})

// Apply options and start
F.Event.add('click', F.Get.byId(DOMstrings.startBtn), (event) => {
    let total = gameOptions.cardsTotal;
    let colsNumber = total === 9 ? 6 : total === 12 ? 8 : total;
    const useCards = cardImages.slice(0, total);
    const doubledIndexes = [...useCards, ...useCards];

    shuffleCards(doubledIndexes);
    
    F.Get.byId(DOMstrings.cardBoard).style.gridTemplateColumns = `repeat(${colsNumber}, 150px)`;

    doubledIndexes.forEach((currentFront, index) => {          
        F.Get.byId(DOMstrings.cardBoard).innerHTML += `
            <div class="card-box">
                <div class="card" id="card_${index}" onclick="cardClickHandler('card_${index}', '${currentFront}')">
                    <div class="card__side card__side--front">
                        <div class="card__picture card__picture--front">
                            <img class="imageOfTheCard" src="${gameOptions.cardSkirt}"/>
                        </div>
                    </div>
                    <div class="card__side card__side--back card__side--back-1">
                        <div class="card__picture card__picture--back">
                            <img class="imageOfTheCard" src="${currentFront}"/>
                        </div>
                    </div>
                </div>
            </div>
            `
    });
    
    event.target.setAttribute('disabled', 'disabled')
})

const openCard = (id) => {
    const clickedCardClass = F.Get.byId(id).classList;
    clickedCardClass.add('jsRoatateCard')
}

const closeCard = (id) => {
    const clickedCardClass = F.Get.byId(id).classList;
    clickedCardClass.remove('jsRoatateCard')
}

const selectedCard = {
    id: null,
    value: null,
    inUse: false,
}

const insertFirstCard = (id, value) => {
    selectedCard.id = id;
    selectedCard.value = value;
}

const isCardMatch = (value) => {
    return selectedCard.value === value
}

const resetSelectedCard = () => {
    selectedCard.id = null;
    selectedCard.value = null;
    selectedCard.inUse = false;
}

const cardClickHandler = (id, value) => {
    if (selectedCard.inUse) return;
    openCard(id)

    if (selectedCard.id === null) {
        insertFirstCard(id, value);
        return;
    }

    if(selectedCard.id !== id){
        selectedCard.inUse = true;
        setTimeout(() => {
            if (isCardMatch(value)) {
                F.Get.byId(id).remove();
                F.Get.byId(selectedCard.id).remove();
            } else {
                closeCard(selectedCard.id);
                closeCard(id);
            }
            resetSelectedCard();
        }, 800)    
    }
};
