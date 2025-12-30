# Galeria de Animais
Uma página web que mostra fotos aleatórias de cães e gatos e a raça do animal mostrado toda vez que o usuário apertar um dos botões na tela.

![AnimalsGalleryDemo](https://github.com/user-attachments/assets/8203cc29-c70b-4371-8c5e-b2c99b1286d3)

## Como funciona

### Backend
Os dados dos animais contendo foto e raça vêm de APIs públicas que são consumidas pelo código JavaScript. São duas APIs diferentes, uma para cães e outra para gatos, porém ambas funcionam de forma similar. Abaixo está o trecho de código utilizado no backend para consumir ambas as APIs. O endpoint '/cat' manda uma resposta com os dados do gato e '/dog' com os dados do cachorro. Foi utilizado **express** para rotear cada endpoint e **axios** para fazer as requisições para as APIs consumidas, além de utilizar **async** e **await** para aguardar a resposta das requisições, que retornam uma **promise** 
```
require('dotenv').config();
const cors = require('cors');
const express = require('express');
const axios = require('axios');

const app = express();

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://animalsgallery.vercel.app']
}));

app.get('/cat', async (req, res) => {
    try {
        const apiResponse = await axios.get(`https://api.thecatapi.com/v1/images/search/?has_breeds=1&api_key=${process.env.CAT_API_KEY}`);
        res.send(apiResponse.data);
    } catch (error) {
        throw new Error('Erro ao receber resposta da API');
    }
     
});

app.get('/dog', async (req, res) => {
    const apiResponse = await axios.get('https://dog.ceo/api/breeds/image/random');
    res.send(apiResponse.data);
})

const port = process.env.PORT || 3000;
app.listen(port);
```
A maior diferença entre as APIs é que para os cães o nome da raça vem na própria url, enquanto que para a raça dos gatos é necessário uma chave privada que pode ser resgatada no próprio site da API. Desta forma, foi uma boa prática reservar a chave privada em uma variável **.env** que pode ser configurada na hora de fazer o deploy para a nuvem e evita expor dados confidenciais diretamente no código.

Além disso, a API de gatos pode exibir fotos de gatos que não contém dados de raça, então para evitar problemas no frontend da aplicação foi usado uma query string **has_breeds=1** na url, o que limita a resposta da API a enviar apenas gatos que possuem raça conhecida. Em seguida a query string **api_key=${process.env.CAT_API_KEY}** é onde deve se passar a chave privada da API, foi utilizado o módulo **dotenv** do **Node** para ler a variável de ambiente.

### Frontend
