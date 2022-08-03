const express = require('express');
const cors = require('cors');
const AuthorData = require('./src/model/AuthorModel');
const BookData = require('./src/model/BookModel');
const UserData = require('./src/model/UserModel');
const bodyparser=require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path'); 


var app = new express();
app.use(cors());
app.use(bodyparser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./dist/frontend'));


function verifyToken(req, res, next) {
    if(!req.headers.authorization) {
      return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split(' ')[1]
    if(token === 'null') {
      return res.status(401).send('Unauthorized request')    
    }
    let payload = jwt.verify(token, 'secretKey')
    if(!payload) {
      return res.status(401).send('Unauthorized request')    
    }
    req.userId = payload.subject
    next()
  }

app.post("/api/adduser",function(req,res){    
    var newuser = {
        uid:req.body.email,
        pwd:req.body.pwd
    };    
    console.log(newuser);
    //-----------
    UserData.find({"uid":newuser.uid}, function(err,docs){
        if(docs.length){           
            console.log("User exists");
            res.json({status: "User Email already registered"});
        }
        else{
            const user = new UserData(newuser);   
            user.save();
            res.json({status: "Success"});                    
        }         
    });      
})

app.post('/api/login', (req, res) => {
    let userData = req.body    
    console.log(userData)
        // console.log(userData.email)
        // console.log(userData.pwd) 
    UserData.findOne({"uid": userData.email}, function(err, user){       
        // In case the user not found   
        if(err) {
          console.log('LOGIN ERROR RESPONSE')
          res.json(err)
        } 
        if (user && user.pwd === req.body.pwd){
          console.log('User and password is correct')
          
          let payload = {subject: user.uid+user.pwd}
          let token = jwt.sign(payload, 'secretKey')
          console.log(token);

          res.json({status: "Login Success",pass:token});
        } else {
          console.log("Credentials wrong");
          res.json({status: "Login invalid"});
        }
    });              
     
   })

app.post('/api/add',verifyToken,function (req, res) {

    var item={
        title:req.body.title,
        author:req.body.author,
        image:req.body.image,
        about:req.body.about
    }
    console.log(item)  ;
    const book = new BookData(item);
    book.save();    

})

app.put('/api/update',(req,res)=>{    
    console.log(req.body.title)
    id=req.body._id,
    title= req.body.title,
    author = req.body.author,
    image = req.body.image,
    about = req.body.about
    
   BookData.findByIdAndUpdate({"_id":id},
                                {$set:{"title":title,
                                "author":author,
                                "image":image,
                                "about":about}})
   .then(function(){
       res.send();
   })
 })

 app.delete('/api/remove/:id',(req,res)=>{   
    id = req.params.id;
    BookData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })

app.get('/api/books',verifyToken,function(req,res){
    res.header("Access-Control-Allow-origin","*");
    res.header("Access-Control-Allow-Methods:GET, POST, PATCH, PUT, DELETE, OPTIONS"); 
    BookData.find()
                .then(function(booklist){
                    res.send(booklist);
                });
});

app.get('/api/authors',verifyToken,function(req,res){
    res.header("Access-Control-Allow-origin","*");
    res.header("Access-Control-Allow-Methods:GET, POST, PATCH, PUT, DELETE, OPTIONS"); 
    AuthorData.find()
                .then(function(author){
                    res.send(author);
                });
});

app.get('/api/:id',verifyToken,function(req,res){
    const id = req.params.id;

    BookData.findOne({_id: id})
      .then((book)=>{
          res.send(book);
      });    
});

app.get('/*', function(req, res) { 
  res.sendFile(path.join(__dirname+'/dist/frontend/index.html'));
 }); 

app.listen(8080, function(){
    console.log('listening to port 8080');
});

