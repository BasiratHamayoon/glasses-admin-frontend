import { 
  LayoutDashboard, Package, Store, Box, MonitorSmartphone, 
  Wallet, Banknote, Users, UsersRound, Settings, 
  ShoppingCart, ClipboardList, Layers, BookLock, BarChart3
} from "lucide-react";

export const navLinks = [
  {
    title: 'core',
    items: [
      { name: 'dashboard',        href: '/dashboard',          icon: LayoutDashboard   },
      { name: 'products',         href: '/products',           icon: Package           },
      { name: 'categories',       href: '/categories',         icon: Layers            },
      { name: 'orders',           href: '/orders',             icon: ShoppingCart       },
      { name: 'orderStatistics',  href: '/order-statistics',   icon: BarChart3         },
      { name: 'stockMmt',         href: '/stock',              icon: Box               },
      { name: 'shops',            href: '/shops',              icon: Store              },
      { name: 'posMonitor',       href: '/monitoring',         icon: MonitorSmartphone  },
      { name: 'closings',         href: '/closings',           icon: BookLock           },
    ]
  },
  {
    title: 'finance',
    items: [
      { name: 'finance',   href: '/finance',    icon: Wallet        },
      { name: 'salary',    href: '/salary',     icon: Banknote      },
      { name: 'purchases', href: '/purchases',  icon: ClipboardList },
    ]
  },
  {
    title: 'people',
    items: [
      { name: 'employees', href: '/employees', icon: Users      },
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