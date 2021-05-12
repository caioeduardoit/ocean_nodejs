const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

(async () => {
    // const url = `mongodb://localhost:27017`;
    const url = 'mongodb+srv://admin:d8yVQwTtLmSfBnLz@cluster0.nvijm.mongodb.net/ocean_db?retryWrites=true&w=majority';
    const dbname = 'ocean_db';

    console.info('Conectando ao banco de dados...');

    const client = await MongoClient.connect(url, { useUnifiedTopology: true });

    console.info('MongoDB conectado com sucesso!');

    const db = client.db(dbname);

    const app = express();

    app.use(express.json());

    app.get('/hello', function (req, res) {
        res.send('Hello World!');
    });

    const mensagens = ['Essa é a primeira mensagem!', 'Essa é a segunda mensagem.'];

    const mensagensCollection = db.collection('mensagens');

    // app.get('/mensagens', function (req, res) {
    // res.send(mensagens.filter(Boolean));
    app.get('/mensagens', async (req, res) => {
        const listaMensagens = await mensagensCollection.find().toArray();
        res.send(listaMensagens);
    });

    app.get('/mensagens/:id', async (req, res) => {
        const id = req.params.id;

        const mensagem = await mensagensCollection.findOne({ _id: ObjectId(id) });

        if (!mensagem) {
            res.send('Mensagem não encontrada.');
        }

        res.send(mensagem);
    });

    app.post('/mensagens', async (req, res) => {
        const mensagem = req.body;

        await mensagensCollection.insertOne(mensagem);

        res.send(mensagem);
    });

    app.put('/mensagens/:id', async (req, res) => {
        const id = req.params.id;
        const mensagem = req.body;

        await mensagensCollection.updateOne(
            { _id: ObjectId(id) },
            { $set: mensagem }
        );

        res.send('Mensagem atualizada com sucesso.');
    });

    app.delete('/mensagens/:id', async (req, res) => {
        const id = req.params.id;

        await mensagensCollection.deleteOne({ _id: ObjectId(id) });

        res.send('Mensagem removida com sucesso!');
    });

    app.listen(process.env.PORT || 3000);

})();