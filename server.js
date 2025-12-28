require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.get('/', async (req, res) => {
    try {
        const apiResponse = await axios.get(`https://api.thecatapi.com/v1/images/search/?has_breeds=1&api_key=${process.env.CAT_API_KEY}`);
        res.send(apiResponse.data);
    } catch (error) {
        console.error(error);
    }
     
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Servidor iniciado na porta ${port}`);
    console.log(`Acesse: http://localhost:${port}`);
});