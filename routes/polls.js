var express = require('express');
var Poll = require('../models/poll');

var router = express.Router();
var Poll = require('../models/poll');

/**
  List Polls
*/
router.get('/', (req, res) => {
  Poll.find((err, polls) => {
    res.json(polls)
  })

})

/**
  Create Poll
*/
router.post('/create', (req, res) => {

  // Not able to create poll if not logged in
  if(!req.user) {
    res.json({message : 'you must be logged in to create a poll'})
  }

  // Get the data
  var title = req.body.title;

  // Create the new poll
  var poll = new Poll({
    title : title,
    user_id : req.user._id,
  })

  var choices = [];
    // If there choices
  if (req.body.choices){
    choices = JSON.parse(req.body.choices);
    // Add the choices
    for(i in choices){
      poll.choices.push(choices[i]);
    }
  }


  // Save the creted poll
  poll.save();

  // Return the created poll
  res.json(poll);
})

/**
  Read Poll
*/
router.get('/:id', (req, res) => {
  // Get the poll with the passed id
  Poll.findOne({_id : req.params.id}, (err, poll) => {
    if (err) return res.json({message : 'error'});

    // If not error, return the poll data
    res.json(poll)
  })
})

/**
  Update Poll
*/
router.post('/update/:id', (req, res) => {
  Poll.findOne({_id : req.params.id}, (err, poll) => {
    // Update is authorized by the user who created the poll
    if (poll.user_id !== req.user._id) return res.json({messsage : 'you are not authorized to edit this poll'})

    // Get the new data

    // Update the poll with the new data

  })
  res.json({message : 'update poll'})
})

/**
  Delte Poll
*/
router.post('/delete/:id', (req, res) => {
  res.json({message : 'delete poll'})
})

/**
  Update Poll
*/
router.post('/vote/:id', (req, res) => {
  var choice_id = req.body.choice_id;
  var poll_id = req.params.id;
  Poll.findOne({_id : poll_id}, (err, poll) => {
    if (err) return;

    for(i in poll.choices){
      if(poll.choices[i]._id === choice_id){
        poll.choices[i].votes++;
        poll.save();
      }
    }

  })
})

module.exports = router;
