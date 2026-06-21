import { LucideIcon, Check, Newspaper, LayoutDashboard } from "lucide-react";

// Explicitly define your system roles as a strict union type
export type SystemRole = 'admin' | 'worker' | 'client';

export interface I_SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /**
   * 💡 Roles authorized to view this specific sub-item. 
   * If omitted, it defaults to public access within the parent boundary.
   */
  roles?: SystemRole[]; 
}

export interface I_NavBarList {
  name: string;
  link: string;
  icon: LucideIcon;
  roles: SystemRole[]; // 💡 Explicit access policy control for the root-level workspace item
  subItems?: I_SidebarItem[];
}

export const ROUTE_SECURITY: I_NavBarList[] = [
  {
    name: "Admin",
    link: "/admin",
    icon: LayoutDashboard,
    roles: ["admin"], // Strictly isolates the entire admin subtree configuration block
    subItems: [
      { label: "Users", href: "/admin/users", icon: Check },
      { label: "FAQ", href: "/admin/faq", icon: Check },
    ],
  }, {
    name: "Contracts",
    link: "/contracts",
    icon: Newspaper,
    roles: ["admin", "client", "worker"],
    subItems: [
      {
        label: "All contracts",
        href: "/contracts/all",
        icon: Check,
        roles: ["admin"],
      },
      {
        label: "Create new contract",
        href: "/contracts/create",
        icon: Check,
        roles: ["admin"],
      },
      {
        label: "My contracts",
        href: "/contracts/my-contracts",
        icon: Check,
        roles: ["client", "worker"],
      },
      {
        label: "Statistiques",
        href: "/contracts/statistiques",
        icon: Check,
        roles: ["admin", "client", "worker"],
      },
    ],
  },
];