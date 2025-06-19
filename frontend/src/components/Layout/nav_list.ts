import {LucideIcon, Check, Newspaper, LayoutDashboard } from "lucide-react";

  export interface I_SidebarItem {
    label: string;
    href: string;
    icon: LucideIcon;
  }
  export interface I_NavBarList {
    name: string;
    link: string;
    icon: LucideIcon;
    subItems?: I_SidebarItem[];
  }

  export const admin_navbar_list: I_NavBarList[] = [
    {
      name: "Contracts",
      link: "/contracts",
      icon: Newspaper,
      subItems: [
        {
          label: "All contracts",
          href: "/contracts/all",
          icon: Check,
        },
        {
          label: "Create new contract",
          href: "/contracts/create",
          icon: Check,
        },
        {
          label: "Statistiques",
          href: "/contracts/statistiques",
          icon: Check,
        },
      ],
    },
    {
      name: "Admin",
      link: "/admin",
      icon: LayoutDashboard,
      subItems: [
        {
          label: "Users",
          href: "/admin/users",
          icon: Check,
        },
        {
          label: "Clients",
          href: "/admin/clients",
          icon: Check,
        },
        {
          label: "Workers",
          href: "/admin/workers",
          icon: Check,
        },
        {
          label: "FAQ",
          href: "/admin/faq",
          icon: Check,
        },
      ],
    },
  ];


  export const client_navbar_list: I_NavBarList[] = [
    {
      name: "Contracts",
      link: "/contracts",
      icon: Check,
      subItems: [
        {
          label: "Statistiques",
          href: "/dossiers/nouveau",
          icon: Check,
        },
        {
          label: "Documents",
          href: "/dossiers/en-cours",
          icon: Check,
        },
        {
          label: "Coordination",
          href: "/dossiers/clotures",
          icon: Check,
        },
      ],
    },
  ];


  export const worker_navbar_list: I_NavBarList[] = [
    {
      name: "Dossiers",
      link: "/dossiers",
      icon: Check,
      subItems: [
        {
          label: "Statistiques",
          href: "/dossiers/nouveau",
          icon: Check,
        },
        {
          label: "Documents",
          href: "/dossiers/en-cours",
          icon: Check,
        },
        {
          label: "Coordination",
          href: "/dossiers/clotures",
          icon: Check,
        },
      ],
    },
  ];

  // export const navbar_list: I_NavBarList[] = [
  //   {
  //     name: "Secretariat",
  //     link: "/secretariat",
  //     icon: Check,
  //     subItems: [
  //       {
  //         label: "Agenda",
  //         href: "/secretariat/agenda",
  //         icon: Check,
  //       },
  //       {
  //         label: "Militaire",
  //         href: "/secretariat/militaire",
  //         icon: Check,
  //       },
  //       {
  //         label: "Autorisations",
  //         href: "/secretariat/autorisations",
  //         icon: Check,
  //       },
  //       {
  //         label: "Permissions",
  //         href: "/secretariat/permissions",
  //         icon: Check,
  //       },
  //     ],
  //   },
  //   {
  //     name: "Dossiers",
  //     link: "/dossiers",
  //     icon: Check,
  //     subItems: [
  //       {
  //         label: "Statistiques",
  //         href: "/dossiers/nouveau",
  //         icon: Check,
  //       },
  //       {
  //         label: "Documents",
  //         href: "/dossiers/en-cours",
  //         icon: Check,
  //       },
  //       {
  //         label: "Coordination",
  //         href: "/dossiers/clotures",
  //         icon: Check,
  //       },
  //     ],
  //   },
  //   {
  //     name: "Admin",
  //     link: "/admin",
  //     icon: Check,
  //     subItems: [
  //       {
  //         label: "Pointage GR",
  //         href: "/pointage",
  //         icon: Check,
  //       },
  //       {
  //         label: "Users",
  //         href: "/admin/users",
  //         icon: Check,
  //       },
  //       {
  //         label: "Roles",
  //         href: "/admin/roles",
  //         icon: Check,
  //       },
  //       {
  //         label: "Permissions",
  //         href: "/admin/permissions",
  //         icon: Check,
  //       },
  //     ],
  //   },
  // ];