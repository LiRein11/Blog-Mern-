import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import { registerValidation, loginValidation, postCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, PostController } from './controllers/index.js';

mongoose
  .connect(
    'mongodb+srv://admin:qqwwee@cluster0.hexkx26.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  }, // Когда будет любой файл загружаться, эта функция вернет путь этого файла
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  }, // Перед сохранением файла эта функция объяснит, как этот файл будет называться
});

const upload = multer({ storage }); // Хранилище, спец функция, которая позволяет

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads')); // Для понимания, что ты делаешь не просто get запрос, а get запрос на получение файла (например статичного img)

// app.get('/', (req, res) => {
//   res.send('Hello world!');
// }); // Если в наше приложение придет запрос на главный путь, то выполняется команда. В req хранится то, что прислал клиент(приложение с фронтенда). В res объясняется, что будет передаваться клиенту. В этой переменной есть специальные методы, спец свойства, благодаря которым настраивается ответ клиенту.

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
}); // Запуск приложения (веб сервера). И объяснить, на какой порт прикрепить наше приложение node.js.
