import { LayoutDashboard, PackagePlus, PackageSearch, Users, X, Menu } from 'lucide-react'
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FaRegEdit } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const MobileDashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { to: '/dashboard/sales', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/add-product', icon: PackagePlus, label: 'Add Product' },
    { to: '/dashboard/products', icon: PackageSearch, label: 'Products' },
    { to: '/dashboard/users', icon: Users, label: 'Users' },
    { to: '/dashboard/orders', icon: FaRegEdit, label: 'Orders' },
  ];

  const closeSidebar = () => setIsOpen(false);
  const openSidebar = () => setIsOpen(true);

  return (
    <div className="lg:hidden w-full bg-pink-50 border-b border-pink-200 z-40">
      {/* Mobile Menu Button */}
      <div className="p-4">
        <Button
          onClick={openSidebar}
          className="bg-pink-600 hover:bg-pink-700 text-white shadow-md px-4 py-2 font-semibold"
        >
          <Menu className="w-4 h-4 mr-2" />
          Menu
        </Button>
      </div>

      {/* Overlay - Closes sidebar when clicked */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen bg-pink-50 border-r border-pink-200 z-[70] 
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          w-[280px] shadow-2xl
        `}
      >
        {/* Header with Close Button */}
        <div className='flex items-center justify-between p-4 border-b border-pink-200'>
          <h2 className='text-xl font-bold text-gray-800'>Admin Menu</h2>
          <Button
            onClick={closeSidebar}
            className="bg-transparent hover:bg-pink-100 text-gray-800"
            size="icon"
            variant="ghost"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className='p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-pink-100 border border-gray-200'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className='text-base font-semibold'>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer (Optional) */}
        <div className='absolute bottom-0 left-0 right-0 p-4 bg-pink-100 border-t border-pink-200'>
          <p className='text-xs text-center text-gray-600'>Admin Dashboard v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default MobileDashboardSidebar;