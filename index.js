document.addEventListener('DOMContentLoaded', () => {
  const cardArray = [
    {
      name: 'basil',
      img: 'images/basil.png'
    },
    {
      name: 'cheese',
      img: 'images/cheese.png'
    },
    {
      name: 'tomato',
      img: 'images/tomato.png'
    },
    {
      name: 'olive',
      img: 'images/olive.png'
    },
    {
      name: 'ham',
      img: 'images/ham.png'
    },
    {
      name: 'mushroom',
      img: 'images/mushroom.png'
    },
    {
      name: 'basil',
      img: 'images/basil.png'
    },
    {
      name: 'cheese',
      img: 'images/cheese.png'
    },
    {
      name: 'tomato',
      img: 'images/tomato.png'
    },
    {
      name: 'olive',
      img: 'images/olive.png'
    },
    {
      name: 'ham',
      img: 'images/ham.png'
    },
    {
      name: 'mushroom',
      img: 'images/mushroom.png'
    },
  ]
//Make every time random cards
  cardArray.sort(() => 0.5 - Math.random())

  // LIST OF VARIABLES
  const grid = document.querySelector('.container')
  //const resultDisplay = document.querySelector('#result')
  let cardsChosen = []
  let cardsChosenId = []
  let cardsWon = []

  //FILL THE CONTAINER AND CREATE THE GRID
  function createGrid() {
    for (let i = 0; i < cardArray.length; i++) {
      let card = document.createElement('img')
      card.setAttribute('src', 'images/blank.png')
      card.setAttribute('data-id', i)
      card.addEventListener('click', flipCard)
      grid.appendChild(card)
    }
  }

  //check for matches
  function checkForMatch() {
    var cards = document.querySelectorAll('img')
    const optionOneId = cardsChosenId[0]
    const optionTwoId = cardsChosenId[1]
    //IF THE CARDS MATCH
    if(optionOneId == optionTwoId) {
      cards[optionOneId].setAttribute('src', 'images/blank.png')
      cards[optionTwoId].setAttribute('src', 'images/blank.png')
    }
    else if (cardsChosen[0] === cardsChosen[1]) {
      cards[optionOneId].setAttribute('src', 'images/white.png')
      cards[optionTwoId].setAttribute('src', 'images/white.png')
      cards[optionOneId].removeEventListener('click', flipCard)
      cards[optionTwoId].removeEventListener('click', flipCard)
      cardsWon.push(cardsChosen)
    } else {
      cards[optionOneId].setAttribute('src', 'images/blank.png')
      cards[optionTwoId].setAttribute('src', 'images/blank.png')
    }
    cardsChosen = []
    cardsChosenId = []
    resultDisplay.textContent = cardsWon.length
    if  (cardsWon.length === cardArray.length/2) {
      resultDisplay.textContent = 'Congratulations! You found them all!'
    }
  }

  //flip your card
  function flipCard() {
    var cardId = this.getAttribute('data-id')
    cardsChosen.push(cardArray[cardId].name)
    cardsChosenId.push(cardId)
    this.setAttribute('src', cardArray[cardId].img)
    if (cardsChosen.length ===2) {
      setTimeout(checkForMatch, 500)
    }
  }

  createGrid()
})
