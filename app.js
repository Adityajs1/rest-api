const express = require('express')
const app = express();
const data = require('./MOCK_DATA.json')
const fs = require('fs')
app.use(express.json())
app.use(express.urlencoded({extended : false}))

// get all the users
app.get('/api/users', (req, res)=>{
    return res.json(users);
})

//post request
app.post('/api/users', (req, res)=>{
    const body = req.body;
    const newUser = {
       ...body,
       id : users.length + 1
    }
    return res.json(newUser);

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
// getting the informations of a specific user
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
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id)
    if(userIndex == -1){
        return res.status(404).json({
            status : 'error',
            message : 'user does not even exist'
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
                messsage : 'unable to update the users'
            })
        }
        return res.json({
            status : 'success',
            user : users[userIndex]
        })
    })
})
.delete((req, res)=>{
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user)=> user.id === id);
    if(userIndex === -1){
        return res.status(404).json({
            status : 'error',
            message : 'not found'
        })
    }
    const deletedUser = users[userIndex]
    users.splice(deletedUser, 1);

    fs.writeFile('./MOCK_DATA.json', (users, null, 2), (err)=>{
        if(err){
            return res.staus(500).json({
                status : 'error',
                message : 'cannot delete the user'
            })
        }
        return res.json({
            status : 'success',
            message : 'user deleted successfully',
            deletedUser
        })
    })
})
const port = 3000
app.listen(port, ()=>{
    console.log(`Server is listening on the port ${port}...`)
})