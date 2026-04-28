import { 
  LayoutDashboard, Package, Store, Box, MonitorSmartphone, 
  Wallet, Banknote, Users, UserCircle, UsersRound, 
  FileText, BarChart, Settings, 
  ShoppingCart, ClipboardList
} from "lucide-react";

export const navLinks = [
  {
    title: 'core',
    items: [
      { name: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'products', href: '/products', icon: Package },
      { name: 'orders', href: '/orders', icon: ShoppingCart },
      { name: 'stockMmt', href: '/stock', icon: Box },
      { name: 'shops', href: '/shops', icon: Store },
      { name: 'posMonitor', href: '/monitoring', icon: MonitorSmartphone },
    ]
  },
  {
    title: 'finance',
    items: [
      { name: 'finance', href: '/finance', icon: Wallet },
      { name: 'salary', href: '/salary', icon: Banknote },
      { name: 'purchases', href: '/purchases', icon: ClipboardList },
    ]
  },
  {
    title: 'people',
    items: [
      { name: 'employees', href: '/employees', icon: Users },
      { name: 'customers', href: '/customers', icon: UsersRound },
    ]
  },
  {
    title: 'settings',
    items: [
      { name: 'settings', href: '/settings', icon: Settings },
    ]
  }
];