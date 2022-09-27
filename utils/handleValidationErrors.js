import { validationResult } from 'express-validator';

export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array());
  } // Если ошибки не пустые (они есть), тогда мы возвращаем ответ (400 - неверный запрос). Вернутся все ошибки, которые не провалидировались

  next();
}; // Парсинг для валидационных ошибок
