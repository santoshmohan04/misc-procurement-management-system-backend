import {
  createNewOrder,
  getNewOrdersForManager,
  getNewOrdersForSupplier,
  getNewOrders,
  updateOrderNew,
  deleteOrderNew,
  getNewOrder,
} from "../repository/index.js";
import AppError from "../utils/appError.js";

export const saveOrderNewService = async (data, managerID) => {
  const {
    orderType,
    items,
    description,
    supplier,
    requiredDate,
    deliveryAddress,
  } = data;
  try {
    const order = await createNewOrder({
      manager: managerID,
      orderType,
      items,
      description,
      supplier,
      requiredDate,
      deliveryAddress,
    });
    return Promise.resolve(order);
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
};

export const updateOrderNewService = async (id, data) => {
  try {
    const order = await updateOrderNew(id, data);
    return Promise.resolve(order);
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
};

export const deleteOrderNewService = async (id) => {
  try {
    const order = await deleteOrderNew(id);
    return Promise.resolve(order);
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
};

export const getNewOrdersService = async () => {
  try {
    const orders = await getNewOrders();
    return Promise.resolve(orders);
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
};

export const getNewOrderForManagerService = async (id) => {
  try {
    const orders = await getNewOrdersForManager(id);
    return Promise.resolve(orders);
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
};

export const getNewOrderForSupplierService = async (id) => {
  try {
    const orders = await getNewOrdersForSupplier(id);
    return Promise.resolve(orders);
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
};

export const getSingleOrderService = async (id) => {
  try {
    const order = await getNewOrder(id);
    return Promise.resolve(order);
  } catch (err) {
    throw new AppError(err.message, err.status);
  }
};
