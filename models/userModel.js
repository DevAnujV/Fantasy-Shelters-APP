const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})

userSchema.pre("save", function(next){
    let user = this;
    bcrypt.genSalt()
    .then(salt => {
        bcrypt.hash(user.password, salt)
        .then(hashedPwd => {
            user.password = hashedPwd
            next();
        }).catch(err => {
            console.log("Error while hashing" + err)
        })
    }).catch(err => {
        console.log("Error while salting" + err)
    })
})

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;