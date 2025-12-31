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
Para o Frontend, foi usado puro HTML, CSS e JavaScript para manipular a página de forma dinâmica. O código HTML abaixo mostra um "h1" de id "breed" que será usado para exibir a raça do animal dinamicamente, assim como a imagem que terá sua url modificada para a que vier na resposta da API, abaixo um botão para exibir fotos de cães e outro para fotos de gatos.
```
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./assets/css/style.css">
    <title>Galeria de Cães</title>
</head>
<body>
    <main>
        <div class="image-container">
            <h1 id="breed"></h1>
            <div class="image-wrapper">
                <img src="./assets/img/dog-sample.webp" id="image" alt="imagem de um animal">
            </div>
        </div>
        <div class="btn-container">
            <button id="dogsBtn">Cachorros</button>
            <button id="catsBtn">Gatos</button>
        </div>
    </main>

    <script src="./assets/js/index.js"></script>
</body>
</html>
```
O código JavaScript abaixo foi utilizado para resgatar os dados que estão sendo enviados pelo backend da aplicação e alterar a página de acordo com a resposta recebida. 
```
(function () {
    const image = document.querySelector('#image');
    const breed = document.querySelector('#breed');
    const dogsBtn = document.querySelector('#dogsBtn');
    const catsBtn = document.querySelector('#catsBtn');

    function displayDogData(data) {
        image.src = data;
        breed.textContent = data.split('/')[4];
    }

    function displayCatData(data) {
        image.src = data[0].url;
        breed.textContent = data[0].breeds[0].name;
    }

    dogsBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('https://animalsgallery-backend.vercel.app/dog');
            const data = await response.json();
            displayDogData(data.message);
        } catch (error) {
            breed.textContent = 'Erro ao mostrar imagem do cachorro';
            image.src = '';
        }
    });

    catsBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('https://animalsgallery-backend.vercel.app/cat');
            const data = await response.json();
            displayCatData(data);
        } catch (error) {
            breed.textContent = 'Erro ao mostrar imagem do gato';
            image.src = '';
        }
    });

})();
```
Foi utilizada uma **IIFE** (Immediately Invoked Function Expression) para envolver todo o código e proteger as variáveis e funções do escopo global. As constantes declaradas no início do programa respectivamente são para alterar o conteúdo da imagem, conteúdo do "h1" que exibe a raça e os botões que irão escutar eventos de clique do usuário. Cada botão enviará uma requisição ao backend da aplicação utilizando o método **fetch**, que acessa a rota com os dados do cachorro ou do gato dependendo de qual for clicado, então utiliza-se o método **json()** para converter os dados em formato de objeto JS. O método fetch retorna uma promise que precisa aguardar ser resolvida ou não, por este motivo foi utilizado novamente async/await dentro de blocos try/catch. 

As funções **displayDogData()** e **displayCatData()** são chamadas passando como argumento os dados que foram recebidos do backend, estas funções tem o simples objetivo de formatar os dados e exibir na tela. Desta forma, elas alteram o atributo "src" da tag "img" no HTML para que seja a url da imagem enviada pela API dos animais e também alteram o conteúdo do "h1" para que seja o nome da raça. Como a API de cães traz a raça na própria url, pegamos apenas este dado usando o método **split()** dividindo cada palavra que vem entre as barras "/" da url, a raça sempre vem na posição de índice 4. Já a API de gatos traz a raça de uma forma diferente, este dado vem dentro de um array de objetos contendo várias informações sobre peso, origem e temperamento do animal. Uma das chaves é o elemento "name" que tem como valor o nome da raça, logo foi necessário pegar apenas o índice deste atributo para exibir na página web.

### Design reponsivo
Também foi implementado responsividade a este projeto para que usuários possam acessar a aplicação através de Smartphones ou Tablets. Como as imagens podem vir de tamanhos variados, algumas podem vir bem maior e quebrar a página em telas menores causando uma rolagem horizontal. Para evitar este problema foi feito com que cada imagem nunca ultrapasse a largura total da tela do usuário, garantindo uma melhor experiência para quem acessar a página através de dispositivos móveis.

<img width="676" height="887" alt="GaleriaAnimaisResponsivo" src="https://github.com/user-attachments/assets/16c3701e-c25e-4b5d-8809-c0ad963205e3" />

Abaixo o trecho das Media Queries que foram implementadas no CSS com os respectivos breakpoints para tablets e smartphones.

```
@media screen and (min-width: 601px) and (max-width: 1024px) {

    .image-container {
        width: 95vw;
        height: auto;
        min-height: 50vh;
    }

    .image-container img {
        max-width: 100%;
        height: auto;
        max-height: 45vh;
    }

    .image-container h1 {
        width: 100%;
        font-size: 32px;
    }

    .btn-container {
        gap: 32px;
        margin-top: 24px;
    }

    button {
        width: 200px;
        padding: 16px;
        font-size: 19px;
    }

}

@media screen and (max-width: 600px) {
     .image-container {
        width: 95vw;
        height: auto;
        padding: 12px;
    }

    .image-container h1 {
        font-size: 22px;
        margin-bottom: 8px;
    }

    .image-container img {
        max-height: 40vh;
    }

    .btn-container {
        gap: 15px;
        margin-top: 16px;
    }

    button {
        width: 160px;
        padding: 12px;
        font-size: 16px;
    }
}
```


## Tecnologias utilizadas
- HTML, CSS e JavaScript
- Node.js
- Express
- Axios
- Dotenv
- Cors

## Competências
- Manipulação do DOM
- Promises, JavaScript assíncrono async/await
- Cors
- Sistema de rotas backend
- Design reponsivo
