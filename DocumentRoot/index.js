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
    
    let autoincrement = { }

    for (let i = 0; i < response.info['quantity']; i++) {

        let newElement = { }

        // Guardarà el nom actual (permet sincronitzar noms i correus)
        let currentName = { }
        currentName = receivedName({name: true, firstSurname: true, lastSurname: true})

        for (const element in response.data) {
            const type = response.data[element].type
            let extra = response.data[element]

            switch(type) {
                case 'Name':
                    currentName = receivedName(extra)
                    newElement[element] = currentName.completeName
                    break
                case 'Number':
                    newElement[element] = receivedNumber(extra, element, autoincrement)
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
                    let found = false
                    for (const custom in response.custom) {
                        console.log(response.custom)
                        if (element == custom) {
                            found = true
                            newElement[element] = receivedCustom(element, response.custom)
                            //console.log(extra)
                        }
                    }
                    if (!found) newElement[element] = receivedError()
                    break
            }
        }

        console.log(newElement)
        myData.data.push(newElement)
    }

    return myData
}

function receivedName(extra) { 
    let dataToReturn = { 
        name: randomName('name'),
        firstSurname: randomName('surname'),
        lastSurname: randomName('surname'),
        completeName: ""
    }
    
    console.log(extra)

    if (extra.name) {
        dataToReturn.completeName += dataToReturn.name + " "
    }

    if (extra.firstSurname) {
        dataToReturn.completeName += dataToReturn.firstSurname + " "
    }

    if (extra.lastSurname) {
        dataToReturn.completeName += dataToReturn.lastSurname + " "
    }

    dataToReturn.completeName = dataToReturn.completeName.slice(0, -1)

    return dataToReturn
}
function receivedNumber(extra, element, autoincrement) {
    // El valor mínim serà, si se n'ha donat un, aquest. 
    // Si no, revisarem: és autoincrement? Llavors 1. Del contrari, 0
    let min = extra.min 
        ? parseInt(extra.min) 
        : extra.autoincrement 
            ? 1
            : 0
    
    // El valor màxim serà, si se n'ha donat un, aquest.
    // Si no, serà 100
    let max = extra.max ? parseInt(extra.max) : 100
    
    if (extra.autoincrement) {
        if (autoincrement[element]) {
            return autoincrement[`${element}`]++
        }
        else {
            autoincrement[`${element}`] = min + 1
            return min
        }
    }

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
    return `${currentName.name.toLowerCase().replace(/\s/g, "")}@gmail.com`
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

function receivedCustom(name, customValues) {
    let randomInt = randomNumber(0, customValues[`${name}`].length - 1)
    return customValues[`${name}`][randomInt]
}

function randomName(type) {
    let data 
    if (type == 'name') data = fs.readFileSync('./data/first-name.json')
    else data = fs.readFileSync('./data/last-name.json')
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

function randomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    return alphabet[Math.floor(Math.random() * alphabet.length)]
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min +1)) + min
}


app.listen(81)