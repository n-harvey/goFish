/*

Deck class, creates an empty array deck 
populated by the createDeck() function, card suits are not important so just iterates 4 times to give all 52 cards

shuffle() funtion uses fisher-yates shuffle to randomizes the deck

deal() function allocates 14 cards between two users. 14 cards is the starting hand

draw() function allows players to take the top card from the deck during go fish

size() function returns how many cards are still in the deck - bugged

*/

class Deck {
	constructor() {
		this.deck = []
	}

	createDeck() {
		let cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']

		for (let i = 0; i < 4; i++) {
			cards.forEach(card => {
				this.deck.push(card)
			});
		}
	}

	shuffle() {
		let index = this.deck.length,
			randomIndex

		while (index != 0) {
			randomIndex = Math.floor(Math.random() * index)
			index--

			[this.deck[index], this.deck[randomIndex]] = [this.deck[randomIndex], this.deck[index]]
		}
	}

	deal(player1, player2) {
		for (let i = 0; i < 14; i++) {
			if (i % 2 === 0) {
				player1.hand.push(this.deck.shift())
			}
			else {
				player2.hand.push(this.deck.shift())
			}
		}
	}

	draw(player) {
		player.hand.push(this.deck.shift())
	}

	size() {
		console.log(this.deck.length)
		return this.deck.length
	}
}

/*
Player class takes param of Name
constructors a player with a name, a hand, and a score
*/


class Player {
	constructor(name) {
		this.name = name
		this.hand = []
		this.score = 0
	}
}


/*

goFish class uses constructors book to keep track of how many books(full set of 4 cards) have been collected, 13 books is all that can be made in go fish

cards array used to check that a user an input a valid card to attempt to fish, if input is not included in array prompt for another input
(case sensitive for now, practice with find?)

startGame() created two players, the deck, shuffles the deck, deals the cards, and then runs the playGame() function

playGame() function take params of player1, player1, and the deck
contains a while loop, that while there are less than 13 books to keep playing the game
alerts the final score when the books are completed

turn() function take params of player1, player 2, and the deck
controls the turns for each player

checkForBooks() function takes params of player
Looks inside the player hand for 4 copies of one card
if found removes the cards, increases the book count, and adds 1 to player score
*/


class goFish {
	constructor() {
		this.books = 0
		this.cards = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']
		this.sets = []
	}

	startGame() {
		let user = new Player(prompt('Enter player name'))
		let cpu = new Player('cpu')
		let deck = new Deck()
		deck.createDeck()
		deck.shuffle()
		deck.deal(user, cpu)
		console.log(user.hand, cpu.hand, deck)
		this.playGame(user, cpu, deck)
	}

	playGame(player1, player2, deck) {
		while (!(this.books >= 13)) {
			this.turn(player1, player2, deck)
			console.log(`Deck remaining cards ${this.deck}`)
			this.turn(player2, player1, deck)
			console.log(`Deck remaining cards ${this.deck}`)
		}

		alert(
			`Game over! 
            ${player1.name} had ${player1.score} books
            ${player2.name} had ${player2.score} books`)

	}

	turn(player1, player2, deck) {
		let turn = true

		do {
			let size = deck.size()
			console.log(`Deck size ${size}`)
			if (player1.hand.length === 0) {
				if (size > 0) { //Size has to be larger than 2, when size is below 2 size becomes undefined and gets stuck in an infinite loop - bug
					deck.draw(player1)
					console.log(`Deck size ${size}`)
				}
				else {
					turn = false
					break
				}
			}
			let fishing = []

			if (player1.name != 'cpu') {
				var request = prompt(`
                ${player1.name}, which card do you want to fish for?
                Your hand: ${player1.hand}
				Completed sets: ${this.sets}`)
			}
			else {
				var request = player1.hand[Math.floor(Math.random() * player1.hand.length)]
				if (request > 10) {
					switch (request) {
						case 11:
							request = 'Jack'
							break;
						case 12:
							request = 'Queen'
							break;
						case 13:
							request = 'King'
							break;
						case 14:
							request = 'Ace'
					}
				}
			}
			if(player1.name === 'cpu'){
				alert(`${player1.name} asked for ${request}`)
			}
			if (this.cards.includes(request) && player1.hand.includes(request)) {
				if (player2.hand.includes(request)) {
					player2.hand.forEach((card) => {
						if (card == request) {
							fishing.push(card)
							console.log(player2.hand)
						}
					})
					if (fishing.length > 0) {
						fishing.forEach((card) => {
							player2.hand.splice(player2.hand.indexOf(card), 1)
						});
						player1.hand = player1.hand.concat(fishing)
					}
					console.log(player2.hand)
					console.log(fishing)

				}
				else {
					alert(`${player1.name} Go Fish!`)
					deck.draw(player1)
					if (player1.hand[player1.hand.length - 1] == request) {
						alert(`${player1.name} caught a fish! ${player1.name} drew a ${request}`)
						console.log(deck)
					}
					else {
						alert(`${player1.name}'s turn is over`)
						console.log(deck)
						turn = false;
					}
				}
			}
			else {
				alert(`Please enter a valid card
                You must have one copy of a card you are trying to fish:
                    ${this.cards}`)
			}
			this.checkForBooks(player1)
		} while (turn)
	}
	checkForBooks(player) {
		console.log('Checking for books')
		let count = {}
		player.hand.forEach(card => {
			count[card] = (count[card] || 0) + 1
		});

		function getKeyByValue(object, value) {
			return (Object.keys(object).find(key => object[key] === value))
		}

		let book = (getKeyByValue(count, 4))
		console.log(`Book checker: ${book}`)

		if (book != undefined) {
			this.sets.push(book)
			alert(`${player.name} has completed the ${book} set`)
			for (let i = player.hand.length - 1; i >= 0; i--) {
				if (player.hand[i] == book) {
					console.log(`removing cards ${player.hand[i]}`)
					player.hand.splice(i, 1)
				}
			}
			this.books++
			player.score++
		}

		console.log(`Books collected ${this.books}`)
	}
}

let game = new goFish
game.startGame()

