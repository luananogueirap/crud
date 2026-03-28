const express = require('express')
const {engine} = require('express-handlebars')
const pool = require('./db/conn')

const app = express()

app.use(
    express.urlencoded({
        extended:true
    })
)

app.use(express.json())

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home')
})


// adicionando dados 

app.post('/books/insertbook', (req,res) =>{

    const title = req.body.title
    const pageqty = req.body.pageqty

    const query = `INSERT INTO books (title, pageqty) VALUES('${title}', '${pageqty}')`

    pool.query(query, function(err) {
       if(err){
        console.log(err)
       }

       res.redirect('/books')

    })
} )


//resgatando dados

app.get('/books', (req, res) => {
    const query = "SELECT * FROM books"
    pool.query(query, function(err, data){
        if(err){
            console.log(err)
            return
        }

        const books = data
        console.log(books)

    res.render('books', {books})
    })
})

// editando dados pt1

app.get('/books/edit/:id', (req, res) => {

    const id = req.params.id
    const query = `SELECT * FROM books WHERE id = ${id}`
    
    pool.query(query, function (err, data) {
        if (err){
            console.log(err)
            return
        }

        const book = data[0]

        res.render('editbook', {book})

    })

})

//filtrando dados com WHERE

app.get('/books/:id', (req, res) => {
    const id = req.params.id

    const query = `SELECT * FROM books WHERE id = ${id}`

    pool.query(query, function (err, data){
        if(err){
        console.log(err)
        return
        }

        const book = data[0]

        res.render('book', {book})
    })
})

//editando livros pt2

app.post('/books/updatebook', (req, res) => {

    const id = req.body.id
    const title = req.body.title
    const pageqty = req.body.pageqty

    const query = `UPDATE books SET title = '${title}', pageqty = '${pageqty}' WHERE id = '${id}'`

    pool.query(query, function (err) {
        if(err){
            console.log(err)
            return
        }

        res.redirect('/books')

    })

})

//removendo

app.post('/books/remove/:id', (req,res) => {
    const id = req.params.id

    const query = `DELETE FROM books WHERE id = ${id}`

    pool.query(query, function(err) {
        if(err){
            console.log(err)
            return
        }

        res.redirect('/books')

    })
})

app.listen(3000)


