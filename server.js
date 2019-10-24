const express = require('express')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const axios = require('axios')

const baseUrl = 'https://listen-api.listennotes.com/api/v2'

const schema = buildSchema(`
  type Podcast {
    description_highlighted: String
    description_original: String
    earliest_pub_date_ms: Int
    email: String
    explicit_content: Boolean
    genre_ids: [Int]
    id: String
    image: String
    itunes_id: Int
    latest_pub_date_ms: Int
    listennotes_url: String
    publisher_highlighted: String
    publisher_original: String
    thumbnail: String
    title_highlighted: String
    title_original: String
    total_episodes: Int
  }
  type Episode {
    audio: String
    audio_length_sec: Int
    description_highlighted: String
    description_original: String
    explicit_content: Boolean
    genre_ids: [Int]
    id: String
    image: String
    itunes_id: Int
    listennotes_url: String
    podcast_id: String
    podcast_listennotes_url: String
    podcast_title_highlighted: String
    podcast_title_original: String
    publisher_highlighted: String
    publisher_original: String
    pub_date_ms: Int
    rss: String
    thumbnail: String
    title_highlighted: String
    title_original: String
    total_episodes: Int
    transcripts_highlighted: [String]
  }
  type Query {
    episodesByName(name: String!): [Episode]
    podcastsByName(name: String!): [Podcast]
  }
`)

const getEpisodesByName = ({ name }) => {
  const formattedName = name.trim()

  return axios
    .get(`${baseUrl}/search`, {
      headers: {
        'X-ListenAPI-Key': process.env.LISTEN_API_KEY
      },
      params: {
        q: formattedName,
        type: 'episode'
      }
    })
    .then(res => res.data.results)
    .catch(err => console.log(err))
}

const getPodcastsByName = ({ name }) => {
  const formattedName = name.trim()

  return axios
    .get(`${baseUrl}/search`, {
      headers: {
        'X-ListenAPI-Key': process.env.LISTEN_API_KEY
      },
      params: {
        q: formattedName,
        type: 'podcast'
      }
    })
    .then(res => res.data.results)
    .catch(err => console.log(err))
}

const root = {
  episodesByName: getEpisodesByName,
  podcastsByName: getPodcastsByName
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
