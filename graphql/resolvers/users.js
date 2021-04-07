const script = require('bcryptjs')
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server')

const { validateRegisterInput, validateLoginInput } = require('../../utils/validators')
const { SECRET_TOKEN } = require('../../config');
const User = require('../../models/User');

// function generalToken(user){
//   jwt.sign (
//   {
//     id: user.id,
//     email: user.email,
//     username: user.username,
//   }, SECRET_TOKEN, { expiresIn: '1h'});
// }

module.exports = {
  Mutation: {
    async login(_, { username, password}){
      const { errors, valid } = validateLoginInput(username, password);

      if(!valid){
        throw new UserInputError('Kesalahan pengguna', { errors });
      }

      const user = await User.findOne({ username });

      if(!user){
        errors.general = 'User tidak ditemukan';
        throw new UserInputError('Kesalahan pengguna', { errors });
      }

      const match = await script.compare(password, user.password);
      if(!match){
        errors.general = 'Password salah';
        throw new UserInputError('Kesalahan pengguna', { errors });
      }

      const token = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username
      }, SECRET_TOKEN, {expiresIn: '1h'});

      return {
        ...user._doc,
        id: user._id,
        token
      }
    },
    async register (_, 
      { 
        registerInput: { username, email, password, confirmPassword }
      }){

      const { valid, errors } = validateRegisterInput( username, email, password, confirmPassword );
      if(!valid){
        throw new UserInputError('Errors', { errors });
      }
      
      const user = await User.findOne({ username });
      if(user){
        throw new UserInputError('Username sudah digunakan', {
          errors: {
            username: 'Username ini sudah digunakan oleh seseorang'
          }
        })
      }
      
      password = await script.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString()
      });

      const res = await newUser.save();

      const token = jwt.sign({
        id: res.id,
        email: res.email,
        username: res.username
      }, SECRET_TOKEN, {expiresIn: '1h'});

      return {
        ...res._doc,
        id: res._id,
        token
      }
    }
  }
};