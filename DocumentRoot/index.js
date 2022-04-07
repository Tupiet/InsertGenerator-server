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

    let result = manageData(body)
    res.send(result)
})

function manageData(response) {
    let myData = {  }

    for (const element in response.data) {
        const type = response.data[element]

        switch(type) {
            case 'Name': 
                myData[element] = receivedName(element, type, response.info['quantity'])
                break
            case 'Street':
                myData[element] = receivedStreet(element, type, response.info['quantity'])
                break
        }
    }
    
    return myData
}

function receivedName(element, type, quantity) {

    let currentData = dummyjson.parse(`{
        "data": [
            {{#repeat ${quantity}}}
            {
                "name": "{{firstName}} {{lastName}}"
            }
            {{/repeat}}
        ]
    }`)

    return JSON.parse(currentData)
}

function receivedStreet(element, type, quantity) {

    let currentData = dummyjson.parse(`{
        "data": [
            {{#repeat ${quantity}}}
            {
                "street": "{{street}}"
            }
            {{/repeat}}
        ]
    }`)

    return JSON.parse(currentData)

}

app.listen(81)

