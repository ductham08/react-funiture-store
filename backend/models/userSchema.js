const mongoose=require("mongoose");

const addressSchema = new mongoose.Schema({
    city: {
      type: String,
      default:""
    },
    district: {
      type: String,
      default:""
    },
    street: {
      type: String,
      default:""
    },
    apartment: {
      type: String,
      default:"",
    },
  },{ _id: false});

const schema = new mongoose.Schema({
    _id:{
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    },
    fullName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phone:{
        type:String,
        default: "",
    },
    cart_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'cart',
    },
    order:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'orders',
        default: [],
    },
    address:{
        type: addressSchema,
        default: {},
    }
},{ minimize: false })

mongoose.model("users",schema);