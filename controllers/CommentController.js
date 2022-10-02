import CommentModel from '../models/Comment.js';

export const createComment = async (req, res) => {
  try {
    const doc = new CommentModel({
      comment: req.body.comment,
      user: req.userId,
    });

    const comm = await doc.save();

    res.json(comm);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать комментарий',
    });
  }
};

export const getAllComments = async (req, res) => {

    try {
      const comments = await CommentModel.find().populate('user').exec(); // populate.exec нужно для того, чтобы получить связь с пользователем (чтобы был не просто его id, а все его данные)

      res.json(comments);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить статьи',
      });
    }
  // try {
  //   const postId = req.params.id;

  //   CommentModel.find(
  //     {
  //       _id: postId,
  //     },
  //     (err, doc) => {
  //       if (err) {
  //         console.log(err);
  //         return res.status(500).json({
  //           message: 'Не удалось вернуть статью',
  //         });
  //       }

  //       if (!doc) {
  //         return res.status(404).json({
  //           message: 'Комментарий не найдена',
  //         });
  //       }

  //       res.json(doc);
  //     },
  //   ).populate('user'); // Это всё делается потому что статья может вернутся только если есть просмотр, и поэтому мы перед возвратом добавляем просмотр и потом возвращаем статью
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({
  //     message: 'Не удалось получить статьи',
  //   });
  // }
};
