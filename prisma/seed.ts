import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Kahvi Panda database seed...');

  // 1. Clear existing data
  await prisma.aIRecommendationEvent.deleteMany({});
  await prisma.aIMessage.deleteMany({});
  await prisma.aIConversation.deleteMany({});
  await prisma.notificationDelivery.deleteMany({});
  await prisma.enquiry.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.shipment.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.cartItem.deleteMany({});
  await prisma.cart.deleteMany({});
  await prisma.inventoryMovement.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productReview.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.coupon.deleteMany({});
  await prisma.blogPost.deleteMany({});

  // 2. Seed Default Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@kahvipanda.in',
      name: 'Panda Commander (Admin)',
      passwordHash: '$2a$10$wJt0F8YI.r9dM9qEre7.d.w/9M7YQGjLkmH4v3XbBvT.Q9p1Z6sS6', // hashed 'admin123'
      role: 'ADMIN',
      phone: '+91 9874199454',
    },
  });
  console.log('✅ Admin user created: admin@kahvipanda.in / admin123');

  // 3. Seed Categories
  const catWholeBeans = await prisma.category.create({
    data: {
      name: 'Whole Coffee Beans',
      slug: 'whole-beans',
      description: 'Slow-roasted whole beans preserved for peak freshness and aromatic home grinding.',
      image: 'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/8039d1f24_generated_240f5e4b.png',
      sortOrder: 1,
    },
  });

  const catGround = await prisma.category.create({
    data: {
      name: 'Ground Coffee',
      slug: 'ground-coffee',
      description: 'Precision ground for French press, Moka pot, South Indian filter, and pour-over rituals.',
      image: 'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/302d490fe_generated_6d60790f.png',
      sortOrder: 2,
    },
  });

  const catInstant = await prisma.category.create({
    data: {
      name: 'Instant Coffee',
      slug: 'instant-coffee',
      description: '100% Arabica freeze-dried micro-grounds. Instant preparation, zero compromise on taste.',
      image: 'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/8c02813b8_generated_b4f61530.png',
      sortOrder: 3,
    },
  });

  const catBundles = await prisma.category.create({
    data: {
      name: 'Coffee Bundles',
      slug: 'bundles',
      description: 'Curated gift boxes and multi-roast discovery packs for curious coffee lovers.',
      image: 'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/23e39189d_generated_964adc29.png',
      sortOrder: 4,
    },
  });

  const catAccessories = await prisma.category.create({
    data: {
      name: 'Brewing Accessories',
      slug: 'accessories',
      description: 'Scandinavian minimalist gear built for reliable, beautiful extractions.',
      image: 'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/3b3af841e_generated_image.png',
      sortOrder: 5,
    },
  });

  const catInnovations = await prisma.category.create({
    data: {
      name: 'Innovations',
      slug: 'innovations',
      description: 'Ready-to-drink self-heating and cold-brew tech in active R&D at our Kolkata craft lab.',
      image: 'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/a67e4a30a_generated_4a833012.png',
      sortOrder: 6,
    },
  });

  console.log('✅ Categories seeded');

  // 4. Products & Variants
  const productsData = [
    {
      name: 'Kolkata Classic Medium Roast',
      slug: 'kolkata-classic-medium-roast',
      description: 'Our signature city blend honoring Kolkata’s storied coffee-house heritage with a clean Scandinavian roasting curve. Balanced, comforting, and wonderfully suited for black coffee or a dash of milk.',
      shortDescription: 'Signature city roast with comforting notes of milk chocolate & hazelnut.',
      categoryId: catWholeBeans.id,
      coffeeType: 'Whole Beans',
      roastLevel: 'Medium',
      origin: 'Coorg & Wayanad Estates',
      tastingNotes: 'Milk Chocolate, Roasted Hazelnut, Caramelised Brown Sugar',
      compatibleBrewingMethods: 'French Press, Moka Pot, Aeropress, Pour Over',
      ingredients: '100% Specialty Arabica Beans',
      featured: true,
      bestseller: true,
      images: [
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/8039d1f24_generated_240f5e4b.png',
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/302d490fe_generated_6d60790f.png',
      ],
      variants: [
        { sku: 'KP-KOL-250G-WB', weight: '250g', grindType: 'Whole Beans', price: 420, compareAtPrice: 480, stockQuantity: 65 },
        { sku: 'KP-KOL-250G-FP', weight: '250g', grindType: 'French Press', price: 420, compareAtPrice: 480, stockQuantity: 50 },
        { sku: 'KP-KOL-250G-MK', weight: '250g', grindType: 'Moka Pot', price: 420, compareAtPrice: 480, stockQuantity: 40 },
        { sku: 'KP-KOL-500G-WB', weight: '500g', grindType: 'Whole Beans', price: 790, compareAtPrice: 900, stockQuantity: 30 },
      ]
    },
    {
      name: 'Nordic Dawn Light Roast',
      slug: 'nordic-dawn-light-roast',
      description: 'Bright, tea-like, and floral. Gently roasted in the Scandinavian style to highlight the terroir, vivid acidity, and delicate sweetness of high-altitude Chikmagalur cherries.',
      shortDescription: 'Crisp, aromatic Nordic roast with sweet bergamot and jasmine aromatics.',
      categoryId: catWholeBeans.id,
      coffeeType: 'Whole Beans',
      roastLevel: 'Light',
      origin: 'Baba Budangiri, Chikmagalur (1400m)',
      tastingNotes: 'Jasmine Blossoms, Lemon Zest, Bergamot, Raw Honey',
      compatibleBrewingMethods: 'Pour Over (V60), Aeropress, Cold Brew, Drip',
      ingredients: '100% Single Origin Arabica',
      featured: true,
      bestseller: false,
      images: [
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/5cd9b52af_generated_image.png',
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/3f7f45d3b_generated_e192eebe.png',
      ],
      variants: [
        { sku: 'KP-NDL-250G-WB', weight: '250g', grindType: 'Whole Beans', price: 480, compareAtPrice: 550, stockQuantity: 45 },
        { sku: 'KP-NDL-250G-PO', weight: '250g', grindType: 'Pour Over', price: 480, compareAtPrice: 550, stockQuantity: 35 },
        { sku: 'KP-NDL-500G-WB', weight: '500g', grindType: 'Whole Beans', price: 890, compareAtPrice: 990, stockQuantity: 25 },
      ]
    },
    {
      name: 'Midnight Monsooned Malabar',
      slug: 'midnight-monsooned-malabar',
      description: 'Cured by salty Arabian Sea monsoons for weeks, then roasted dark for maximum body, velvety crema, and earthy warmth. Low in acidity, heavy in sweetness.',
      shortDescription: 'Earthy, bold dark roast with velvety body and warm spice undertones.',
      categoryId: catGround.id,
      coffeeType: 'Ground Coffee',
      roastLevel: 'Dark',
      origin: 'Malabar Coast, Kerala',
      tastingNotes: 'Dark Cocoa, Allspice, Roasted Walnuts, Smoked Vanilla',
      compatibleBrewingMethods: 'Moka Pot, South Indian Filter, Espresso, French Press',
      ingredients: '100% Monsooned Malabar Arabica',
      featured: true,
      bestseller: true,
      images: [
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/302d490fe_generated_6d60790f.png',
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/8c02813b8_generated_b4f61530.png',
      ],
      variants: [
        { sku: 'KP-MMM-250G-MK', weight: '250g', grindType: 'Moka Pot', price: 450, compareAtPrice: 520, stockQuantity: 60 },
        { sku: 'KP-MMM-250G-ES', weight: '250g', grindType: 'Espresso', price: 450, compareAtPrice: 520, stockQuantity: 45 },
        { sku: 'KP-MMM-250G-SI', weight: '250g', grindType: 'South Indian Filter', price: 450, compareAtPrice: 520, stockQuantity: 50 },
        { sku: 'KP-MMM-500G-MK', weight: '500g', grindType: 'Moka Pot', price: 840, compareAtPrice: 960, stockQuantity: 30 },
      ]
    },
    {
      name: 'The Panda Morning Rush Blend',
      slug: 'panda-morning-rush-blend',
      description: 'Your reliable everyday wake-up call. Roasted medium-dark to punch through milk with notes of roasted cacao and toasted nuts. Designed for busy mornings when you need exceptional coffee fast.',
      shortDescription: 'Bold everyday blend designed to pair effortlessly with milk or stand alone.',
      categoryId: catGround.id,
      coffeeType: 'Ground Coffee',
      roastLevel: 'Medium-Dark',
      origin: 'Chikmagalur & Biligirirangana Hills',
      tastingNotes: 'Dark Chocolate Fudge, Toasted Almond, Cane Sugar',
      compatibleBrewingMethods: 'Moka Pot, French Press, South Indian Filter, Drip',
      ingredients: '85% Arabica, 15% Premium Washed Robusta',
      featured: true,
      bestseller: true,
      images: [
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/23e39189d_generated_964adc29.png',
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/cf7eb0420_generated_b7908a27.png',
      ],
      variants: [
        { sku: 'KP-PMR-250G-FP', weight: '250g', grindType: 'French Press', price: 390, compareAtPrice: 450, stockQuantity: 80 },
        { sku: 'KP-PMR-250G-MK', weight: '250g', grindType: 'Moka Pot', price: 390, compareAtPrice: 450, stockQuantity: 75 },
        { sku: 'KP-PMR-250G-WB', weight: '250g', grindType: 'Whole Beans', price: 390, compareAtPrice: 450, stockQuantity: 60 },
        { sku: 'KP-PMR-500G-FP', weight: '500g', grindType: 'French Press', price: 720, compareAtPrice: 850, stockQuantity: 40 },
      ]
    },
    {
      name: 'Kahvi Micro-Ground Instant Reserve',
      slug: 'kahvi-micro-ground-instant-reserve',
      description: 'Forget bitter supermarket instant powder. We gently freeze-dry small-batch specialty brew infused with micro-ground Arabica roast. Ready in 10 seconds with hot water or chilled milk.',
      shortDescription: '100% Arabica freeze-dried crystals with micro-ground roast. Pure speed, real aroma.',
      categoryId: catInstant.id,
      coffeeType: 'Instant Coffee',
      roastLevel: 'Medium',
      origin: 'Wayanad High Ranges',
      tastingNotes: 'Velvety Cocoa, Roasted Hazelnut, Brown Sugar',
      compatibleBrewingMethods: 'Instant (Hot Water or Cold Milk)',
      ingredients: '100% Freeze-Dried Arabica Coffee Crystals',
      featured: true,
      bestseller: true,
      images: [
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/8c02813b8_generated_b4f61530.png',
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/748e6c94d_generated_96b33c63.png',
      ],
      variants: [
        { sku: 'KP-INS-100G', weight: '100g Jar (50 Cups)', grindType: 'Instant Crystals', price: 380, compareAtPrice: 440, stockQuantity: 120 },
        { sku: 'KP-INS-30S', weight: '30 On-The-Go Sachets', grindType: 'Instant Crystals', price: 420, compareAtPrice: 499, stockQuantity: 90 },
      ]
    },
    {
      name: 'Nordic Discovery Trio Pack',
      slug: 'nordic-discovery-trio-pack',
      description: 'The ultimate sampler for the curious palate. Includes three 250g pouches: Nordic Dawn (Light), Kolkata Classic (Medium), and Midnight Malabar (Dark). Includes a brew recipe card from our head roaster.',
      shortDescription: 'Three distinct roast profiles (3 x 250g) in a collector presentation box.',
      categoryId: catBundles.id,
      coffeeType: 'Coffee Bundles',
      roastLevel: 'Nordic Roast',
      origin: 'Pan-South India Specialty Estates',
      tastingNotes: 'A spectrum of citrus brightness, smooth chocolate, and smoky cacao.',
      compatibleBrewingMethods: 'Universal (Includes 3 Grind Options)',
      ingredients: '100% Specialty Coffee (750g Total)',
      featured: true,
      bestseller: true,
      images: [
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/23e39189d_generated_964adc29.png',
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/fc11876a2_generated_282c63ad.png',
      ],
      variants: [
        { sku: 'KP-BUN-TRIO-WB', weight: '3 x 250g (750g)', grindType: 'Whole Beans', price: 1199, compareAtPrice: 1350, stockQuantity: 35 },
        { sku: 'KP-BUN-TRIO-FP', weight: '3 x 250g (750g)', grindType: 'French Press Grind', price: 1199, compareAtPrice: 1350, stockQuantity: 30 },
      ]
    },
    {
      name: 'Nordic Matte French Press (600ml)',
      slug: 'nordic-matte-french-press',
      description: 'Double-walled stainless steel cafetière with a dual-mesh plunger that traps micro-fines for clean body without the silt. Finished in Scandinavian matte charcoal.',
      shortDescription: 'Double-walled insulated French press in matte charcoal finish. Retains heat for 2 hours.',
      categoryId: catAccessories.id,
      coffeeType: 'Brewing Accessories',
      roastLevel: 'Medium',
      origin: 'Crafted Gear',
      tastingNotes: 'Precision extraction tool',
      compatibleBrewingMethods: 'French Press, Cold Immersion Brew',
      ingredients: '304 Food Grade Stainless Steel',
      featured: false,
      bestseller: false,
      images: [
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/3b3af841e_generated_image.png',
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/2c24fb5c7_generated_3ce7b84a.png',
      ],
      variants: [
        { sku: 'KP-ACC-FP-600', weight: '600ml (2-3 Cups)', grindType: 'Brewing Hardware', price: 1490, compareAtPrice: 1850, stockQuantity: 20 },
      ]
    },
    {
      name: 'Smart Self-Heating Cold & Hot Brew Can',
      slug: 'smart-self-heating-cold-hot-can',
      description: 'Active R&D Innovation from our Kolkata pilot lab. A twist-activated thermodynamic can delivering hot or chilled specialty coffee anytime, anywhere without an external electricity source.',
      shortDescription: 'Currently in development in Kolkata. Sign up for early prototype testing access.',
      categoryId: catInnovations.id,
      coffeeType: 'Innovations',
      roastLevel: 'Nordic Roast',
      origin: 'Kolkata R&D Kitchen',
      tastingNotes: 'Future Ready-to-Drink Tech',
      compatibleBrewingMethods: 'Self-Activating Thermodynamic Vessel',
      ingredients: 'Specialty Cold Brew Extract + Phase Change Thermal Core',
      featured: false,
      bestseller: false,
      images: [
        'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/a67e4a30a_generated_4a833012.png',
      ],
      variants: [
        { sku: 'KP-INO-WAITLIST', weight: '250ml Prototype', grindType: 'Ready-to-Drink', price: 0, compareAtPrice: 199, stockQuantity: 0, isAvailable: false },
      ]
    }
  ];

  for (const p of productsData) {
    const createdProduct = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        shortDescription: p.shortDescription,
        categoryId: p.categoryId,
        coffeeType: p.coffeeType,
        roastLevel: p.roastLevel,
        origin: p.origin,
        tastingNotes: p.tastingNotes,
        compatibleBrewingMethods: p.compatibleBrewingMethods,
        ingredients: p.ingredients,
        featured: p.featured,
        bestseller: p.bestseller,
        images: {
          create: p.images.map((url, i) => ({
            url,
            sortOrder: i,
            altText: `${p.name} - Photo ${i + 1}`
          }))
        },
        variants: {
          create: p.variants.map(v => ({
            sku: v.sku,
            weight: v.weight,
            grindType: v.grindType,
            price: v.price,
            compareAtPrice: v.compareAtPrice,
            stockQuantity: v.stockQuantity,
            isAvailable: v.isAvailable ?? true
          }))
        }
      }
    });
    console.log(`☕ Product created: ${createdProduct.name}`);
  }

  // 5. Seed Welcome Coupon
  await prisma.coupon.create({
    data: {
      code: 'RUSH10',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValue: 400,
      maxDiscount: 150,
      isActive: true
    }
  });
  await prisma.coupon.create({
    data: {
      code: 'FIRSTSIP',
      discountType: 'FIXED',
      discountValue: 50,
      minOrderValue: 350,
      isActive: true
    }
  });
  console.log('✅ Promo coupons created: RUSH10 (10% off), FIRSTSIP (₹50 off)');

  // 6. Seed Educational Blog Posts
  await prisma.blogPost.create({
    data: {
      slug: 'how-to-brew-with-french-press',
      title: 'How to make better coffee at home: The French Press Method',
      excerpt: 'Five simple tweaks that improve your cup more than buying a fancy ₹50,000 espresso machine.',
      category: 'Brewing Guide',
      readTime: '4 min read',
      coverImage: 'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/8039d1f24_generated_240f5e4b.png',
      content: `You don't need a complicated machine to extract exceptional coffee in the morning. All you need is freshly roasted beans, filtered water off the boil (around 92-94°C), and four minutes of patience.\n\n1. Use a 1:15 ratio (20g coarse coffee to 300g water).\n2. Pour gently, ensure all grounds are saturated.\n3. Let it steep for 4 minutes.\n4. Break the crust with a spoon, scoop off foam.\n5. Press down gently and serve immediately—never leave coffee sitting in the press!`
    }
  });

  await prisma.blogPost.create({
    data: {
      slug: 'nordic-roasting-philosophy',
      title: 'Why Nordic Roasting? Respecting the Bean Terroir',
      excerpt: 'How lighter, slower roasting curves reveal delicate florals, sweetness, and distinct Indian estate origins.',
      category: 'Roast Profile',
      readTime: '5 min read',
      coverImage: 'https://media.base44.com/images/public/6ae797797bf6e0fab7fe1feb/5cd9b52af_generated_image.png',
      content: `In Scandinavia, coffee is celebrated not as a dark, bitter stimulant, but as a seasonal harvest fruit with nuanced florals, gentle citrus notes, and inherent honeyed sweetness. We roast carefully in small batches in Kolkata to celebrate Indian terroir without baking or scorching the precious oils.`
    }
  });

  console.log('✅ Seed completed successfully! 🎉');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
