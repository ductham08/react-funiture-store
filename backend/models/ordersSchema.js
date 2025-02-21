const mongoose = require("mongoose");

const schema = mongoose.Schema;

const addressSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    apartment: {
      type: String,
      required: true,
    }
  },
  { _id: false }
);
const ItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: true }
);
const ordersSchema = new schema({
  userId: { type: mongoose.Types.ObjectId, ref: "users" },
  _id: { type: mongoose.Types.ObjectId, auto: true },
  address: {
    type: addressSchema,
  },
  phone: { type: String, ref: "users", required: true },
  totalPrice: {
    type: Number,
    default: 0,
  },
  date: { type: Date, default: Date.now },
  items: {
    type: [ItemSchema],
    required: true,
  },
});

mongoose.model("orders", ordersSchema);
