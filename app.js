let express=require('express');
let mongoose=require('mongoose');
let ejs=require('ejs');
let _=require('lodash')
let uploads=require('express-fileupload');
let app=express();
let port=process.env.PORT||8000;

app.set('view engine','ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(uploads());

let arr=[];
let match="";
let b="";

//   const uri="mongodb+srv://santhosh:1234@cluster0.xq2wt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect( 'mongodb://localhost:27017/bookDB');

mongoose.connection.on('connected',()=>{
    console.log("mongoDb connected");
});

let picSchema={
    bname:String,
    price:Number,
    name:String,
    num:Number,
    email:String,
   
    filename:[String],
   
}

let regSchema={
    name:String,
    pswd:String,
    cpswd:String
}

let regmodel=mongoose.model('reg',regSchema);
let picmodel= mongoose.model('pic',picSchema);

app.get('/',(req,res)=>{
    res.render('login');
});

app.get('/register',(req,res)=>{
    res.render('register')
})

app.get('/iregister',(req,res)=>{
    res.render('iregister')
})

app.get('/ilogin',(req,res)=>{
    res.render('ilogin');
})

app.get('/compose',(req,res)=>{
res.render('form');
});

app.get('/index',(req,res)=>{

    picmodel.find({},(err,found)=>{
        if(!err){
            res.render('index',{datas:found})
        }else{
            console.log(err);
        }
    })
    
});

app.get('/new/:topic',(req,res)=>{
     const name1 =req.params.topic

    picmodel.findOne({"bname":name1},(err,found)=>{
        if(!err){
            res.render('data',{data:found});
        }else{
            console.log(err);
        }
    })
})

app.get('/data',(req,res)=>{
    res.render('data');
});

app.get('/admin',(req,res)=>{
    picmodel.find({},(err,found)=>{
        if(!err){
            res.render('admin',{datas:found})
        }else{
            console.log(err);
        }
    })
})

app.get('/adminreg',(req,res)=>{
    res.render('adminreg');
});

app.get('/invalid',(req,res)=>{
    res.render('invalid');
});

app.post('/',(req,res)=>{
    let name=req.body.name;
    let pass=req.body.pswd;

    regmodel.findOne({"name":name},(err,found)=>{
        if((found.name==name)&&(found.pswd==pass)){
            res.redirect('/index');
        }else{
            res.redirect('/ilogin');
        }
    })

});

app.post('/register',(req,res)=>{
     regname=req.body.name;
     pswd=req.body.pswd;
     cpswd=req.body.cpswd;

     if(pswd==cpswd){

   let regdocs=new regmodel({
       name:regname,
       pswd:pswd,
       cpswd:cpswd
       
   }) ;

   regdocs.save();
   res.redirect('/');
}else{
    res.redirect('/iregister')
}

   

   
})


app.post('/adminreg',(req,res)=>{
    let email=req.body.email;
    let pass=req.body.pass;
    if((email=="santhosh@gmail.com")&&(pass=="211260")){
        res.redirect('/admin');
    }else{
        res.redirect('/adminreg');
    }
})

app.post('/compose',(req,res)=>{
    let bname=req.body.name1;
   let price=req.body.price;
   let name=req.body.name2;
   let num=req.body.num;
   let email=req.body.email;
   let file=req.files.img;
   if(file.name){
     res.redirect('/invalid#book-pic');
   }else{
        for (var i=0;i<file.length;i++){
           b=file[i].name
             arr.push(b);
        }
     
        
        for(var i=0;i<file.length;i++){
          
            
            file[i].mv('./public/uploads/'+file[i].name,(err)=>{
                if(err){
                   console.log(err);
                }
            })
            console.log("uploaded sucessfully");
        }
       
    
    

    let picdocs=new picmodel({
       bname:bname,
       price:price,
       name:name,
       num:num,
       email:email,
       filename:arr
    });
    
            picdocs.save();

            arr=[];

    res.redirect('/index#books');
   }
});

app.post('/delete',(req,res)=>{
    let dele=req.body.checkbox;
    picmodel.findByIdAndDelete(dele,(err)=>{
        if(!err){
            console.log("deleted sucessfully");
            res.redirect('/admin');
        }else{
            console.log(err);
        }
    })
    })

app.listen(port,(res)=>{
    console.log(`the server runs on ${port}`);
})