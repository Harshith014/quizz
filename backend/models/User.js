// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schema Definition
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Email is invalid'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
    },
    points: {
        type: Number,
        default: 0,
    },
    gamesPlayed: {
        type: Number,
        default: 0,
    },
    role: {
        type: String,
        enum: ['player', 'admin'],
        default: 'player',
    },
}, { timestamps: true });

// Password Hashing Middleware (Pre-save Hook)
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// Password Verification Method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Index on email for faster queries
UserSchema.index({ email: 1 });

const User = mongoose.model('User', UserSchema);
module.exports = User;
