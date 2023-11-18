
const videoData = require('./data/videos.json');
const fs = require('fs');
require('dotenv').config();
const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
app.use(express.json());
const { PORT, CORS_ORIGIN } = process.env
app.use(cors({PORT, CORS_ORIGIN}))


// console.log(videoData.videos)
// console.log(videoData.videoDetails[0].comments)
// console.log(PORT)


let students = [
  {
    id: '5dbb3dd8-49d8-4c3b-93d9-59230836b2f1',
    name: 'Brynhildr Sadler',
    program: 'Web Dev',
    grade: 75,
  },
  {
    id: '594daba3-e1e4-4a5f-89ae-372dfb95a16d',
    name: 'Joan Leon',
    program: 'UX',
    grade: 72,
  },
  {
    id: '9c05b68b-e51b-42ce-8b89-10f8aa32db2b',
    name: 'Mark Summers',
    program: 'Web Dev',
    grade: 87,
  },
  {
    id: '5c49d6a0-74a2-4202-af90-204ef0e35fbc',
    name: 'Tanja Zawisza',
    program: 'Web Dev',
    grade: 92,
  },
  {
    id: '23e91f79-f553-4f4f-88ac-09070cb38ac1',
    name: 'Slavomir Amato',
    program: 'UX',
    grade: 78,
  },
  {
    id: '1c4b7c42-23af-4168-aced-f87cb02f5172',
    name: 'Tihana Anand',
    program: 'UX',
    grade: 60,
  },
  {
    id: '86a81142-b6dc-422b-9d55-7bbc04aa012c',
    name: 'Reima Ivov',
    program: 'Web Dev',
    grade: 95,
  },
  {
    id: '8d8b7afa-8896-44cb-9bb7-bc21beda4fd5',
    name: 'Demokritos Shafir',
    program: 'UX',
    grade: 83,
  },
];

// GET is working!
app.get('/videos', (req, res) => {
  res.json(videoData.videos);
})


// Working on POST
app.post('/videos/:id/comments', (req, res) => {
  const comment = req.body.comment;
  const videoId = req.params.id;
 // videoData.videoDetails[0].comments
 // This part SHOULD work, but haven't tested it yet
  const newComment = {
    id: uuidv4(),
    name: "Bryce Borer",
    comment: comment,
    likes: 0,
    timestamp: Date.now()
  };
  // console.log("req: ", req)
  console.log("comment: ", comment)
  // console.log("videoId: ", videoId)


  // videoData.videoDetails.comments.push(newComment)
  // students.push(newComment);
  
  fs.readFile("./data/videos2.json", (err, data) =>{
    // console.log(data)
    const newThing = data.videoDetails.find((e) => {e.id = videoId})
    // videoData.videoDetails.comments.push(newThing)
    console.log("newThing: ", newThing)
  })

  fs.writeFile("./data/videos2.json",
        JSON.stringify(videoData), () => {
            console.log("videos2.json has been created!")
            res.json(newComment);
        });
        
// read file and latest entry

});

app.delete('/api/v1/students/:id', (req, res) => {
  const studentIdParam = req.params.id
  const filteredStudents = students.filter((student)=> {
    return student.id !==studentIdParam
  });
  students = filteredStudents
  res.send(filteredStudents)

});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
