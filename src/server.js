import express from 'express';
import db from '../db/users-db.js';
import bodyParser from 'body-parser';
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/users', async (req, res) => {
  const users = await db.getAllUsers();
  res.status(200).json({users});
});
app.post('/users', async (req, res) => {
  const result = await db.createUser(req.body);
  res.status(201).json({id: result[0]});
});
app.put('/users/:id', async (req, res) => {
  const id = await db.updateUser(req.params.id, req.body);
  res.status(200).json({id});
});
app.delete('/users/:id', async (req, res) => {
  await db.deleteUser(req.params.id);
  
  res.status(201).json({succes: true});
});
// app.get('/users', (req, res) => {
//   const {search} = req.query;
//   const matches = users.filter(user => user.username.includes(search));
//   if(matches){
//     res.json(matches);
//   }else{
//     res.json(users);
//   }
// });

// app.get('/users/:userId', (req, res) => {
//   let {userId} = req.params;
//   let user = users.find(user => user.id == userId);
  
//   if(user){
//     res.json(user);
//   } else {
//     res.sendStatus(404);
//   }
// });

// app.post('/users', (req, res) => {
//   let {username, password} = req.body;
//   let newUser = {
//     id: uuid(),
//     username,
//     password,
//   };
//   users.push(newUser);
//   res.status(201).json(users);
// });

// app.delete('/users/:userId', (req, res) => {
//   let {userId} = req.params;
//   let userIndex = users.findIndex(user => user.id === userId);
//   if(userIndex > -1){
//     users.splice(userIndex, 1);
//   }
//   res.json(users);
// });

// app.put('/users/:userId', (req, res) => {
//   let {userId} = req.params;
//   let {username, age} = req.body;

//   let user = users.find(user => user.id === userId);

//   if(user){
//     user.username = username;
//     user.age = age;
//     res.json(users);
//   } else {
//     res.sendStatus(404);
//   }
// });
app.listen(8000, () => console.log('server is runnig 8000'))