import mongoose from "mongoose";
import bcrypt from "bcrypt"
const paymentMethodSchema = new mongoose.Schema({
    cardType: String,
    lastFourDigits: String,
    expiryDate: String,
    isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        trim: true
    },
    prenom: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    },
    role: {
        type: String,
        default: 'client',
        enum: ['client', 'admin']
    },
    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    addresses: [{
        street: String,
        city: String,
        state: String,
        country: { type: String, default: "Maroc" },
        postalCode: String,
        isDefault: { type: Boolean, default: false }
    }],
    paymentMethods: [paymentMethodSchema],
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    cart: {
        items: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }],
        total: {
            type: Number,
            default: 0
        }
    },
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    lastLogin: Date,
    preferences: {
        newsletter: { type: Boolean, default: false },
        theme: { type: String, default: 'light' }
    },
    socialMedia: {
        googleId: String,
        facebookId: String
    },
    avatar: String,
    status: {
        type: String,
        enum: ['active', 'suspended', 'banned'],
        default: 'active'
    },
    otp: { type: String },
    otpExpires: { type: Date },
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ 'socialMedia.googleId': 1 });
userSchema.index({ 'socialMedia.facebookId': 1 });

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });

const User = mongoose.model("User", userSchema);

export default User;