const Movie = require("../models/movies.js");

async function list(req, res) {
    const movies = await Movie.findAll();
    return res.status(200).json(movies);
}

async function create(req, res) {
    const { title, year } = req.body;

    if (!title || !year) {
        return res.status(400).json({
            message: "Título e ano são obrigatórios"
        });
    }

    const movie = await Movie.create({ title, year });
    return res.status(201).json(movie);
}

async function findById(req, res) {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) {
        return res.status(404).json({ message: "Filme não encontrado" });
    }
    return res.status(200).json(movie);
}

async function update(req, res) {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
        return res.status(404).json({ message: "Filme não encontrado" });
    }

    await movie.update(req.body);

    return res.status(200).json(movie);
}

async function remove(req, res) {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
        return res.status(404).json({ message: "Filme não encontrado" });
    }

    await movie.destroy();

    return res.status(200).json({ message: "Filme excluído com sucesso" });
}
async function patch(req, res) {
    const movie = await Movie.findByPk(req.params.id);

    if (!movie) {
        return res.status(404).json({
            message: "Filme não encontrado"
        });
    }

    await movie.update(req.body);

    return res.status(200).json(movie);
}

module.exports = { 
    list, 
    create, 
    findById,  
    update, 
    remove,
    patch,
};
