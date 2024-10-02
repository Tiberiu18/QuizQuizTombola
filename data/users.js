import bcrypt from "bcryptjs";


const user = [
   {
    name:"Admin",
    email:"admin@example.com",
    password:bcrypt.hashSync("123456",10),  // 10 is the number of rounds to hash the password"),
    isAdmin:true
   },
   {
    name:"User",
    email:"user@example.com",
    password:bcrypt.hashSync("123456",10),
   }
];
  
  export default user;
  