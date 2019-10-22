const express = require('express')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const axios = require('axios')

const baseUrl = 'https://listen-api.listennotes.com/api/v2'

const schema = buildSchema(`
  type Query {
    audioUrl(podcastName: String!): String
  }
`)

const getPodcastAudioUrl = ({ podcastName }) => {
  const formattedName = podcastName.trim()

  return axios
    .get(`${baseUrl}/search`, {
      headers: {
        'X-ListenAPI-Key': process.env.LISTEN_API_KEY
      },
      params: {
        q: formattedName
      }
    })
    .then(res => res.data.results[0].audio)
    .catch(err => console.log(err))
}

const root = {
  audioUrl: getPodcastAudioUrl
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

app.listen(process.env.PORT || 4000, () => {
  console.log('Server listening on port 4000')
})
