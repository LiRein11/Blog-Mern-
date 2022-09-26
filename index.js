import express from 'express';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import checkAuth from './utils/checkAuth.js';

import { register, login, getMe } from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';

mongoose
  .connect(
    'mongodb+srv://admin:qqwwee@cluster0.hexkx26.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello world!');
// }); // Если в наше приложение придет запрос на главный путь, то выполняется команда. В req хранится то, что прислал клиент(приложение с фронтенда). В res объясняется, что будет передаваться клиенту. В этой переменной есть специальные методы, спец свойства, благодаря которым настраивается ответ клиенту.

app.post('/auth/login', loginValidation, login);
app.post('/auth/register', registerValidation, register);
app.get('/auth/me', checkAuth, getMe);

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne); 
app.post('/posts',checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id',checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
}); // Запуск приложения (веб сервера). И объяснить, на какой порт прикрепить наше приложение node.js.
