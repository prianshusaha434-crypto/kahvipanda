import { Router, Request, Response } from 'express';
import { ProductService } from '../modules/products/product-service';
import { CartService } from '../modules/cart/cart-service';
import { OrderService } from '../modules/orders/order-service';
import { EnquiryService } from '../modules/enquiry/enquiry-service';
import { PandaAIService } from '../modules/ai/panda-ai-service';
import { AuthService, authenticateToken, requireAdmin } from '../modules/auth/auth-service';
import { prisma } from '../db';
import {
  CartItemSchema,
  EnquiryFormSchema,
  CheckoutPayloadSchema,
  AIChatRequestSchema
} from '@kahvi-panda/shared';

const router = Router();

// ==========================================
// 1. PUBLIC STOREFRONT ROUTES
// ==========================================

// Get all products with filtering & sorting
router.get('/products', async (req: Request, res: Response) => {
  try {
    const { category, coffeeType, roastLevel, minPrice, maxPrice, search, sort, featured, bestseller, page, limit } = req.query;
    const result = await ProductService.getProducts({
      categorySlug: category as string,
      coffeeType: coffeeType as string,
      roastLevel: roastLevel as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      search: search as string,
      sort: sort as any,
      featuredOnly: featured === 'true',
      bestsellerOnly: bestseller === 'true',
      page: page ? parseInt(page as string, 10) : 1,
      limit: limit ? parseInt(limit as string, 10) : 24
    });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get bestsellers (The Panda Picks)
router.get('/products/bestsellers', async (_req: Request, res: Response) => {
  try {
    const bestsellers = await ProductService.getBestsellers();
    res.json(bestsellers);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Search products
router.get('/products/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string || '';
    const results = await ProductService.searchCatalog(query);
    res.json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product by slug
router.get('/products/:slug', async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getProductBySlug(req.params.slug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get all categories
router.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await ProductService.getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Calculate verified cart values
router.post('/cart/calculate', async (req: Request, res: Response) => {
  try {
    const { items, couponCode } = req.body;
    const validatedItems = items?.map((i: any) => CartItemSchema.parse(i)) || [];
    const calculation = await CartService.calculateCart(validatedItems, couponCode);
    res.json(calculation);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Checkout - place order
router.post('/checkout', async (req: Request, res: Response) => {
  try {
    const payload = CheckoutPayloadSchema.parse(req.body);
    const userId = (req as any).user?.userId;
    const orderResult = await OrderService.createOrder(payload, userId);
    res.status(201).json(orderResult);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Verify Razorpay payment signature
router.post('/checkout/verify-payment', async (req: Request, res: Response) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const result = await OrderService.verifyRazorpayPayment(
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Get order details for tracking / confirmation
router.get('/orders/:identifier', async (req: Request, res: Response) => {
  try {
    const order = await OrderService.getOrderByIdOrNumber(req.params.identifier);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// General contact & wholesale enquiry form
router.post('/contact', async (req: Request, res: Response) => {
  try {
    const validated = EnquiryFormSchema.parse(req.body);
    const result = await EnquiryService.submitEnquiry(validated);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Wholesale B2B enquiry alias
router.post('/wholesale', async (req: Request, res: Response) => {
  try {
    const validated = EnquiryFormSchema.parse({
      ...req.body,
      type: 'WHOLESALE_B2B'
    });
    const result = await EnquiryService.submitEnquiry(validated);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Newsletter subscription
router.post('/newsletter/subscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email: email.toLowerCase() },
      update: { isActive: true },
      create: { email: email.toLowerCase() }
    });
    res.json({ success: true, message: 'Welcome to the Kahvi Panda coffee circle! ☕🐼' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Coffee Journal / Educational Blogs
router.get('/blogs', async (_req: Request, res: Response) => {
  try {
    const blogs = await prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' }
    });
    res.json(blogs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/blogs/:slug', async (req: Request, res: Response) => {
  try {
    const blog = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug }
    });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. PANDA AI CHAT CONCIERGE
// ==========================================
router.post('/ai/chat', async (req: Request, res: Response) => {
  try {
    const { sessionId, message, language } = AIChatRequestSchema.parse(req.body);
    const response = await PandaAIService.handleChat(sessionId, message, language);
    res.json(response);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ==========================================
// 3. AUTHENTICATION & ACCOUNT
// ==========================================
router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }
    const result = await AuthService.register(name, email, password, phone);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

router.get('/auth/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const profile = await AuthService.getUserProfile(userId);
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/account/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const profile = await AuthService.getUserProfile(userId);
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. PROTECTED ADMIN PORTAL
// ==========================================
router.get('/admin/overview', authenticateToken, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [totalOrders, totalEnquiries, totalProducts, aiConvs] = await Promise.all([
      prisma.order.count(),
      prisma.enquiry.count(),
      prisma.product.count(),
      prisma.aIConversation.count()
    ]);

    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });

    const recentEnquiries = await prisma.enquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    const revenueAggregate = await prisma.order.aggregate({
      where: { status: { in: ['CONFIRMED', 'DELIVERED', 'PROCESSING'] } },
      _sum: { totalAmount: true }
    });

    res.json({
      metrics: {
        totalOrders,
        totalEnquiries,
        totalProducts,
        totalConversations: aiConvs,
        totalRevenue: revenueAggregate._sum.totalAmount || 0
      },
      recentOrders,
      recentEnquiries
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin product list & create
router.get('/admin/products', authenticateToken, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        variants: true,
        images: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/admin/products', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: data.description,
        shortDescription: data.shortDescription,
        categoryId: data.categoryId,
        coffeeType: data.coffeeType,
        roastLevel: data.roastLevel,
        origin: data.origin,
        tastingNotes: data.tastingNotes,
        compatibleBrewingMethods: data.compatibleBrewingMethods,
        ingredients: data.ingredients,
        featured: !!data.featured,
        bestseller: !!data.bestseller,
        images: {
          create: (data.images || []).map((url: string, i: number) => ({ url, sortOrder: i }))
        },
        variants: {
          create: (data.variants || []).map((v: any) => ({
            sku: v.sku,
            weight: v.weight,
            grindType: v.grindType,
            price: parseFloat(v.price),
            compareAtPrice: v.compareAtPrice ? parseFloat(v.compareAtPrice) : null,
            stockQuantity: parseInt(v.stockQuantity || '50', 10),
            isAvailable: true
          }))
        }
      }
    });
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin order status update
router.get('/admin/orders', authenticateToken, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/admin/orders/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const order = await OrderService.updateOrderStatus(req.params.id, req.body.status);
    res.json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin enquiries list & update
router.get('/admin/enquiries', authenticateToken, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const enquiries = await EnquiryService.getEnquiries();
    res.json(enquiries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/admin/enquiries/:id', authenticateToken, requireAdmin, async (req: Request, res: Response) => {
  try {
    const enquiry = await EnquiryService.updateEnquiryStatus(req.params.id, req.body.notes, req.body.whatsAppStatus);
    res.json(enquiry);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin AI Analytics
router.get('/admin/ai-analytics', authenticateToken, requireAdmin, async (_req: Request, res: Response) => {
  try {
    const [totalConversations, totalMessages, events] = await Promise.all([
      prisma.aIConversation.count(),
      prisma.aIMessage.count(),
      prisma.aIRecommendationEvent.findMany({ take: 50, orderBy: { createdAt: 'desc' } })
    ]);

    res.json({
      totalConversations,
      totalMessages,
      recentEvents: events
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
