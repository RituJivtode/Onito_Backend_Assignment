const express = require("express");
const router = express.Router(); //used express to create route handlers
const connection = require("./mysql.js");

router.get('/api/v1/longest-duration-movies', (req, res) => {
  try{
    const sql = `SELECT tconst, primaryTitle, runtimeMinutes, genres 
                 FROM movies 
                 ORDER BY runtimeMinutes DESC 
                 LIMIT 10`;
    connection.query(sql, (error, results) => {
      if (error) throw error.message
      return res.status(200).send({ status: true, msg: "Success", data: results });
    });
  }catch(error){
    res.status(500).send({ status: false, msg: error.message })
  }
  });
  
  //b) POST /api/v1/new-movie
  router.post('/api/v1/new-movie', (req, res) => {
    try{
    let body = req.body
    let { tconst, primaryTitle, runtimeMinutes, genres } = body;

    tconst = body.tconst,
    titleType = body.titleType,
    primaryTitle = body.primaryTitle,
    runtimeMinutes = body.runtimeMinutes,
    genres = body.genres

    const sql = `INSERT INTO movies (tconst, titleType, primaryTitle, runtimeMinutes, genres)
                 VALUES (?, ?, ?, ?, ?)`;

    const values = [tconst, titleType, primaryTitle, runtimeMinutes, genres];
    console.log(values)
    connection.query(sql, values, (error, results) => {
      console.log(connection.query(sql, values))
      if (error) throw error;
      console.log(results)
      res.status(201).send({ status: true, msg: "New movie added successfully", data: results });
    });
  }catch(error){
    res.status(500).send({ status: false, msg: error.message })
  }
  });
  
  //c) GET /api/v1/top-rated-movies
  router.get('/api/v1/top-rated-movies', (req, res) => {
    try{
    const sql = `SELECT movies.tconst, primaryTitle, genres, AVG(averageRating) AS avgRating 
                 FROM movies 
                 JOIN ratings ON movies.tconst = ratings.tconst 
                 GROUP BY tconst 
                 HAVING avgRating > 6.0 
                 ORDER BY avgRating DESC`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      return res.status(200).send({ status: true, msg: "Success", data: results });
    });
  }catch(error){
    res.status(500).send({ status: false, msg: error.message })
  }
  });
  
  //d) GET /api/v1/genre-movies-with-subtotals
  router.get('/api/v1/genre-movies-with-subtotals', (req, res) => {
    try{
    const sql = `SELECT 
    IFNULL(genres, 'Total') AS genres,
    IF(primaryTitle IS NULL, NULL, primaryTitle) AS primaryTitle,
    SUM(numVotes) AS numVotes
  FROM (
    SELECT 
      m.genres,
      m.primaryTitle,
      COALESCE(SUM(r.numVotes), 0) AS numVotes
    FROM movies AS m
    LEFT JOIN ratings AS r ON m.tconst = r.tconst
    GROUP BY m.genres, m.primaryTitle WITH ROLLUP
  ) AS subquery
  GROUP BY genres, primaryTitle
  HAVING genres IS NOT NULL OR primaryTitle IS NULL`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      return res.status(200).send({ status: true, msg: "Success", data: results });
    });
  }catch(error){
    res.status(500).send({ status: false, msg: error.message })
  }
  });
  
  //e) POST /api/v1/update-runtime-minutes
  router.post('/api/v1/update-runtime-minutes', (req, res) => {

    const sql = `UPDATE movies 
                 SET runtimeMinutes = CASE 
                                        WHEN genres = 'Documentary' THEN runtimeMinutes + 15 
                                        WHEN genres = 'Animation' THEN runtimeMinutes + 30 
                                        ELSE runtimeMinutes + 45 
                                      END`;
    connection.query(sql, (error, results) => {
      if (error) throw error;
      return res.status(200).send({ status: true, msg: "Success" });
    });
  });

  module.exports = router;