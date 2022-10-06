import CommentModel from '../models/Comment.js';
import Post from '../models/Post.js';

export const createComment = async (req, res) => {
  try {
    const id = req.params.id;

    const doc = new CommentModel({
      text: req.body.text,
      post: id,
      user: req.userId,
    });

    await doc.save();

    const postRelated = await Post.findById(id);

    postRelated.comments.push(doc);

    await postRelated.save(function (err) {
      if (err) {
        console.log(err);
      }
      res.json('success');
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать комментарий',
    });
  }
};

// export const removeComment = async (req, res) => {
//   try {
//     const commentId = req.params.id;

//     await CommentModel.find(
//       {
//         _id: commentId,
//       },
//       (err, doc) => {
//         if (err) {
//           console.log(err);
//           return res.status(500).json({
//             message: 'Не удалось удалить статью',
//           });
//         }

//         if (!doc) {
//           return res.status(404).json({
//             message: 'Статья не найдена',
//           });
//         }

//         res.json({
//           doc,
//         });
//       },
//     );
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: 'Не удалось получить статьи',
//     });
//   }
// };

export const getOneComment = async (req, res) => {
  try {
    const commentId = req.params.id;

       CommentModel.findOne(
      {
        _id: commentId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось вернуть статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json(doc);
      },
    ) // Это всё делается потому что статья может вернутся только если есть просмотр, и поэтому мы перед возвратом добавляем просмотр и потом возвращаем статью
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getCommentsByPost = async (req, res) => {
  try {
    // const posts = await PostModel.find().populate('user').exec();

    const id = req.params.id;

    // const post = PostModel.find({id}).populate('comments')

    const comments = await CommentModel.find({ post: id }).populate('user');

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await CommentModel.find().populate('user');

    // const ab = comments.map((obj) => obj.post);

    res.json(comments);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};
