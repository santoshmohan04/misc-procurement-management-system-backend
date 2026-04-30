import { Order } from "../models/index.js";
import AppError from "../utils/appError.js";

export const createNewOrder = (data) =>
  Order.create(data)
    .then((order) => {
      return Promise.resolve(order);
    })
    .catch(() => {
      throw new AppError("Internal server error.", 500);
    });

export const getNewOrdersForManager = (id) =>
  Order.find({ manager: id })
    .populate("manager")
    .populate("supplier")
    .then((orders) => {
      return Promise.resolve(orders);
    })
    .catch(() => {
      throw new AppError("Internal server error.", 500);
    });

export const getNewOrdersForSupplier = (id) =>
  Order.find({ supplier: id })
    .populate("manager")
    .populate("supplier")
    .then((orders) => {
      return Promise.resolve(orders);
    })
    .catch(() => {
      throw new AppError("Internal server error.", 500);
    });

export const getNewOrders = async ({ page = 1, limit = 10, search } = {}) => {
  try {
    const sanitizedSearch =
      search && typeof search === "string"
        ? search
            .replace(/['"\\]/g, "")
            .trim()
            .slice(0, 200)
        : null;
    const query = sanitizedSearch
      ? { $text: { $search: sanitizedSearch } }
      : {};
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("manager")
        .populate("supplier")
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query),
    ]);
    return Promise.resolve({
      orders,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch {
    throw new AppError("Internal server error.", 500);
  }
};

export const getNewOrder = (id) =>
  Order.findById(id)
    .populate("manager")
    .populate("supplier")
    .then((order) => {
      return Promise.resolve(order);
    })
    .catch(() => {
      throw new AppError("Internal server error.", 500);
    });

export const updateOrderNew = (orderId, data) =>
  Order.findByIdAndUpdate(orderId, { $set: data }, { new: true })
    .then((order) => {
      return Promise.resolve(order);
    })
    .catch(() => {
      throw new AppError("Internal server error.", 500);
    });

export const deleteOrderNew = (orderId) =>
  Order.findByIdAndDelete(orderId)
    .then((order) => {
      return Promise.resolve(order);
    })
    .catch(() => {
      throw new AppError("Internal server error.", 500);
    });

export const bulkUpdateOrders = async (ids, update) => {
  try {
    const ALLOWED_FIELDS = [
      "approval",
      "status",
      "rejectionNote",
      "requiredDate",
      "deliveryAddress",
      "deliveredDate",
      "isReceiptPrinted",
    ];
    const safeUpdate = Object.fromEntries(
      Object.entries(update).filter(([key]) => ALLOWED_FIELDS.includes(key)),
    );
    if (Object.keys(safeUpdate).length === 0) {
      throw new AppError("No valid fields provided for update.", 400);
    }
    const result = await Order.updateMany(
      { _id: { $in: ids } },
      { $set: safeUpdate },
    );
    return Promise.resolve(result);
  } catch (err) {
    if (err.status) throw err;
    throw new AppError("Internal server error.", 500);
  }
};
