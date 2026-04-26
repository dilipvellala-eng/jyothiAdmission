import { Application } from '../models/application.model.js';
import { ClassSeat } from '../models/classSeat.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const base = req.user.role === 'parent' ? { user: req.user._id } : {};
  const [total, approved, pending, rejected, drafts, byClass, classes] = await Promise.all([
    Application.countDocuments(base),
    Application.countDocuments({ ...base, status: 'Approved' }),
    Application.countDocuments({ ...base, status: 'Pending' }),
    Application.countDocuments({ ...base, status: 'Rejected' }),
    Application.countDocuments({ ...base, status: 'Draft' }),
    Application.aggregate([
      { $match: base },
      { $group: { _id: '$classApplyingFor', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]),
    ClassSeat.find({ isActive: true }).sort({ name: 1 })
  ]);

  res.json({ total, approved, pending, rejected, drafts, byClass, classes });
});
