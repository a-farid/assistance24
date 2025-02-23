import {
    LucideIcon,
    Check,
  } from "lucide-react";
  
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
  
  export const navbar_list: I_NavBarList[] = [
    // {
    //   name: "Home",
    //   link: "/home",
    //   icon: House,
    //   subItems: [
    //     {
    //       label: "Home",
    //       href: "/home",
    //       icon: Notebook,
    //     },
    //     {
    //       label: "About",
    //       href: "/home/about",
    //       icon: Info,
    //     },
    //     {
    //       label: "Contact",
    //       href: "/home/contact",
    //       icon: Contact,
    //     },
    //   ],
    // },
    {
      name: "Secretariat",
      link: "/secretariat",
      icon: Check,
      subItems: [
        {
          label: "Agenda",
          href: "/secretariat/agenda",
          icon: Check,
        },
        {
          label: "Militaire",
          href: "/secretariat/militaire",
          icon: Check,
        },
        {
          label: "Autorisations",
          href: "/secretariat/autorisations",
          icon: Check,
        },
        {
          label: "Permissions",
          href: "/secretariat/permissions",
          icon: Check,
        },
        // {
        //   label: "Detachements",
        //   href: "/secretariat/detachements",
        //   icon: Check,
        // },
      ],
    },
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
    {
      name: "Admin",
      link: "/admin",
      icon: Check,
      subItems: [
        {
          label: "Pointage GR",
          href: "/pointage",
          icon: Check,
        },
        {
          label: "Users",
          href: "/admin/users",
          icon: Check,
        },
        {
          label: "Roles",
          href: "/admin/roles",
          icon: Check,
        },
        {
          label: "Permissions",
          href: "/admin/permissions",
          icon: Check,
        },
      ],
    },
  ];