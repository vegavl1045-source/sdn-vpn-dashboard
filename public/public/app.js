let data={users:[],servers:[],configs:[],notices:[]};
function login(){
  const e=document.getElementById("email").value, p=document.getElementById("pass").value;
  if(e==="admin@sdnvpn.com" && p==="admin123"){
    localStorage.setItem("sdn_admin","yes"); document.getElementById("login").classList.add("hidden"); document.getElementById("app").classList.remove("hidden"); load();
  } else alert("Wrong login");
}
function logout(){localStorage.removeItem("sdn_admin");location.reload()}
function show(id){document.querySelectorAll(".page").forEach(p=>p.classList.add("hidden"));document.getElementById(id).classList.remove("hidden")}
async function load(){data=await (await fetch("/api/data")).json();render()}
function render(){
  uCount.innerText=data.users.length;sCount.innerText=data.servers.length;cCount.innerText=data.configs.length;
  userRows.innerHTML=data.users.map(u=>`<tr><td>${u.name}</td><td>${u.email}</td><td>${u.plan}</td><td>${u.expiry}</td><td>${u.status}</td><td><button onclick="delUser('${u.id}')">Delete</button></td></tr>`).join("");
  serverRows.innerHTML=data.servers.map(s=>`<tr><td>${s.id}</td><td>${s.name}</td><td>${s.country}</td><td>${s.ip}</td><td>${s.status}</td><td>${s.ping}</td><td><button onclick="delServer('${s.id}')">Delete</button></td></tr>`).join("");
  configList.innerHTML=data.configs.map(c=>`<div class="card"><b>${c.name}</b><pre>${c.config}</pre></div>`).join("");
  noticeList.innerHTML=data.notices.map(n=>`<div class="card"><b>${n.title}</b><p>${n.message}</p></div>`).join("");
}
async function addUser(){await fetch("/api/users",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:uname.value,email:uemail.value,plan:uplan.value,expiry:uexpiry.value,status:"Active",traffic:"0 GB"})});load()}
async function delUser(id){await fetch("/api/users/"+id,{method:"DELETE"});load()}
async function addServer(){await fetch("/api/servers",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:sid.value,name:sname.value,country:scountry.value,ip:sip.value,status:"Online",ping:"--"})});load()}
async function delServer(id){await fetch("/api/servers/"+id,{method:"DELETE"});load()}
async function addConfig(){await fetch("/api/configs",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:"WireGuard Config "+new Date().toLocaleString(),config:cfg.value})});cfg.value="";load()}
async function sendNotice(){await fetch("/api/notices",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:ntitle.value,message:nmsg.value})});ntitle.value="";nmsg.value="";load()}
if(localStorage.getItem("sdn_admin")==="yes"){login.className;document.getElementById("login").classList.add("hidden");document.getElementById("app").classList.remove("hidden");load();}
