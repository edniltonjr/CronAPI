const express = require('express');

const app = express();
const routes = require('./routes');

app.use('/v0', routes);

app.listen(3000);
