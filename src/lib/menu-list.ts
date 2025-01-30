import { Users, StickyNote, LayoutGrid, LucideIcon, NotepadText, Flag, BriefcaseBusiness, FileSpreadsheet, Gem, ListOrdered, Contact, BadgeDollarSign, ArrowRightLeft } from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Managements",
      menus: [
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: []
        },
        {
          href: "/posts",
          label: "Posts",
          active: pathname.includes("/posts"),
          icon: StickyNote,
          submenus: []
        },
        {
          href: "/courses",
          label: "Courses",
          active: pathname.includes("/courses"),
          icon: FileSpreadsheet,
          submenus: []
        },
        {
          href: "/skills",
          label: "Specializations",
          active: pathname.includes("/skills"),
          icon: Gem,
          submenus: []
        },

        {
          href: "/course-transaction",
          label: "Transactions",
          active: pathname.includes("/course-transaction"),
          icon: ArrowRightLeft,
          submenus: []
        },

        {
          href: "/course-purchase",
          label: "Course Purchase",
          active: pathname.includes("/course-purchase"),
          icon: BadgeDollarSign,
          submenus: []
        },
        {
          href: "/plans",
          label: "Plans",
          active: pathname.includes("/plans"),
          icon: Gem,
          submenus: []
        },

        {
          href: "/flaggedUsers",
          label: "Flagged",
          active: pathname.includes("/flagged"),
          icon: Flag,
          submenus: [
            {
              href: "/flagged-users",
              label: "Users",
              active: pathname.includes("/flagged-users")
            },
            {
              href: "/flagged-posts",
              label: "Posts",
              active: pathname.includes("/flagged-posts")
            },
          ]
        },
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/content/privacy_policy",
          label: "Contents",
          active: pathname.includes("/pages"),
          icon: NotepadText,
          submenus: []
        },
        {
          href: "/contact",
          label: "Contact Us",
          active: pathname.includes("/contact"),
          icon: Contact,
          submenus: []
        },
      ]
    }
  ];
}
