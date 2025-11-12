// src/context/ProductsContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { client } from '../lib/sanity';

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProducts must be used within ProductsProvider');
  return context;
};

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all shop products
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = `*[_type == "shopProduct"] | order(name asc) {
        _id,
        id,
        name,
        shortDescription,
        description,
        category,
        tags,
        isNew,
        "imageUrl": mainImage.asset->url,
        "imageRef": mainImage.asset->_id
      }`;
      const data = await client.fetch(query);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle isNew — MAX 6 ONLY
  const toggleNewArrival = async (productId) => {
    const product = products.find(p => p._id === productId);
    if (!product) return { success: false, error: 'Product not found' };

    const currentNewCount = products.filter(p => p.isNew).length;
    const willBeNew = !product.isNew;

    if (willBeNew && currentNewCount >= 6) {
      return { success: false, error: 'Max 6 new arrivals allowed' };
    }

    try {
      await client
        .patch(productId)
        .set({ isNew: willBeNew })
        .commit();

      setProducts(prev =>
        prev.map(p =>
          p._id === productId ? { ...p, isNew: willBeNew } : p
        )
      );
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Add new product
  const addProduct = async (productData) => {
    try {
      const doc = {
        _type: 'shopProduct',
        ...productData,
        isNew: false,
      };
      const result = await client.create(doc);
      await fetchProducts(); // Refresh
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Update product
  const updateProduct = async (id, updates) => {
    try {
      await client.patch(id).set(updates).commit();
      await fetchProducts();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await client.delete(id);
      setProducts(prev => prev.filter(p => p._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Load on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    toggleNewArrival,
    addProduct,
    updateProduct,
    deleteProduct,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};