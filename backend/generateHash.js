import bcrypt from "bcryptjs";
const hashedPassword = await bcrypt.hash("Admin123", 10);
console.log(hashedPassword);