import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductState, adapter } from './product.reducer';

export const selectProductState =
  createFeatureSelector<ProductState>('products');

// Entity Selectors
const { selectIds, selectEntities, selectAll, selectTotal } =
  adapter.getSelectors();

export const selectAllProducts = createSelector(selectProductState, selectAll);

export const selectProductEntities = createSelector(
  selectProductState,
  selectEntities
);

export const selectProductIds = createSelector(selectProductState, selectIds);

export const selectTotalProducts = createSelector(
  selectProductState,
  selectTotal
);

// State Property Selectors
export const selectProductsLoading = createSelector(
  selectProductState,
  (state) => state.loading
);

export const selectProductsError = createSelector(
  selectProductState,
  (state) => state.error
);

export const selectSelectedProductId = createSelector(
  selectProductState,
  (state) => state.selectedProductId
);

export const selectCurrentPage = createSelector(
  selectProductState,
  (state) => state.currentPage
);

export const selectSearchQuery = createSelector(
  selectProductState,
  (state) => state.searchQuery
);

export const selectSelectedCategory = createSelector(
  selectProductState,
  (state) => state.selectedCategory
);

export const selectProductFilters = createSelector(
  selectProductState,
  (state) => state.filters
);

export const selectProductsTotal = createSelector(
  selectProductState,
  (state) => state.total
);

// Computed Selectors
export const selectSelectedProduct = createSelector(
  selectProductEntities,
  selectSelectedProductId,
  (entities, selectedId) => (selectedId ? entities[selectedId] : null)
);

export const selectFilteredProducts = createSelector(
  selectAllProducts,
  selectSearchQuery,
  selectSelectedCategory,
  selectProductFilters,
  (products, searchQuery, selectedCategory, filters) => {
    let filteredProducts = products;

    // Filter by search query with null checks
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter((product) => {
        if (!product) return false;

        // Safe string checking with fallbacks
        const title = (product.title || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const brand = (product.brand || '').toLowerCase();
        const tags = product.tags || [];

        return (
          title.includes(query) ||
          description.includes(query) ||
          brand.includes(query) ||
          tags.some((tag) => (tag || '').toLowerCase().includes(query))
        );
      });
    }

    // Filter by category with null check
    if (selectedCategory && selectedCategory.trim()) {
      filteredProducts = filteredProducts.filter(
        (product) => product && product.category === selectedCategory
      );
    }

    // Filter by price range with null checks
    if (filters && filters.priceRange) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product &&
          typeof product.price === 'number' &&
          product.price >= filters.priceRange.min &&
          product.price <= filters.priceRange.max
      );
    }

    // Filter by rating with null checks
    if (filters && filters.rating > 0) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product &&
          typeof product.rating === 'number' &&
          product.rating >= filters.rating
      );
    }

    return filteredProducts;
  }
);

export const selectProductCategories = createSelector(
  selectAllProducts,
  (products) => {
    const categories = products
      .filter((product) => product && product.category)
      .map((product) => product.category);
    return [...new Set(categories)].sort();
  }
);

export const selectProductById = (id: number) =>
  createSelector(selectProductEntities, (entities) => entities[id]);
