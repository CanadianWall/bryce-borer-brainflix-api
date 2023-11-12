require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

const { PORT, CORS_ORIGIN } = process.env
console.log(PORT)
console.log(CORS_ORIGIN)

app.use(cors({ origin: CORS_ORIGIN}));

app.get('/', (req, res) => {
    res.send('HELLO')
})


app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
})