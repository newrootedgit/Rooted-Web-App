import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Sprout, Users, ClipboardList, CheckSquare, LayoutDashboard } from 'lucide-react';
import { AppLayout, NavItem } from '@shared/ui/components/AppLayout';
import { AppType } from '@shared/ui/components/AppHeader';
import { ProductsPage } from './products/ProductsPage';
import { CustomersPage } from './customers/CustomersPage';
import { OrdersPage } from './orders/OrdersPage';
import { TasksPage } from './tasks/TasksPage';
import { ProductionPage } from './production/ProductionPage';
import { FarmLayoutPage } from './farm-layout/FarmLayoutPage';

const sidebarItems: NavItem[] = [
  { id: 'products', label: 'Varieties', icon: <Sprout size={20} /> },
  { id: 'customers', label: 'Customers', icon: <Users size={20} /> },
  { id: 'orders', label: 'Orders', icon: <ClipboardList size={20} /> },
  { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
  { id: 'production', label: 'Production', icon: <Calendar size={20} /> },
  { id: 'farm-layout', label: 'Farm Layout', icon: <LayoutDashboard size={20} /> },
];

export function PlannerPage() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('products');

  function handleAppChange(app: AppType) {
    if (app === 'machines') {
      navigate('/machines');
    }
  }

  return (
    <AppLayout
      currentApp="planner"
      onAppChange={handleAppChange}
      sidebarItems={sidebarItems}
      activeSidebarItem={activeItem}
      onSidebarItemClick={setActiveItem}
    >
      {activeItem === 'products' && <ProductsPage />}
      {activeItem === 'customers' && <CustomersPage />}
      {activeItem === 'orders' && <OrdersPage />}
      {activeItem === 'tasks' && <TasksPage />}
      {activeItem === 'production' && <ProductionPage />}
      {activeItem === 'farm-layout' && <FarmLayoutPage />}
    </AppLayout>
  );
}
