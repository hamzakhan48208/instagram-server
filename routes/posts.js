const router = require('express').Router();

const User = require('../models/User');
const Post = require('../models/Post');

//home route
router.get('/', function(req, res){
  res.json('Welcome to Post route!');
});

//create post
router.post('/create', async function(req, res){
  const post = new Post(req.body);

  try{
      await post.save();
     return  res.status(200).json("Post created successfully!");
  }catch(err){
      return res.status(500).json(err.message);
  }
});

//get post
router.get('/getPost/:postId', async function(req, res){
  try{
      const post = await Post.findOne({_id: req.params.postId});
      return res.status(200).json(post);
  }catch(err){
      return res.status(500).json(err);
  }
});

//update post
router.put('/update/:id', async function(req, res){
  const post = await Post.findById(req.params.id);


    try{
        if(post.image !== req.body.image){
            //image updated, update both
            await post.updateOne({image: req.body.image, description: req.body.description});
        }
        else{
            //image same, only update description
            await post.updateOne({description: req.body.description});
        }
        return res.status(200).json("Post updated successfully!");
    }catch(err){
        return res.status(500).json(err.message);
    }

});

//delete post
router.delete('/delete/:id', async function(req, res){
  const post = await Post.findById(req.params.id);

  try{
      await post.deleteOne();
      return res.status(200).json("Post deleted successfully!");
  }catch(err){
      console.log(err.message);
      return res.status(500).json(err.message);
  }
});

//like and dislike post
router.post('/like/:id', async function(req, res){
  //not liked previously
  try{
      const post = await Post.findById(req.params.id);
      if(!post.likes.includes(req.body.userId)){
          await post.updateOne({$push: {likes: req.body.userId}});
          res.status(200).json("liked");
      }
      else{
          await post.updateOne({$pull: {likes: req.body.userId}});
          res.status(200).json("disliked");
      }
  }catch(err){
      res.status(200).json(err.message);
  }

});

//get timeline posts
router.get('/timeline/all/:username', async function(req, res){
  try{
      const user = await User.findOne({username: req.params.username});
      const userPosts = await Post.find({userId: user._id}).sort({createdAt: -1});

      //get followings posts
      const friendsPosts = await Promise.all(
          user.following.map((friendId) => {
              return Post.find({userId: friendId}).sort({createdAt: -1});
          })
      );

      res.status(200).json(userPosts.concat(...friendsPosts));
  }
  catch(err){
      res.status(500).json(err.message);
  }

});

//get timeline posts of current user
router.get('/timeline/:username', async function(req, res){
  try{
      const user = await User.findOne({username: req.params.username});
      const userPosts = await Post.find({userId: user._id}).sort({createdAt: -1});


      res.status(200).json(userPosts);
  }
  catch(err){
      res.status(500).json(err.message);
  }
});

//add comment
router.post('/addComment/:postId', async function(req, res){
  try{
    const post = await Post.findOneAndUpdate(
      { _id: req.params.postId },
      { $push: { comments: req.body } },
      { new: true }
    );

      res.status(200).json(post);

  }catch(err){
      res.status(500).json(err.message);
  }
});

module.exports = router;
