// components/admin/ProductStats.tsx
import React, { useEffect } from 'react';
import { useAppSelector } from '@/hooks';
import { Package, IndianRupee, Archive } from 'lucide-react';
import { useTheme } from '@/hooks';
import { fetchCategories } from '@/store/slices/productSlice';
import { useAppDispatch } from '@/hooks';
import { fetchProducts } from '@/store/slices/adminSlice';

const ProductStats: React.FC = () => {
  const dispatch = useAppDispatch();
  const {  categories} = useAppSelector(state => state.products);
  const { theme } = useTheme();
  const { products } = useAppSelector(state => state.adminProducts);
  useEffect(() => {
    dispatch(fetchProducts({ page: 1, limit: 10 }));
    dispatch(fetchCategories());
  }, []);
  
  const stats = React.useMemo(() => {
    // const activeProducts = products.filter(p => p.status === 'active').length;
    // const inactiveProducts = products.filter(p => p.status === 'inactive').length;
    const averagePrice = products.list.length > 0 
      ? products.list.reduce((sum, p) => sum + p.price, 0) / products.list.length 
      : 0;


    return [
      {
        title: 'Total Products',
        value: products.list.length.toString(),
        icon: Package,
        color: 'blue'
      },
      // {
      //   title: 'Active Products',
      //   value: products.list.every.toString(),
      //   icon: TrendingUp,
      //   color: 'green'
      // },
      {
        title: 'Average Price',
        value: `${averagePrice.toFixed(2)}`,
        icon: IndianRupee,
        color: 'yellow'
      },
      {
        title: 'Categories Count',
        value: categories.length.toString(),
        icon: Archive,
        color: 'purple'
      }
    ];
  }, [products]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} p-6`}
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-lg ${
              stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
              stat.color === 'green' ? 'bg-green-100 text-green-600' :
              stat.color === 'yellow' ? 'bg-yellow-100 text-yellow-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {stat.title}
              </p>
              <p className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductStats;