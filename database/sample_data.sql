INSERT INTO users
(name, email, password, role, account_status)
VALUES
('FoodLoop Admin', 'admin@foodloop.com', '$2b$10$cR7FIW4G7HlfA1gyQ2GJi.oOf7aXSt2WiPOBStT9q7LFKbtYHXijW', 'ADMIN', 'ACTIVE');


{
  "email": "admin@foodloop.com",
  "password": "Admin123"
}


{
  "email": "rahul.restaurant@test.com",
  "password": "Rahul@12345"
}


UPDATE users
SET password = '$2b$10$Di3tPVkNxdCWIuhUO.geFuqO8D98zh1wSjGEe8W9moOEZPwBvcsbG'
WHERE email = 'priya.ngo@test.com';
{
  "email": "priya.ngo@test.com",
  "password": "Priya@123"
}