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
    let myData = { 
        data: [  ]
    }

    for (let i = 0; i < response.info['quantity']; i++) {
        
        let newElement = {  }

        for (const element in response.data) {
            const type = response.data[element]
            const quantity = response.data['quantity']

            switch(type) {
                case 'Name': 
                    newElement[element] = receivedName(element, type, quantity)
                    break
                case 'Street':
                    newElement[element] = receivedStreet(element, type, quantity)
                    break
            }

        }
        myData.data.push(newElement)

       
    }
            
    return myData
}

function receivedName(element, type, quantity) {

    let currentData = dummyjson.parse(`{
        "${element}": "{{firstName}} {{lastName}}"
    }`)

    return JSON.parse(currentData)[element]
}

function receivedStreet(element, type, quantity) {

    let currentData = dummyjson.parse(`{
        "${element}": "{{street}}"
    }`)

    return JSON.parse(currentData)[element]

}

app.listen(81)

