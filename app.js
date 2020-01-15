const express=require('express')
const app=express()
const path=require('path')
const bodyParser=require('body-parser')
const {exec}=require('child_process');
const fs=require('fs')

//html的引擎中间件
app.engine('html',require('express-art-template'))
//配置静态文件的中间件
app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(path.join(__dirname,'node_modules')))
//body-parser中间件的配置
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())
app.get('/',(req,res)=>{
    fs.readFile('./public/css/base.less',(err,data)=>{
        if(err){
            console.log(err);
            return 
        }
        let options={} 
        let aColor=data.toString().split(';')
        aColor.forEach((item,index)=>{
            if(/\n*\s*/gi.test(item) && item.replace(/\n*\s*/gi,'')){
                let arr=item.replace(/\n*\s*/gi,'').split(':')
                options[arr[0]]=arr[1]
            }
        })
        res.render('index.html',{
            'color':options['@primary-color']
        })
    })
    
})
app.post('/color',(req,res)=>{
    let {color}=req.body 
    /* 
    @primary-color:#b6cf4d;
@green-color:#378c2b;
@blue-color: #356ba8;
@yellow-color:#aa9f30;
@red-color:#8c2b3a;

    */
   let sColor=`@primary-color:${color};
   @green-color:spin(@primary-color,30);
   @blue-color:spin(@primary-color,120);
   @yellow-color:spin(@primary-color,210);
   @red-color:spin(@primary-color,300);
   `
    fs.writeFile('./public/css/base.less',sColor,(err,data)=>{
        if(err){
            console.log(err)
            res.json({
                err:-1,
                msg:`${err}`
            })
            return 
        }
        exec(`lessc ./public/css/style.less ./public/css/style.css`,(error,stdout,stderr)=>{
            if(error){
                console.log(`${error}`);
                return 
            }
            res.json({
                err:0,
                msg:'success'
            })
            //res.redirect('/')
        })
        
    })
})
app.listen(9000,()=>{
    console.log('server running now port:9000')
})