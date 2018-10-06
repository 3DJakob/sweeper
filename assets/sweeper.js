let gameBoard = []
let gameFrozen = false
let sizeX = 10
let sizeY = 10

window.addEventListener('resize', function () {
  resizeGameBoard()
}, true)

function initSweep () {
  gameFrozen = false
  gameBoard = []
  clearGameBoard()
  initGameBoard()
  renderGameBoard()
}

function clearGameBoard () {
  const target = document.getElementById('sweeperElement')
  target.innerHTML = ''
}

function initGameBoard () {
  sizeX = parseInt(document.getElementById('inputX').value) ? parseInt(document.getElementById('inputX').value) : sizeX
  sizeY = parseInt(document.getElementById('inputY').value) ? parseInt(document.getElementById('inputY').value) : sizeY
  for (let i = 0; i < sizeX * sizeY; i++) {
    const newEntry = { 'bomb': randomBool(), 'number': 0, clicked: false }
    gameBoard[i] = newEntry
  }

  for (let i = 0; i < gameBoard.length; i++) {
    let sum = bombCount(i, 'top') + sideBombCount(i) + bombCount(i, 'bottom')
    gameBoard[i].number = sum
  }
}

function isLeft (i) {
  return i % sizeX === 0
}

function isRight (i) {
  return i % sizeX === sizeX - 1
}

function isTop (i) {
  return i < sizeX
}

function isBottom (i) {
  return i + 1 > sizeX * sizeY - sizeX
}

function bombCount (i, side) {
  let topOrBottom = false
  let steps = 0
  if (side === 'top') {
    topOrBottom = isTop(i)
    steps = -sizeX
  } else if (side === 'bottom') {
    topOrBottom = isBottom(i)
    steps = sizeX
  }
  let sum = 0
  if (!topOrBottom) {
    if (getRowIndex(i + steps - 1) === getRowIndex(i + steps)) {
      if (gameBoard[i + steps - 1].bomb) { sum++ }
    }
    if (gameBoard[i + steps].bomb) { sum++ }
    if (getRowIndex(i + steps + 1) === getRowIndex(i + steps)) {
      if (gameBoard[i + steps + 1].bomb) { sum++ }
    }
  }
  return sum
}

function sideBombCount (i) {
  let sum = 0
  if (!isLeft(i) && gameBoard[i - 1].bomb) {
    sum++
  }
  if (!isRight(i) && gameBoard[i + 1].bomb) {
    sum++
  }
  return sum
}

function getRowIndex (i) {
  let res = 0
  if (i < 0) {
    return -1
  }
  i++
  while (i - sizeX > 0) {
    i = i - sizeX
    res++
  }
  return res
}

function randomBool () {
  return Boolean(Math.round(Math.random() - 0.3))
}

function renderGameBoard () {
  const target = document.getElementById('sweeperElement')
  resizeGameBoard()
  for (let i = 0; i < sizeY; i++) {
    target.appendChild(renderRow(i))
  }
}

function resizeGameBoard () {
  const target = document.getElementById('sweeperElement')
  const ratio = sizeX / sizeY
  let w = window.innerWidth
  let h = window.innerHeight
  let resultW = 0
  let resultH = 0
  const minW = sizeX * 20
  const minH = sizeY * 20
  if (w > h) {
    const temp = h
    h = w
    w = temp
  }
  if (ratio > 1) {
    resultW = w * 0.95 - 98 * ratio
    resultH = w / ratio * 0.95 - 98
  } else {
    resultW = w * ratio * 0.95 - 98 * ratio
    resultH = w * 0.95 - 98
  }
  if (resultW < minW || resultH < minH) {
    resultW = minW
    resultH = minH
  }
  target.style.width = String(resultW)
  target.style.height = String(resultH)
}

function renderRow (rowNumber) {
  const row = document.createElement('div')
  for (let i = 0; i < sizeX; i++) {
    const obj = gameBoard[i + rowNumber * sizeX]
    const square = document.createElement('div')
    square.addEventListener('click', function () {
      click(obj, square, true)
    })
    square.addEventListener('contextmenu', function (evt) {
      evt.preventDefault()
      click(obj, square, false)
    })
    row.appendChild(square)
  }
  return row
}

function click (obj, element, leftClick) {
  const lost = function () {
    window.alert('You lost!')
  }
  if (!gameFrozen) {
    if (leftClick) {
      if (obj.bomb) {
        showGameBoard()
        setTimeout(lost, 100)
        gameFrozen = true
      } else {
        element.textContent = obj.number
        obj.clicked = true
      }
    } else {
      element.innerHTML = '<i class="fa fa-flag-o" aria-hidden="true"></i>'
    }
    if (checkVictory()) {
      window.alert('You win!')
      gameFrozen = true
    }
  }
}

function showGameBoard () {
  for (let i = 0; i < gameBoard.length; i++) {
    const obj = gameBoard[i]
    const selector = '#sweeperElement div:nth-child(' + (getRowIndex(i) + 1) + ') div:nth-child(' + (i % sizeX + 1) + ')'
    const target = document.querySelector(selector)
    if (obj.bomb) {
      target.classList.add('bomb')
      target.innerHTML = '<i class="fa fa-bomb" aria-hidden="true"></i>'
    } else {
      target.textContent = obj.number
    }
  }
}

function checkVictory () {
  let winning = true
  gameBoard.forEach(function (square) {
    if (!(square.bomb || square.clicked)) {
      winning = false
    }
  })
  return winning
}

window['initSweep'] = initSweep
