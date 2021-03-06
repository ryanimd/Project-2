const express = require('express')
const Post = require('../models/posts.js')
const posts = express.Router()

const authenticate = (req, res, next) => {
  if (req.session.currentUser){
    return next()
  } else {
    res.redirect('/sessions/new')
  }
}

const seed = [
  {
    title: "Here\'s an example",
    message: "First post here. Let\'s see how this goes 😬"
  },
  {
    title: "",
    message: "This post won\'t have a title"
  },
  {
    title: "Random thought",
    message: "Which letter is silent in the word Scent, the S or the C?"
  }
]

// INDEX //
posts.get('/', (req, res) => {
  Post.find({}, (err, allPosts) => {
    res.render('posts/index.ejs', {
      posts: allPosts,
      currentUser: req.session.currentUser
    })
  })
})

// SEED ROUTE FOR DEMO //
posts.get('/demo/seed', (req, res) => {
  console.log('seed route accessed');
  for (i in seed) {
    Post.create(seed[i], (err, data) => {
        // if (err){
        //   console.log(err);
        // } else {
        //   console.log(data);
        // }
      }
    )
  }
  res.redirect('/posts')
})

// NEW //
posts.get('/new', (req, res) => {
  res.render(
    'posts/new.ejs',
    {currentUser: req.session.currentUser}
  )
})

// CREATE //
posts.post('/', (req, res) => {
  Post.create(req.body, (err, createdPost) => {
    // console.log(req.body);
    res.redirect('/')
  })
})

// SHOW //
posts.get('/:id', authenticate, (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
      // console.log(req.params.id);
      res.render('posts/show.ejs', {
        post: foundPost,
        currentUser: req.session.currentUser
      })
  })
})

// EDIT //
posts.get('/:id/edit', (req, res) => {
  Post.findById(req.params.id, (err, foundPost) => {
    res.render('posts/edit.ejs', {
      post: foundPost,
      currentUser: req.session.currentUser
    })
  })
})

// UPDATE //
posts.put('/:id', (req, res) => {
  Post.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true},
    (err, updatePost) => {
      res.redirect('/posts')
    }
  )
})

// DELETE //
posts.delete('/:id', (req, res) => {
  Post.findByIdAndRemove(req.params.id, (err, deletePost) => {
    res.redirect('/posts')
  })
})

module.exports = posts;
