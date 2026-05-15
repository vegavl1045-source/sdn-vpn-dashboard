const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;
const DB = path.join(__dirname, "data.json");

app.use(cors());
app.use(express.json({limit:"10mb"}));
app.use(express.static(path.join(__dirname, "public")));

function load(){
  if(!fs.existsSync(DB)){
    const seed = {
      users:[
        {id:"1001",name:"Test User",email:"user@sdnvpn.com",status:"Active",plan:"Free",expiry:"2026-12-31",traffic:"1.2 GB"}
      ],
      servers:[
        {id:"DXB-1",name:"Dubai Fast Server",country:"UAE",ip:"1.2.3.4",status:"Online",ping:"22 ms"},
        {id:"SG-1",name:"Singapore Server",country:"Singapore",ip:"5.6.7.8",status:"Online",ping:"58 ms"}
      ],
      configs:[],
      notices:[{title:"Welcome to SDN VPN",message:"Dashboard is ready."}]
    };
    fs.writeFileSync(DB, JSON.stringify(seed,null,2));
  }
  return JSON.parse(fs.readFileSync(DB));
}
function save(data){ fs.writeFileSync(DB, JSON.stringify(data,null,2)); }

app.get("/api/data",(req,res)=>res.json(load()));

app.post("/api/users",(req,res)=>{
  const db=load(); db.users.push({...req.body,id:Date.now().toString()}); save(db); res.json({ok:true});
});
app.delete("/api/users/:id",(req,res)=>{
  const db=load(); db.users=db.users.filter(x=>x.id!==req.params.id); save(db); res.json({ok:true});
});
app.post("/api/servers",(req,res)=>{
  const db=load(); db.servers.push({...req.body,id:req.body.id||Date.now().toString()}); save(db); res.json({ok:true});
});
app.delete("/api/servers/:id",(req,res)=>{
  const db=load(); db.servers=db.servers.filter(x=>x.id!==req.params.id); save(db); res.json({ok:true});
});
app.post("/api/notices",(req,res)=>{
  const db=load(); db.notices.unshift(req.body); save(db); res.json({ok:true});
});
app.post("/api/configs",(req,res)=>{
  const db=load(); db.configs.push({...req.body,id:Date.now().toString()}); save(db); res.json({ok:true});
});

app.listen(PORT,()=>console.log(`SDN Admin Dashboard running: http://localhost:${PORT}`));