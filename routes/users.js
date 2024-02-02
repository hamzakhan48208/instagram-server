const router = require('express').Router();
const User = require('../models/User');
const Post = require('../models/Post');

//home route
router.get('/', function(req, res){
  res.json("Welcome to Users route!");
});

//get user
router.get('/:username', async function(req, res){
  const user = await User.findOne({ username: req.params.username });
  return res.status(200).json(user);

});

//get user
router.get('/id/:id', async function(req, res){
  const user = await User.findById(req.params.id);
  return res.status(200).json(user);

});

//update user
router.put('/update/:id', async function(req, res){
  try {
    // Use findByIdAndUpdate to update and get the updated document
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        profilePicture: req.body.profilePicture,
        description: req.body.description,
      },
      { new: true } // Setting { new: true } returns the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

//follow user
router.post('/follow/:username', async function(req, res){
  const currUser = await User.findOne({username: req.body.username});
  const otherUser = await User.findOne({username: req.params.username});

  if(!otherUser.followers.includes(currUser._id)){
      await otherUser.updateOne({$push: {followers: currUser._id}});
      await currUser.updateOne({$push: {following: otherUser._id}});

      res.status(200).json("User followed successfully!");
  }
  else{
      res.status(500).json("You already followed this user!");
  }
});

//unfollow user
router.post('/unfollow/:username', async function(req, res){
  const currUser = await User.findOne({username: req.body.username});
  const otherUser = await User.findOne({username: req.params.username});

  if(otherUser.followers.includes(currUser._id)){
      await otherUser.updateOne({$pull: {followers: currUser._id}});
      await currUser.updateOne({$pull: {following: otherUser._id}});

      res.status(200).json("User unfollowed successfully!");
  }
  else{
      res.status(500).json("You do not follow this user!");
  }
});

//get all users
router.get('/allUsers/all', async function(req, res){
  try{
      const users = await User.find({}).limit(5);
      console.log("users:"+users);
      return res.status(200).json(users);
  }catch(err){
      return res.status(500).json(err);
  }
});

//delete user
router.delete('/delete/:id', async function(req, res){
  try {
    // Find and delete the user
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find and delete all posts associated with the user
    const deletedPosts = await Post.deleteMany({ userId: deletedUser._id });

    res.status(200).json({
      deletedUser: deletedUser,
      deletedPostsCount: deletedPosts.deletedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
