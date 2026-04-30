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

export const getNewOrders = () =>
  Order.find()
    .populate("manager")
    .populate("supplier")
    .then((orders) => {
      return Promise.resolve(orders);
    })
    .catch(() => {
      throw new AppError("Internal server error.", 500);
    });

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
