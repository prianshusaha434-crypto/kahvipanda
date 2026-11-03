import { prisma } from '../../db';

export interface ProductFilterOptions {
  categorySlug?: string;
  coffeeType?: string;
  roastLevel?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'newest';
  featuredOnly?: boolean;
  bestsellerOnly?: boolean;
  page?: number;
  limit?: number;
}

export class ProductService {
  static async getProducts(filters: ProductFilterOptions = {}) {
    const {
      categorySlug,
      coffeeType,
      roastLevel,
      minPrice,
      maxPrice,
      search,
      sort = 'popular',
      featuredOnly,
      bestsellerOnly,
      page = 1,
      limit = 24
    } = filters;

    const where: any = {
      status: 'ACTIVE'
    };

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (coffeeType) {
      where.coffeeType = coffeeType;
    }

    if (roastLevel) {
      where.roastLevel = roastLevel;
    }

    if (featuredOnly) {
      where.featured = true;
    }

    if (bestsellerOnly) {
      where.bestseller = true;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tastingNotes: { contains: search } },
        { origin: { contains: search } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    if (sort === 'popular') orderBy = { bestseller: 'desc' };

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { orderBy: { price: 'asc' } }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.product.count({ where })
    ]);

    // Apply price filter on variants if requested
    let filteredProducts = products;
    if (minPrice !== undefined || maxPrice !== undefined) {
      filteredProducts = products.filter(p => {
        const lowestVariantPrice = p.variants[0]?.price ?? 0;
        if (minPrice !== undefined && lowestVariantPrice < minPrice) return false;
        if (maxPrice !== undefined && lowestVariantPrice > maxPrice) return false;
        return true;
      });
    }

    if (sort === 'price_asc') {
      filteredProducts.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
    } else if (sort === 'price_desc') {
      filteredProducts.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
    }

    return {
      products: filteredProducts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  static async getProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { price: 'asc' } },
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
  }

  static async getCategories() {
    return prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: { select: { products: true } }
      }
    });
  }

  static async getBestsellers() {
    return prisma.product.findMany({
      where: { bestseller: true, status: 'ACTIVE' },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { price: 'asc' } }
      },
      take: 6
    });
  }

  static async searchCatalog(query: string) {
    const cleanQ = query.trim().toLowerCase();
    return prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { name: { contains: cleanQ } },
          { description: { contains: cleanQ } },
          { tastingNotes: { contains: cleanQ } },
          { origin: { contains: cleanQ } },
          { coffeeType: { contains: cleanQ } },
          { roastLevel: { contains: cleanQ } }
        ]
      },
      include: {
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { price: 'asc' } }
      },
      take: 8
    });
  }
}
