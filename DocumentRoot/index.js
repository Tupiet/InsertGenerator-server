const express = require('express')
const dummyjson = require('dummy-json')

const app = express()

const template = `{
    "name": [
        {{#repeat 3}}
        "{{firstName}} {{secondName}}"
        {{/repeat}}
    ]
  }`;  

app.get('/', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Content-Type', 'application/json')
    res.send(dummyjson.parse(`{
        "name": [
            {{#repeat ${req.query['quantity']}}}
            "{{firstName}} {{secondName}}"
            {{/repeat}}
        ]
      }`))
    console.log(req.query)
})

app.listen(80)