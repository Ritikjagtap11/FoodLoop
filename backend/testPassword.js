import bcrypt from "bcryptjs";

const hash = await bcrypt.hash("Priya@123", 10);

console.log(hash);