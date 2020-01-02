const numberOfCards = 30;
const cardsPerRow = 6;
var imagesList = Array.from(Array(15) , (_,x) => x + 1);
imagesList = imagesList.concat(imagesList);
var imageIndex = 0;
var numberOfClicks = 0;
var firstImageId = 0;
var secondImageId = 0;

window.onload = function() {
    imagesList = shuffle(imagesList);
    for (i = 0; i < numberOfCards; i++) {

        let card = document.createElement("div");
        card.className = "card";

        let innerCard = document.createElement("div");
        innerCard.className = "card-inner";
        innerCard.setAttribute("id", i);
        innerCard.addEventListener('click', swapCardFace);

        let frontCard = document.createElement("div")
        frontCard.className = "card-front";
        frontCard.dataset.row = Math.floor(i / 6);

        let backCard = document.createElement("div");
        backCard.className = "card-back";
        backCard.style.backgroundImage = getRandomImage();

        card.appendChild(innerCard);
        innerCard.appendChild(frontCard);
        innerCard.appendChild(backCard);

        document.getElementById("cards").appendChild(card);
    }
    var timer = document.getElementById("timer");
    var score = document.getElementById("score");
    var clearInterval = setInterval(function() {
        if(parseInt(timer.textContent) === 0) {
            alert("You lost!");
            location.reload();
            this.clearInterval(clearInterval);
        }
        else if(parseInt(score.textContent) === 15) {
            alert("You win!");
            location.reload();
            this.clearInterval(clearInterval);
        } else {
            timer.textContent = timer.textContent - 1;
        }   
    }, 1000)
}

function showImage(event) {
    document.getElementById(event.target.id).className = "card-transition";
}

function getRandomImage() {
    return "url('Images/HufflepuffRavenClaw/" + imagesList[imageIndex++] + ".jpg')";
}

function shuffle(array) {
    return array.map((a) => [Math.random(),a]).sort((a,b) => a[0]-b[0]).map((a) => a[1]);
}

function checkMatchingImages() {
    var score = document.getElementById("score");
    let firstImageCard = document.getElementById(firstImageId);
    let secondImageCard = document.getElementById(secondImageId);
    let sameImages = firstImageCard.childNodes[1].style.backgroundImage 
                     === secondImageCard.childNodes[1].style.backgroundImage
                     ? true : false;

    if(!sameImages) {
        firstImageCard.style.transform = "none";
        secondImageCard.style.transform = "none";
    } else {
        score.textContent = parseInt(score.textContent) + 1;
    }
    numberOfClicks = 0;
}

function swapCardFace(event) {
    let innerCard = event.target.parentNode;
    if(numberOfClicks === 0) {
        firstImageId = innerCard.id;
        innerCard.style.transform = "rotateY(180deg)";
        numberOfClicks++;
    } else if(numberOfClicks === 1) {
        secondImageId = innerCard.id;
        innerCard.style.transform = "rotateY(180deg)";
        numberOfClicks++;
        setTimeout(checkMatchingImages, 700);
    }
}

