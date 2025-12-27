(function () {
    const image = document.querySelector('#image');
    const imgBtn = document.querySelector('#imgBtn');
    const breed = document.querySelector('#breed');

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

})();