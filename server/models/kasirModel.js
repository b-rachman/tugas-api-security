const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CashierSchema = new Schema({
  nama_barang: {
    type: String,
    required: true,
    trim: true
  },
  harga: {
    type: String,
    required: true
  },
  saldo_total:{
    type: String,
    required: true
  }
})

const Cashier = mongoose.model('cashier', CashierSchema)

module.exports = Cashier;