"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Image,
  BarChart3,
  Tag,
  Settings,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      label: "Projects",
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      label: "Blogs",
      href: "/admin/blogs",
      icon: FileText,
    },
    {
      label: "Media",
      href: "/admin/media",
      icon: Image,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      label: "Tags",
      href: "/admin/tags",
      icon: Tag,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-carolina text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-100 hover:text-carolina"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 mt-8 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Quick Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Projects</span>
            <span className="font-semibold text-gray-900">-</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Blogs</span>
            <span className="font-semibold text-gray-900">-</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Images</span>
            <span className="font-semibold text-gray-900">-</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
