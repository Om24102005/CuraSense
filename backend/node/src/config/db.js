import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MONGODB_URI } from './env.js';
import { User } from '../models/User.js';

export function connectDB() {
  mongoose.set('bufferCommands', false);

  if (!MONGODB_URI) {
    console.error('[FATAL] MONGODB_URI is not set. Check backend/.env');
  }

  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 4000,
  })
    .then(async () => {
      console.log('Connected to MongoDB:', MONGODB_URI);
      const adminExists = await User.findOne({ name: 'Curasense_D_Hawk' });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('9301919025Mtl', salt);
        await User.create({
          name: 'Curasense_D_Hawk',
          email: 'admin@curasense.com',
          password: hashedPassword,
          role: 'admin'
        });
        console.log('Admin Override Account Initialized');
      }
    })
    .catch(err => {
      console.error('[MongoDB] Connection failed:', err.message);
      console.error('[MongoDB] Is mongod running on the host in MONGODB_URI?');
    });
}
