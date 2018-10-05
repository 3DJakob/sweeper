let gameBoard = []
const sizeX = 10
const sizeY = 10

function initSweep () {
  initGameBoard()
  renderGameBoard()
}

function initGameBoard () {
  for (let i = 0; i < sizeX * sizeY; i++) {
    const newEntry = { 'bomb': randomBool(), 'number': 0, clicked: false }
    gameBoard[i] = newEntry
  }

  for (let i = 0; i < gameBoard.length; i++) {
    let sum = 0
    if (!isTop(i)) {
      if (getRowIndex(i - sizeX - 1) === getRowIndex(i - sizeX)) {
        if (gameBoard[i - sizeX - 1].bomb) { sum++ }
      }
      if (gameBoard[i - sizeX].bomb) { sum++ }
      if (getRowIndex(i - sizeX + 1) === getRowIndex(i - sizeX)) {
        if (gameBoard[i - sizeX + 1].bomb) { sum++ }
      }
    }
    // console.log(sum)
    gameBoard[i].number = sum
  }
  console.log(gameBoard)
}

function isLeft (i) {
  return i % sizeX === 0
}

function isRight (i) {
  return i % sizeX === 9
}

function isTop (i) {
  return i <= sizeX
}

function isBottom (i) {
  return i > sizeX * sizeY - sizeX
}

function getRowIndex (i) {
  let res = 0
  while (i - sizeX > 0) {
    i = i - sizeX
    res++
  }
  return res
}

function randomBool () {
  return Boolean(Math.round(Math.random()));
}

function renderGameBoard () {
  const target = document.getElementById('sweeperElement')

  for (let i = 0; i < sizeY; i++) {
    target.appendChild(renderRow(i))
  }
}

function renderRow (rowNumber) {
  const row = document.createElement('div')
  for (let i = 0; i < sizeX; i++) {
    const obj = gameBoard[i + rowNumber * 10]
    const square = document.createElement('div')
    square.textContent = obj.number
    if (obj.bomb) {
      square.classList.add('bomb')
      // square.textContent = 'B'
    }
    row.appendChild(square)
  }
  return row
}

window['initSweep'] = initSweep
