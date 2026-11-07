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
    const currentPage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
    const pageSize = Number.isFinite(limit) ? Math.min(100, Math.max(1, Math.floor(limit))) : 24;
    const validMinPrice = Number.isFinite(minPrice) ? minPrice : undefined;
    const validMaxPrice = Number.isFinite(maxPrice) ? maxPrice : undefined;

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

    if (validMinPrice !== undefined || validMaxPrice !== undefined) {
      where.variants = {
        some: {
          price: {
            ...(validMinPrice !== undefined ? { gte: validMinPrice } : {}),
            ...(validMaxPrice !== undefined ? { lte: validMaxPrice } : {})
          }
        }
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { tastingNotes: { contains: search } },
        { origin: { contains: search } },
        { compatibleBrewingMethods: { contains: search } },
        { variants: { some: { grindType: { contains: search } } } }
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };
    if (sort === 'popular') orderBy = { bestseller: 'desc' };

    const skip = (currentPage - 1) * pageSize;
    const sortByPrice = sort === 'price_asc' || sort === 'price_desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          images: { orderBy: { sortOrder: 'asc' } },
          variants: { orderBy: { price: 'asc' } }
        },
        orderBy,
        ...(sortByPrice ? {} : { skip, take: pageSize })
      }),
      prisma.product.count({ where })
    ]);

    if (sort === 'price_asc') {
      products.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
    } else if (sort === 'price_desc') {
      products.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
    }
    const pagedProducts = sortByPrice ? products.slice(skip, skip + pageSize) : products;

    return {
      products: pagedProducts,
      pagination: {
        total,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  static async getProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug, status: 'ACTIVE' },
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
    const cleanQ = query.trim();
    if (!cleanQ) return [];

    return prisma.product.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { name: { contains: cleanQ } },
          { description: { contains: cleanQ } },
          { tastingNotes: { contains: cleanQ } },
          { origin: { contains: cleanQ } },
          { compatibleBrewingMethods: { contains: cleanQ } },
          { variants: { some: { grindType: { contains: cleanQ } } } },
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
