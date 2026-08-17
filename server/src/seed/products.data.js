const img = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1000&q=80`;

/**
 * Seed catalogue. `categorySlug` is resolved to a Category _id by seed.js.
 * Prices are in INR.
 */
export const products = [
  // ─── Electronics ────────────────────────────────────────────────────────────
  {
    name: 'Nova Pro Wireless Headphones',
    brand: 'Aurex',
    categorySlug: 'electronics',
    price: 12999, mrp: 19999, stock: 42, rating: 4.7, numReviews: 316, sold: 980,
    badge: 'Best seller', isFeatured: true, isTrending: true,
    shortDescription: 'Over-ear ANC headphones with 40-hour battery and multipoint pairing.',
    description:
      'The Nova Pro pairs a 40mm dynamic driver with adaptive noise cancelling that adjusts to the room rather than a fixed profile. Memory-foam earcups sit flush without clamping, and multipoint pairing keeps a laptop and phone connected at the same time. A ten-minute charge returns roughly six hours of playback.',
    highlights: ['Adaptive ANC with transparency mode', '40-hour battery, 10-min quick charge', 'Multipoint Bluetooth 5.3', 'Foldable frame with hard case'],
    specs: [
      { key: 'Driver', value: '40mm dynamic' }, { key: 'Battery life', value: 'Up to 40 hours' },
      { key: 'Connectivity', value: 'Bluetooth 5.3, USB-C, 3.5mm' }, { key: 'Weight', value: '268 g' },
      { key: 'Warranty', value: '2 years' },
    ],
    images: [img('1505740420928-5e560c06d30e'), img('1484704849700-f032a568e944'), img('1583394838336-acd977736f90')],
    tags: ['headphones', 'audio', 'anc', 'wireless'],
  },
  {
    name: 'Slate 5G Smartphone (256 GB)',
    brand: 'Kova',
    categorySlug: 'electronics',
    price: 32999, mrp: 38999, stock: 25, rating: 4.5, numReviews: 204, sold: 610,
    isFeatured: true, isTrending: true,
    shortDescription: '6.7-inch AMOLED, triple camera and a 5000 mAh cell that lasts the day.',
    description:
      'Slate 5G keeps the spec sheet honest: a 120 Hz AMOLED panel, a 50 MP main sensor with optical stabilisation, and a 5000 mAh battery that reaches full charge in 38 minutes. Three years of OS updates are included from the day it ships.',
    highlights: ['6.7" 120 Hz AMOLED', '50 MP OIS main camera', '5000 mAh, 65 W fast charge', '3 years of OS updates'],
    specs: [
      { key: 'Display', value: '6.7-inch AMOLED, 120 Hz' }, { key: 'Storage', value: '256 GB + 12 GB RAM' },
      { key: 'Camera', value: '50 MP + 12 MP ultrawide + 8 MP tele' }, { key: 'Battery', value: '5000 mAh, 65 W' },
      { key: 'Warranty', value: '1 year' },
    ],
    images: [img('1511707171634-5f897ff02aa9'), img('1598327105666-5b89351aff97'), img('1592750475338-74b7b21085ab')],
    tags: ['phone', 'smartphone', '5g', 'android'],
  },
  {
    name: 'Field Earbuds',
    brand: 'Aurex',
    categorySlug: 'electronics',
    price: 5999, mrp: 8999, stock: 88, rating: 4.4, numReviews: 512, sold: 1420,
    isTrending: true,
    shortDescription: 'Pocket ANC earbuds rated IPX5, with a case that charges wirelessly.',
    description:
      'Field earbuds weigh 4.6 g each and stay put through a run. Hybrid ANC cuts commute noise, and the sweat-resistant IPX5 shell handles rain. The case adds three full charges and tops up on any Qi pad.',
    highlights: ['Hybrid ANC', 'IPX5 water resistance', '8 h + 24 h with case', 'Wireless charging case'],
    specs: [
      { key: 'Driver', value: '11mm' }, { key: 'Battery life', value: '8 h buds / 32 h total' },
      { key: 'Water resistance', value: 'IPX5' }, { key: 'Warranty', value: '1 year' },
    ],
    images: [img('1590658268037-6bf12165a8df'), img('1606220945770-b5b6c2c55bf1'), img('1572569511254-d8f925fe2cbb')],
    tags: ['earbuds', 'audio', 'anc'],
  },
  {
    name: 'Air 14 Ultrabook',
    brand: 'Northpeak',
    categorySlug: 'electronics',
    price: 78999, mrp: 89999, stock: 14, rating: 4.6, numReviews: 128, sold: 220,
    isFeatured: true,
    shortDescription: '1.19 kg aluminium laptop with a 2.8K display and 16-hour battery.',
    description:
      'A 14-inch machine for people who write, design and sit in calls all day. The 2.8K panel covers 100% DCI-P3, the keyboard has 1.5 mm of travel, and the chassis stays quiet under load thanks to a vapour chamber instead of a fan-first design.',
    highlights: ['2.8K 90 Hz display', '16 GB RAM / 512 GB SSD', 'Up to 16 hours of battery', '1.19 kg aluminium body'],
    specs: [
      { key: 'Display', value: '14-inch 2.8K, 90 Hz' }, { key: 'Memory', value: '16 GB LPDDR5' },
      { key: 'Storage', value: '512 GB NVMe SSD' }, { key: 'Ports', value: '2× USB-C, USB-A, HDMI, 3.5mm' },
      { key: 'Warranty', value: '2 years onsite' },
    ],
    images: [img('1517336714731-489689fd1ca8'), img('1496181133206-80ce9b88a853'), img('1531297484001-80022131f5a1')],
    tags: ['laptop', 'ultrabook', 'work'],
  },
  {
    name: 'Lens 4K Action Camera',
    brand: 'Kova',
    categorySlug: 'electronics',
    price: 18499, mrp: 24999, stock: 31, rating: 4.3, numReviews: 96, sold: 180,
    shortDescription: '4K60 capture, waterproof to 10 m without a case.',
    description:
      'Built for handheld shooting: six-axis stabilisation smooths out running footage, and the front screen means you can frame yourself without guessing. Waterproof to 10 metres straight out of the box.',
    highlights: ['4K at 60 fps', 'Six-axis stabilisation', 'Waterproof to 10 m', 'Dual colour screens'],
    specs: [
      { key: 'Video', value: '4K60 / 1080p240' }, { key: 'Sensor', value: '1/1.7-inch CMOS' },
      { key: 'Battery', value: '1720 mAh' }, { key: 'Warranty', value: '1 year' },
    ],
    images: [img('1526170375885-4d8ecf77b99f'), img('1502920917128-1aa500764cbd'), img('1516035069371-29a1b244cc32')],
    tags: ['camera', 'action camera', '4k'],
  },

  // ─── Fashion ────────────────────────────────────────────────────────────────
  {
    name: 'Everyday Oxford Shirt',
    brand: 'Vellum',
    categorySlug: 'fashion',
    price: 2499, mrp: 3999, stock: 120, rating: 4.5, numReviews: 288, sold: 940,
    isTrending: true,
    shortDescription: 'Garment-washed cotton oxford with a soft collar and clean seams.',
    description:
      'Woven from 140 gsm long-staple cotton and washed before cutting, so the fit you try on is the fit you keep. The collar sits without stays, and the side seams are single-needle stitched.',
    highlights: ['100% long-staple cotton', 'Pre-washed, no shrinkage', 'Single-needle side seams', 'Six colourways'],
    specs: [
      { key: 'Fabric', value: '140 gsm cotton oxford' }, { key: 'Fit', value: 'Regular' },
      { key: 'Care', value: 'Machine wash cold, tumble low' }, { key: 'Origin', value: 'Made in India' },
    ],
    images: [img('1602810318383-e386cc2a3ccf'), img('1521572163474-6864f9cf17ab'), img('1620799140408-edc6dcb6d633')],
    tags: ['shirt', 'cotton', 'menswear'],
  },
  {
    name: 'Relaxed Denim Jacket',
    brand: 'Mavi',
    categorySlug: 'fashion',
    price: 4299, mrp: 5999, stock: 64, rating: 4.6, numReviews: 174, sold: 520,
    isFeatured: true,
    shortDescription: '13 oz rigid denim that breaks in around you, not the other way round.',
    description:
      'Cut from 13 oz selvedge-edge denim with copper rivets at the stress points. It starts stiff on purpose — six weeks of wear gives you the fades no factory can fake.',
    highlights: ['13 oz rigid denim', 'Copper rivets', 'Chest and hand pockets', 'Unisex sizing'],
    specs: [
      { key: 'Fabric', value: '13 oz cotton denim' }, { key: 'Fit', value: 'Relaxed' },
      { key: 'Care', value: 'Wash rarely, cold, inside out' }, { key: 'Origin', value: 'Made in India' },
    ],
    images: [img('1543076447-215ad9ba6923'), img('1576871337622-98d48d1cf531'), img('1591047139829-d91aecb6caea')],
    tags: ['jacket', 'denim', 'outerwear'],
  },
  {
    name: 'Court Low Sneakers',
    brand: 'Grit Lab',
    categorySlug: 'fashion',
    price: 3799, mrp: 5499, stock: 96, rating: 4.4, numReviews: 402, sold: 1180,
    isTrending: true, badge: 'Trending',
    shortDescription: 'Full-grain leather uppers on a vulcanised rubber sole.',
    description:
      'A low-profile court shoe with a leather upper that creases rather than cracks, sitting on a vulcanised sole with a 6 mm foam insole you can swap out for an orthotic.',
    highlights: ['Full-grain leather upper', 'Vulcanised rubber sole', 'Removable insole', 'Sizes 5–12'],
    specs: [
      { key: 'Upper', value: 'Full-grain leather' }, { key: 'Sole', value: 'Vulcanised rubber' },
      { key: 'Closure', value: 'Flat cotton lace' }, { key: 'Care', value: 'Wipe clean, condition monthly' },
    ],
    images: [img('1542291026-7eec264c27ff'), img('1560769629-975ec94e6a86'), img('1595950653106-6c9ebd614d3a')],
    tags: ['sneakers', 'shoes', 'leather'],
  },
  {
    name: 'Merino Crew Knit',
    brand: 'Vellum',
    categorySlug: 'fashion',
    price: 5199, mrp: 6999, stock: 48, rating: 4.7, numReviews: 141, sold: 380,
    shortDescription: 'Fine-gauge merino that layers under a jacket without bulk.',
    description:
      'Knitted from 19.5-micron merino at a 12-gauge, so it holds shape through a full winter and packs down to nothing. Ribbed cuffs stay tight after washing.',
    highlights: ['19.5-micron merino wool', 'Fully fashioned shoulders', 'Ribbed cuffs and hem', 'Machine washable'],
    specs: [
      { key: 'Fabric', value: '100% merino wool, 12-gauge' }, { key: 'Fit', value: 'Slim' },
      { key: 'Care', value: 'Machine wash wool cycle' }, { key: 'Origin', value: 'Made in India' },
    ],
    images: [img('1620799140408-edc6dcb6d633'), img('1434389677669-e08b4cac3105'), img('1516762689617-e1cffcef479d')],
    tags: ['knitwear', 'merino', 'sweater'],
  },
  {
    name: 'Tailored Stretch Chinos',
    brand: 'Mavi',
    categorySlug: 'fashion',
    price: 2899, mrp: 3999, stock: 110, rating: 4.3, numReviews: 219, sold: 700,
    shortDescription: 'Cotton-elastane twill with a clean taper and a hidden gusset.',
    description:
      'A chino cut for sitting down in. Two percent elastane keeps the taper clean through a workday, and a hidden crotch gusset stops the seam blowout that kills most trousers.',
    highlights: ['98% cotton, 2% elastane', 'Hidden gusset', 'Tapered leg', 'Five colourways'],
    specs: [
      { key: 'Fabric', value: '280 gsm stretch twill' }, { key: 'Fit', value: 'Tapered' },
      { key: 'Rise', value: 'Mid' }, { key: 'Care', value: 'Machine wash cold' },
    ],
    images: [img('1473966968600-fa801b869a1a'), img('1594633312681-425c7b97ccd1'), img('1584865288642-42078afe6942')],
    tags: ['chinos', 'trousers', 'menswear'],
  },

  // ─── Home & Living ──────────────────────────────────────────────────────────
  {
    name: 'Boucle Lounge Chair',
    brand: 'Loom & Co.',
    categorySlug: 'home-living',
    price: 24999, mrp: 32999, stock: 12, rating: 4.8, numReviews: 87, sold: 150,
    isFeatured: true,
    shortDescription: 'Solid-ash frame, high-density foam, removable boucle cover.',
    description:
      'A reading chair with a 102° recline — upright enough to work in, relaxed enough to stay in. The frame is kiln-dried solid ash, and the boucle cover unzips for dry cleaning.',
    highlights: ['Kiln-dried solid ash frame', 'Removable, washable cover', 'High-density CMHR foam', '10-year frame warranty'],
    specs: [
      { key: 'Dimensions', value: 'W 78 × D 82 × H 74 cm' }, { key: 'Frame', value: 'Solid ash' },
      { key: 'Upholstery', value: 'Polyester boucle' }, { key: 'Assembly', value: 'Legs only, 5 minutes' },
      { key: 'Warranty', value: '10 years on frame' },
    ],
    images: [img('1567538096630-e0c55bd6374c'), img('1586023492125-27b2c045efd7'), img('1555041469-a586c61ea9bc')],
    tags: ['chair', 'furniture', 'living room'],
  },
  {
    name: 'Ceramic Vase Set of 3',
    brand: 'Terra Form',
    categorySlug: 'home-living',
    price: 3499, mrp: 4999, stock: 70, rating: 4.5, numReviews: 132, sold: 410,
    isTrending: true,
    shortDescription: 'Wheel-thrown stoneware in three heights, matte glaze inside and out.',
    description:
      'Thrown by hand in Jaipur, so no two are identical. The matte glaze runs through the interior too, which means they hold water without a liner.',
    highlights: ['Wheel-thrown stoneware', 'Watertight matte glaze', 'Heights: 12, 18 and 24 cm', 'Hand-finished, no two alike'],
    specs: [
      { key: 'Material', value: 'Stoneware' }, { key: 'Heights', value: '12 / 18 / 24 cm' },
      { key: 'Care', value: 'Hand wash' }, { key: 'Origin', value: 'Jaipur, India' },
    ],
    images: [img('1578500494198-246f612d3b3d'), img('1493663284031-b7e3aefcae8e'), img('1526057565006-20beab8dd2ed')],
    tags: ['vase', 'decor', 'ceramic'],
  },
  {
    name: 'Washed Linen Duvet Set',
    brand: 'Halcyon',
    categorySlug: 'home-living',
    price: 7999, mrp: 11999, stock: 36, rating: 4.7, numReviews: 210, sold: 490,
    isFeatured: true,
    shortDescription: 'Stone-washed European flax, softer after every wash.',
    description:
      'Woven from European flax at 165 gsm and stone-washed twice, so it arrives already broken in. Linen breathes in summer and traps warmth in winter, which is why it outlasts three sets of cotton.',
    highlights: ['100% European flax linen', 'Stone-washed twice', 'Includes duvet cover + 2 shams', 'OEKO-TEX certified'],
    specs: [
      { key: 'Material', value: '165 gsm European flax' }, { key: 'Includes', value: 'Duvet cover, 2 pillow shams' },
      { key: 'Sizes', value: 'Single / Double / King' }, { key: 'Care', value: 'Machine wash warm, tumble low' },
    ],
    images: [img('1522771739844-6a9f6d5f14af'), img('1631049307264-da0ec9d70304'), img('1584100936595-c0654b55a2e2')],
    tags: ['bedding', 'linen', 'bedroom'],
  },
  {
    name: 'Arc Floor Lamp',
    brand: 'Loom & Co.',
    categorySlug: 'home-living',
    price: 9499, mrp: 13999, stock: 22, rating: 4.4, numReviews: 74, sold: 190,
    shortDescription: 'Marble base, brushed brass arm, dimmable warm LED.',
    description:
      'The 2.1 m arc reaches over a sofa without a table underneath it. A 9 kg marble base keeps it planted, and the integrated LED dims from 2200K candlelight to 3000K reading light.',
    highlights: ['2.1 m reach', '9 kg marble base', 'Dimmable 2200–3000K LED', 'Foot switch on cable'],
    specs: [
      { key: 'Height', value: '210 cm' }, { key: 'Base', value: 'Carrara marble' },
      { key: 'Light', value: '12 W integrated LED, dimmable' }, { key: 'Warranty', value: '3 years' },
    ],
    images: [img('1507473885765-e6ed057f782c'), img('1543198126-a4d9c4a1c39c'), img('1524484485831-a92ffc0de03f')],
    tags: ['lamp', 'lighting', 'living room'],
  },
  {
    name: 'Stoneware Mug Set of 4',
    brand: 'Terra Form',
    categorySlug: 'home-living',
    price: 1899, mrp: 2799, stock: 140, rating: 4.6, numReviews: 265, sold: 830,
    shortDescription: '350 ml mugs with a reactive glaze — dishwasher and microwave safe.',
    description:
      'Fired at 1240°C for a body that resists chipping, with a handle sized for a full hand rather than two fingers. The reactive glaze pools differently on every piece.',
    highlights: ['350 ml capacity', 'Dishwasher and microwave safe', 'Reactive glaze, unique per piece', 'Set of 4'],
    specs: [
      { key: 'Material', value: 'Stoneware' }, { key: 'Capacity', value: '350 ml' },
      { key: 'Care', value: 'Dishwasher safe' }, { key: 'Origin', value: 'Jaipur, India' },
    ],
    images: [img('1514228742587-6b1558fcca3d'), img('1517256064527-09c73fc73e38'), img('1481833761820-0509d3217039')],
    tags: ['mug', 'kitchen', 'ceramic'],
  },

  // ─── Beauty ─────────────────────────────────────────────────────────────────
  {
    name: 'Renewal Vitamin C Serum',
    brand: 'Maison Lune',
    categorySlug: 'beauty',
    price: 2199, mrp: 2999, stock: 150, rating: 4.6, numReviews: 388, sold: 1250,
    isTrending: true, isFeatured: true, badge: 'Best seller',
    shortDescription: '15% stabilised vitamin C with ferulic acid, in amber glass.',
    description:
      'A 15% L-ascorbic acid serum buffered with ferulic acid and vitamin E, packed in amber glass with an airless pump so it stays potent to the last drop. Fragrance-free and suitable for daily morning use.',
    highlights: ['15% stabilised vitamin C', 'Ferulic acid + vitamin E', 'Fragrance-free', 'Airless amber pump, 30 ml'],
    specs: [
      { key: 'Size', value: '30 ml' }, { key: 'Key actives', value: '15% L-ascorbic acid, 0.5% ferulic acid' },
      { key: 'Skin type', value: 'All, including sensitive' }, { key: 'Shelf life', value: '6 months after opening' },
    ],
    images: [img('1620916566398-39f1143ab7be'), img('1608248543803-ba4f8c70ae0b'), img('1612817288484-6f916006741a')],
    tags: ['serum', 'skincare', 'vitamin c'],
  },
  {
    name: 'Hydra Ceramide Cream',
    brand: 'Maison Lune',
    categorySlug: 'beauty',
    price: 1799, mrp: 2499, stock: 130, rating: 4.5, numReviews: 297, sold: 890,
    shortDescription: 'Barrier cream with ceramides and squalane, no fragrance.',
    description:
      'A three-ceramide blend with squalane and glycerin that rebuilds the barrier after actives, retinoids or a hard winter. Thick enough to work overnight, light enough for morning.',
    highlights: ['Ceramides NP, AP and EOP', 'Squalane + glycerin', 'Non-comedogenic', '50 ml jar'],
    specs: [
      { key: 'Size', value: '50 ml' }, { key: 'Key actives', value: 'Ceramide complex, squalane' },
      { key: 'Skin type', value: 'Dry to normal' }, { key: 'Fragrance', value: 'None' },
    ],
    images: [img('1571781926291-c477ebfd024b'), img('1596462502278-27bfdc403348'), img('1570194065650-d99fb4bedf0a')],
    tags: ['moisturiser', 'skincare', 'ceramide'],
  },
  {
    name: 'Matte Lip Trio',
    brand: 'Studio Ora',
    categorySlug: 'beauty',
    price: 1499, mrp: 2199, stock: 95, rating: 4.3, numReviews: 186, sold: 620,
    shortDescription: 'Three transfer-resistant mattes that do not dry the lip.',
    description:
      'A weightless matte finish held up by a jojoba and shea base, so eight hours of wear does not leave you flaking. Three shades: clay, plum and true red.',
    highlights: ['Transfer-resistant matte', 'Jojoba and shea base', 'Three shades included', 'Vegan and cruelty-free'],
    specs: [
      { key: 'Includes', value: '3 × 3.2 g' }, { key: 'Finish', value: 'Matte' },
      { key: 'Shades', value: 'Clay / Plum / True red' }, { key: 'Wear', value: 'Up to 8 hours' },
    ],
    images: [img('1586495777744-4413f21062fa'), img('1512496015851-a90fb38ba796'), img('1583241801242-1918e9d97ca8')],
    tags: ['lipstick', 'makeup', 'matte'],
  },
  {
    name: 'Amber Oud Eau de Parfum',
    brand: 'Maison Lune',
    categorySlug: 'beauty',
    price: 4599, mrp: 6499, stock: 55, rating: 4.7, numReviews: 143, sold: 340,
    isFeatured: true,
    shortDescription: '18% concentration — amber, oud and a dry cedar base.',
    description:
      'Opens with bergamot and pink pepper, settles into amber and oud over cedar. At 18% concentration it lasts about eight hours on skin without shouting across a room.',
    highlights: ['18% parfum concentration', 'Amber, oud, cedar', '~8 hours of wear', '50 ml glass flacon'],
    specs: [
      { key: 'Size', value: '50 ml' }, { key: 'Concentration', value: 'Eau de parfum, 18%' },
      { key: 'Top notes', value: 'Bergamot, pink pepper' }, { key: 'Base notes', value: 'Amber, oud, cedar' },
    ],
    images: [img('1541643600914-78b084683601'), img('1585386959984-a4155224a1ad'), img('1594035910387-fea47794261f')],
    tags: ['perfume', 'fragrance', 'unisex'],
  },
  {
    name: 'Clay Purifying Cleanser',
    brand: 'Studio Ora',
    categorySlug: 'beauty',
    price: 999, mrp: 1499, stock: 180, rating: 4.2, numReviews: 224, sold: 760,
    shortDescription: 'Kaolin and green tea gel cleanser at skin-friendly pH 5.5.',
    description:
      'A gel-to-foam cleanser built on kaolin clay and green tea extract. It clears oil without stripping — the pH sits at 5.5, so the barrier stays intact for whatever you layer next.',
    highlights: ['Kaolin clay + green tea', 'pH 5.5', 'Sulphate-free', '150 ml pump'],
    specs: [
      { key: 'Size', value: '150 ml' }, { key: 'pH', value: '5.5' },
      { key: 'Skin type', value: 'Oily to combination' }, { key: 'Fragrance', value: 'Light green tea' },
    ],
    images: [img('1556228720-195a672e8a03'), img('1556228578-8c89e6adf883'), img('1598452963314-b09f397a5c48')],
    tags: ['cleanser', 'skincare', 'clay'],
  },

  // ─── Fitness ────────────────────────────────────────────────────────────────
  {
    name: 'Hex Dumbbell Pair 10 kg',
    brand: 'Grit Lab',
    categorySlug: 'fitness',
    price: 4299, mrp: 5999, stock: 60, rating: 4.6, numReviews: 158, sold: 470,
    isTrending: true,
    shortDescription: 'Rubber-coated hex heads that sit flat and stay quiet.',
    description:
      'Cast iron under a thick rubber shell, so a dropped rep does not crack the floor or wake the flat below. The hex profile stops them rolling, and the knurled chrome handle holds grip through sweat.',
    highlights: ['Rubber-coated cast iron', 'Non-roll hex heads', 'Knurled chrome handle', 'Sold as a pair'],
    specs: [
      { key: 'Weight', value: '10 kg each (20 kg pair)' }, { key: 'Material', value: 'Cast iron, rubber coat' },
      { key: 'Handle', value: 'Knurled chrome, 32 mm' }, { key: 'Warranty', value: '5 years' },
    ],
    images: [img('1584735935682-2f2b69dff9d2'), img('1517836357463-d25dfeac3438'), img('1571019613454-1cb2f99b2d8b')],
    tags: ['dumbbell', 'strength', 'home gym'],
  },
  {
    name: 'Cork Yoga Mat 5 mm',
    brand: 'Terra Form',
    categorySlug: 'fitness',
    price: 2799, mrp: 3999, stock: 85, rating: 4.5, numReviews: 192, sold: 540,
    shortDescription: 'Cork surface over natural rubber — grippier as you sweat.',
    description:
      'Cork gets tackier when damp, which is the opposite of what a PVC mat does. Backed with natural tree rubber for 5 mm of cushioning that still lets you feel the floor in balance poses.',
    highlights: ['Cork top, natural rubber base', 'Grip improves with sweat', '5 mm cushioning', 'Carry strap included'],
    specs: [
      { key: 'Dimensions', value: '183 × 61 cm' }, { key: 'Thickness', value: '5 mm' },
      { key: 'Weight', value: '2.4 kg' }, { key: 'Care', value: 'Wipe with damp cloth' },
    ],
    images: [img('1592432678016-e910b452f9a2'), img('1544367567-0f2fcb009e0b'), img('1518611012118-696072aa579a')],
    tags: ['yoga', 'mat', 'cork'],
  },
  {
    name: 'Pulse Fitness Watch',
    brand: 'Kova',
    categorySlug: 'fitness',
    price: 8999, mrp: 12999, stock: 72, rating: 4.4, numReviews: 331, sold: 990,
    isFeatured: true, isTrending: true,
    shortDescription: 'GPS, SpO2 and a 14-day battery in a 38 g case.',
    description:
      'Tracks 120 sport modes with built-in GPS, so it works without your phone. Sleep and SpO2 monitoring run overnight without denting the 14-day battery, and it survives a swim at 5 ATM.',
    highlights: ['Built-in GPS, 120 sport modes', 'SpO2 and sleep tracking', '14-day battery', '5 ATM water resistance'],
    specs: [
      { key: 'Display', value: '1.43-inch AMOLED' }, { key: 'Battery', value: 'Up to 14 days' },
      { key: 'Sensors', value: 'HR, SpO2, accelerometer, GPS' }, { key: 'Warranty', value: '1 year' },
    ],
    images: [img('1546868871-7041f2a55e12'), img('1523275335684-37898b6baf30'), img('1434493789847-2f02dc6ca35d')],
    tags: ['smartwatch', 'fitness tracker', 'gps'],
  },
  {
    name: 'Resistance Band Kit',
    brand: 'Grit Lab',
    categorySlug: 'fitness',
    price: 1299, mrp: 1999, stock: 200, rating: 4.3, numReviews: 276, sold: 1040,
    shortDescription: 'Five fabric bands from 5 to 40 kg, with a door anchor.',
    description:
      'Fabric-wrapped latex bands that do not roll up the thigh mid-set. Five tensions cover warm-ups through to assisted pull-ups, and the door anchor turns any frame into a cable station.',
    highlights: ['5 tensions: 5–40 kg', 'Fabric wrapped, no roll', 'Door anchor and handles', 'Mesh carry bag'],
    specs: [
      { key: 'Includes', value: '5 bands, 2 handles, door anchor, bag' },
      { key: 'Resistance', value: '5 / 10 / 20 / 30 / 40 kg' },
      { key: 'Material', value: 'Latex core, fabric sleeve' }, { key: 'Warranty', value: '1 year' },
    ],
    images: [img('1598289431512-b97b0917affc'), img('1517649763962-0c623066013b'), img('1534438327276-14e5300c3a48')],
    tags: ['bands', 'home gym', 'mobility'],
  },
  {
    name: 'Insulated Steel Bottle 750 ml',
    brand: 'Halcyon',
    categorySlug: 'fitness',
    price: 1499, mrp: 2199, stock: 160, rating: 4.5, numReviews: 214, sold: 720,
    shortDescription: 'Cold for 24 hours, hot for 12, with a leak-proof lid.',
    description:
      'Double-walled 18/8 stainless steel with a vacuum gap that holds ice through a full day outdoors. The wide mouth takes standard ice cubes and a bottle brush.',
    highlights: ['24 h cold / 12 h hot', '18/8 stainless steel', 'Leak-proof lid', 'Fits standard cup holders'],
    specs: [
      { key: 'Capacity', value: '750 ml' }, { key: 'Material', value: '18/8 stainless steel' },
      { key: 'Weight', value: '340 g' }, { key: 'Care', value: 'Hand wash' },
    ],
    images: [img('1602143407151-7111542de6e8'), img('1523362628745-0c100150b504'), img('1571019613454-1cb2f99b2d8b')],
    tags: ['bottle', 'hydration', 'steel'],
  },

  // ─── Accessories ────────────────────────────────────────────────────────────
  {
    name: 'Leather Weekender Bag',
    brand: 'Vellum',
    categorySlug: 'accessories',
    price: 11999, mrp: 16999, stock: 28, rating: 4.7, numReviews: 118, sold: 260,
    isFeatured: true,
    shortDescription: 'Full-grain leather, 42 L, cabin-legal on most carriers.',
    description:
      'Cut from 1.8 mm full-grain leather with a cotton-canvas lining and YKK Excella hardware. At 42 litres it swallows three days of clothes and still fits most overhead bins.',
    highlights: ['1.8 mm full-grain leather', '42 L capacity', 'YKK Excella zips', 'Detachable shoulder strap'],
    specs: [
      { key: 'Dimensions', value: '55 × 28 × 27 cm' }, { key: 'Capacity', value: '42 L' },
      { key: 'Material', value: 'Full-grain leather' }, { key: 'Warranty', value: 'Lifetime on hardware' },
    ],
    images: [img('1553062407-98eeb64c6a62'), img('1547949003-9792a18a2601'), img('1590874103328-eac38a683ce7')],
    tags: ['bag', 'leather', 'travel'],
  },
  {
    name: 'Minimal Field Watch',
    brand: 'Kite',
    categorySlug: 'accessories',
    price: 7499, mrp: 10999, stock: 44, rating: 4.6, numReviews: 165, sold: 430,
    isTrending: true,
    shortDescription: 'Sapphire crystal, sweep quartz, 38 mm case that fits any wrist.',
    description:
      'A 38 mm brushed steel case with a domed sapphire crystal and a Japanese sweep-second quartz movement. Lume on the hands and indices reads at a glance in the dark.',
    highlights: ['38 mm brushed steel case', 'Sapphire crystal', 'Japanese quartz movement', '10 ATM water resistance'],
    specs: [
      { key: 'Case', value: '38 mm stainless steel' }, { key: 'Crystal', value: 'Domed sapphire' },
      { key: 'Movement', value: 'Japanese quartz, sweep second' }, { key: 'Strap', value: '20 mm quick-release leather' },
      { key: 'Warranty', value: '2 years' },
    ],
    images: [img('1524805444758-089113d48a6d'), img('1434056886845-dac89ffe9b56'), img('1523275335684-37898b6baf30')],
    tags: ['watch', 'accessories', 'quartz'],
  },
  {
    name: 'Acetate Sunglasses',
    brand: 'Studio Ora',
    categorySlug: 'accessories',
    price: 3299, mrp: 4799, stock: 76, rating: 4.4, numReviews: 149, sold: 380,
    shortDescription: 'Italian acetate frames with polarised CR-39 lenses.',
    description:
      'Hand-polished Mazzucchelli acetate with polarised CR-39 lenses that cut glare off water and dashboards. Adjustable nose pads keep them level whatever your bridge.',
    highlights: ['Italian Mazzucchelli acetate', 'Polarised CR-39 lenses', 'UV400 protection', 'Hard case included'],
    specs: [
      { key: 'Frame', value: 'Italian acetate' }, { key: 'Lens', value: 'Polarised CR-39, UV400' },
      { key: 'Lens width', value: '52 mm' }, { key: 'Warranty', value: '1 year' },
    ],
    images: [img('1572635196237-14b3f281503f'), img('1511499767150-a48a237f0083'), img('1473496169904-658ba7c44d8a')],
    tags: ['sunglasses', 'eyewear', 'polarised'],
  },
  {
    name: 'Bifold Card Wallet',
    brand: 'Vellum',
    categorySlug: 'accessories',
    price: 1999, mrp: 2999, stock: 130, rating: 4.5, numReviews: 203, sold: 640,
    shortDescription: 'Six card slots, RFID lining, 8 mm thin in the pocket.',
    description:
      'Vegetable-tanned leather that darkens with use, cut down to six slots and a note sleeve. An RFID-blocking layer sits between the halves without adding bulk.',
    highlights: ['Vegetable-tanned leather', '6 card slots + note sleeve', 'RFID-blocking layer', '8 mm profile'],
    specs: [
      { key: 'Dimensions', value: '10.5 × 8 × 0.8 cm' }, { key: 'Material', value: 'Vegetable-tanned leather' },
      { key: 'Capacity', value: '6 cards + notes' }, { key: 'Warranty', value: '2 years' },
    ],
    images: [img('1627123424574-724758594e93'), img('1517254797898-04edd251bfb3'), img('1553062407-98eeb64c6a62')],
    tags: ['wallet', 'leather', 'rfid'],
  },
  {
    name: 'Commuter Backpack 22 L',
    brand: 'Northpeak',
    categorySlug: 'accessories',
    price: 5499, mrp: 7999, stock: 90, rating: 4.6, numReviews: 287, sold: 810,
    isTrending: true,
    shortDescription: 'Water-resistant recycled shell with a suspended 16-inch laptop sleeve.',
    description:
      'A 22 L daily pack in recycled 900D polyester with a DWR finish. The laptop sleeve is suspended off the base, so setting the bag down does not transmit the shock to your machine.',
    highlights: ['Recycled 900D shell, DWR coated', 'Suspended 16-inch laptop sleeve', 'Luggage pass-through', 'Hidden security pocket'],
    specs: [
      { key: 'Capacity', value: '22 L' }, { key: 'Laptop', value: 'Fits up to 16-inch' },
      { key: 'Material', value: 'Recycled 900D polyester' }, { key: 'Weight', value: '890 g' },
      { key: 'Warranty', value: '5 years' },
    ],
    images: [img('1622560480605-d83c853bc5c3'), img('1581605405669-fcdf81165afa'), img('1553062407-98eeb64c6a62')],
    tags: ['backpack', 'commuter', 'laptop bag'],
  },
];
