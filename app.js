const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const database = path.join(__dirname, "moviesData.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: database,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running");
    });
  } catch (e) {
    console.log(`DB error:${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

app.get("/movies/", async (request, response) => {
  const getMovieNames = `
    SELECT movie_name 
    FROM movie;
    `;
  const movieNamesArr = await db.all(getMovieNames);
  response.send(movieNamesArr);
});
//post  api
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovieQuery = `
    INSERT INTO 
       movie(director_id,movie_name,lead_actor)
    VALUES
      (
          ${directorId},
          '${movieName}',
          '${leadActor}'
      );   
    `;
  const dbResponse = await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});
