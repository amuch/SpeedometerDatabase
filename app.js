const express = require('express')
const app = express()
const morgan = require('morgan')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const dateTime = require('node-datetime')
const port = 8000

app.use(bodyParser.json())
app.use(morgan('short'))

// Add correct parameters for local database.
function getConnection() {
    return mysql.createConnection({
        host: ,
        user: ,
        password: ,
        database: 
    })
}

app.post('/add_speed', (request, response) => {
    const connection = getConnection()
    var sentDateTime

    if(!request.body.sent){
        const currentDateTime = dateTime.create()
        sentDateTime = currentDateTime.format('Y-m-d H:M:S')
    }
    else {
        sentDateTime = request.body.sent
    }

    const speed = request.body.speed
    console.log(sentDateTime)
    const queryString = "INSERT INTO Speed (speed, sent, received) VALUES (?, ?, now())"
    connection.query(queryString, [speed, sentDateTime], (error, results, fields) => {
        if(error) {
            console.log("Failed to add speed: " + error)
            response.sendStatus(500)
            return
        }
        console.log("Inserted " + speed + " into database.")
        response.end()
    })
    response.send(sentDateTime)
})

app.get('/speeds', (request, response) => {
    const connection = getConnection()
    const queryString = "SELECT * FROM Speed"
    connection.query(queryString, (error, rows, fields) => {
        if(error) {
            console.log("failed to fetch speeds: " + error)
            response.sendStatus(500)
            return
        }
        const speeds = rows.map((row) => {
            return {"speed": row.speed, "sent": row.sent, "received": row.received}
        })
        response.json(speeds)
    })
})


app.get("/", (request, response) => {
    console.log("Root route")
    response.send("Root route...")
})

app.listen(port, () => {
    console.log("Server is running on port: " + port)
})
