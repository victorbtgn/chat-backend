const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        min: 3,
    }
});

let db = model('User', userSchema);

async function createUser(user) {
    return await db.create(user);
};

module.exports = { createUser };
