const express = require('express')
const homeController = require('../Controllers/homecontroller')
const router = express.Router()
const Book = require("../models/Book");
const User = require("../models/user");
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']


router.get('/', async (req, res) => {
  const adventure = await Book.find({category: "Adventure"}).limit(5);
  const fanfiction = await Book.find({category: "Fanfiction"}).limit(5);
  const horror = await Book.find({category: "Horror"}).limit(5);
  const mystery = await Book.find({category: "Mystery"}).limit(5);
  const romance = await Book.find({category: "Romance"}).limit(5);
  res.render('home', {adventure: adventure, fanfiction: fanfiction, horror: horror, mystery: mystery, romance: romance});
});

router.get('/create', (req, res) => {
  res.render('create')
});

router.post('/create', homeController.create);

//VIEW-MORE
router.get('/adventure', async(req, res) => {
  try {
    const adventure = await Book.find({category: "Adventure"});
    res.render("category/adventure", {adventure: adventure})
  } catch (error) {
    res.redirect("/home");
  }
});

router.get('/fanfiction', async(req, res) => {
  try {
    const fanfiction = await Book.find({category: "Fanfiction"});
    res.render("category/fanfiction", {fanfiction: fanfiction})
  } catch (error) {
    res.redirect("/home");
  }
});

router.get('/horror', async(req, res) => {
  try {
    const horror = await Book.find({category: "Horror"});
    res.render("category/horror", {horror: horror})
  } catch (error) {
    res.redirect("/home");
  }
});

router.get('/mystery', async(req, res) => {
  try {
    const mystery = await Book.find({category: "Mystery"});
    res.render("category/mystery", {mystery: mystery})
  } catch (error) {
    res.redirect("/home");
  }
});

router.get('/romance', async(req, res) => {
  try {
    const romance = await Book.find({category: "Romance"});
    res.render("category/romance", {romance: romance})
  } catch (error) {
    res.redirect("/home");
  }
});

//DASHBOARD
router.get("/dashboard", async(req, res) => {
  const user = await User.findById(req.user.id).populate('uploadedBooks purchasedBooks favouraiteBooks')
  res.render("dashboard", { book: user.uploadedBooks, purchase: user.purchasedBooks, favourite: user.favouraiteBooks, user: user})
})

//SHOW-BOOK
router.get("/:id",async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author");
    const user = await User.findById(req.user.id);
    if (book == null) res.redirect("/home");
    var purchasers = book.purchasers;
    console.log("purchasers",purchasers)
    var purchaseStatus = false
    if(purchasers.includes(req.user.id)){
      purchaseStatus = true;
    }
    var uploadStatus = false
    if(book.author._id == req.user.id ){
      uploadStatus = true;
    }
    var favouraiteStatus = false;
    if(user.favouraiteBooks.includes(book._id)){
      favouraiteStatus = true;
    }
    console.log("status",purchaseStatus)
    const suggestions = await Book.find({category:book.category}).limit(5)
    
    res.render("show-book", { book: book, Status:purchaseStatus , uploaded:uploadStatus , suggestions:suggestions ,favStatus:favouraiteStatus });
  } catch (error) {
    console.log(error)
    res.redirect("/home");
  } 
});

//ReadBook
router.get("/read/:id",async (req, res) => {
  try {
    const read = await Book.findById(req.params.id);
    if (read == null) res.redirect("/home");
    res.render("readBook", { read: read.sanitizedHtml,});
  } catch (error) {
    res.redirect("/home");
  } 
});

//purchase book
router.post("/purchase",homeController.purchase);

router.post("/favourite",homeController.favourite);

router.delete('/delete/:id',homeController.delete);


//edit
router.get('/dashboard/edit', async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("details", {user: user})
});

//edit
router.put('/dashboard/edit/submit', homeController.editProfile)
module.exports = router