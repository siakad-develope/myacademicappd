const userModel = require ('../models/Users');



const createUser = async (req, res) => {
    const { name, email, password, status = true, role_id = 0 } = req.body; // Default role_id to 0 if not provided

    try {
        const newUser = await userModel.create({
            name,
            email,
            password,
            status,
            role_id 
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const assignRoleToUser = async (req, res) => {
    const { roleId, userId } = req.body; 

    try {
        const user = await userModel.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const [updated] = await userModel.update(
            { role_id: roleId }, 
            { where: { id: userId } } 
        );

        if (updated) {
            return res.status(200).json({ message: 'Role assigned successfully' });
        } else {
            return res.status(404).json({ message: 'Role update failed' });
        }
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ error: error.message });
    }
};
// Controller to handle fetching all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await userModel.findByPk(userId);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;

    try {
        const [updated] = await userModel.update(updates, {
            where: { id: userId }
        });
        if (updated) {
            const updatedUser = await userModel.findByPk(userId);
            res.status(200).json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const deleted = await userModel.destroy({
            where: { id: userId }
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createUser,
    assignRoleToUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};
