enum RadioMessage {
    message1 = 49434,
    received = 33822,
    request = 39978
}
function addPlayer2 (p2Image: Image) {
    mySprite.sayText("Connected", 1000, false)
    mySprite2 = sprites.create(p2Image, SpriteKind.Player)
    sendLocation()
}
function sendLocation () {
    coordinatesReceived = false
    radio.sendString("" + mySprite.x + "," + mySprite.y)
}
radio.onReceivedString(function (receivedString) {
    coordinates = receivedString.split(",")
    mySprite2.setPosition(parseFloat(coordinates[0]), parseFloat(coordinates[1]))
    coordinatesReceived = true
})
radio.onReceivedMessage(RadioMessage.request, function () {
    radioConnected = true
    player2Serial = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    radio.sendMessage(RadioMessage.received)
    addPlayer2(assets.image`player1`)
    mySprite.setImage(assets.image`player2`)
})
radio.onReceivedMessage(RadioMessage.received, function () {
    radioConnected = true
    player2Serial = radio.receivedPacket(RadioPacketProperty.SerialNumber)
    addPlayer2(assets.image`player2`)
})
let player2Serial = 0
let radioConnected = false
let coordinates: string[] = []
let coordinatesReceived = false
let mySprite2: Sprite = null
let mySprite: Sprite = null
radio.setGroup(1)
radio.setTransmitSerialNumber(true)
mySprite = sprites.create(assets.image`player1`, SpriteKind.Player)
game.onUpdate(function () {
    if (controller.dx() != 0 || controller.dy() != 0) {
        mySprite.x += controller.dx(20)
        mySprite.y += controller.dy(20)
    }
    if (radioConnected) {
        sendLocation()
        pauseUntil(() => coordinatesReceived)
    }
})
game.onUpdateInterval(500, function () {
    if (!(radioConnected)) {
        radio.sendMessage(RadioMessage.request)
    }
})
