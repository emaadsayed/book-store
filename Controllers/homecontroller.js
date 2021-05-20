const Book = require("../models/Book");
const User = require("../models/user");
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']


module.exports.create = async(req,res)=>{
    console.log(req.body.title)
    console.log(req.user.id)
    let response = {success:false,data:{status:"Book not added"}};
    let book = new Book({
     title: req.body.title,
     description: req.body.description,
     language: req.body.language,
     category: req.body.category,
     paid: req.body.paid,
     author: req.user.id,
     content:req.body.content,
    })
      try {
        saveCover(book, req.body.cover)
        book = await book.save( async(err,result)=>{   
          if(err){
            console.log(err);
              res.send(response)
          }
          else{
           
            await User.updateOne({_id:req.user.id},{$push:{uploadedBooks:result._id}},{ upsert: true }).then(result =>{
              if(result){
                response = {success:true,data:{status:"book added"}};
                res.redirect("/home")
              }else{
                response = {success:false,data:{status:"book not added to user"}};
                res.send(response)
              }
            }).catch(e=>{
              console.log(e);
              
            })            
          }
        });
        
        console.log("done")
      } catch (e) {
        console.log(e);
        res.send(response)
      }

}
    

module.exports.purchase = async (req, res) => {
  let response = { success: false, data: { status: "Could not purchase" } };
  await User.updateOne({ _id: req.user.id }, { $push: { purchasedBooks: req.body.bookId } }, { upsert: true }).then(async(result) => {
    if (result) {
      await Book.updateOne({ _id: req.body.bookId }, { $push: { purchasers: req.user.id } }, { upsert: true }).then(bookResult => {
        if (bookResult) {
          response = { success: true, data: { status: "book purchased successfully" } };
        }
      })   
    } else {
      console.log(result);
      res.send(response)
    }
  }).catch(e => {
    console.log(e);
  })
}

module.exports.favourite = async (req, res) => {
  let response = { success: false, data: { status: "Could not purchase" } };
  await User.updateOne({ _id: req.user.id }, { $push: { favouraiteBooks: req.body.bookId } }, { upsert: true }).then(result => {
    if (result) {
      response = { success: true, data: { status: "book purchased successfully" } };
    } else {
      console.log(result);
      res.send(response)
    }
  }).catch(e => {
    console.log(e);
  })
}


module.exports.editProfile = async(req,res)=>{
  let response = { success: false, data: { status: "Could not edit" } };
  await User.updateOne({ _id: req.user.id }, { $set: { name: req.body.name, email: req.body.email,about:req.body.description} }, { upsert: true }).then(result => {
    if (result) {
      response = { success: true, data: { status: "edited successfully" } };
      res.redirect("/home/dashboard")
    } else {
      console.log(result);
      res.send(response)
    }
  }).catch(e => {
    console.log(e);
  })
}

module.exports.delete = async(req,res)=>{
  let response = { success: false, data: { status: "Could not Delete" } };
  await Book.findByIdAndDelete(req.params.id).then(async(result)=>{
    if(result){
      await User.updateOne({_id:req.user.id},{$pull:{uploadedBooks:req.params.id}}).then(result=>{
        if(result){
          response = { success: true, data: { status: "deleted successfully" } };
          res.redirect("/home/dashboard")
        }
      }).catch(e=>{
      console.log(e); 
      })
    }else {
      console.log(result);
      res.send(response)
    }
  })
}


   //UPLOAD
   function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if (cover != null && imageMimeTypes.includes(cover.type)) {
      book.coverImage = new Buffer.from(cover.data, 'base64')
      book.coverImageType = cover.type
    }
  }