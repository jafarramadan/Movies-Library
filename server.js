const express = require("express");

const app = express();

const dataFromJson = require('./Movie data/data.json');
const { default: axios } = require("axios");

require('dotenv').config()
const port = process.env.PORT
const apiKey = process.env.API_KEY

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



//routes
app.get('/',dataHandler);
app.get('/favorite',favHandler);
app.get('/trending',trendingHandler);
app.get('/searchMovie',searchMovieHandler);
app.get('/airingToday',airingTodayHandler);
app.get('/availableRegions',availableRegionsHandler);

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
app.listen(port , () => {
  
    console.log("Listening to port ",port);
  });

  