const User = require('./users.model');


const registerUserController = async (req, res, next) => {
    try {
        const { body } = req;
        const user = await User.createUser(body);
        if(!user) {
            res.status(400).json({ message: 'Some error.' });
            return;
        };
        res.status(201).json({
            id: user._id,
            name: user.name,
        });
    } catch (error) {
        console.log('reg err: ', error);
        res.status(400).json({ message: 'Some error.' });
        next(error);
    }
};

module.exports = { registerUserController };
