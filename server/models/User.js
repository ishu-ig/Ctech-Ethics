const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Full Name is Mandatory"]
    },
    username: {
        type: String,
        unique: true,
        required: [true, "User Name is Mandatory"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email Address is Mandatory"]
    },
    phone: {
        type: String,
        required: [true, "Phone Number is Mandatory"]
    },
    password: {
        type: String,
        required: [true, "Password is Mandatory"]
    },
    role: {
        type: String,
        enum: ["Super Admin", "Admin", "Buyer"], // Note: "Buyer" was referenced in login, so I added it here.
        default: "Admin"
    },
    address: {
        type: String,
        default: ""
    },
    pin: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: "-234567"
    },
    pic: {
        type: String,
        default: ""
    },
    active: {
        type: Boolean,
        default: true
    },
    resume: {
        type: String // Fixed from "String" to String object
    }
});

const User = new mongoose.model("User", UserSchema);
module.exports = User;