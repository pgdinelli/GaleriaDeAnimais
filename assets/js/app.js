(function () {
    const image = document.querySelector('#image');
    const imgBtn = document.querySelector('#imgBtn');
    const breed = document.querySelector('#breed');
    const gatosBtn = document.querySelector('#gatosBtn');

    async function getImg() {
        try {
            const url = 'https://dog.ceo/api/breeds/image/random';
            const response = await fetch(url);
            const data = await response.json();
            return data.message;
        } catch {
            breed.textContent = `Erro ao pegar imagem`;
            return;
        }
    }

    imgBtn.addEventListener('click', async () => {
        try {
            const data = await getImg();
            image.src = data;
            breed.textContent = data.split('/')[4];
        } catch {
            return;
        }
    });

    gatosBtn.addEventListener('click', async () => {
        const response = await fetch('https://api.thecatapi.com/v1/images/search')
        const data = await response.json();
        const idResponse = await fetch('https://api.thecatapi.com/v1/breeds');
        const dataId = await idResponse.json();
        image.src = data[0].url;

        //for(let )
        console.log(data);
        console.log(dataId)
        //breed.textContent = data[0];
    });

})();