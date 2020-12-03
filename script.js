const net = new brain.NeuralNetwork()
// adding more hidden layers makes the output better
// const net = new brain.NeuralNetwork({
//     hiddenLayers:[4, 5,6]
// })


const data = [{
    "input": {
        "r": 0,
        "g": 0,
        "b": 0
    },
    "output": [1]
}, {
    "input": {
        "r": 1,
        "g": 1,
        "b": 1
    },
    "output": [0]
}, {
    "input": {
        "r": 0.572953898038113,
        "g": 0.17984830956413367,
        "b": 0.9205524134715568
    },
    "output": [1]
}, {
    "input": {
        "r": 0.5867333801426258,
        "g": 0.40788591930767937,
        "b": 0.5605131914538457
    },
    "output": [1]
}, {
    "input": {
        "r": 0.08952283206685152,
        "g": 0.10733121769862053,
        "b": 0.8658706919401136
    },
    "output": [1]
}, {
    "input": {
        "r": 0.7723219410495117,
        "g": 0.6321997315545567,
        "b": 0.6066527362792624
    },
    "output": [1]
},{
    "input": {
        "r": 0.28882545725910314,
        "g": 0.5275180797439396,
        "b": 0.5488851379936934
    },
    "output": [1]
}]



//x or operations
net.train(data)

// const diagram = document.getElementById('diagram')
// diagram.innerHTML = brain.utilities.toSVG(net)

//test if it works with an input
//console.log(net.run({r:1, g:1,b:0}))

const colorE1 = document.getElementById('color')
const guessE1 = document.getElementById('guess')
const whiteButton = document.getElementById('white-button')
const blackButton = document.getElementById('black-button')
const printButton = document.getElementById('print-button')
let color
setRandomColor()

whiteButton.addEventListener('click', () => {
    chooseColor(1)
})

blackButton.addEventListener('click', () => {
    chooseColor(0)
})

printButton.addEventListener('click', print)

function chooseColor(value) {
    data.push({
        input: color,
        output: [value]
    })
    setRandomColor()

}

function print() {
    console.log(JSON.stringify(data))
}

function setRandomColor() {
    color = {
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
    }
    const guess = net.run(color)[0]

    guessE1.style.color = guess > .5 ? '#FFF' : '#000'

    colorE1.style.backgroundColor =
        `rgba(${color.r*255},${color.g*255},${color.b*255})`
}