const express = require('express');
const jwt = require('jsonwebtoken');
const randomColor = require('random-color');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());
var color = randomColor();

app.post('/auth', (req, res) => {
  const {clientId, name} = req.body;
  if (!clientId || clientId.length < 1) {
    res.status(400).send('Invalid ID');
  }
  if (!name || name.length < 1) {
    res.status(400).send('Invalid name');
  }
  const token = jwt.sign({
    client: clientId,
    channel: 'key',
    permissions: {
      "^observable-locations$": {
        publish: true,
        subscribe: true,
        history: 50,
      }
    },
    data: {
      name,
      color: color.hexString()
    },
    exp: Math.floor(Date.now() / 1000) + 60 * 3 // expire in 3 minutes
  }, 'Key');
  res.send(token);
});

app.listen(3000, () => console.log('Server listening on port 3000'));