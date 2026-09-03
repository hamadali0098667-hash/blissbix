const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');

const User = require('../models/User');
const Category = require('../models/Category');
const Collection = require('../models/Collection');
const Product = require('../models/Product');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Category.deleteMany();
    await Collection.deleteMany();
    await Product.deleteMany();

    await User.create({ name: 'Admin User', email: 'admin@blissbix.com', password: 'password123', role: 'admin' });
    await User.create({ name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'customer' });

    const categories = await Category.insertMany([
      { name: 'Men', description: 'Men clothing' },
      { name: 'Women', description: 'Women clothing' },
      { name: 'Accessories', description: 'Bags, Watches, etc' },
      { name: 'Kids', description: 'Kids clothing' },
      { name: 'Footwear', description: 'Shoes and Sneakers' }
    ]);

    const collections = await Collection.insertMany([
      { name: 'Summer Collection', description: 'Summer vibes' },
      { name: 'Winter Essentials', description: 'Stay warm' },
      { name: 'Trendy Styles', description: 'Latest Fashion' }
    ]);

    const catMen = categories[0]._id;
    const catWomen = categories[1]._id;
    const catAcc = categories[2]._id;
    const catKids = categories[3]._id;
    const catShoes = categories[4]._id;

    const baseVariants = [
      { size: 'S', color: 'Black', stock: 100 },
      { size: 'M', color: 'Black', stock: 100 },
      { size: 'L', color: 'Black', stock: 100 },
      { size: 'M', color: 'White', stock: 100 }
    ];

    const shoeVariants = [
      { size: '8', color: 'Black', stock: 50 },
      { size: '9', color: 'White', stock: 50 },
      { size: '10', color: 'Brown', stock: 50 }
    ];

    const products = [
      // Men (5)
      { name: 'Premium Cotton T-Shirt', description: 'A great quality shirt.', price: 29.99, gender: 'Men', category: catMen, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Mens Casual Slim Fit', description: 'A great quality shirt.', price: 45.00, gender: 'Men', category: catMen, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Mens Cotton Jacket', description: 'A great quality jacket.', price: 65.99, gender: 'Men', category: catMen, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Classic Blue Jeans', description: 'A great quality pants.', price: 55.00, gender: 'Men', category: catMen, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1542272454-313658518928?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Black Formal Shirt', description: 'A great quality shirt.', price: 40.00, gender: 'Men', category: catMen, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80'] },
        
      // Women (6)
      { name: 'Biylaclesen Women 3-in-1 Snowboard Jacket', description: 'A great quality jacket.', price: 110.00, gender: 'Women', category: catWomen, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Lock and Love Women Removable Hood', description: 'A great quality jacket.', price: 75.00, gender: 'Women', category: catWomen, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Rain Jacket Women Windbreaker', description: 'A great quality jacket.', price: 49.99, gender: 'Women', category: catWomen, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1525457136159-8878648a7ad0?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Solid Short Sleeve Boat Neck V', description: 'A great quality shirt.', price: 25.00, gender: 'Women', category: catWomen, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Opna Women Short Sleeve Moisture', description: 'A great quality shirt.', price: 19.95, gender: 'Women', category: catWomen, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'] },
      { name: 'DANVOUY Womens T Shirt Casual Cotton', description: 'A great quality shirt.', price: 22.99, gender: 'Women', category: catWomen, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80'] },

      // Accessories (5)
      { name: 'Fjallraven Foldsack Backpack', description: 'A great quality bag.', price: 109.95, gender: 'Accessories', category: catAcc, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Solid Gold Petite Micropave', description: 'A great quality ring.', price: 168.00, gender: 'Accessories', category: catAcc, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1605100804763-247f67b2548e?auto=format&fit=crop&w=800&q=80'] },
      { name: 'White Gold Plated Princess', description: 'A great quality ring.', price: 9.99, gender: 'Accessories', category: catAcc, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Pierced Owl Rose Gold Plated', description: 'A great quality ring.', price: 10.99, gender: 'Accessories', category: catAcc, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Luxury Leather Handbag', description: 'A great quality bag.', price: 150.00, gender: 'Accessories', category: catAcc, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80'] },

      // Kids (4)
      { name: 'Boys Graphic Print T-Shirt', description: 'A great quality kids shirt.', price: 18.00, gender: 'Kids', category: catKids, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1519238263530-99bea67b0b18?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Girls Cute Summer Dress', description: 'A great quality kids dress.', price: 25.00, gender: 'Kids', category: catKids, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Kids Denim Overalls', description: 'A great quality overalls.', price: 35.00, gender: 'Kids', category: catKids, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1519238356193-294713cfa2b9?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Toddler Winter Jacket', description: 'A great quality jacket.', price: 40.00, gender: 'Kids', category: catKids, variants: baseVariants,
        images: ['https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80'] },

      // Footwear (5)
      { name: 'Classic Canvas Sneakers', description: 'A great quality shoes.', price: 45.00, gender: 'Men', category: catShoes, variants: shoeVariants,
        images: ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Womens Running Shoes', description: 'A great quality shoes.', price: 85.00, gender: 'Women', category: catShoes, variants: shoeVariants,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Leather Formal Loafers', description: 'A great quality shoes.', price: 95.00, gender: 'Men', category: catShoes, variants: shoeVariants,
        images: ['https://images.unsplash.com/photo-1614252339474-af35cb181cd1?auto=format&fit=crop&w=800&q=80'] },
      { name: 'High Heel Sandals', description: 'A great quality shoes.', price: 70.00, gender: 'Women', category: catShoes, variants: shoeVariants,
        images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'] },
      { name: 'Kids Sports Shoes', description: 'A great quality shoes.', price: 30.00, gender: 'Kids', category: catShoes, variants: shoeVariants,
        images: ['https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=800&q=80'] }
    ];

    await Product.insertMany(products);

    console.log('Seed with 25 Products Done!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
