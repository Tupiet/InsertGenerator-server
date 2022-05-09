const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.urlencoded({extended: true}));
app.use(express.json()) // To parse the incoming requests with JSON payloads

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.post('/', (req, res) => {

    const body = req.body
    console.log(body)

    let result = manageData(body)
    res.send(result)
})

function manageData(response) {
    let myData = {
        data: [  ]
    }

    for (let i = 0; i < response.info['quantity']; i++) {

        let newElement = { }

        // Guardarà el nom actual (permet sincronitzar noms i correus)
        let currentName

        for (const element in response.data) {
            const type = response.data[element].type
            let extra = response.data[element]

            switch(type) {
                case 'Name':
                    currentName = receivedName()
                    newElement[element] = currentName
                    break
                case 'Number':
                    newElement[element] = receivedNumber(extra)
                    break
                case 'Street':
                    newElement[element] = receivedStreet()
                    break
                case 'Email':
                    newElement[element] = receivedEmail(currentName)
                    break
                case 'Phone (house)':
                    newElement[element] = receivedPhoneHouse()
                    break
                case 'Phone (mobile)':
                    newElement[element] = receivedPhoneMobile()
                    break
                case 'DNI':
                    newElement[element] = receivedDNI()
                    break
                case 'Date':
                    newElement[element] = receivedDate(extra)
                    break
                default:
                    newElement[element] = receivedError()
                    break
            }
        }

        console.log(newElement)
        myData.data.push(newElement)
    }

    return myData
}

function receivedName() { 
    let data = fs.readFileSync('./data/first-name.json')
    
    try {
        const names = JSON.parse(data)
        random = Math.floor(Math.random() * names.length)
        let actualName = names[random]
        let words = actualName.split(" ")

        for(let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase()
        }

        return words.join(" ")
        
    } catch (err) {
        console.log("Something went wrong...")
    }
}
function receivedNumber(extra) { 
    let min = extra.min ? parseInt(extra.min) : 0
    let max = extra.max ? parseInt(extra.max) : 100

    return randomNumber(min, max)
}

function receivedStreet() { 
    let data = fs.readFileSync('./data/street.json')
    
    try {
        const streets = JSON.parse(data)
        random = Math.floor(Math.random() * streets.length)
        return streets[random]
    } catch (err) {
        console.log("Something went wrong...")
    }
 }

function receivedEmail(currentName) { 
    return `${currentName.toLowerCase().replace(/\s/g, "")}@gmail.com`
 }

function receivedPhoneHouse() { 
    let phone = "9"
    for (let i = 0; i < 8; i++) {
        phone += randomNumber(0, 9)
    }
    return parseInt(phone)
 }

function receivedPhoneMobile() { 
    let phone = "6"
    for (let i = 0; i < 8; i++) {
        phone += randomNumber(0, 9)
    }
    return parseInt(phone)
 }
function receivedDate(extra) { 
    let min = extra.min ? new Date(extra.min) : new Date('1991-01-01')
    let max = extra.max ? new Date(extra.max) : new Date()

    let format = extra.format ? extra.format : 'YYYY-MM-DD'

    console.log(new Date(+min + Math.random() * (max - min)))

    return new Date(+min + Math.random() * (max - min)).toISOString().slice(0, 10)
}
function receivedError() { return "Something went wrong!" }

function receivedDNI() {
    let dni = ""
    for (let i = 0; i < 8; i++) {
        dni += Math.floor(Math.random() * 10)
    }
    dni += randomLetter().toUpperCase()
    return dni
}


function randomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    return alphabet[Math.floor(Math.random() * alphabet.length)]
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min +1)) + min
}


app.listen(81)