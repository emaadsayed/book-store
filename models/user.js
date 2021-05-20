const mongoose = require('mongoose')

const user = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    about: {
        type: String,
    },
    uploadedBooks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Books",
    
        },
    ],
    purchasedBooks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Books",
     
        },
    ],
    favouraiteBooks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Books",
    
        },
    ],
    coverImage: {
        type: Buffer,
      
    },
      coverImageType: {
        type: String,
       
      }

},
    {
        timestamps: true
    });

    user.virtual('coverImagePath').get(function() {
        if (this.coverImage != null && this.coverImageType != null) {
          return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
        }
      })

module.exports = mongoose.model("Users", user);