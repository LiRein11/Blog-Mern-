import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10); // Алгоритм шифрования нашего пароля
    const hash = await bcrypt.hash(password, salt); // Зашифрованный пароль

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save(); // Сохраняем документ в БД

    const token = jwt.sign(
      {
        _id: user._id, // Хватит только id, чтобы работать с пользователем
      },
      'secret123', // Ключ, благодаря которому шифруется токен
      {
        expiresIn: '30d', // Срок жизни токена
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
  
};// Если придет запрос на auth/register, то мы проверим, есть ли в этом пути то, что мы хотим (второй аргумент это нам позволяет), если есть, то только в этом случае выполняй третью часть(сам запрос (функцию))

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); // Если пользователь нашелся в БД, то проверка его пароля на сходство с паролем, который он прислал

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id, // Хватит только id, чтобы работать с пользователем
      },
      'secret123', // Ключ, благодаря которому шифруется токен
      {
        expiresIn: '30d', // Срок жизни токена
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }
    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};
