const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        dropdups: true,
        validate: [
            {
                validator: async function (value) {
                    const emailCount = await this.model('user')
                        .countDocuments({ email: value });
                    return emailCount === 0;
                },
                message: props => `Please try a different email. This one exists ${props.value}`
            },
            {
                validator: function (value) {
                    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value.toLowerCase());
                },
                message: props => `Please ensure your email address is in the correct format. The email you entered was ${props.value}`
            },
            {
                validator: function (value) {
                    return this.emailConfirmation === value;
                },
                message: props => `Your email, ${props.value} does not match the email confirmation you entered.`
            }
        ]
    }
}, {
    timestamps: true
});

UserSchema.virtual('emailConfirmation')
    .get(function () {
        return this._emailConfirmation;
    })
    .set(function (value) {
        this._emailConfirmation = value;
    });

UserSchema.virtual('password')
    .get(function () {
        return this._password;
    })
    .set(function (value) {
        if (value !== this.passwordConfirmation) {
            this.invalidate('password', 'Password and password confirmation must match');
        }

        this._password = value;
    });

UserSchema.virtual('passwordConfirmation')
    .get(function () {
        return this._passwordConfirmation;
    })
    .set(function (value) {
        this._passwordConfirmation = value;
    });

UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email'
});

module.exports = mongoose.model('user', UserSchema);