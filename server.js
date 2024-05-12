const express = require("express");

const app = express();

const  cors = require('cors')

const dataFromJson = require('./Movie data/data.json');
const { default: axios } = require("axios");

require('dotenv').config()
const port = process.env.PORT||8080;
const apiKey = process.env.API_KEY

const bodyParser= require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const { Client } = require('pg');
// const url = `postgress://jafar:0000@localhost:5432/movies`
   const url =`postgres://njxorovv:XpAcwIQm1QWWoBqvzJI3MaViJ_PVXKuY@kala.db.elephantsql.com/njxorovv`
const client = new Client(url);

//constructor

function MovieData11(title , poster_path , overview){
this.title=title;
this.poster_path=poster_path;
this.overview=overview;
}
function MovieData12(id,title ,release_date, poster_path , overview){
    this.id=id;
    this.release_date=release_date;
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
    }

    app.use(cors());

//routes
app.get('/',dataHandler);
app.get('/favorite',favHandler);
app.get('/trending',trendingHandler);
app.get('/searchMovie',searchMovieHandler);
app.get('/airingToday',airingTodayHandler);
app.get('/  ',availableRegionsHandler);

app.post('/addMovie',addMovieHandler);
app.get('/getMovies',getMoviesHandler);

app.put('/editMovie/:id',editMovieHandler);
app.delete('/deleteMovie/:id',deleteMovieHandler);
app.get('/getMoviesID/:id',getIDMoviesHandler);


//functions

function dataHandler(req,res){
    const result=new MovieData11(dataFromJson.title , dataFromJson.poster_path , dataFromJson.overview);
    res.json(result);
    }

 function favHandler(req,res){
        res.send("Welcome to Favorite Page");
    }
 
function trendingHandler(req,res){
        let url=`https://api.themoviedb.org/3/trending/all/week?api_key=18976591dc16bc5a0867e48d4ff172ec`;
        axios.get(url)
        .then(result2=>{
            let movieData12=result2.data.results.map(movie=>{
                return new MovieData12(movie.id,movie.title,movie.release_date,movie.poster_path,movie.overview)
            });
            
            
            res.json(movieData12);
        })
        .catch(error=>{
            console.log(error);
        })
    }

    function searchMovieHandler(req,res){
           
           let movieName=req.query.title;
           console.log(movieName);
           let url=`https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=18976591dc16bc5a0867e48d4ff172ec`
           axios.get(url)
           .then(result=>{
            res.json(result.data.results)
           })
           .catch(error=>{
            console.log(error);
        })
    }
    function airingTodayHandler(req,res){
           
        let url=`https://api.themoviedb.org/3/tv/airing_today?&api_key=18976591dc16bc5a0867e48d4ff172ec`
        axios.get(url)
        .then(result=>{
         res.json(result.data.results)
        })
        .catch(error=>{
         console.log(error);
     })
 }

 function availableRegionsHandler(req,res){
           
    let url=`https://api.themoviedb.org/3/watch/providers/regions?&api_key=18976591dc16bc5a0867e48d4ff172ec`
    axios.get(url)
    .then(result=>{
     res.json(result.data.results)
    })
    .catch(error=>{
     console.log(error);
 })
}

function addMovieHandler(req,res){
    
    const original_title=req.body.original_title;
    const release_date=req.body.release_date;
    const poster_path=req.body.poster_path;
    const overview=req.body.overview;
    const comment=req.body.comment;
    
    const sql= `INSERT INTO movie(original_title, release_date, poster_path, overview, comment )
    VALUES ($1, $2, $3, $4, $5) RETURNING *;`

    const values =[original_title,release_date,poster_path,overview,comment]
    client.query(sql,values)
    .then(()=>{
        res.status(201).send("data recieved to movies database")
    })
    .catch()

}

function getMoviesHandler(req,res){
    const sql=`SELECT * FROM movie`
    client.query(sql)
    
    .then((result)=>{
        const data=result.rows;
        res.json(data)
    })
    .catch()
    
}


// function editMovieHandler(req,res){
//     const id = req.params.id;
//     const original_title=req.body.original_title;
//     const release_date=req.body.release_date;
//     const poster_path=req.body.poster_path;
//     const overview=req.body.overview;
//     const comment=req.body.comment;

//     const sql=`UPDATE movie
//     SET original_title = $1, release_date = $2, poster_path =$3, overview=$4,comment=$5
//     WHERE id=${id} RETURNING *;`

//     const values =[original_title,release_date,poster_path,overview,comment]

//     client.query(sql,values)
//     .then(result=>{
//         res.send("successfully updated")
//     })
//     .catch()


//}
function editMovieHandler(req, res) {
    const id = req.params.id;
    const { comment } = req.body;

    const sql = `
        UPDATE movie
        SET comment = $1
        WHERE id = $2
        RETURNING *;
    `;

    const values = [comment, id];

    client.query(sql, values)
        .then(result => {
            if (result.rows.length > 0) {
                const updatedMovie = result.rows[0];
                res.json(updatedMovie); // Send back the updated movie object
            } else {
                res.status(404).send("Movie not found"); // Handle case where movie with given id is not found
            }
        })
        .catch(error => {
            console.error("Error updating movie:", error);
            res.status(500).send("Internal Server Error");
        });
}



function deleteMovieHandler(req,res){
    const id=req.params.id;

    const sql=`DELETE FROM movie WHERE id=$1;`
    const values=[id]

    client.query(sql,values)
    .then(result=>{
        res.send("sucessfully deleted")
    })
    .catch()


}

function getIDMoviesHandler(req,res){
    const id=req.params.id

    const sql=`SELECT * FROM movie WHERE id=$1`
    let values=[id]
    client.query(sql,values)
    
    .then((result)=>{
        const data=result.rows;
        res.json(data)
    })
    .catch()

}









//error 404
app.use('*', errorHandler404)
function errorHandler404(req, res, next) {
    let status404 = 404;
    let response404 = "Page Not Found Error";

    res.status(404).send(
        `status: ${status404}
        responseText: ${response404}`
    )
}

//error 500
app.use((err, req, res, next) => {
    let status500 = 500;
    let response500 = "Sorry, Something Went Wrong";
    console.error(err.stack);
    res.status(500).send(
        `status: ${status500}
        responseText: ${response500}`
    );
});


//app listener
client.connect()
.then(app.listen(port , () => {
  
    console.log("Listening to port ",port);
  }))
.catch()

 