import Comment from '../models/Comment.js';
import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().limit(10).exec();

    const tags = posts
      .map((obj) => obj.tags)
      .flat()
      .slice(0, 10);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec(); // populate.exec нужно для того, чтобы получить связь с пользователем (чтобы был не просто его id, а все его данные)

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getPostsByTag = async (req, res) => {
  try {
    // const posts = await PostModel.find().populate('user').exec(); // populate.exec нужно для того, чтобы получить связь с пользователем (чтобы был не просто его id, а все его данные)

    // const tagName = req.params.tags;
    const tagName = req.params.tag;

    PostModel.find(
      {
        tags: tagName,
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

        // doc.map((obj, i) => {
        //  { $inc: {obj.viewsCount : 1}};
        // });
        res.json(doc);
      },
    ).populate('user');

    // const postsByTag = posts.map((obj) => {
    //   if (obj.tags.includes('timestamps')) {
    //     return obj;
    //   }
    // });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getCommentsByPost = async (req, res) => {
  // try {
  //   // const posts = await PostModel.find().populate('user').exec(); // populate.exec нужно для того, чтобы получить связь с пользователем (чтобы был не просто его id, а все его данные)

  //   // const tagName = req.params.tags;
  //   const id = req.params.id;

  //   Comment.find(
  //     {
  //       post: id,
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
  //           message: 'Статья не найдена',
  //         });
  //       }

  //       // doc.map((obj, i) => {
  //       //  { $inc: {obj.viewsCount : 1}};
  //       // });
  //       res.json(doc);
  //     },
  //   );

  //   // const postsByTag = posts.map((obj) => {
  //   //   if (obj.tags.includes('timestamps')) {
  //   //     return obj;
  //   //   }
  //   // });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({
  //     message: 'Не удалось получить статьи',
  //   });
  // }

  try {
    // const posts = await PostModel.find().populate('user').exec();

    const id = req.params.id;

    const post = await PostModel.find().populate('comments');

    const comments = await Comment.find(id);

    if (id === comments.post){
      res.json(comments)
    }

    // res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getAllByDate = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec(); // populate.exec нужно для того, чтобы получить связь с пользователем (чтобы был не просто его id, а все его данные)

    const postsDate = posts.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    res.json(postsDate);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getAllByViews = async (req, res) => {
  try {
    const posts = await PostModel.find().populate('user').exec(); // populate.exec нужно для того, чтобы получить связь с пользователем (чтобы был не просто его id, а все его данные)

    const postsViews = posts.sort((a, b) => {
      return b.viewsCount - a.viewsCount;
    });

    res.json(postsViews);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
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
    ).populate('user'); // Это всё делается потому что статья может вернутся только если есть просмотр, и поэтому мы перед возвратом добавляем просмотр и потом возвращаем статью
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

// export const createComment = async (req, res) => {
//   try {
//     const postId = req.params.id;

//     PostModel.findOneAndUpdate(
//       {
//         _id: postId,
//       },
//       {
//         comments: req.body.comments,
//       },
//     );

//     res.json({
//       success: true,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: 'Не удалось обновить статью',
//     });
//   }
// };

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: 'Не удалось удалить статью',
          });
        }

        if (!doc) {
          return res.status(404).json({
            message: 'Статья не найдена',
          });
        }

        res.json({
          success: true,
        });
      },
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить статьи',
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось создать статью',
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    await PostModel.updateOne(
      {
        _id: postId,
      },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(','),
        user: req.userId,
      },
    );
    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить статью',
    });
  }
};
