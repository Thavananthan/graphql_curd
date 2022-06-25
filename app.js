const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const testSchema = require("./server/schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    graphql: true,
    schema: testSchema,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0.z01mi.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(PORT, () => {
      console.log("Listening for requests on my awesome port 4000");
    });
  })
  .catch((e) => console.log("Error:::" + e));
//
