const express = require("express");
const route = require("./routes.js");

const app = express()
app.use(express.json())
app.use("/", route)

//port is two-way communication link between two programs running on the network
app.listen(process.env.PORT || 3000, function() {
    console.log("Express app running on port " + (process.env.PORT || 3000));
});
