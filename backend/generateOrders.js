import axios from "axios";

const BASE_URL = "http://localhost:8038/orders"; // Change if needed

// Helper to generate random data
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateOrder = (index) => {
  const digitalCount = random(1, 3);
  const offsetCount = random(1, 2);

  const digital = Array.from({ length: digitalCount }).map((_, i) => ({
    title: `Digital item ${i + 1} (Order ${index})`,
    price: random(100, 500),
  }));

  const offset = Array.from({ length: offsetCount }).map((_, i) => ({
    title: `Offset item ${i + 1} (Order ${index})`,
    price: random(200, 600),
  }));

  const total_money_digital = digital.reduce((s, d) => s + d.price, 0);
  const total_money_offset = offset.reduce((s, d) => s + d.price, 0);
  const total = total_money_digital + total_money_offset;
  const recip = random(0, total);
  const remained = total - recip;

  return {
    customer: {
      name: `Customer ${index}`,
      phone_number: `07${random(0, 9)}${random(1000000, 9999999)}`,
    },
    digital,
    offset,
    total_money_digital,
    total_money_offset,
    total,
    recip,
    remained,
  };
};

const seedOrders = async () => {
  for (let i = 1; i <= 100; i++) {
    const order = generateOrder(i);
    try {
      await axios.post(BASE_URL, order);
      console.log(`✅ Created order ${i}`);
    } catch (err) {
      console.error(`❌ Failed to create order ${i}:`, err.message);
    }
  }

  console.log("🌟 Done creating 100 orders!");
};

seedOrders();
