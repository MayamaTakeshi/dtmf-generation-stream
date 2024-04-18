# dtmf-generation-stream

## Overview

This is a simple nodejs module that implements a readable stream that generates DTMF tones.

You can specify digits to be generated as a simple string like '1234' or use SSML like this:
```
<speak><prosody rate="50ms">1234</prosody><break time="500ms"/><prosody rate="100ms">1234</prosody></speak>
```

## Installation
```
npm i dtmf-generation-stream
```
## Sample Usage
```
const DtmfGenerationStream = require('dtmf-generation-stream')
const Speaker = require('speaker')

const format = {
	sampleRate: 8000, 
	bitDepth: 16,
	channels: 1
}

const dgs = new DtmfGenerationStream({format})

const s = new Speaker(format)

var digits = '11112222'
console.log(`Enqueueing: ${digits}`)
dgs.enqueue(digits)

var ssml = '<speak><prosody rate="50ms">1234</prosody><break time="500ms"/><prosody rate="100ms">1234</prosody></speak>'
console.log(`Enqueueing: ${ssml}`)
dgs.enqueue(ssml)

dgs.pipe(s)

dgs.on('empty', () => {
  var ssml = '<speak><prosody rate="30ms">abcd</prosody></speak>'
  console.log(`Empty. Enqueueing: ${ssml}`)
  dgs.enqueue(ssml)
})
```

## More Examples

See [here](https://github.com/MayamaTakeshi/dtmf-generation-stream/tree/main/examples).

## Events

The stream emits event 'empty' indicating when there are no more digits in the queue to be played.



