require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const Car = require('../models/Car');

const CATEGORY_NAMES = ['Bike', 'Bus', 'HatchBack', 'Luxury', 'Sedan', 'Small', 'Suv', 'Truck', 'Van'];

const CARS_BY_CATEGORY = {
  Bike: [
    { name: 'Royal Enfield Classic 350', brand: 'Royal Enfield', model: 'Classic 350', year: 2023, pricePerDay: 800, description: 'Iconic cruiser for city and highway.' },
    { name: 'Honda Activa 6G', brand: 'Honda', model: 'Activa 6G', year: 2024, pricePerDay: 400, description: 'Reliable scooter for daily commute.' },
    { name: 'Bajaj Pulsar NS200', brand: 'Bajaj', model: 'Pulsar NS200', year: 2023, pricePerDay: 600, description: 'Sporty bike for enthusiasts.' },
  ],
  Bus: [
    { name: 'Volvo Multi-Axle AC', brand: 'Volvo', model: 'Multi-Axle', year: 2022, pricePerDay: 15000, description: 'Luxury AC bus for group travel.' },
    { name: 'Tata Starbus Urban', brand: 'Tata', model: 'Starbus Urban', year: 2023, pricePerDay: 12000, description: 'City bus for events and tours.' },
    { name: 'Ashok Leyland Jan Bus', brand: 'Ashok Leyland', model: 'Jan Bus', year: 2022, pricePerDay: 10000, description: 'Comfortable bus for outstation trips.' },
  ],
  HatchBack: [
    { name: 'Maruti Swift', brand: 'Maruti Suzuki', model: 'Swift', year: 2024, pricePerDay: 1200, description: 'Compact and fuel-efficient hatchback.' },
    { name: 'Hyundai i20', brand: 'Hyundai', model: 'i20', year: 2023, pricePerDay: 1400, description: 'Feature-rich premium hatchback.' },
    { name: 'Tata Punch', brand: 'Tata', model: 'Punch', year: 2024, pricePerDay: 1300, description: 'Compact SUV-style hatchback.' },
  ],
  Luxury: [
    { name: 'Mercedes-Benz S-Class', brand: 'Mercedes-Benz', model: 'S-Class', year: 2023, pricePerDay: 25000, description: 'Ultimate luxury sedan.' },
    { name: 'BMW 7 Series', brand: 'BMW', model: '7 Series', year: 2023, pricePerDay: 22000, description: 'Executive luxury sedan.' },
    { name: 'Audi A8 L', brand: 'Audi', model: 'A8 L', year: 2023, pricePerDay: 24000, description: 'Flagship luxury with comfort.' },
  ],
  Sedan: [
    { name: 'Honda City', brand: 'Honda', model: 'City', year: 2024, pricePerDay: 1800, description: 'Reliable mid-size sedan.' },
    { name: 'Hyundai Verna', brand: 'Hyundai', model: 'Verna', year: 2023, pricePerDay: 1900, description: 'Stylish and comfortable sedan.' },
    { name: 'Toyota Camry', brand: 'Toyota', model: 'Camry', year: 2023, pricePerDay: 3500, description: 'Premium sedan with hybrid option.' },
  ],
  Small: [
    { name: 'Maruti Alto 800', brand: 'Maruti Suzuki', model: 'Alto 800', year: 2023, pricePerDay: 700, description: 'Budget-friendly small car.' },
    { name: 'Renault Kwid', brand: 'Renault', model: 'Kwid', year: 2023, pricePerDay: 750, description: 'Compact and economical.' },
    { name: 'Datsun Redi-GO', brand: 'Datsun', model: 'Redi-GO', year: 2023, pricePerDay: 650, description: 'Affordable urban runabout.' },
  ],
  Suv: [
    { name: 'Mahindra XUV700', brand: 'Mahindra', model: 'XUV700', year: 2024, pricePerDay: 3500, description: 'Feature-packed family SUV.' },
    { name: 'Hyundai Creta', brand: 'Hyundai', model: 'Creta', year: 2024, pricePerDay: 2800, description: 'Popular mid-size SUV.' },
    { name: 'Kia Seltos', brand: 'Kia', model: 'Seltos', year: 2023, pricePerDay: 2600, description: 'Stylish and capable SUV.' },
  ],
  Truck: [
    { name: 'Tata Signa 4825', brand: 'Tata', model: 'Signa 4825', year: 2022, pricePerDay: 8000, description: 'Heavy-duty truck for cargo.' },
    { name: 'Ashok Leyland 3120', brand: 'Ashok Leyland', model: '3120', year: 2022, pricePerDay: 7500, description: 'Reliable commercial truck.' },
    { name: 'Eicher Pro 6031', brand: 'Eicher', model: 'Pro 6031', year: 2023, pricePerDay: 7000, description: 'Multi-axle cargo truck.' },
  ],
  Van: [
    { name: 'Toyota Innova Crysta', brand: 'Toyota', model: 'Innova Crysta', year: 2023, pricePerDay: 3500, description: 'Spacious MPV for family or group.' },
    { name: 'Maruti Eeco', brand: 'Maruti Suzuki', model: 'Eeco', year: 2023, pricePerDay: 1500, description: 'Affordable people mover.' },
    { name: 'Mahindra Marazzo', brand: 'Mahindra', model: 'Marazzo', year: 2023, pricePerDay: 2800, description: 'Comfortable 8-seater van.' },
  ],
};

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);

  const categoryIds = {};

  for (const name of CATEGORY_NAMES) {
    let cat = await Category.findOne({ name });
    if (!cat) {
      cat = await Category.create({ name, description: `${name} vehicles` });
      console.log('Created category:', name);
    } else {
      console.log('Category exists:', name);
    }
    categoryIds[name] = cat._id;
  }

  let created = 0;
  let skipped = 0;

  for (const catName of CATEGORY_NAMES) {
    const cars = CARS_BY_CATEGORY[catName];
    const categoryId = categoryIds[catName];

    for (const c of cars) {
      const exists = await Car.findOne({
        name: c.name,
        category: categoryId,
      });
      if (exists) {
        skipped++;
        continue;
      }
      await Car.create({
        name: c.name,
        brand: c.brand,
        model: c.model,
        year: c.year,
        category: categoryId,
        pricePerDay: c.pricePerDay,
        availability: 'available',
        image: null,
        description: c.description || '',
      });
      created++;
      console.log('Created car:', c.name, `(${catName})`);
    }
  }

  console.log('\nDone. Cars created:', created, '| Skipped (already exist):', skipped);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
