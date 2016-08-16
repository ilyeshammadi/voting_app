var express = require('express');
var Poll = require('../models/poll');

var router = express.Router();
var Poll = require('../models/poll');

router.get('/', (req, res) => {

  Poll.find((err, polls) => {
    res.json(polls)
  })

})

router.get('/create', (req, res) => {

  var poll = new Poll({
    title : "Hello World"
  })
  poll.save();
  res.json(poll);
})

router.get('/:id', (req, res) => {
  Poll.findOne({_id : req.params.id}, (err, poll) => {
    if (err) return;
    res.json(poll)
  })
})


router.get('/update/:id', (req, res) => {
  res.json({message : 'update poll'})
})

router.get('/delete/:id', (req, res) => {
  res.json({message : 'delete poll'})
})



module.exports = router;
