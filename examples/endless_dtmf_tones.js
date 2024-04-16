const DtmfGenerationStream = require('../index.js')
const Speaker = require('speaker')

const format = {
	sampleRate: 8000, 
	bitDepth: 16,
	channels: 1
}

const dgs = new DtmfGenerationStream({format})

const s = new Speaker(format)

var digits = '0123456789abcd*#'
console.log(`Enqueueing ${digits}`)
dgs.enqueue(digits)

dgs.on('empty', () => {
	console.log("Got event 'empty'. Reversing digits.")
  digits = digits.split("").reverse().join("")
  console.log(`Enqueueing ${digits}`)
	dgs.enqueue(digits)
})

dgs.pipe(s)
