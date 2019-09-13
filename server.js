require('dotenv').config();

const MOVIEDATA = require('./movies-data-small.json');

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const server = express();
server.use(morgan('common'));
server.use(helmet());

server.use(function validateBearerKey(req,res,next) {

        if (!req.get('Authorization'))
            return res.status(401).json({error: 'Authorization header missing'});

        if (req.get('Authorization').split(' ')[1] !== process.env.KEY)
            return res.status(401).json({error: 'Unauthorized access'});

        next();
});

server.use(cors());

const PORT = 8000;


function filterByGenre(json, genre) {

    return json.filter((movie) => {
        return movie.genre === genre;
    });
}


function filterByCountry(json, country) {
    return json.filter((movie) => {
        return movie.country === country;
    });
}


function filterByAvgVote(json, avg_vote) {
    return json.filter((movie) => {
        return movie.avg_vote >= avg_vote;
    });
}


server.get("/movie", (req,res) => {

    retval = MOVIEDATA;

    /* Filter by genre */

    if (req.query.genre)
        retval = filterByGenre(retval, req.query.genre);

    /* Filter by country */

    if (req.query.country)
        retval = filterByCountry(retval, req.query.country);

    /* Filter by avg_vote */

    if (req.query.avg_vote)
        retval = filterByAvgVote(retval, Number(req.query.avg_vote));

    res.json(retval);
})

server.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
})
