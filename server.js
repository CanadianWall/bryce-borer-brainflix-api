
const videoData = require('./data/videos.json');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
app.use(express.json());
const { PORT, CORS_ORIGIN } = process.env
app.use(cors({ PORT, CORS_ORIGIN }))

// get all videos
app.get('/videos', (req, res) => {
  res.json(videoData.videos);
})

// get video ID
app.get('/videos/:id', (req, res) => {
  const videoId = req.params.id
  const getVideos = () => fs.readFileSync("./data/videos2.json", { endoding: 'utf8' })
  const readVideos = JSON.parse(getVideos())
  const videoIndex = readVideos.videoDetails.findIndex((e) => e.id == videoId)
  console.log(readVideos.videoDetails[videoIndex])
  res.json(readVideos.videoDetails[videoIndex]);
})

app.post('/videos/:videoId/comments', (req, res) => {
  const comment = req.body.comment;
  const videoId = req.params.videoId;

  const newComment = {
    id: uuidv4(),
    name: "Bryce Borer",
    comment: comment,
    likes: 0,
    timestamp: Date.now()
  };

  const getVideos = () => fs.readFileSync("./data/videos2.json", { endoding: 'utf8' })
  let readVideos = JSON.parse(getVideos())
  const newCommentVideoIndex = readVideos.videoDetails.findIndex((e) => e.id == videoId)

  //Adds new comment to the proper video
  readVideos.videoDetails[newCommentVideoIndex].comments = [...readVideos.videoDetails[newCommentVideoIndex].comments, newComment]

  fs.writeFile("./data/videos2.json",
    JSON.stringify(readVideos), () => {
      res.json(newComment);
    });

});

app.delete('/videos/:videoId/comments/:commentId', (req, res) => {
  const videoId = req.params.videoId
  const commentId = req.params.commentId

  const getVideos = () => fs.readFileSync("./data/videos2.json", { endoding: 'utf8' })
  let readVideos = JSON.parse(getVideos())
  const videoIndex = readVideos.videoDetails.findIndex((e) => e.id == videoId)

  const filteredVideoComments = readVideos.videoDetails[videoIndex].comments.filter((comment) => {
    return comment.id !== commentId;
  });

  //Updates comments with deleted comment removed
  readVideos.videoDetails[videoIndex].comments = filteredVideoComments

  fs.writeFile("./data/videos2.json",
    JSON.stringify(readVideos), () => {
      res.json(filteredVideoComments);
    });

});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
