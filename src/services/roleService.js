const {  Role } = require('../models');

exports.createRole = async ({ role_name }) => {
  const newRole = await Role.create({ role_name });
  return newRole;
};

exports.getAllRoles = async () => {
  const roles = await Role.findAll();
  return roles;
};

exports.getRoleById = async (id) => {
    const role = await Role.findOne({ where: { id } }); 
    return role;

};

exports.updateRole = async (id, { role_name }) => {
  const role = await Role.findByPk(id);
  if (!role) return null;
  role.role_name = role_name || role.role_name;
  await role.save();
  return role;
};

exports.deleteRole = async (id) => {
  const role = await Role.findByPk(id);
  if (!role) return null;
  await role.destroy();
  return role;
};
