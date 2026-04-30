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
    const query = search ? { $text: { $search: search } } : {};
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
    const result = await Order.updateMany(
      { _id: { $in: ids } },
      { $set: update },
    );
    return Promise.resolve(result);
  } catch {
    throw new AppError("Internal server error.", 500);
  }
};
