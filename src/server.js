import express from 'express';
import userdb from '../db/users-db.js';
import productdb from '../db/products-db.js'
import cartdb from '../db/cart-db.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
function authToken(req, res, next){
  const authHeader = req.get('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if(token == null){
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.token, (err, user) => {
    if(err){
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  })
}
////////// USERS /////////////
app.get('/api/users', async (req, res) => {
  const users = await userdb.getAllUsers();
  res.status(200).json(users);
});

app.get('/api/users/:id', async (req, res) => {
  const user = await userdb.getUserById(req.params.id);
  res.status(200).json({
    status: 200,
    data: {
      username: user.username,
      age: user.age,
      gender: user.gender,
    }
  });
});

app.put('/api/users/:id', async (req, res) => {
  const {username, password, age, gender} = req.body;
  const user = await userdb.getUserById(req.params.id);
  if(user.password == password.currentPassword){
    if(password.newPassword){
      const updatedUserWithPassword = {
        username: username,
        age: age,
        gender: gender,
        password: password.newPassword,
      }
      await userdb.updateUser(req.params.id, updatedUserWithPassword);
      res.status(201).json({
        status: 201,
        id: user.id,
      });
    }
    else {
      const updatedUserWOpassword = {
        username: username,
        age: age,
        gender: gender,
        password: password.currentPassword
      };
      await userdb.updateUser(req.params.id, updatedUserWOpassword);
      res.status(201).json({
        status: 201,
        id: user.id,
      });
    }
  } else {
    res.status(403).json({
      status: 403,
      message: 'wrong password'
    })
  }
});

app.delete('/api/users/:id', authToken, async (req, res) => {
  await userdb.deleteUser(req.params.id);
  res.status(201).json({success: true});
});

/////////// SIGN IN ///////////
app.post('/api/users/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = await userdb.getUserByUsername(username);
  if(!user){
    res.status(401).send('user not found');
  } else if(user.password == password){
    let token = jwt.sign(
    {
      userId: user.id,
      username: user.username
    },
    process.env.token,
    {expiresIn: '1h'}
    );
    res.status(200).json({
      status: 200,
      data: {
        username: user.username,
        age: user.age,
        gender: user.gender,
        token: token
      }
    });
  } else if(user.password !== password){
    res.status(403).json({
      status: 403,
      message: 'wrong password'
    })
  }
});
////////////// REGISTER ///////////////
app.post('/api/users/register', async (req, res) => {
  const { username, password, age, gender } = req.body;
  const userExist = await userdb.getUserByUsername(username);
  if(userExist){
    res.status(403).send('User already exists');
  }else {
    const newUser = {
      username: username,
      password: password.newPassword,
      age: age,
      gender: gender,
    };
    await userdb.createUser(newUser);
    let addedUser = await userdb.getUserByUsername(newUser.username);
    let token = jwt.sign(
      {
        userId: addedUser.id,
        username: addedUser.username
      },
      process.env.token,
      {expiresIn: '1h'}
    );
    res.status(201).json({
      "status": 201,
      data: {
        username: addedUser.username,
        age: addedUser.age,
        gender: addedUser.gender,
        token: token
      }
    });
  }

});
/////////// PRODUCTS //////////
app.get('/api/products', async (req, res) => {
  res.set('Access-Control-Allow-Origin', 'http://localhost:8000/api/products');
  const price = req.query.price;
  if(price){
    const products = await productdb.getProductByPrice(price);
    res.status(200).json(products)
  } else{
    const products = await productdb.getAllProducts();
    res.status(200).json(products);
  }
});

app.get('/api/products/:id', async (req, res) => {
  const product = await productdb.getProductById(req.params.id)
  res.status(200).json(product)
});

///////////// CART ///////////////
app.get('/api/cart/:id', async (req, res) => {
  const userCart = await cartdb.getCart(req.params.id);
  if(userCart.length !== 0){
    res.status(200).json(userCart);
  } else {
    res.status(404).send({message: 'Not Found!'})
  }
});

app.post('/api/cart', async (req, res) => {
  const cart = await cartdb.addToCart(req.body);
  res.status(201).json({id: cart[0]})
});

app.put('/api/cart/:id', async (req, res) => {
  const cart = await cartdb.updateCart(req.params.id, req.body);
  res.status(201).json(cart);
});

app.delete('/api/cart/:id', async (req, res) => {
  const cart = await cartdb.deleteCart(req.params.id);
  res.status(202).send({message: 'Deleted'});
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