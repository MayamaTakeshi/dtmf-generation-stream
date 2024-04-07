const { DtmfGenerationStream }  = require('../index.js')
const Speaker = require('speaker')

const format = {
	sampleRate: 8000, 
	bitDepth: 16,
	channels: 1
}

const dgs = new DtmfGenerationStream(format)

const s = new Speaker(format)

var ssml = '<speak><prosody rate="50ms">1234</prosody><break time="500ms"/><prosody rate="100ms">1234</prosody></speak>'
console.log(`Enqueueing: ${ssml}`)
dgs.enqueue(ssml)

dgs.pipe(s)

dgs.on('empty', () => {
  var ssml = '<speak><prosody rate="30ms">abcd</prosody></speak>'
  console.log(`Empty. Enqueueing: ${ssml}`)
  dgs.enqueue(ssml)
})
