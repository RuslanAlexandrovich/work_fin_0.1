const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const bodyParser = require('body-parser');
const jwt = require("jsonwebtoken");
const env = require("dotenv");  
const cors = require('cors');
const {OAuth2Client} = require('google-auth-library');
// import {base64ToBytes } from ;
env.config();
const TOKEN = process.env.TOKEN_SECRET;
const CLIENT_ID = process.env.CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors()); // Использование пакета cors для разрешения запросов из разных источников
app.set("views", "./views");
app.set("view engine", "pug");
// Middleware для обработки данных из формы
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//

// Массив для хранения новостей
const newsArray = [
  {id: 0,
  title: "Sport",
content: "Sport - my life!",
tags: ["sport", "health"],
username: "Ruslan",
date: new Date().toLocaleDateString(),
  },
  {id: 1,
    title: "Health",
  content: "This text about health!",
  tags: ["tennis", "football"],
  username: "Egor",
  date: new Date().toLocaleDateString(),
    }
];

// Обработчик POST-запроса для сохранения новости
app.post('/news', (req, res) => {
  const { title, content, tags, username } = req.body;
  newsArray.sort((a, b)=>a.id - b.id);
  const id= newsArray.length ===0 ? 0 : newsArray[newsArray.length-1].id+1;
  const news = {
    id: id,
    title: title,
    content: content,
    username: username,
    tags: tags,
    date: new Date().toLocaleDateString(),
  };
  console.log(news);
  newsArray.push(news);
  res.json(news)
});
app.post("/login",async (req, res)=>{

   const jwtToken = req.body.credentials;
   const username  = await verify(jwtToken).catch(console.error);
   res.json({username: username});
});
app.put("/news/:id", (req, res)=>{
  const id= req.params.id;
  const { title, content, tags, username} = req.body;

  const news = {
    id: id,
    title: title,
    content: content,
    username: username,
    tags: tags,
    date: new Date().toLocaleDateString(),
  };
  newsArray[id] = news;
  res.json(news)
});

app.get("/news/:id/edit", (req, res)=>{
  const id= req.params.id;
  const selectedNews = newsArray[id];
    console.log(selectedNews);
    res.render("edit", selectedNews);
});


app.get('/news/:id', (req, res) => {
// запрос на вывод в newsRead
  const id=req.params.id;
    const selectedNews = newsArray[id];
console.log("COOKIES"+req.cookies);
    let currentUser;
    if(req.cookies && req.cookies.username){
      currentUser= req.cookies.username;
      currentUser = decodeURIComponent(currentUser);
      currentUser = new TextDecoder().decode(base64ToBytes(currentUser));
      console.log("CURENTUSER _ Last!: "+currentUser);
    }
   
    const canEdit = currentUser && (currentUser === selectedNews.username);
    
    let data = {
      title: selectedNews.title,
      id: selectedNews.id,
      date: selectedNews.date,
      username: selectedNews.username,
      tags: selectedNews.tags,
      canedit: canEdit,
      content: selectedNews.content
    }
    console.log(data);
    res.render("news", data);
});

app.delete('/news/:id', (req, res) => {
  const id= req.params.id;
  console.log(id);
  const deletedNews = newsArray.splice(id, 1);
  //обработать возможный 0 записей
  res.json(deletedNews[0]);
});

// Обработчик GET-запроса для получения всех новостей
app.get('/news', (req, res) => {
  res.json(newsArray);
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});


// function  generateToken(token, username){
//   return jwt.sign({username: username}, token, {expiresIn: '1800s'});
// }

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  const useremail = payload['email'];
  const username = payload['name'];
  return username;
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
}
function base64ToBytes(base64) {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}



