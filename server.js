const express = require("express");
const app = express();

const ip = process.env.IP || "0.0.0.0";
const port = process.env.PORT || 8080;

//Import puppeteer function
const searchImage = require("./shoppingResults");

app.get("/search", (request, response) => {
  const searchQuery = request.query.searchquery;

  if (searchQuery != null) {
    searchImage(searchQuery).then((results) => {
      response.status(200);
      response.json(results);
    });
  } else response.end();
});

//Catches requests made to localhost:3000/
app.get("/search", (req, res) => res.send("Hello World!"));

//Initialises the express server on the port 30000
app.listen(port, ip);
