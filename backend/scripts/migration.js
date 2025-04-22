// scripts/migration.js
import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

export const migrate = async () => {
    try {
      console.log('Starting password migration...');
      
      const users = await User.find().select('+password');
      let updatedCount = 0;
      
      for (const user of users) {
        // Skip if password is already hashed
        if (user.password?.startsWith('$2a$')) {
          continue;
        }
        
        // Skip if password is empty
        if (!user.password) {
          console.log(`Skipping user ${user.email} - no password set`);
          continue;
        }
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        updatedCount++;
        console.log(`Updated password for ${user.email}`);
      }
      
      console.log(`Migration complete. Updated ${updatedCount} users.`);
      process.exit(0);
    } catch (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }
  };