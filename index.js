const express = require('express');
const cors = require('cors'); // Necessita da instalação: npm install cors
const fs = require('fs');
const usuarios = require('./minha-loja-gamer/data/usuarios.json');
const app = express();
const port = 3000;

// Importações dos JSONs
const jogos = require('./minha-loja-gamer/data/jogos.json');

// Caminho do arquivo onde estão salvos os produtos
const caminhoProdutos = './minha-loja-gamer/data/produtos.json'; 
const produtos = require(caminhoProdutos);

app.use(cors()); 
app.use(express.json()); 

//BUSCAR JOGOS
app.get('/jogos', (req, res) => {
    res.json(jogos);
});

// PRODUTOS

//BUSCAR PRODUTOS
app.get('/produtos', (req, res) => {
    res.json(produtos);
});

//INSERIR PRODUTOS
app.post('/produtos', (req, res) => {
    const novoProduto = req.body;

    const novoId = produtos.length > 0
        ? Math.max(...produtos.map(p => p.id)) + 1
        : 1;
    novoProduto.id = novoId;

    produtos.push(novoProduto);
    
    // Corrigido para caminhoProdutos
    fs.writeFileSync(caminhoProdutos, JSON.stringify(produtos, null, 2)); 

    res.status(201).json({ mensagem: "Produto cadastrado!", produto: novoProduto });
});

//EDITAR PRODUTOS
app.put('/produtos/:id', (req, res) => {
    const idBuscado = parseInt(req.params.id);
    const dadosAtualizados = req.body;
    const index = produtos.findIndex(p => p.id === idBuscado);
    if (index === -1) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    produtos[index] = { id: idBuscado, ...dadosAtualizados };
    fs.writeFileSync(caminhoProdutos, JSON.stringify(produtos, null, 2));

    res.status(200).json({ mensagem: "Produto atualizado!", produto: produtos[index] });
});

//DELETAR PRODUTOS
app.delete('/produtos/:id', (req, res) => {
    const idBuscado = parseInt(req.params.id);
    const index = produtos.findIndex(p => p.id === idBuscado);
    
    if (index === -1) {
        return res.status(404).json({ erro: "Produto não encontrado" });
    }

    produtos.splice(index, 1);
    fs.writeFileSync(caminhoProdutos, JSON.stringify(produtos, null, 2));
    
    res.status(204).send();
});

// USUÁRIOS

//GESTÃO DE USUÁRIOS
app.post('/usuarios', (req, res) => {
    try {
        const { nome, email } = req.body; // 1. receber
 
        if (!nome || !email) {
            return res.status(400).json({ erro: 'Nome e e-mail são obrigatórios' }); // 2. validar
        }
 
        const jaExiste = usuarios.some(u => u.email === email);
        if (jaExiste) {
            return res.status(409).json({ erro: 'E-mail já cadastrado' });
        }
        const novoUsuario = { nome, email }; //3.Salvar
        usuarios.push(novoUsuario);
        fs.writeFileSync('./minha-loja-gamer/data/usuarios.json', JSON.stringify(usuarios, null, 2));
 
        res.status(201).json({ mensagem: 'Usuário cadastrado!', usuario: novoUsuario });  //4.Responder
    } catch (erro) {
        res.status(500).json({ erro: 'Erro interno ao salvar usuário' });
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});