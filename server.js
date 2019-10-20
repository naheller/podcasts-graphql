const express = require('express')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const axios = require('axios')

const schema = buildSchema(`
  type Query {
    feedUrl(podcastName: String!): String
  }
`)

const getPodcastFeedUrl = ({ podcastName }) => {
  const formattedName = podcastName.trim().replace(/ /g, '+')

  return axios
    .get('https://itunes.apple.com/search', {
      params: {
        term: formattedName,
        entity: 'podcast'
      }
    })
    .then(res => res.data.results[0].feedUrl)
}

const root = {
  feedUrl: getPodcastFeedUrl
}

const app = express()

app.use(
  '/graphql',
  graphqlHttp({
    schema,
    rootValue: root,
    graphiql: true
  })
)

app.listen(4000, () => {
  console.log('Server listening on port 4000')
})
