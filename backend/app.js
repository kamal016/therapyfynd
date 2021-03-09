const express = require("express");
const app = express();
const cors = require("cors");

const { graphqlHTTP } = require('express-graphql');
const schema = require("./schema/schema");

//middleware
app.use('/graphql', cors() ,graphqlHTTP({
  schema,
  graphiql: true
}));

//Allow cross origin requests
app.use(cors());

app.use(express.json());

//routes
app.use("/authentication", require("./routes/jwtAuth"));

app.use("/home", require("./routes/home"));

app.listen(5000, () => {
  console.log(`Server is starting on port 5000`);
});