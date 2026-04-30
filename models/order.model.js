import mongoose from "mongoose";

const { Schema } = mongoose;

const OrderSchema = new Schema({
  orderType: String,
  description: String,
  items: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      qty: Number,
      available: {
        type: String,
        default: "PENDING",
      },
      deliveredQuantity: Number,
    },
  ],
  approval: {
    type: String,
    default: "PENDING",
  },
  status: {
    type: String,
    default: "PLACED",
  },
  requiredDate: Date,
  manager: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  supplier: {
    type: Schema.Types.ObjectId,
    ref: "Supplier",
  },
  deliveryAddress: String,
  deliveredDate: Date,
  rejectionNote: {
    type: String,
    default: "Order didn't rejected",
  },
  isReceiptPrinted: {
    type: Boolean,
    default: false,
  },
});

export const Order = mongoose.model("Order", OrderSchema);
