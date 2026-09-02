const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, min: 0 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  images: [{ type: String }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  collectionRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  gender: { type: String, enum: ['Men', 'Women', 'Kids', 'Unisex', 'Accessories'] },
  fabric: { type: String },
  variants: [variantSchema],
  popularity: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
