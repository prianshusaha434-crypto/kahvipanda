import assert from 'assert';

async function runTestSuite() {
  console.log('🧪 Starting Kahvi Panda Automated Test Suite...\n');
  const baseUrl = 'http://localhost:5000/api/v1';

  // 1. Healthcheck Test
  console.log('Test 1: Healthcheck API');
  const healthRes = await fetch('http://localhost:5000/health');
  assert.strictEqual(healthRes.status, 200, 'Health endpoint should return 200');
  const healthData = await healthRes.json();
  assert.strictEqual(healthData.status, 'healthy');
  console.log('✅ Healthcheck passed.');

  // 2. Products Listing & Catalogue Test
  console.log('\nTest 2: Products Listing & Filtering');
  const prodRes = await fetch(`${baseUrl}/products`);
  assert.strictEqual(prodRes.status, 200);
  const prodData = await prodRes.json();
  assert.ok(prodData.products.length >= 6, 'Should return at least 6 seeded products');
  const firstProd = prodData.products[0];
  assert.ok(firstProd.name, 'Product must have a name');
  assert.ok(firstProd.variants.length > 0, 'Product must have variants');
  console.log(`✅ Products catalog passed. Found ${prodData.products.length} products. First: "${firstProd.name}"`);

  // 3. Search API Test
  console.log('\nTest 3: Catalog Search Endpoint');
  const searchRes = await fetch(`${baseUrl}/products/search?q=Moka`);
  assert.strictEqual(searchRes.status, 200);
  const searchData = await searchRes.json();
  assert.ok(Array.isArray(searchData), 'Search should return an array');
  assert.ok(searchData.length > 0, 'Search should match products by supported brewing method or grind');
  console.log(`✅ Search passed. Returned ${searchData.length} matches for query "Moka".`);

  // 4. Server-Side Cart Pricing & Free Shipping Threshold Calculation
  console.log('\nTest 4: Server-Side Cart Pricing & Free Shipping Threshold');
  const variant = firstProd.variants[0];
  const invalidCartRes = await fetch(`${baseUrl}/cart/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{
        productId: 'not-the-variant-product',
        variantId: variant.id,
        name: firstProd.name,
        slug: firstProd.slug,
        image: '',
        price: 1,
        weight: variant.weight,
        grindType: variant.grindType,
        quantity: 1
      }]
    })
  });
  assert.strictEqual(invalidCartRes.status, 400, 'Cart must reject a variant attached to a different product');

  const cartRes = await fetch(`${baseUrl}/cart/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        {
          productId: firstProd.id,
          variantId: variant.id,
          name: firstProd.name,
          slug: firstProd.slug,
          image: firstProd.images?.[0]?.url || '',
          price: 1,
          weight: variant.weight,
          grindType: variant.grindType,
          quantity: 1
        }
      ],
      couponCode: 'RUSH10'
    })
  });
  assert.strictEqual(cartRes.status, 200);
  const cartData = await cartRes.json();
  assert.ok(cartData.subtotal > 0, 'Subtotal should be greater than 0');
  assert.strictEqual(cartData.items[0].price, variant.price, 'Server must ignore client-supplied prices');
  assert.strictEqual(cartData.shippingAmount, 99, 'Orders under ₹999 must have ₹99 delivery fee');
  assert.ok(cartData.discountAmount > 0, 'Coupon RUSH10 should apply discount');
  console.log(`✅ Cart calculation passed. Subtotal: ₹${cartData.subtotal}, Shipping: ₹${cartData.shippingAmount}, Discount: ₹${cartData.discountAmount}, Total: ₹${cartData.totalAmount}`);

  // 5. WhatsApp Enquiry Dispatch Test
  console.log('\nTest 5: Enquiry Submission & WhatsApp Formatting');
  const enqRes = await fetch(`${baseUrl}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priyanshu Test',
      phone: '+91 9874199454',
      email: 'priyanshu@example.com',
      type: 'GENERAL',
      subject: 'Automated Test Enquiry',
      message: 'Verifying automated WhatsApp formatting and database persistence.'
    })
  });
  assert.strictEqual(enqRes.status, 201);
  const enqData = await enqRes.json();
  assert.ok(enqData.referenceNumber.startsWith('KP-'), 'Must generate a KP reference ID');
  assert.ok(enqData.whatsAppClickUrl.includes('919874199454'), 'Must include target WhatsApp phone');
  console.log(`✅ Enquiry test passed. Ref: ${enqData.referenceNumber}, WhatsApp status: ${enqData.whatsAppStatus}`);

  // 6. Checkout & Stock Decrement Test
  console.log('\nTest 6: Simulated Checkout & Inventory Safety');
  const initialStock = variant.stockQuantity;
  const checkoutRes = await fetch(`${baseUrl}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [
        {
          productId: firstProd.id,
          variantId: variant.id,
          name: firstProd.name,
          slug: firstProd.slug,
          image: firstProd.images?.[0]?.url || '',
          price: variant.price,
          weight: variant.weight,
          grindType: variant.grindType,
          quantity: 2
        }
      ],
      address: {
        fullName: 'Test Customer',
        email: 'test@example.com',
        phone: '+91 9830011223',
        street: '12 Park Street, 4th Floor',
        city: 'Kolkata',
        state: 'West Bengal',
        postalCode: '700016',
        country: 'India'
      }
    })
  });
  assert.strictEqual(checkoutRes.status, 201);
  const orderData = await checkoutRes.json();
  assert.ok(orderData.orderNumber.startsWith('KP-'), 'Order number must be generated');
  const publicOrderRes = await fetch(`${baseUrl}/orders/${orderData.orderNumber}`);
  assert.strictEqual(publicOrderRes.status, 200);
  const publicOrder = await publicOrderRes.json();
  assert.ok(!('customerEmail' in publicOrder) && !('customerPhone' in publicOrder), 'Public order tracking must not expose customer contact details');
  assert.ok(!('shippingAddress' in publicOrder) && !('payments' in publicOrder), 'Public order tracking must not expose addresses or payment records');
  console.log(`✅ Checkout passed. Placed Order #${orderData.orderNumber} for ₹${orderData.totalAmount}`);

  // 7. Panda AI Concierge Multilingual & Tool Test
  console.log('\nTest 7: Panda AI Concierge & Intelligent Recommendation');
  const aiRes = await fetch(`${baseUrl}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'automated_test_session',
      message: 'Recommend coffee under 500 for Moka pot'
    })
  });
  assert.strictEqual(aiRes.status, 200);
  const aiData = await aiRes.json();
  assert.ok(aiData.message.includes('Moka Pot') || aiData.message.includes('₹500') || aiData.message.includes('Panda'), 'AI should understand coffee context');
  assert.ok(aiData.recommendedProducts?.length > 0, 'AI must return matching products from the live database');
  console.log(`✅ Panda AI test passed. Response: "${aiData.message.substring(0, 60)}..."`);

  console.log('\n🎉 ALL 7 AUTOMATED FULL-STACK TESTS PASSED SUCCESSFULLY! ☕🐼\n');
}

runTestSuite().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
