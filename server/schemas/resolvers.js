//mostly from mini project 21
const { AuthenticationError } = require('apollo-server-express');
const { User, Book } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, args, context) => {
        if(context.user){
          const userData = await User.findOne({ _id: context.user._id});

          return userData;
        }
        throw new AuthenticationError('NotLogged In')
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
      saveBook: async (parent, { bookData }, context) => {
        if (context.user) {
          const userUpdate = await User.findOneAndUpdate(
           {_id: context.user._id},
           { $push: { savedBooks: bookData} },
           {new: true}
          );
  
          return userUpdate;
        }
        throw new AuthenticationError('You need to be logged in!');
      },

      removeBook: async (parent, { bookId }, context) => {
        if (context.user) {
          const userUpdate = await User.findOneAndUpdate(
            {_id: context.user._id},
            { $pull: { savedBooks: bookId} },
            {new: true}
           );
   
           return userUpdate;
        }
        throw new AuthenticationError('You need to be logged in!');
      },
  }
}

module.exports = resolvers;