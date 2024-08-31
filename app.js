require('./databases/databases');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes/router-user'));
app.use('/api', require('./routes/router-viewer'))
app.use('/api', require('./routes/router-projek'))

app.use(require('./middleware/error-middleware'));

app.listen(4000, () => console.log('Express running'));