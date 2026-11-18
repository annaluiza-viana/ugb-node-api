const express = require("express"); //importa ele todo
const sequelize = require("./database/database.js");

const Hero = require("./models/Hero.js");
const Movie = require("./models/movies.js")
const heroesRoutes =  require("./routes/heroes.routes.js")
const moviesRoutes = require("./routes/movies.routes.js");
const app = express();
app.use(express.static('public'));

app.use(express.json()); //para receber dados em JSON

Hero.belongsToMany(Movie, {
    through: "HeroMovies"
});

Movie.belongsToMany(Hero , {
    through: "HeroMovies"
});

app.use("/heroes", heroesRoutes); 
app.use("/movies", moviesRoutes);

sequelize.sync() //sincronizar os Models da aplicação com as tabelas do banco de dados
    .then(() => {
        console.log("Banco de Dados sincronizado")
    })
    .catch((error) => { 
        console.error("Erro a sincronizar o Banco", error)
    })

module.exports = app;