// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./comment.model');

var db = 'mongodb://localhost/comment';
mongoose.connect(db);

// Set up body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Create a route
app.get('/', function (req, res) {
    res.send('Happy to be here');
});

// Create a route
app.get('/comments', function (req, res) {
    console.log('Getting all comments');
    Comment.find({})
        .exec(function (err, comments) {
            if (err) {
                res.send('Error has occured');
            } else {
                console.log(comments);
                res.json(comments);
            }
        });
});

// Create a route
app.get('/comments/:id', function (req, res) {
    console.log('Getting one comments');
    Comment.findOne({
            _id: req.params.id
        })
        .exec(function (err, comment) {
            if (err) {
                res.send('Error has occured');
            } else {
                console.log(comment);
                res.json(comment);
            }
        });
});

// Create a route
app.post('/comment', function (req, res) {
    var newComment = new Comment();

    newComment.name = req.body.name;
    newComment.comment = req.body.comment;

    newComment.save(function (err, comment) {
        if (err) {
            res.send('Error saving comment');
        } else {
            console.log(comment);
            res.send(comment);
        }
    });
});

// Create a route
app.put('/comment/:id', function (req, res) {
    Comment.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                name: req.body.name,
                comment: req.body.comment
            }
        }, {
            upsert: true
        },
        function (err, newComment) {
            if (err) {
                res.send('Error updating comment');
            } else {
                console.log(newComment);
                res.send(newComment);
            }
        });
});

// Create a route
app.delete('/comment/:id', function (req, res) {
    Comment.findOneAndRemove({
            _id: req.params.id
        },
        function (err, comment) {
            if (err) {
                res.send('Error deleting comment');
            } else {
                console.log(comment);
                res.status(204);
            }
        });
});
