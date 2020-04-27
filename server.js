const express = require('express')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')
const axios = require('axios')
const cors = require('cors')
const bodyParser = require('body-parser')

const baseUrl = 'https://listen-api.listennotes.com/api/v2'

const schema = buildSchema(`
  type PodcastByName {
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
  type PodcastById {
    id: String
    rss: String
    email: String
    title: String
    website: String
    episodes: [EpisodeById]
    thumbnail: String
    description: String
    total_episodes: Int
  }
  type EpisodeByName {
    audio: String
    audio_length_sec: Int
    description_highlighted: String
    description_original: String
    explicit_content: Boolean
    genre_ids: [Int]
    id: String
    image: String
    itunes_id: Int
    link: String
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
  type EpisodeById {
    id: String
    link: String
    audio: String
    image: String
    title: String
    thumbnail: String
    description: String
    pub_date_ms: String
    listennotes_url: String
    listennotes_edit_url: String
    audio_length_sec: String
    explicit_content: Boolean
    maybe_audio_invalid: Boolean
  }
  type Query {
    episodesByName(name: String!): [EpisodeByName]
    episodeById(id: String!): EpisodeById
    podcastsByName(name: String!): [PodcastByName]
    podcastById(id: String!): PodcastById
  }
`)

const getPodcastById = ({ id }) =>
  axios
    .get(`${baseUrl}/podcasts/${id}`, {
      headers: {
        'X-ListenAPI-Key': process.env.LISTEN_API_KEY,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err))

const getPodcastsByName = ({ name }) => {
  const formattedName = name.trim()

  return axios
    .get(`${baseUrl}/search`, {
      headers: {
        'X-ListenAPI-Key': process.env.LISTEN_API_KEY,
      },
      params: {
        q: formattedName,
        type: 'podcast',
      },
    })
    .then((res) => res.data.results)
    .catch((err) => console.log(err))
}

const getEpisodeById = ({ id }) =>
  axios
    .get(`${baseUrl}/episodes/${id}`, {
      headers: {
        'X-ListenAPI-Key': process.env.LISTEN_API_KEY,
      },
    })
    .then((res) => res.data)
    .catch((err) => console.log(err))

const getEpisodesByName = ({ name }) => {
  const formattedName = name.trim()

  return axios
    .get(`${baseUrl}/search`, {
      headers: {
        'X-ListenAPI-Key': process.env.LISTEN_API_KEY,
      },
      params: {
        q: formattedName,
        type: 'episode',
      },
    })
    .then((res) => res.data.results)
    .catch((err) => console.log(err))
}

const root = {
  podcastById: getPodcastById,
  podcastsByName: getPodcastsByName,
  episodeById: getEpisodeById,
  episodesByName: getEpisodesByName,
}

const app = express()

app.use('*', cors())

app.use(
  '/graphql',
  bodyParser.json(),
  graphqlHttp({
    schema,
    rootValue: root,
    graphiql: true,
  })
)

const portNumber = process.env.PORT || 4000

app.listen(portNumber, () => {
  console.log(`Server listening on port ${portNumber}`)
})
