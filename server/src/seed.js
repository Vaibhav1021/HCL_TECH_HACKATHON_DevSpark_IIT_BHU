// Optional simple seeding script to create a provider and one patient
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { MONGO_URI } from './config.js';
import { User } from './models.js';

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});

  const providerPassword = await bcrypt.hash('Provider123!', 10);
  const patientPassword = await bcrypt.hash('Patient123!', 10);

  const provider = await User.create({
    role: 'provider',
    name: 'Demo Provider',
    email: 'provider@example.com',
    passwordHash: providerPassword,
    consentGiven: true,
  });

  const patient = await User.create({
    role: 'patient',
    name: 'Demo Patient',
    email: 'patient@example.com',
    passwordHash: patientPassword,
    consentGiven: true,
    allergies: 'None',
    medications: 'Vitamin D',
    goals: [
      { type: 'steps', target: 8000, unit: 'steps', logs: [] },
      { type: 'water', target: 8, unit: 'glasses', logs: [] },
      { type: 'sleep', target: 8, unit: 'hours', logs: [] },
    ],
    reminders: [
      {
        title: 'Annual Wellness Check',
        description: 'Schedule your yearly preventive checkup.',
        dueDate: new Date(new Date().getFullYear(), 11, 31),
      },
    ],
  });

  provider.assignedPatients = [patient._id];
  await provider.save();

  console.log('Seed complete');
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

