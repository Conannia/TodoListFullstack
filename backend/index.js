const express =  require('express')
const bodyParser = require('body-parser')
const cors = require('cors') //untuk access FE

const app = express()

app.use(express())
app.use(bodyParser.json());
app.use(cors({origin:"http://localhost:3000", credentials: true}))

const Todo = require("./api/todo.controller")
app.use('/api/todo', Todo)

app.listen(8080,(() => console.log("ini test 8080 nya")))