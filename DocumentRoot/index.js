const express = require('express')
const dummyjson = require('dummy-json')

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

        let newElement = "{"

        for (const element in response.data) {
            const type = response.data[element].type
            let extra = response.data[element]

            switch(type) {
                case 'Name':
                    newElement += receivedName(element)
                    break
                case 'Number':
                    newElement += receivedNumber(element, extra)
                    break
                case 'Street':
                    newElement += receivedStreet(element)
                    break
                case 'Email':
                    newElement += receivedEmail(element)
                    break
                case 'Phone (house)':
                    newElement += receivedPhoneHouse(element)
                    break
                case 'Phone (mobile)':
                    newElement += receivedPhoneMobile(element)
                    break
                case 'DNI':
                    newElement += receivedDNI(element)
                    break
                case 'Date':
                    newElement += receivedDate(element, extra)
                    break
                default:
                    newElement += receivedError()
                    break
            }

        }

        newElement = newElement.slice(0, -2)

        newElement += `}`

        let elementDummy = dummyjson.parse(newElement)

        console.log(elementDummy)
        myData.data.push(JSON.parse(elementDummy))


    }

    return myData
}

function receivedName(element) { return `"${element}": "{{firstName}} {{lastName}}", ` }
function receivedNumber(element, extra) { 
    let min = extra.min ? extra.min : 0
    let max = extra.max ? extra.max : 100
    console.log(min, max)
    return `"${element}": "{{int ${min} ${max}}}", ` 
}
function receivedStreet(element) { return `"${element}": "{{street}}", ` }
function receivedEmail(element) { return `"${element}": "{{email}}", ` }
function receivedPhoneHouse(element) { return `"${element}": "{{phone \"9xxxxxxxx\"}}", ` }
function receivedPhoneMobile(element) { return `"${element}": "{{phone \"6xxxxxxxx\"}}", ` }
function receivedDate(element, extra) { 
    let min = extra.min ? extra.min : '1991-01-01'
    let max = extra.max ? extra.max : new Date().toISOString().slice(0, 10)
    let format = extra.format ? extra.format : 'YYYY-MM-DD'
    console.log(min, max)
    return `"${element}": "{{date '${min}' '${max}' '${format}'}}", ` 
}
function receivedError() { return `"error": "Something went wrong!", ` }

function receivedDNI(element) {
    let dni = ""
    for (let i = 0; i < 8; i++) {
        dni += Math.floor(Math.random() * 10)
    }
    dni += randomLetter().toUpperCase()
    return `"${element}": "${dni}", `
}


function randomLetter() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    return alphabet[Math.floor(Math.random() * alphabet.length)]
}


app.listen(81)