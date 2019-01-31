var http=require('http');
var fs=require('fs');
var server = http.createServer().listen(4300);

var express=require('express');
var app=express();
var appServer=http.Server(app);

var mongo=require('mongojs');
var db=mongo('bloodbank',['users']);

var bodyParser=require('body-parser');

var moment = require("moment");

var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
appServer.listen(4287);

console.log("running")
//APIS

app.post('/api/signup/',function(req, res){
    console.log('data', req.body)
    try{
        var data = req.body;
        var email = data.email;
        db.users.find({"email": email }, function(err, doc){
            if(err){
                res.json({"status": "0", "error": err});
            }
            else if(doc.length > 0){                
                res.json({"status": "0", "error": "Duplicate!", "user": doc[0]});
            }
            else{
                data['createddate'] = moment().toDate();
                db.users.save(data, function (err, saved) {
                    if (err || !saved) {
                        res.json({"status": "0", "error":err});
                    } 
                    else {
                        res.json({"status": "1", "error":"", "user_id": saved._id});
                    }
                });
            }
        });
    }catch(error){
        res.json({"status":"0", "error": 'Exception: '+error}) 
    }
});

app.post('/api/login/', function(req, res){
    try{
        var data = req.body;
        var email = data.email;
        var password = data.password;
    
        var time = Date.now();
       
       
      
        db.users.findOne({"email":email, "password":password},
            {
                _id:1,
                name:1,
                email:1,
                bloodGroup:1,
                location:1,
                phone:1,
                password:1,
                group:1,
                
            },function(err, user){
                if(err){
                    res.json({"status":"0", "error":err})
                }else if(!user){
                    res.json({"status":"2", "error":"user does not exist..."})
                }else if(user.password != password){
                    res.json({"status":"3", "error":"password mismatch..."})
                }else{
                    res.json({"status":"1", "error":"Success"})
                }
            }
        );
    }catch(error){
        res.json({"status":"0", "error": 'Exception: '+error}) 
    }
});

app.get('/api/getuserdatas/', function(req, res){
    try{
    
        var userDatas=[];
      
        db.users.find().forEach(function(err, user){
                if(err){
                    res.json({"status":"0", "error":err})
                }else if(!user){
                    res.json({"status":"1", "error":"Success","data":userDatas})
                }else{
                    userDatas.push(user)
                }
            }
        );
    }catch(error){
        res.json({"status":"0", "error": 'Exception: '+error}) 
    }
});

app.get('/api/getbloodgroups/', function(req, res){
    try{
    
        var userDatas=[];
      
        db.users.find().forEach(function(err, user){
                if(err){
                    res.json({"status":"0", "error":err})
                }else if(!user){
                    res.json({"status":"1", "error":"Success","data":userDatas})
                }else{
                    userDatas.push(user.bloodGroup)
                }
            }
        );
    }catch(error){
        res.json({"status":"0", "error": 'Exception: '+error}) 
    }
});




