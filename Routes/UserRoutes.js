import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../Models/UserModel.js';
import protect from '../Middleware/AuthMiddleware.js';
import generateToken from '../utils/generateToken.js';

import {PythonShell} from 'python-shell';
import {spawn} from 'child_process';

const userRouter = express.Router();


// Get all users
userRouter.get("/", asyncHandler(async(req, res) => {
    const users = await User.find({});
    res.json(users);
})
);


// OLD CODE
/*userRouter.post("/login", asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});

    if(user && (await user.matchPassword(password))){
        console.log(user.ageGroup);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token:generateToken(user._id),
            createdAt: user.createdAt,
            sex:user.sex,
        });
    } 
        else{
            res.status(401);
            throw new Error('Invalid email or password');
        }
    })
);*/
// OLD CODE


// NEW LOGIN
userRouter.post("/login", asyncHandler(async (req, res) => {
    const { identifier, password } = req.body;

    // Caută utilizatorul după email, username sau telefon
    const user = await User.findOne({
        $or: [
            { email: identifier },
            { userName: identifier },
            { phoneNumber: identifier }
        ]
    });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
            createdAt: user.createdAt,
            sex: user.sex,
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
}));


// Register
// userRouter.post("/", asyncHandler(async(req, res) => {
//     const {name, email, password, sex, ageGroup, favoriteColors, favoriteFlowers} = req.body;
//     const userExists = await User.findOne({email});

//     if (userExists){
//         res.status(400);
//         throw new Error('User already exists');
//     }

//     const user = await User.create({
//         name,
//         email,
//         password,
//         sex,
//         ageGroup,
//         favoriteColors,
//         favoriteFlowers,
//     });

//     if(user){
//         res.status(201).json({
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             isAdmin:user.isAdmin,
//             sex:user.sex,
//             ageGroup:user.ageGroup,
//             favoriteColors:user.favoriteColors,
//             favoriteFlowers:user.favoriteFlowers,
//             token:generateToken(user._id),
//         });
//     }

//     else{
//         res.status(400);
//         throw new Error('Invalid user data');
//     }
// })
// );



userRouter.post("/", asyncHandler(async(req, res) => {
    const {userName, firstName, lastName, phoneNumber, dateOfBirth, email, password, sex} = req.body;
    

    const userExists = await User.findOne({
        $or: [
            { email: email },
            { userName: userName },
            { phoneNumber: phoneNumber }
        ]
    });

    if (userExists){
        res.status(400);
        throw new Error('User already exists');
    }

    
    
    const user = await User.create({
        userName,
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        dateOfBirth,
        sex,
    });

    if(user){
        res.status(201).json({
            _id: user._id,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth,
            email: user.email,
            isAdmin:user.isAdmin,
            sex:user.sex,
            token:generateToken(user._id),
        });
    }

    else{
        res.status(400);
        throw new Error('Invalid user data');
    }
    
})
);





// OLD PROFILE
/*
userRouter.get("/profile", protect, asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            favoriteColors: user.favoriteColors,
            favoriteFlowers: user.favoriteFlowers,
            ageGroup: user.ageGroup,
            sex:user.sex,
        });
    }
    else{
        res.status(404);
        throw new Error('User not found');
    }
}
));
// OLD PROFILE */

userRouter.get("/profile", protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            dateOfBirth: user.dateOfBirth,
            isAdmin: user.isAdmin,
            createdAt: user.createdAt,
            sex: user.sex,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));


// OLD Update PROFILE
/*
userRouter.put("/profile", protect,asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id);

    if(user){
        console.log(req.body.favoriteColors);
        user.email = req.body.email || user.email;
        user.name = req.body.name || user.name;
        if(req.body.password){
            user.password = req.body.password;
        }
        user.sex = req.body.sex || user.sex;
        user.ageGroup = req.body.ageGroup || user.ageGroup;
        user.favoriteColors = req.body.favoriteColors || user.favoriteColors;
        user.favoriteFlowers = req.body.favoriteFlowers || user.favoriteFlowers;

        const updatedUser = await user.save();
        
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            createdAt: updatedUser.createdAt,
            sex: updatedUser.sex,
            ageGroup: updatedUser.ageGroup,
            favoriteColors: updatedUser.favoriteColors,
            favoriteFlowers: updatedUser.favoriteFlowers,
            token:generateToken(updatedUser._id),
        });
        
    }
    else{
        res.status(404);
        throw new Error('User not found');
    }
}
));
OLD UPDATE PROFILE END */

// Update PROFILE
userRouter.put("/profile", protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.userName = req.body.userName || user.userName;
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
        user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
        user.sex = req.body.sex || user.sex;

        const updatedUser = await user.save();
        
        res.json({
            _id: updatedUser._id,
            userName: updatedUser.userName,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
            dateOfBirth: updatedUser.dateOfBirth,
            isAdmin: updatedUser.isAdmin,
            sex: updatedUser.sex,
            createdAt: updatedUser.createdAt,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
}));




export default userRouter;