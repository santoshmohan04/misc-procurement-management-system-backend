import { Order, Payment } from "../models/index.js";
import AppError from "../utils/appError.js";

export const getDashboardStats = async () => {
  try {
    const [totalOrders, pendingOrders, paymentAgg, deliveryStats] =
      await Promise.all([
        Order.countDocuments(),
        Order.countDocuments({ approval: "PENDING" }),
        Payment.aggregate([
          {
            $group: {
              _id: null,
              total: {
                $sum: { $toDouble: { $ifNull: ["$paymentAmount", 0] } },
              },
            },
          },
        ]),
        Order.aggregate([
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

    const totalPayments = paymentAgg.length > 0 ? paymentAgg[0].total : 0;

    return Promise.resolve({
      totalOrders,
      pendingOrders,
      totalPayments,
      deliveryStats,
    });
  } catch {
    throw new AppError("Internal server error.", 500);
  }
};
