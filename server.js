const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const path = require('path');

const environment = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[environment];
const database = require('knex')(config);

app.use('/', express.static(`${__dirname}/client/build`));
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


io.on('connection', socket => {
  io.sockets.emit('welcome', 'hi ⛑️');

  socket.on('connect', () => {
    console.log('client connected');
  });

  socket.on('message', message => {
    io.sockets.emit('message', message);
    const msg = {
      message: message.msg,
      user_id: message.user.id
    };
    database('messages').insert(msg)
      .then(() => {
      })
      .catch(err => {
        console.log(`Error adding message: ${err}`);
      });
  });

  socket.on('newuser', usr => {
    const msg = {
      user: { sn: '🤖CHATBOT🤖'},
      msg: `A new user has connected 👋🏻, hi ${usr.sn}!`
    };
    io.sockets.emit('message', msg);
  });

  socket.on('signout', usr => {
    const msg = {
      user: { sn: '🤖CHATBOT🤖'},
      msg: `A user has disconnected 👋🏻, bye ${usr.sn}!`
    };
    io.sockets.emit('message', msg);
  });
});

app.get('/test', (req, res) => {
  return res.status(203).json({status: 'hello'});
});

app.post('/api/users', async (req, res) => {
  const {un, pw, confirmpw, sn} = req.body;
  if (pw !== confirmpw) {
    return res.status(422).json({error: 'Passwords do not match.'});
  }

  const paramTranslations = {
    un: 'Username',
    pw: 'Password',
    sn: 'Screenname'
  };

  const reqParams = ['un', 'pw', 'sn'];
  for (const reqParam in reqParams) {
    const param = reqParams[reqParam];
    if (!req.body[param]) {
      console.log(param);
      return res.status(422).json({error: `Please enter a valid ${paramTranslations[param]}.`});
    }
  }

  const snAvailable = !!!await getUser(sn, 'sn');
  const unAvailable = !!!await getUser(un, 'un');

  if (!snAvailable) {
    return res.status(422).json({error: `Screenname ${sn} is not available`});
  }

  if (!unAvailable) {
    return res.status(422).json({error: `Username ${un} is not available`});
  }

  const userInfo = {
    un, pw, sn
  };

  return database('users').insert(userInfo, 'id')
    .then(user => {
      return res.status(201).json({status: 'success', userId: user[0]});
    })
    .catch(err => {
      return res.status(500).json({error: 'Server error when adding user - Please try again momentarily'});
    });
});

app.post('/api/signin', async (req, res) => {
  const user = await getUser(req.body.un, 'un');
  console.log('getuser return val: ', user);
  console.log(req.body);

  if (!user) {
    return res.status(422).json({error: 'Incorrect username or password.'});
  }

  if (user.pw !== req.body.pw) {
    return res.status(422).json({error: 'Incorrect username or password.'});
  }

  delete user.pw;

  return res.status(200).json({user});
});

const getUser = (query, param) => {
  return database('users').where(param, query).first();
};

app.get('/api/recentmessages', (req, res) => {
  return database('messages').limit(20)
    .then(messages => {
      return res.status(200).json({ messages });
    })
    .catch(err => {
      return res.status(500).json({ error: 'Error retrieving messages' });
    });
});

app.get('/api/users/:id', (req, res) => {
  return database('users').where('id', req.params.id).first(['sn'])
    .then(user => {
      return res.status(200).json({user});
    })
    .catch(err => {
      return res.status(200).json({error: 'Could not fetch user information'});
    });
});





http.listen(app.get('port'), () => {
  console.log(`Server is listening on port ${app.get('port')}`);
});

