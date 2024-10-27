import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    userName: {type: String, required: true, unique:true },
    firstName: { type: String, required: true },   // Prenume
    lastName: { type: String, required: true },    // Nume
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true, unique: true }, // Număr de telefon
    dateOfBirth: { type: Date, required: true },   // Data de naștere
    isAdmin: {type: Boolean, required: true, default: false},
    sex: {type: String, required: true},

},
{
    timestamps: true
});


// Login
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

//Register
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    

});



const User = mongoose.model('User', userSchema);


export default User;