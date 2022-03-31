const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUserById,
    deleteUserById
} = require('../../../controller/userController');

router.route('/')
    .post(createUser)
    .get(getAllUsers);

router.route('/:userId')
    .get(getUserById)
    .put(updateUserById)
    .delete(deleteUserById);

module.exports = router;
