import mongoose from 'mongoose';

const classSeatSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    totalSeats: { type: Number, required: true, min: 0 },
    filledSeats: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

classSeatSchema.virtual('availableSeats').get(function availableSeats() {
  return Math.max(this.totalSeats - this.filledSeats, 0);
});

classSeatSchema.set('toJSON', { virtuals: true });

export const ClassSeat = mongoose.model('ClassSeat', classSeatSchema);
