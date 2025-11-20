const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello IFNTI!');
});

app.listen(port, () => {
    console.log('Server started at http://localhost:3000');  
});