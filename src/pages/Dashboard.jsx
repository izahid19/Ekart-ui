import Sidebar from '@/components/Sidebar'
import MobileDashboardSidebar from '@/components/MobileDashboardSidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='flex min-h-screen bg-gray-100 pt-20'> {/* Added pt-20 for navbar spacing */}
      <Sidebar /> {/* Desktop only */}
      <div className='flex-1 w-full flex flex-col'>
        <MobileDashboardSidebar /> {/* Mobile only - at top of content */}
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard