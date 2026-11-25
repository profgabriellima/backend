const formCadastro = document.getElementById('form-cadastro');

formCadastro.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const novoProduto = {
        nome: document.getElementById('nome').value,
        preco: parseFloat(document.getElementById('preco').value),
        descricao: document.getElementById('descricao').value,
        imagem: document.getElementById('imagem').value
    };

    const resposta = await fetch('http://localhost:3000/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoProduto)
    });

    if (resposta.ok) {
        alert('Produto cadastrado com sucesso!');
        formCadastro.reset();
    }
});
