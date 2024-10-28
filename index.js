let rows = 3;
let columns = 3;
let type;

let currTile;
let otherTile; // blank tile

let turns = 0;

let imageOrder = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

function playGame(gameType) {
	localStorage.setItem('gameType', gameType);
	window.location.href = `/${gameType}.html`;
}

window.onload = function () {
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < columns; c++) {
			let tile = document.createElement('img');
			tile.id = r.toString() + '-' + c.toString();
			tile.src = `./assets/pattern/${localStorage.getItem('gameType')}/` + imageOrder.shift() + '.jpg';

			// DRAG FUNCTIONALITY
			tile.addEventListener('dragstart', dragStart); // click an image to drag
			tile.addEventListener('dragover', dragOver); // moving image around while clicked
			tile.addEventListener('dragenter', dragEnter); // dragging image onto another one
			tile.addEventListener('dragleave', dragLeave); // dragged image leaving another image
			tile.addEventListener('drop', dragDrop); // drag an image over another image, drop the image
			tile.addEventListener('dragend', dragEnd); // after drag drop, swap the two tiles

			document.getElementById('board').append(tile);
		}
	}
};

function dragStart() {
	currTile = this;
}

function dragOver(e) {
	e.preventDefault();
}

function dragEnter(e) {
	e.preventDefault();
}

function dragLeave() {}

function dragDrop() {
	otherTile = this; // this refers to the img tile being dropped on
}

function dragEnd() {
	if (!otherTile.src.includes('3.jpg')) {
		return;
	}

	let currCoords = currTile.id.split('-'); // ex) "0-0" -> ["0", "0"]
	let r = parseInt(currCoords[0]);
	let c = parseInt(currCoords[1]);

	let otherCoords = otherTile.id.split('-');
	let r2 = parseInt(otherCoords[0]);
	let c2 = parseInt(otherCoords[1]);

	let moveLeft = r == r2 && c2 == c - 1;
	let moveRight = r == r2 && c2 == c + 1;

	let moveUp = c == c2 && r2 == r - 1;
	let moveDown = c == c2 && r2 == r + 1;

	let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

	if (isAdjacent) {
		let currImg = currTile.src;
		let otherImg = otherTile.src;

		currTile.src = otherImg;
		otherTile.src = currImg;

		turns += 1;
		document.getElementById('turns').innerText = turns;
	}

	// Check if puzzle is completed
	let isCompleted = true;
	let tiles = document.querySelectorAll('#board img');
	for (let i = 0; i < tiles.length; i++) {
		let tileNumber = tiles[i].src.match(/(\d+)\.jpg$/)[1];
		if (tileNumber != i + 1) {
			isCompleted = false;
			break;
		}
	}

	// Show SweetAlert if puzzle is completed
	if (isCompleted) {
		setTimeout(() => {
			Swal.fire({
				title: 'GG 🤯!',
				text: `Puzzle Bertema ${localStorage.getItem('gameType')} telah Anda telah selesaikan! Saatnya pergi ke tantangan puzzle lainnya!`,
				icon: 'success',
				confirmButtonText: 'Gass!',
			}).then((result) => {
				if (result.isConfirmed) {
					window.location.href = 'index.html';
				}
			});
		}, 300); // 300ms delay
	}
}
