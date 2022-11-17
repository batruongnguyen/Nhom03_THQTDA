const Payments = require("../models/paymentModel");
const Users = require("../models/userModel");
const Products = require("../models/productModel");

const paymentCtrl = {
  getPayments: async (req, res) => {
    try {
      const payments = await Payments.find();
      res.json(payments);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createPayment: async (req, res) => {
    try {
      const { cart, payerID, address, idUser } = req.body;

      const user = await Users.findById(idUser).select("name email");
      if (!user)
        return res.status(400).json({ msg: "Người dùng không tồn tại." });

      const { _id, name, email } = user;

      const total = cart.reduce((sum, i) => {
        return sum + i.price * i.quantity;
      }, 0);

      const newPayment = new Payments({
        user_id: _id,
        name,
        email,
        cart,
        paymentID: payerID,
        address,
        total,
        status: true,
        type: "online",
      });
      await newPayment.save();

      cart.filter((item) => {
        return sold(item._id, item.quantity, item.sold);
      });

      res.status(200).json({ msg: "Thanh toán thành công!" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ msg: err.message });
    }
  },
};

const sold = async (id, quantity, oldSold) => {
  await Products.findOneAndUpdate(
    { _id: id },
    {
      sold: quantity + oldSold,
    }
  );
};

module.exports = paymentCtrl;
