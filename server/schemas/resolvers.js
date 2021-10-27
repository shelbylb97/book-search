//mostly from mini project 21
const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    users: async () => {
        return User.find().populate('books');
      },

    user: async (parent, { username }) => {
        return User.findOne({ username }).populate('books');
      },

    books: async (parent, { username }) => {
        const params = username ? { username } : {};
        return Book.find(params).sort({ createdAt: -1 });
      },

    book: async (parent, { bookId }) => {
        return Book.findOne({ _id: bookId });
      },
    },


Mutation: {

   addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
        const user = await User.findOne({ email });
  
        if (!user) {
          throw new AuthenticationError('No user found with this email address');
        }
  
        const correctPw = await user.isCorrectPassword(password);
  
        if (!correctPw) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        const token = signToken(user);
  
        return { token, user };
      },

//taken from activity 26 dont know how to write it 
      saveBook: async (parent, { bookId }, context) => {
        if (context.user) {
          const book = await Book.create({
            bookText,
            bookAuthor: context.user.username,
          });
  
          await User.findOneAndUpdate(
            { _id: context.user._id },
            { $addToSet: { books: book._id } }
          );
  
          return book;
        }
        throw new AuthenticationError('You need to be logged in!');
      },

      removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
          const thought = await Thought.findOneAndDelete({
            _id: bookId,
            thoughtAuthor: context.user.username,
          });
  
          await User.findOneAndUpdate(
            { _id: context.user._id },
            { $pull: { thoughts: book._id } }
          );
  
          return book;
        }
        throw new AuthenticationError('You need to be logged in!');
      },
  },
};

module.exports = resolvers;