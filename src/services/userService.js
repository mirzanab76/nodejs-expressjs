const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');

exports.createUser = async ({ username, email, password, name, address, age, picture, role_id  }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ 
    username, email, password: hashedPassword, name, address, age, picture, role_id 
  });
  return newUser;
};

exports.getAllUsers = async () => {
  const users = await User.findAll({
    include: [{
      model: Role,
      as: 'role',
      attributes: ['role_name'] 
    }]
  });
  return users;
};

exports.getUserById = async (id) => {
  return User.findByPk(id, {
    include: [{
      model: Role,
      as: 'role',
      attributes: ['id', 'role_name']
    }]
  });
};

exports.updateUser = async (id, { username, email, password, name, address, age, picture, role_id }) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  user.username = username || user.username;
  user.email = email || user.email;
  user.password = password || user.password;
  user.name = name || user.name;
  user.address = address || user.address;
  user.age = age || user.age;
  user.picture = picture || user.picture;
  user.role_id = role_id || user.role_id;
  await user.save();
  return user;
};

exports.deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return user;
};
