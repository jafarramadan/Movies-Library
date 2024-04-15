const express = require("express");

const app = express();
const port =8080;
const dataFromJson = require('./Movie data/data.json');

function MovieData(title , poster_path , overview){
this.title=title;
this.poster_path=poster_path;
this.overview=overview;
}

app.get('/',dataHandler);
app.get('/favorite',favHandler)

//home page handler

function dataHandler(req,res){
    const result=new MovieData(dataFromJson.title , dataFromJson.poster_path , dataFromJson.overview);
    res.json(result);
    }
//favorite page handler
    function favHandler(req,res){
        res.send("Welcome to Favorite Page");
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



app.listen(port , () => {
  
    console.log("Listening to port ",port);
  });