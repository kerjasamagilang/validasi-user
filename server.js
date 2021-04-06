const { ApolloServer, PubSub } = require('apollo-server');
const mongoose = require('mongoose');

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
require('dotenv').config();

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
});

const URI = process.env.ATLAS_URI_DATABASE;
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    console.log('Connected to MONGODB')
    return server.listen({port: 5000});
  })
  .then(res => {
    console.log(`Server is running on ${res.url}`)
  })
  .catch(err => {
    console.log(err)
  })