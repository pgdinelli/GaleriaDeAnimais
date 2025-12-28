require('dotenv').config();
const cors = require('cors');
const express = require('express');
const axios = require('axios');

const app = express();

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500']
}));

app.get('/', async (req, res) => {
    try {
        const apiResponse = await axios.get(`https://api.thecatapi.com/v1/images/search/?has_breeds=1&api_key=${process.env.CAT_API_KEY}`);
        res.send(apiResponse.data);
    } catch (error) {
        throw new Error('Erro ao receber resposta da API');
    }
     
});

const port = process.env.PORT;
app.listen(port);