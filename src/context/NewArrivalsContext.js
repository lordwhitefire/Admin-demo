// src/context/NewArrivalsContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { client } from '../lib/sanity';

const NewArrivalsContext = createContext();

export const useNewArrivals = () => {
  const context = useContext(NewArrivalsContext);
  if (!context) throw new Error('useNewArrivals must be used within NewArrivalsProvider');
  return context;
};

export const NewArrivalsProvider = ({ children }) => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNewArrivals = async () => {
    setLoading(true);
    try {
      const data = await client.fetch(`
        *[_type == "newArrivalProduct"] | order(_createdAt desc) {
          _id,
          id,
          name,
          shortDescription,
          category,
          "imageUrl": mainImage.asset->url
        }
      `);
      setNewArrivals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const addNewArrival = async (shopProduct) => {
  if (newArrivals.length >= 6) {
    return { success: false, error: 'Max 6 new arrivals allowed' };
  }

  console.log('DEBUG: shopProduct.isNew =', shopProduct.isNew); // ← DEBUG HERE

  try {
    await client.create({
      _type: 'newArrivalProduct',
      id: shopProduct.id,
      name: shopProduct.name,
      shortDescription: shopProduct.shortDescription || '',
      category: shopProduct.category,
      isNew: shopProduct.isNew || false, // ← INHERIT FROM MAIN PRODUCT
      mainImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: shopProduct.imageRef
        }
      }
    });

    console.log('DEBUG: New Arrival created with isNew =', shopProduct.isNew);

    await fetchNewArrivals();
    return { success: true };
  } catch (err) {
    console.error('ADD FAILED:', err);
    return { success: false, error: err.message };
  }
};

  const removeNewArrival = async (id) => {
    try {
      await client.delete(id);
      setNewArrivals(prev => prev.filter(p => p._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchNewArrivals();
  }, []);

  return (
    <NewArrivalsContext.Provider value={{
      newArrivals,
      loading,
      fetchNewArrivals,
      addNewArrival,
      removeNewArrival,
    }}>
      {children}
    </NewArrivalsContext.Provider>
  );
};