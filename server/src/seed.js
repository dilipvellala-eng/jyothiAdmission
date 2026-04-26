import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from './config/db.js';
import { ClassSeat } from './models/classSeat.model.js';
import { User } from './models/user.model.js';

await connectDB();

const users = [
  { name: 'Admin User', email: 'admin@school.test', password: 'Admin@12345', role: 'admin' },
  { name: 'Staff User', email: 'staff@school.test', password: 'Staff@12345', role: 'staff' },
  { name: 'Parent User', email: 'parent@school.test', phone: '9876543210', password: 'Parent@12345', role: 'parent' }
];

for (const user of users) {
  const exists = await User.findOne({ email: user.email });
  if (!exists) await User.create(user);
}

const classes = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];
for (const name of classes) {
  await ClassSeat.findOneAndUpdate({ name }, { name, totalSeats: 40, filledSeats: 0, isActive: true }, { upsert: true });
}

console.log('Seed complete');
process.exit(0);
