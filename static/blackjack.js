var root = "/static/media/cards/" 
var back = root + "back.jpg";
var myDeck = {}
var deckList = []


// card to image mapping
var imageMap = {}



// keeps track of how many cards
// are played, 2 to init
var pCards = 2
var dCards = 2

// player score
var yscore = 0

// dealer score visible
// to player
var dscore = 0

// dealers hidden score from player
var hscore = 0

// If player holds, value is 1
// dealer turn stats
var callState = 0


// holds id of dealer hidden card
// this is for recall when the player calls
var dHidden = 0



// invoked when player presses call button
// this ends the players turn and updates callState to 1
// the hidden cards are now revealed and the dealer
// begins to stars playing
function call() {
    if (callState == 0) {
        callState = 1
        document.getElementById(dHidden).style.display = "none"
        document.getElementById("rspacer").style.display = "none"
        document.getElementById("reveal").style.display = "block"
        document.getElementById("hspacer").style.display = "block"
        dscore = hscore
        dealerAI()
    }
}


// checked after each turn
// will determine if game is over
// will determine whos turn
function gameState() {
    
    // players turn, player and dealer score under 21
    if (yscore < 21 && hscore < 21 && callState == 0) {
        gameMessage(0)
        return 0
    }
    
    // dealer turn, player and dealer score under 21
    if (yscore < 21 && dscore < 21 && callState == 1) {
        gameMessage(6)
        return 0
    }    
    
    // players turn, player hits BLACKJACK
    if (yscore == 21 && callState == 0) {
        gameMessage(1)
        playWinSound()
        return 1
    }
    
    // players turn, player BUSTS
    if (yscore > 21 && callState == 0) {
        gameMessage(2)
        playLoseSound()
        return 1
    }
    
    // any turn, dealer hits BLACKJACK
    if (hscore == 21 || dscore == 21) {
        gameMessage(3)
        playLoseSound()
        return 1
    }
    
    // dealers turn, dealer BUSTS
    if (dscore > 21 && callState == 1) {
        gameMessage(4)
        playWinSound()
        return 1
    }
    
    // Dealers turn, five cards draw, result is a tie
    if (callState == 1 && dscore == yscore && dCards == 5) {
        gameMessage(5)
        playLoseSound()
        return 1
    }
    
    // dealers turn, five cards drawn, under yscore
    if (callState == 1 && dscore < yscore && dCards == 5) {
        gameMessage(8)
        playWinSound()
        return 1
    }
}


function gameMessage(data) {
    
    var result = {0: 'PLAYERS TURN - DRAW OR HOLD',
                  1: 'BLACKJACK - YOU WIN',
                  2: 'YOU BUST - DEALER WINS',
                  3: 'BLACKJACK - DEALER WINS',
                  4: 'DEALER BUSTS - YOU WIN',
                  5: 'TIE - DEALER WINS',
                  6: 'DEALERS TURN',
                  7: 'DEALER HOLDS AND DEALER WINS',
                  8: 'DEALER OUT OF CARDS - YOU WIN'}
                  
    document.getElementById("result").innerHTML = result[data]
}


// used to remove cards from the deckList
// this prevents the same card being drawn twice
function popper(data) {
    myIndex = deckList.indexOf(data);
    deckList.splice(myIndex, 1);
}      

    
// used to generate the card values
// also places the draw deck on the page
// also generates ImageMap
function genDeck() {
    var deck = new Image(200, 250);
    deck.src = back;
    deck.setAttribute('id', "deck")
    deck.setAttribute('onclick','pDrawCard()');
    document.getElementById("dealer").appendChild(deck).style.float = 'right';
    
    var suites = ["h","s","d","c"]
    var royals = ["j","q","k"]
    for (var x of suites) {
        myDeck[x + "a"] = 11 // making ace == 11
        deckList.push(x + "a") // pushing ace to list
        imageMap[x + "a"] = root + (x + "a.jpg") // mapping card to image
        var i
        for (i = 2; i <= 10; i++) {
            myDeck[x + i] = i;
            deckList.push(x + i)
            imageMap[x + i] = root + (x + i + ".jpg")
        }
        for (var r of royals) {
            myDeck[x + r] = 10;
            deckList.push(x + r)
            imageMap[x + r] = root + (x + r + ".jpg")
        }
    }
}

// randomly selects a card from the deckList
// then calls popper to remove the card
// from the possible choices to prevent
// duplicates
function pickCard() {
    pick = deckList[Math.floor(Math.random() * deckList.length)]
    popper(pick)
    return pick
}


// creates and places the DOM objects
// that represent the cards on the board
// inputs are the card and (player,dealer)
function placeCard(data1,data2,data3) {
    
    // dict to determine where to put the card
    // on the player or dealer board space
    var who = {"p": "player",
               "d": "dealer"}
    
    // first dealer card (hidden)           
    if (data3 == 1 && data2 == "d") {
        var dFirst = new Image(200, 250);
        dFirst.src = back;
        dFirst.setAttribute('id', data1)
        dFirst.setAttribute('class', "card")
        document.getElementById(who[data2]).appendChild(dFirst).style.float = 'left';
        
        
        // creates the space between cards
        var spacer = document.createElement("div");
        spacer.setAttribute('id','rspacer')
        spacer.setAttribute('class','spacer')
        document.getElementById(who[data2]).appendChild(spacer).style.float = 'left';        
        
        
        // creates the hidden card
        var card = new Image(200, 250);
        card.setAttribute('id', "reveal")
        card.src = imageMap[data1];
        card.setAttribute('class', "card")
        document.getElementById(who[data2]).appendChild(card).style.float = 'left';
        
       
        // creates the space between the hidden card
        var spacer = document.createElement("div");
        spacer.setAttribute('id','hspacer')
        spacer.setAttribute('class','spacer')
        document.getElementById(who[data2]).appendChild(spacer).style.float = 'left';
        
        
        // hide hidden card and spacer
        document.getElementById("reveal").style.display = "none"
        document.getElementById("hspacer").style.display = "none"
        
    }    
    
    if (data3 == 0) {
    
        // creates the card
        var card = new Image(200, 250);
        card.setAttribute('id', data1)
        card.src = imageMap[data1];
        card.setAttribute('class', "card")
        document.getElementById(who[data2]).appendChild(card).style.float = 'left';
      
        // creates the space between cards
        var spacer = document.createElement("div");
        spacer.setAttribute('class','spacer')
        document.getElementById(who[data2]).appendChild(spacer).style.float = 'left';
    }
}


// starts the game
function deal() {
    
    document.getElementById("new").style.display = "none"
    
    // deals first card to player
    var pRandom1 = pickCard()
    var pTurn1 = myDeck[pRandom1]
    placeCard(pRandom1,"p",0)
    yscore += pTurn1 // update score
    document.getElementById("yscore").innerHTML = yscore
    
    // deals first card to dealer
    var dRandom1 = pickCard()
    var dTurn1 = myDeck[dRandom1]
    dHidden = dRandom1
    placeCard(dRandom1,"d",1)
    hscore += dTurn1 // update dealer hidden score
    
    //deals second card to player
    var pRandom2 = pickCard()
    var pTurn2 = myDeck[pRandom2]
    placeCard(pRandom2,"p",0)
    yscore += pTurn2 // update score
    document.getElementById("yscore").innerHTML = yscore
    
    // deals first card to dealer
    var dRandom2 = pickCard()
    var dTurn2 = myDeck[dRandom2]
    placeCard(dRandom2,"d",0)
    hscore += dTurn2 // update dealer hidden score
    dscore += dTurn2 // update dealer score
    document.getElementById("dscore").innerHTML = dscore
    
    // checks for blackjack after
    // initial deal
    if (gameState() == 1) {
        call()
        dscore = hscore
        document.getElementById("dscore").innerHTML = dscore
    }
}



// invoked when player draws a card
// by clicking the card pile
function pDrawCard() {
    
    var myState = gameState()
    
    if (myState == 0 && callState == 0 && pCards <= 4) {
        
        // picks the players next card
        var myPick = pickCard()
        placeCard(myPick,"p",0)
        playCardSound()
    
        //update players current score
        yscore += myDeck[myPick]
        document.getElementById("yscore").innerHTML = yscore
        
        //update cards played count for player
        pCards += 1
        }
    gameState()
}



function dealerAI() {
    
    // during dealers turn will hold if
    // dealers hand is greater than players hand
    // and under 21
    if (hscore >= yscore && hscore <= 21) {
        document.getElementById("dscore").innerHTML = dscore
        playLoseSound()
        document.getElementById("new").style.display = "block"
        gameMessage(7)
    }
    
    if (hscore < yscore && hscore <= 21 && dCards <= 4) {
        dealerDraw()
    }
}



// invoked when player clicks the call button (hold)
// this loops until the game is over
function dealerDraw() {
    
    // checking to see if game is over
    // checking if playerd called (hold)
    // checking if the dealer has played 
    // less than 5 cards 
    if (gameState() == 0 && callState == 1 && dCards <= 4) {
        
        // picks the dealers next card
        var myPick = pickCard()
        placeCard(myPick,"d",0)
        
        //update dealers current score
        dscore += myDeck[myPick]
        document.getElementById("dscore").innerHTML = dscore
        playCardSound()
        
        //update cards played count for dealer
        dCards += 1
        
        // checking to see if the game
        // has ended
        gameState()
        
    }
    // if game can go on
    // pause for 1 sec for more
    // realistic human feeling
    // invokes dealer AI after pause
    if (gameState() == 0) {
        setTimeout(dealerAI, 1000)  
    }    
}

// sound played when a card is drawn
function playCardSound() {
    var x = document.getElementById("placeCard");
    x.play(); 
}

// sound played when a player loses
function playLoseSound() {
    var x = document.getElementById("lose");
    x.play();
    document.getElementById("new").style.display = "block"
    document.getElementById("call").style.display = "none"
}

// sound played when a player wins
function playWinSound() {
    var x = document.getElementById("clap");
    x.play();
    document.getElementById("new").style.display = "block"
    document.getElementById("call").style.display = "none"
}

function restart() {
    window.location.reload(false);
}
