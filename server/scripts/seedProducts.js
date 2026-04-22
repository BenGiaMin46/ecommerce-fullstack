import mongoose from "mongoose";
import dotenv from "dotenv";
import Products from "../models/Products.js";

dotenv.config();

// Reduced to 40-45 unique products with English names
const blueprints = [
  {
    category: "Men",
    subCategory: "Casual Wear",
    types: [
      { name: "Urban Comfort Tee", images: ["photo-1521572163474-6864f9cf17ab", "photo-1562157873-818bc0726f68", "photo-1581655353564-df123a1eb120", "photo-1503342217505-b0a15ec3261c"] },
      { name: "Street Essential Polo", images: ["photo-1571945153237-4929e783af4a", "photo-1485218126466-34e6392ec754", "photo-1506794778202-cad84cf45f1d", "photo-1519085360753-af0119f7cbe7"] },
      { name: "Relaxed Cargo Jogger", images: ["photo-1542272604-787c3839105e", "photo-1594932224010-75b436183cc2", "photo-1552374196-1ab2a1c593e8", "photo-1541099649107-f6ad02052f3e"] },
      { name: "Weekend Denim Shirt", images: ["photo-1596755094514-f87e34085b2c", "photo-1588514065522-288d087as87d", "photo-1578932750294-f5075e85f44a", "photo-1551028719-00167b16eac5"] },
    ],
    basePrice: 25,
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    category: "Men",
    subCategory: "Formal Wear",
    types: [
      { name: "Classic Office Shirt", images: ["photo-1598440947619-2c35fc9aa908", "photo-1602810318383-e386cc2a3ccf", "photo-1593032465175-481ac7f40147", "photo-1489987707025-afc232f7ea0f"] },
      { name: "Tailored Smart Trouser", images: ["photo-1594633312681-425c7b97ccd1", "photo-1507679799987-c7377f323b88", "photo-1593032465175-481ac7f40147", "photo-1598440947619-2c35fc9aa908"] },
      { name: "Executive Blazer", images: ["photo-1552374196-1ab2a1c593e8", "photo-1548449112-96a38a643324", "photo-1507679799987-c7377f323b88", "photo-1593032465175-481ac7f40147"] },
      { name: "Modern Fit Waistcoat", images: ["photo-1617137984095-74e4e5e3613f", "photo-1598911510765-75fd5c2f3856", "photo-1621072156002-e2fcc103e86e", "photo-1593030141340-009d22b70d80"] },
    ],
    basePrice: 55,
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    category: "Women",
    subCategory: "Western Wear",
    types: [
      { name: "Elegant Midi Dress", images: ["photo-1515886657613-9f3515b0c78f", "photo-1496747611176-843222e1e57c", "photo-1539109136881-3be0616acf4b", "photo-1495385794356-15371f348c31"] },
      { name: "Floral Summer Gown", images: ["photo-1595777457583-95e059d581b8", "photo-1572804013309-59a88b7e92f1", "photo-1515378791036-0648a3ef77b2", "photo-1502716119720-b23a93e5fe1b"] },
      { name: "Satin Evening Top", images: ["photo-1556905055-8f358a7a47b2", "photo-1564485371866-49931243bf3a", "photo-1551048633-31742918823b", "photo-1533038590840-1cde6b66b721"] },
      { name: "High Rise Skinny Denim", images: ["photo-1541099649107-f6ad02052f3e", "photo-1555529733-d8c1c7388363", "photo-1582533561751-ef6f6ab93a2e", "photo-1542272604-787c3839105e"] },
    ],
    basePrice: 45,
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    category: "Women",
    subCategory: "Ethnic Wear",
    types: [
      { name: "Designer Kurta Set", images: ["photo-1565693413579-8ff3fdc1b03b", "photo-1583391733975-09aabf05350c", "photo-1610030469983-98758b384ca2", "photo-1599948633239-4bfc7f2402fe"] },
      { name: "Festive Anarkali Suit", images: ["photo-1591047139829-d91aecb6caea", "photo-1599948633239-b9a5e8as7981", "photo-1608748010899-18f300247112", "photo-1610030469612-4f7f2b7f3001"] },
      { name: "Handcrafted Silk Saree", images: ["photo-1610030469915-189f3001ad5a", "photo-1583391733956-6c78276477e2", "photo-1610030469668-dd2660a9278f", "photo-1599948633239-4bfc7f2402fe"] },
      { name: "Embroidered Palazzo Set", images: ["photo-1490481651871-ab68de25d43d", "photo-1565693413579-8ff3fdc1b03b", "photo-1610030469912-70b7dff22b82", "photo-1583391733956-6c78276477e2"] },
    ],
    basePrice: 75,
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    category: "Unisex",
    subCategory: "Winter Wear",
    types: [
      { name: "Heavyweight Fleece Hoodie", images: ["photo-1576566588028-4147f3842f27", "photo-1556821840-3a63f95609a7", "photo-1506794778202-cad84cf45f1d", "photo-1559181567-c3190ca9959b"] },
      { name: "Insulated Puffer Jacket", images: ["photo-1603252109303-2751441dd157", "photo-1539571696357-5a69c17a67c6", "photo-1544923246-77307dd654ca", "photo-1591047139829-d91aecb6caea"] },
      { name: "Waterproof Travel Parka", images: ["photo-1583743814966-8936f5b7be1a", "photo-1551028719-00167b16eac5", "photo-1576566588028-4147f3842f27", "photo-1539571696357-5a69c17a67c6"] },
      { name: "Premium Wool Blend Cardigan", images: ["photo-1567401893414-76b7b1e5a7a5", "photo-1434389677669-e08b4cac3105", "photo-1475116127127-33849bb97cb1", "photo-1533038590840-1cde6b66b721"] },
    ],
    basePrice: 85,
    sizes: ["S", "M", "L", "XL", "XXL"]
  }
];

const variants = [
  { label: "Classic Edition", tweak: 0 },
  { label: "Modern Fit", tweak: 15 },
  { label: "Premium Selection", tweak: 30 },
  { label: "Limited Series", tweak: 45 },
];

const buildProducts = () => {
  const dataset = [];
  
  blueprints.forEach(bp => {
    bp.types.forEach(type => {
      // Create 4 distinct variants for each product type with unique images
      variants.forEach((variant, vIdx) => {
        const mrp = bp.basePrice + (vIdx * 12);
        const off = Math.round(10 + Math.random() * 30);
        const org = Math.round((mrp * (100 - off)) / 100);
        
        // Use a unique image for each variant to ensure variety
        const imgId = type.images[vIdx % type.images.length];
        const imgUrl = `https://images.unsplash.com/${imgId}?w=1000&q=80`;

        dataset.push({
          title: `${type.name} - ${variant.label}`,
          name: `${type.name} - ${bp.subCategory}`,
          desc: `High-quality ${type.name} from our ${bp.subCategory} collection. Crafted with attention to detail for maximum comfort and style. Ideal for lovers of ${bp.category} fashion.`,
          img: imgUrl,
          price: {
            org: org < 15 ? 15 : org,
            mrp,
            off,
          },
          sizes: bp.sizes,
          category: [bp.category, bp.subCategory],
        });
      });
    });
  });

  return dataset;
};

const seedProducts = async () => {
  const shouldReset = process.argv.includes("--reset");

  if (!process.env.MODNO_DB) {
    throw new Error("Missing MODNO_DB in .env");
  }

  await mongoose.connect(process.env.MODNO_DB);
  console.log("Connected to MongoDB");

  if (shouldReset) {
    await Products.deleteMany({});
    console.log("Existing products removed");
  }

  const dataset = buildProducts();
  await Products.insertMany(dataset, { ordered: false });
  const total = await Products.countDocuments();

  console.log(`Successfully seeded ${dataset.length} unique products.`);
  console.log(`Total products now in database: ${total}`);
};

seedProducts()
  .catch((error) => {
    console.error("Critical seeding failure:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
    console.log("Database connection closed");
  });
