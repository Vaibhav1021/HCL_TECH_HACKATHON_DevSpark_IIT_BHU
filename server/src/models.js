import mongoose from 'mongoose';

const { Schema } = mongoose;

const goalSchema = new Schema(
  {
    type: { type: String, enum: ['steps', 'water', 'sleep', 'custom'], required: true },
    target: { type: Number, required: false },
    unit: { type: String, required: false },
    logs: [
      {
        date: { type: Date, required: true },
        value: { type: Number, required: true },
      },
    ],
  },
  { _id: true }
);

const reminderSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    dueDate: Date,
    completed: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new Schema(
  {
    role: { type: String, enum: ['patient', 'provider'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    consentGiven: { type: Boolean, default: false },
    // Patient-specific fields
    allergies: String,
    medications: String,
    goals: [goalSchema],
    reminders: [reminderSchema],
    assignedPatients: [{ type: Schema.Types.ObjectId, ref: 'User' }], // for providers
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);

