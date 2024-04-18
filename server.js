const express = require("express");
const bodyParser = require("body-parser")
const cors = require('cors');
const mongoose = require("mongoose")

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    }
});

const Book = mongoose.model('Bookrecord', bookSchema);

const uri ="mongodb+srv://final:final@cluster0.sovjyo2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error:'));


connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
});


httpStatus = require("http-status-codes");


app.get( "/", (req, res) => {
    Book.find()
        .then((books) => res.json(books))
        .catch((err) => res.status(400).json("Error: " + err));
});

app.get('/:id', (req, res) => {
    console.log('just id' + req.params.id);
    Book.findById(req.params.id)
        .then((books) => res.json(books))
        .catch((err) => res.status(400).json("Error: " + err));
});

app.post('/',  async (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const description = req.body.description;
   
    const newBook = new Book({
        title,
        author,
        description
    });

    try {
        const savedBook = await newBook.save();
        console.log("Book Created");


        res.status(httpStatus.StatusCodes.OK).json(savedBook);
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
});

app.post('/:id', async (req, res) => {
    const booktitle = req.body.title;
    const author = req.body.author;
    const description = req.body.description;


    const book = await Book.findById(req.params.id)

    book.title = booktitle;
    book.author = author;
    book.description = description;

    try {
        const savedBook = await book.save();
        console.log("Book Updated");


        res.status(httpStatus.StatusCodes.OK).json(savedBook);
    } catch (err) {
        res.status(400).json("Error: " + err);
    }
});

app.delete('/:id', (req, res) => {
    Book.deleteOne({ _id: req.params.id })
        .then(() => res.json("Book deleted successfully"))
        .catch((err) => res.status(400).json("Error: " + err));
});

app.listen(5000, ()=> {
    console.log(`server running on 5000`);
});
