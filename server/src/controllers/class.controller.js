import { ClassSeat } from '../models/classSeat.model.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listClasses = asyncHandler(async (_req, res) => {
  const classes = await ClassSeat.find({ isActive: true }).sort({ name: 1 });
  res.json(classes);
});

export const upsertClass = asyncHandler(async (req, res) => {
  const { name, totalSeats, filledSeats = 0, isActive = true } = req.body;
  const classSeat = await ClassSeat.findOneAndUpdate(
    { name },
    { name, totalSeats, filledSeats, isActive },
    { new: true, upsert: true, runValidators: true }
  );
  res.json(classSeat);
});

export const deleteClass = asyncHandler(async (req, res) => {
  const classSeat = await ClassSeat.findById(req.params.id);
  if (!classSeat) throw new ApiError(404, 'Class not found');
  classSeat.isActive = false;
  await classSeat.save();
  res.status(204).send();
});
