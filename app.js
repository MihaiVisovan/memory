// const cards = require('./Media/Images/cards.js');
const numberOfCards = 30;
const theme = new Audio('Media/Music/theme.mp3');
const win = new Audio('Media/Music/win.mp3');
const lose = new Audio('Media/Music/lose.mp3');
let numberOfClicks = 0;
let firstImageId = 0;
let secondImageId = 0;
let startMusic = true;
let shuffledCards = [];

window.onload = () => {
    shuffledCards = shuffle(easyCards);
    for (i = 0; i < numberOfCards; i++) {
        let card = document.createElement("div");
        card.className = "card";

        let innerCard = document.createElement("div");
        innerCard.className = "card-inner";
        innerCard.setAttribute("id", shuffledCards[i].id);
        setTimeout(() => {
            innerCard.addEventListener('click', swapCardFace);
        }, 5000)

        let frontCard = document.createElement("div")
        frontCard.className = "card-front";
        frontCard.dataset.row = Math.floor(i / 6);

        let backCard = document.createElement("div");
        backCard.className = "card-back";
        backCard.style.backgroundImage = shuffledCards[i].path;

        card.appendChild(innerCard);
        innerCard.appendChild(frontCard);
        innerCard.appendChild(backCard);

        document.getElementById("cards").appendChild(card);
    }
    let timer = document.getElementById("timer");
    let score = document.getElementById("score");
    let clearInterval = setInterval(() => {
        if(parseInt(timer.textContent) === 0) {
            stopThemeSong();
            lose.volume = 0.2;
            lose.play();
            setTimeout(() => {
                alert("You lost!");
            }, 0);
            location.reload();
            this.clearInterval(clearInterval);
        }
        else if(parseInt(score.textContent) === 15) {
            stopThemeSong();
            win.volume = 0.5;
            win.play();
            setTimeout(() => {
                alert("You win!");
            }, 0);           
            location.reload();
            this.clearInterval(clearInterval);
        } else {
            timer.textContent = timer.textContent - 1;
        }   
    }, 1000)
}

const stopThemeSong = () => {
    if (!theme.paused) {
        theme.pause();
    }
}

const shuffle = (array) => {
    return array.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);
}

const checkMatchingImages = () => {
    let score = document.getElementById("score");
    const firstImageCard = document.getElementById(firstImageId);
    const secondImageCard = document.getElementById(secondImageId);

    const firstImageIndex = shuffledCards.findIndex(x => x.id === firstImageId);
    const secondImageIndex = shuffledCards.findIndex(x => x.id === secondImageId);

    const sameImages = firstImageCard.childNodes[1].style.backgroundImage 
                     === secondImageCard.childNodes[1].style.backgroundImage;
    if(!sameImages) {
        if(!shuffledCards[firstImageIndex].flipped) {
            firstImageCard.style.transform = "none";
        }
        if(!shuffledCards[secondImageIndex].flipped) {
            secondImageCard.style.transform = "none";
        }
    } else {
        shuffledCards[firstImageIndex].flipped = true;
        shuffledCards[secondImageIndex].flipped = true;
        score.textContent = parseInt(score.textContent) + 1;
    }
    numberOfClicks = 0;
}

const swapCardFace = (event) => {
    if(startMusic) {
        theme.volume = 0.5;
        theme.play();
        startMusic = false;
    }
    let innerCard = event.target.parentNode;
    if(numberOfClicks === 0) {
        firstImageId = innerCard.id;
        innerCard.style.transform = "rotateY(180deg)";
        numberOfClicks++;
    } else if(numberOfClicks === 1 && firstImageId !== innerCard.id) {
        secondImageId = innerCard.id;
        innerCard.style.transform = "rotateY(180deg)";
        numberOfClicks++;
        setTimeout(checkMatchingImages, 700);
    }
}

