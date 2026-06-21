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

export const NAVBAR_LIST: I_NavBarList[] = [
  {
    name: "Contracts",
    link: "/contracts",
    icon: Newspaper,
    roles: ["admin", "client"], // Only accessible by administrators and client profiles
    subItems: [
      {
        label: "All contracts",
        href: "/contracts/all",
        icon: Check,
        roles: ["admin"], // Further restrict specific sub-actions to admins only
      },
      {
        label: "Create new contract",
        href: "/contracts/create",
        icon: Check,
        roles: ["admin"],
      },
      {
        label: "Statistiques",
        href: "/contracts/statistiques",
        icon: Check,
        roles: ["admin", "client"],
      },
      {
        label: "Documents",
        href: "/dossiers/en-cours",
        icon: Check,
        roles: ["client"], // Visible only to clients under the contracts section
      },
      {
        label: "Coordination",
        href: "/dossiers/clotures",
        icon: Check,
        roles: ["client"],
      },
    ],
  },
  {
    name: "Admin",
    link: "/admin",
    icon: LayoutDashboard,
    roles: ["admin"], // Strictly isolates the entire admin subtree configuration block
    subItems: [
      { label: "Users", href: "/admin/users", icon: Check },
      { label: "Clients", href: "/admin/clients", icon: Check },
      { label: "Workers", href: "/admin/workers", icon: Check },
      { label: "FAQ", href: "/admin/faq", icon: Check },
    ],
  },
  {
    name: "Dossiers",
    link: "/dossiers",
    icon: Check,
    roles: ["worker"], // Worker-specific execution space
    subItems: [
      { label: "Statistiques", href: "/dossiers/nouveau", icon: Check },
      { label: "Documents", href: "/dossiers/en-cours", icon: Check },
      { label: "Coordination", href: "/dossiers/clotures", icon: Check },
    ],
  },
];