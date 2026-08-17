import 'dotenv/config';
import mongoose from 'mongoose';
import slugify from 'slugify';
import { connectDB, disconnectDB } from '../config/db.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { categories } from './categories.data.js';
import { products } from './products.data.js';

const users = [
  { name: 'Slekco Admin', email: 'admin@slekco.com', password: 'admin123', role: 'admin' },
  { name: 'Ananya Rao', email: 'ananya@example.com', password: 'test1234', role: 'customer' },
];

async function importData() {
  await Promise.all([
    Category.deleteMany(),
    Product.deleteMany(),
    User.deleteMany(),
    Order.deleteMany(),
  ]);

  const createdCategories = await Category.insertMany(categories);
  const byslug = Object.fromEntries(createdCategories.map((c) => [c.slug, c._id]));

  const docs = products.map((p, i) => {
    const { categorySlug, ...rest } = p;
    return {
      ...rest,
      category: byslug[categorySlug],
      slug: slugify(`${p.brand} ${p.name}`, { lower: true, strict: true }),
      sku: `SLK-${String(i + 1).padStart(4, '0')}`,
    };
  });

  await Product.insertMany(docs);
  for (const u of users) await User.create(u); // create() so the password hook runs

  console.log(`Seeded ${createdCategories.length} categories, ${docs.length} products, ${users.length} users.`);
  console.log('Admin login: admin@slekco.com / admin123');
}

async function destroyData() {
  await Promise.all([Category.deleteMany(), Product.deleteMany(), User.deleteMany(), Order.deleteMany()]);
  console.log('All Slekco collections cleared.');
}

(async () => {
  try {
    await connectDB();
    if (process.argv.includes('--destroy')) await destroyData();
    else await importData();
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
})();
