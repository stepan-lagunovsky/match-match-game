var DOMstrings = {
    cardBoard: 'cardBoard',
    startBtn: 'jsStartBtn',
    difficultyRadio: 'difficulty',
    cardPictureRadio: 'cardside',
    card: '.card'
}

document.getElementsByName(DOMstrings.difficultyRadio).forEach(function(cur) {
    cur.addEventListener('change', (e) => {
        document.getElementById(DOMstrings.startBtn).value = e.target.value / 2;
    })
})

document.getElementsByName(DOMstrings.cardPictureRadio).forEach(function(cur) {
    cur.addEventListener('change', (e) => {
        const choosenPicture = e.target.value

        cardOptions.backgroundImage = 'assets/img/cards/back/' + choosenPicture + '.png'

    })
})

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

let cardsIndexes = []

let cardOptions = {}

document.getElementById(DOMstrings.startBtn).addEventListener('click', function(e) {
    let choosenNumber = e.target.value;

    for (let i = 0; i < choosenNumber; i++) {
        let index = i

        cardsIndexes.push(index)
    }

    const doubledIndexes = [...cardsIndexes, ...cardsIndexes]

    shuffle(doubledIndexes)

    doubledIndexes.forEach((currentIndex, index) => {  
        let cardConstructor = {
            id: currentIndex,
            title : currentIndex,
            img : currentIndex
        };
        
        document.getElementById(DOMstrings.cardBoard).innerHTML += `
            <div class="card" id="card_${cardConstructor.id}" data-card="card_${cardConstructor.id}">
                <div class="card__side card__side--front">
                    <div class="card__picture card__picture--front">
                        <img id='img_${cardConstructor.id}' class="imageOfTheCard" src="${cardOptions.backgroundImage}"/>
                    </div>
                </div>
                <div class="card__side card__side--back card__side--back-1">
                    <div class="card__picture card__picture--back">
                        <img class="imageOfTheCard" src="assets/img/cards/front/front_${cardConstructor.img}.png"/>
                    </div>
                </div>
            </div>
            `
    });
    
    this.setAttribute("disabled", "disabled")
})
localStorage.clear();


let cleckedPair = []

document.getElementById(DOMstrings.cardBoard).addEventListener('click', (e) => {
    const newCard = e.target.parentNode.parentNode.parentNode.id
    const clickedCardClass = e.target.parentNode.parentNode.parentNode.classList
    
    clickedCardClass.add('jsRoatateCard')

    if (cleckedPair.length < 2) {
        cleckedPair.push(newCard)
        // cleckedPair.indexOf(newCard) === -1 ? cleckedPair.push(newCard) : console.log('already here')
    }

    if (cleckedPair.length === 2) {

        setTimeout(function(){

            if (cleckedPair[0] === cleckedPair[1]) {
                alert('true')
            } else {
                alert('false')
            }

            for (let el of document.getElementsByClassName('card')) {
                el.classList.remove('jsRoatateCard')
            }
    
            cleckedPair = []
         }, 1000);
    }
})


console.log(cleckedPair)

// validate = () => {

//     for (let el of cleckedPair) {
//         document.getElementById(el).classList.remove('jsRoatateCard')
//     }
// }


// for (let el of selectedPair) {
//     if (selectedPair[0] !== selectedPair[1]) {
//         document.getElementById(el).classList.remove('jsRoatateCard')
//     }
// }


// let matchArr = [];

// document.getElementById(DOMstrings.cardBoard).addEventListener('click', (e) => {
//     let cardSrc = e.target.src;

//     // Push only if there this is a card, but NOT the board
//     if (e.target.className === 'imageOfTheCard') {
//         matchArr.push(cardSrc)
//     }

//     console.log(matchArr)

//     if (!!matchArr.reduce(function(a, b){ return (a === b) ? a : NaN; }) && matchArr.length == 2) {
//         alert('match')
//     } else {
//         alert('not match')
//     }

//     // Clear array if more then two checked
//     if (matchArr.length >= 2) {
//         matchArr = [];
//     }

// })






// function shuffle(array) {
//     var currentIndex = array.length, temporaryValue, randomIndex;
  
//     // While there remain elements to shuffle...
//     while (0 !== currentIndex) {
  
//       // Pick a remaining element...
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex -= 1;
  
//       // And swap it with the current element.
//       temporaryValue = array[currentIndex];
//       array[currentIndex] = array[randomIndex];
//       array[randomIndex] = temporaryValue;
//     }
  
//     return array;
//   }
  
//   var arr = [2, 11, 37];
//   arr = shuffle(arr);
//   console.log(arr)



// TIMER
// const timerVar = setInterval(countTimer, 1000);
// let totalSeconds = 0;

// function countTimer() {
//    ++totalSeconds;
//    let hour = Math.floor(totalSeconds /3600);
//    let minute = Math.floor((totalSeconds - hour*3600)/60);
//    let seconds = totalSeconds - (hour*3600 + minute*60);

//    document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
// }

// clearInterval(timerVar);
