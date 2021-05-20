const mongoose = require('mongoose')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)
const marked = require('marked')

const book = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    language:{
        type:String,
        required:true
    },
    category:{
       type:String,
       required:true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    paid:{
        type:Number,
        default:0
    },
    content:{
     type:String,
    },
    purchasers:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    }
  ],
    sanitizedHtml:{
        type:String,
       },
       coverImage: {
        type: Buffer,
        required: true
    },
      coverImageType: {
        type: String,
        required: true
      }
},
{
    timestamps: true
})

book.pre('validate', function(next) {

    if (this.content) {
      this.sanitizedHtml = dompurify.sanitize(marked(this.content))
    }
  
    next();
  })

book.virtual('coverImagePath').get(function() {
    if (this.coverImage != null && this.coverImageType != null) {
      return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
  })

module.exports = mongoose.model("Books", book );