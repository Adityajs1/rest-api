const express = require('express')
const users = require('./MOCK_DATA.json')
const fs = require('fs')
const app = express();

app.use(express.urlencoded({extended : false}))
app.get('/api/users', (req, res)=>{
      return res.json(users);
})

app.post('/api/users', (req, res)=>{
    const body = req.body;
    users.push({...body, id : body.length + 1})
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err, data)=>{
       return res.json({status : "success", id : users.length + 1})
    })
})

app.route('/api/users/:id').get((req, res)=>{
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
})
.put((req, res)=>{
    return res.json({status : "pending"})
})
.delete((req, res)=>{
    return res.json({status :"pending"})
})


const port = 8000
app.listen(port, ()=> console.log(`Server is listening on the port ${port}...`))