// const { AuthenticationError, UserInputError } = require('apollo-server');

// const Post = require('../../models/Post');
// const checkAuth = require('../../utils/check-auth');

// module.exports = {
//   Mutation: {
//     createComment: async (_, { postId, body }, context ) => {
//       const { username } = checkAuth(context);
//       if(body.trim() === ''){
//         throw new UserInputError('Comment tidak boleh kosong', {
//           errors: {
//             body: 'Comment tidak boleh kosong'
//           }
//         });
//       }
//       const post = await Post.findById(postId);
//       if(post){
//         post.comments.unshift({
//           body,
//           username,
//           createdAt: new Date().toISOString()
//         });
//         await post.save();
//         return post;
//       } else throw new UserInputError('Post tidak ditemukan')
//     }
//   },
//   async deleteComment(_, { postId, commentId }, context){
//     const { username } = checkAuth(context);

//     const post = await Post.findById(postId);

//     if(post){
//       const commentIndex = post.comments.findIndex((c) => c.id === commentId);

//       if(post.comments[commentIndex].username === username){
//         post.comments.splice(commentIndex, 1);
//         await post.save();
//         return post;
//       } else {
//         throw new AuthenticationError('Tidak diizinkan')
//       }
//     } else {
//       throw new UserInputError('Post tidak ditemukan')
//     }
//   }
// };

const { AuthenticationError, UserInputError } = require('apollo-server');

const checkAuth = require('../../utils/check-auth');
const Post = require('../../models/Post');

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {
      const { username } = checkAuth(context);
      if (body.trim() === '') {
        throw new UserInputError('Empty comment', {
          errors: {
            body: 'Comment body must not empty'
          }
        });
      }

      const post = await Post.findById(postId);

      if (post) {
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString()
        });
        await post.save();
        return post;
      } else throw new UserInputError('Post not found');
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);

        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } else {
        throw new UserInputError('Post not found');
      }
    }
  }
};