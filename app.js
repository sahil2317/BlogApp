var express = require("express")
var app = express();
var methodOverride = require("method-override");
var expressSanitizer = require("express-sanitizer");
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
const mongoose = require("mongoose");
app.set("view engine","ejs");
app.use(methodOverride("_method"));

//MongoDB Connection
mongoose.connect("mongodb://localhost:27017/BlogApp",{ useNewUrlParser: true, useUnifiedTopology: true},(err)=>{
       if(!err){
           console.log("MongoDB connection success");
       }
       else{
           console.log("Error in DB connection" +err)
           }
   });
//Schema Setup
 var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type:Date,default: Date.now}
 });
 var Blog = mongoose.model("Blog",blogSchema);

  
 
//Restful Routes

app.get("/",function(req,res){
    res.redirect("/blogs");
  });
//Index Route
app.get("/blogs",function(req,res){
  Blog.find({},function(err,blog){
    if(err){
        console.log(err);
    }
    else{
        res.render("index",{blog : blog});
    }
  });
});

//New Route
app.get("/blogs/new",function(req,res){
res.render("new");
});

//Create Route
app.post("/blogs",function(req,res){
  //Create blog
  //to create blog we use syntax-Blog.creat(Data,callback)
  //Here blog represet form name which we included in group-blog[title]
  
  req.body.blog.body = req.sanitize(req.body.blog.body)

  Blog.create(req.body.blog,function(err,newBlog){
    if(err){
       res.render("new");
    }
    else{
      
      res.redirect("/blogs");
    }
  })
});
//Show  Route
app.get("/blogs/:id",function(req,res){
  //To identify correct id of Db we use findById method
  Blog.findById(req.params.id,function(err,foundBlog){
     if(err){
       res.redirect("/blogs");
     }
     else{
       res.render("show",{blog: foundBlog})
     }
  });
});

//Edit Route
app.get("/blogs/:id/edit",function(req,res){
  Blog.findById(req.params.id,function(err,foundBlog){
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.render("edit",{blog: foundBlog})
    }
 });
});

//Update Route
app.put("/blogs/:id" ,function(req,res){
     //To update edited form use findByIdandUpdate method
     //Blog.findByIdAndUpdate(id, newData,callBack())
     req.body.blog.body = req.sanitize(req.body.blog.body)
     Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
         if(err){
           red.redirect("/blogs")
         }
         else{
           res.redirect("/blogs/" + req.params.id);
         }
     });
});
//Delete route
app.delete("/blogs/:id",function(req,res){
  //Destroy blog
  Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
          res.redirect("/blogs");
        }
        else{
          res.redirect("/blogs");
        }
  });
});



  //Server of Express listining 
app.listen(3000,function(){
    console.log("BlogApp is started");
});