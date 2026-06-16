const express = require('express')
const app = express()
const users = require('./MOCK_DATA.json')
const fs = require('fs')

app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.get('/api/users', (req, res)=>{
    return res.json(users)
})

app.post('/api/users', (req, res)=>{
    const body = req.body;
    const newUser = {
        ...body,
        id : users.length + 1
    }
    users.push(newUser)

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err)=>{
        if(err){
            return res.status(500).json({
                status : 'error',
            })
        }
        return res.json({
            status : 'success',
            newUser
        })
    })
})
app.route('/api/users/:id')
.get((req, res)=>{
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id)
    if(!user){
        return res.status(404).json({
            status : 'errror',
            message : 'user not found'
        })
    }
    return res.json(user);
})
.put((req, res)=>{
     const id = Number(req.params.id)
     const userIndex = users.findIndex((user)=> user.id === id)
     if(userIndex === -1){
        return res.status(404).json({
            status : 'error',
            message : 'not found'
        })
     }
     users[userIndex] = {
        ...users[userIndex],
        ...req.body
     }

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err)=>{
        if(err){
            return res.status(500).json({
                status : 'error',
                message : 'failed to update the user'
            })
        }
        return res.json({
            status : true,
            user : users[userIndex]
        })
    })
})
.delete((req, res)=>{
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user)=> user.id === id)
    if(userIndex === -1){
        return res.status(404).json({
            status : 'error',
            message : 'not found'
        })
    }
    const deletedUser = users[userIndex]
    users.splice(userIndex, 1)
    
     fs.writeFile('./MOCK_DATA.json', JSON.stringify(users, null, 2), (err)=>{
        if(err){
            return res.status(500).json({
                status : 'error',
                message : 'failed to delete the user'
            })
        }
        return res.json({
            status : true,
            deletedUser
        })
    })
    
})
const port = 8000
app.listen(port, () => {
    console.log(`Server is listening on the port ${port}...`);
});