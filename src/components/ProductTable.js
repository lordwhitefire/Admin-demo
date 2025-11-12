// src/components/ProductTable.js
import { useProducts } from '../context/ProductsContext';

const ProductTable = ({ products, onEdit, onDelete }) => {
  const { toggleNewArrival } = useProducts();

  const handleToggleNew = async (product) => {
    const result = await toggleNewArrival(product._id);
    if (!result.success) {
      alert(result.error);
    }
  };

  if (products.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-500">No products found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Image
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              Category
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              New
            </th>
            <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id} className="hover:bg-gray-50 transition">
              {/* Image */}
              <td className="px-6 py-4 whitespace-nowrap">
                <img
                  src={product.imageUrl || 'https://via.placeholder.com/60'}
                  alt={product.name}
                  className="w-12 h-12 rounded-lg object-cover shadow-sm"
                />
              </td>

              {/* Name */}
              <td className="px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 hidden lg:block">
                    {product.shortDescription?.substring(0, 60)}...
                  </p>
                </div>
              </td>

              {/* Category */}
              <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  {product.category}
                </span>
              </td>

              {/* New Toggle */}
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={() => handleToggleNew(product)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    product.isNew
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600'
                      : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition ${
                      product.isNew ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(product)}
                  className="text-indigo-600 hover:text-indigo-900 font-medium transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product._id)}
                  className="text-red-600 hover:text-red-900 font-medium transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;