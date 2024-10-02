import User from "../Models/UserModel";

// validate Email
const validateEmail = async (req, res, next) => {
    const { email } = req.body;

    if(!email){
        return res.status(400).json({ message: 'Email is required' });
    }

    // check if user with given email exists in the database
    var user = await User.find({ email: email });

    if(user){
        next();
    }

};

export default validateEmail;