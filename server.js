const videoData = require('./data/videos2.json');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
app.use(express.json());
app.use(express.static('public'))
app.use('/images', express.static('images'))
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

app.post('/upload', (req, res) => {
  const newVideoId = uuidv4()
  const title = req.body.title;
  const channel = req.body.channel;
  const image = req.body.image;
  const description = req.body.description;

  const newVideo = {
    id: newVideoId,
    title: title,
    channel: channel,
    image: image
  }

  const newVideoDetails = {
    id: newVideoId,
    title: title,
    channel: channel,
    image: image,
    description: description,
    views: "0",
    likes: "0",
    duration: "0:20",
    video: "https://project-2-api.herokuapp.com/stream",
    timestamp: Date.now(),
    comments: []
  };

  const getVideos = () => fs.readFileSync("./data/videos2.json", { endoding: 'utf8' })
  let readVideos = JSON.parse(getVideos())

  //Adds new video
  readVideos.videos = [...readVideos.videos, newVideo]

  //Adds new video with details
  readVideos.videoDetails = [...readVideos.videoDetails, newVideoDetails]

  fs.writeFile("./data/videos2.json",
    JSON.stringify(readVideos), () => {
      console.log(title)
      res.json(`${title} has been uploaded!`);
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

app.put('/videos/:videoId/likes', (req, res) => {
  const videoId = req.params.videoId

  const getVideos = () => fs.readFileSync("./data/videos2.json", { endoding: 'utf8' })
  let readVideos = JSON.parse(getVideos())
  const videoIndex = readVideos.videoDetails.findIndex((e) => e.id == videoId)

  let likesString = readVideos.videoDetails[videoIndex].likes
  let likesInt

  // Handles commas in the likes number
  if (likesString.length > 3) {
    likesString = readVideos.videoDetails[videoIndex].likes.replace(/,/g, "");
    likesInt = parseInt(likesString) + 1
    likesString = likesInt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  } else {
    likesInt = parseInt(likesString) + 1
    likesString = likesInt.toString()
  }

  readVideos.videoDetails[videoIndex].likes = likesString

  fs.writeFile("./data/videos2.json",
    JSON.stringify(readVideos), () => {
      res.json(readVideos.videoDetails[videoIndex].likes);
    });
})

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

