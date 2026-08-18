const User = require("../models/User");
const cloudinary = require("../cloudinary");
const mailer = require("../mailer/index");
const { userWelcomeTemplate, userOtpTemplate } = require("../mailer/templates");
const passwordValidator = require('password-validator');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const schema = new passwordValidator();

// Add properties to it
schema
    .is().min(8)
    .is().max(100)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)
    .has().not().spaces()
    .is().not().oneOf(['Passw0rd', 'Password123']);

// Helper: extract Cloudinary public_id from URL
const getCloudinaryPublicId = (url) => {
    if (!url || !url.includes("cloudinary.com")) return null;
    try {
        const parts = url.split("/");
        const uploadIndex = parts.indexOf("upload");
        if (uploadIndex === -1) return null;
        const publicIdWithExt = parts.slice(uploadIndex + 2).join("/");
        return publicIdWithExt.replace(/\.[^/.]+$/, "");
    } catch {
        return null;
    }
};

// Helper: delete from Cloudinary
async function deleteFromCloudinary(url) {
    const publicId = getCloudinaryPublicId(url);
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (e) {
        console.error("Cloudinary Deletion Error:", e);
    }
}

async function createRecord(req, res) {
    try {
        let errorMessage = {};
        if (!req.body.name) errorMessage.name = "Full Name is Mandatory";
        if (!req.body.username) errorMessage.username = "User Name is Mandatory";
        if (!req.body.email) errorMessage.email = "Email Address is Mandatory";
        if (!req.body.phone) errorMessage.phone = "Phone Number is Mandatory";
        if (!req.body.password) errorMessage.password = "Password is Mandatory";

        if (Object.values(errorMessage).length > 0) {
            return res.status(400).send({ result: "Fail", reason: errorMessage });
        }

        if (!schema.validate(req.body.password)) {
            errorMessage.password = "Password Must Contain Minimum 8 Character, 1 Upper Case, 1 Lower Case, 1 Digit, No Space Allowed";
            return res.status(400).send({ result: "Fail", reason: errorMessage });
        }

        let data = new User(req.body);
        data.password = await bcrypt.hash(req.body.password, 12);

        if (req.files?.pic) {
            data.pic = req.files.pic[0].path;
        }
        if (req.files?.resume) {
            data.resume = req.files.resume[0].path;
        }

        await data.save();

        try {
            await mailer.sendMail({
                from: process.env.MAIL_SENDER,
                to: data.email,
                subject: `Welcome to ${process.env.SITE_NAME || "CTech Ethics"}!`,
                html: userWelcomeTemplate({
                    name: data.name,
                    username: data.username
                })
            });
            console.log(`Welcome email sent to ${data.email}`);
        } catch (e) {
            console.error("User welcome email failed:", e);
        }

        res.send({
            result: "Done",
            data
        });
    } catch (error) {
        if (req.files?.pic) {
            await deleteFromCloudinary(req.files.pic[0].path);
        }

        if (req.files?.resume) {
            await deleteFromCloudinary(req.files.resume[0].path);
        }

        let errorMessage = {};

        if (error.code === 11000) { // MongoDB duplicate key error code
            if (error.keyValue?.username) errorMessage.username = "User Name Already Exist";
            if (error.keyValue?.email) errorMessage.email = "Email Already Exist";
        }

        if (error.errors?.name) errorMessage.name = error.errors.name.message;
        if (error.errors?.username) errorMessage.username = error.errors.username.message;
        if (error.errors?.email) errorMessage.email = error.errors.email.message;
        if (error.errors?.phone) errorMessage.phone = error.errors.phone.message;
        if (error.errors?.password) errorMessage.password = error.errors.password.message;

        res.status(400).send({
            result: "Fail",
            reason: Object.keys(errorMessage).length ? errorMessage : "Validation Error"
        });
    }
}

async function getRecord(req, res) {
    try {
        let data = await User.find().sort({ _id: -1 });
        res.send({
            result: "Done",
            count: data.length,
            data: data
        });
    } catch (error) {
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        });
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id });
        if (data) {
            res.send({ result: "Done", data: data });
        } else {
            res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

async function updateRecord(req, res) {
    try {
        let data = await User.findById(req.params._id);

        if (!data) {
            return res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }

        data.name = req.body.name ?? data.name;
        data.username = req.body.username ?? data.username;
        data.email = req.body.email ?? data.email;
        data.phone = req.body.phone ?? data.phone;
        data.address = req.body.address ?? data.address;
        data.pin = req.body.pin ?? data.pin;
        data.city = req.body.city ?? data.city;
        data.state = req.body.state ?? data.state;
        data.active = req.body.active ?? data.active;

        if (req.files?.pic) {
            if (data.pic) await deleteFromCloudinary(data.pic);
            data.pic = req.files.pic[0].path;
        }

        if (req.files?.resume) {
            if (data.resume) await deleteFromCloudinary(data.resume);
            data.resume = req.files.resume[0].path;
        }

        await data.save();
        res.send({ result: "Done", data });

    } catch (error) {
        if (req.files?.pic) await deleteFromCloudinary(req.files.pic[0].path);
        if (req.files?.resume) await deleteFromCloudinary(req.files.resume[0].path);

        let errorMessage = {};
        if (error.code === 11000) {
            if (error.keyValue?.username) errorMessage.username = "User Name Already Exist";
            if (error.keyValue?.email) errorMessage.email = "Email Already Exist";
        }

        res.status(400).send({
            result: "Fail",
            reason: Object.keys(errorMessage).length ? errorMessage : "Internal Server Error"
        });
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await User.findOne({ _id: req.params._id });
        if (data) {
            await deleteFromCloudinary(data.pic);
            if (data.resume) await deleteFromCloudinary(data.resume); // Make sure to delete resume too!
            await data.deleteOne();
            res.send({ result: "Done", data: data });
        } else {
            res.status(404).send({ result: "Fail", reason: "Record Not Found" });
        }
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

async function login(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.username }
            ]
        });

        if (data && await bcrypt.compare(req.body.password, data.password)) {
            let key = data.role === "Admin" ? process.env.JWT_SECRET_KEY_ADMIN : process.env.JWT_SECRET_KEY_SUPERADMIN;
            jwt.sign({ data }, key, { expiresIn: "15 Days" }, (error, token) => {
                if (error) {
                    res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
                } else {
                    res.send({ result: "Done", data: data, token: token });
                }
            });
        } else {
            res.status(401).send({ result: "Fail", reason: "Invalid Username or Password" });
        }
    } catch (error) {
        res.status(500).send({ result: "Fail", reason: "Internal Server Error" });
    }
}

async function forgetPassword1(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username }
            ]
        })
        if (data) {
            let otp = Number(Number(Math.random().toString().slice(2, 8)).toString().padEnd(6, 1))
            data.otp = otp
            await data.save()

            try {
                await mailer.sendMail({
                    from: process.env.MAIL_SENDER,
                    to: data.email,
                    subject: `OTP for Password Reset - ${process.env.SITE_NAME || "CTech Ethics"}`,
                    html: userOtpTemplate({
                        name: data.name,
                        otp: data.otp
                    })
                });
                console.log(`Password reset OTP sent to ${data.email}`);
            } catch (mailErr) {
                console.error("Password reset OTP email failed:", mailErr);
            }
            res.send({
                result: "Done",
                message: "OTP Has Been Sent On Your Registered Email Address"
            })
        }
        else {
            res.status(404).send({
                result: "Fail",
                reason: "User Not Found"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword2(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username }
            ]
        })
        if (data) {
            if (data.otp == req.body.otp)
                res.send({
                    result: "Done"
                })
            else
                res.status(400).send({
                    result: "Fail",
                    reason: "Invalid OTP"
                })
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "UnAuthorized Activity"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

async function forgetPassword3(req, res) {
    try {
        let data = await User.findOne({
            $or: [
                { "username": req.body.username },
                { "email": req.body.username }
            ]
        })
        if (data) {
            if (schema.validate(req.body.password)) {
                bcrypt.hash(req.body.password, 12, async (error, hash) => {
                    if (error) {
                        console.log(error)
                        res.status(500).send({
                            result: "Fail",
                            reason: "Internal Server Error"
                        })
                    }
                    else {
                        data.password = hash
                        await data.save()
                        res.send({
                            result: "Done",
                            reason: "Password Has Been Reset"
                        })
                    }
                })
            }
            else
                res.status(400).send({
                    result: "Fail",
                    reason: "Invalid Password. It Must Container at least 1 upper case and 1 lower case alphabet, 1 digit, should not contain any space and length must be 8-100"
                })
        }
        else {
            res.status(401).send({
                result: "Fail",
                reason: "UnAuthorized Activity"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            result: "Fail",
            reason: "Internal Server Error"
        })
    }
}

module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
    login: login,
    forgetPassword1: forgetPassword1,
    forgetPassword2: forgetPassword2,
    forgetPassword3: forgetPassword3
}