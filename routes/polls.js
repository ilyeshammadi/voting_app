var express = require('express');
var Poll = require('../models/poll');

var router = express.Router();
var Poll = require('../models/poll');

/**
  Helper function to check if element in array
*/
function isInArray(arr, e){
  return arr.indexOf(e) !== -1;
}

/**
  List Polls
*/
router.get('/', (req, res) => {

  Poll.find((err, polls) => {
    for(var i=0; i<polls.length; i++){

      // If the user is not logged in, he can not vote
      if(req.user){

        // If the user has voted before
        if(isInArray(polls[i].voters, req.user._id)){
          polls[i].can_vote = false;
        }

        // If the user is the poll creater
        if (String(polls[i].user_id) === String(req.user._id)){
          polls[i].can_vote = false;
        }
      }else {
        polls[i].can_vote = false;
      }
    }
    res.json(polls)
  })

})

/**
  Create Poll
*/
router.post('/create', (req, res) => {

  // Not able to create poll if not logged in
  if(!req.user) {
    res.status(400).json({message : 'you must be logged in to create a poll'})
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
    if (err) return res.status(400).json({message : 'error'});

    // If the user is not logged in, he can not vote
    if(req.user){

      // If the user has voted before
      if(isInArray(poll.voters, req.user._id)){
        poll.can_vote = false;
      }

      // If the user is the poll creater
      if (String(poll.user_id) === String(req.user._id)){
        polls.can_vote = false;
      }
    }else {
      poll.can_vote = false;
    }

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

  console.log(choice_id);
  console.log(poll_id);

  Poll.findOne({_id : poll_id}, (err, poll) => {
    if (err) return;

    if (String(req.user._id) === String(poll.user_id)) return;

    // If the voter is the user who created the poll, return
    if(req.user == poll.user_id) return;

    for(var i=0; i<poll.choices.length; i++){

      // If the user has not voted before
      if(!isInArray(poll.voters, req.user._id)){

        // If the param choice is in the poll choices
        if((poll.choices[i]._id + "") === choice_id){

          // Add the user to the voters list
          poll.voters.push(req.user);

          // Increment the voter by one
          poll.choices[i].votes++;
          poll.save();
          return res.status(200).end();
        }else {
          return res.status(400).json({message : 'choice does not exist in the poll choices'});
        }
      }else {
        return res.status(400).json({message : 'you can vote only once'});
      }
    }


  })
})

module.exports = router;
