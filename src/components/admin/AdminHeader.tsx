"use client";

import Link from "next/link";
import Image from "next/image";
import { LogOut, User, Home } from "lucide-react";
import { useState } from "react";

interface AdminHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    // Use NextAuth signOut
    const { signOut } = await import("next-auth/react");
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-6">
        {/* Logo/Brand */}
        <Link href="/admin" className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-br from-carolina to-dark-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">OD</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">Content Management System</p>
          </div>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* View Site Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-carolina hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>View Site</span>
          </Link>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "User"}
                  width={32}
                  height={32}
                  className="rounded-full"
                  unoptimized
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-carolina flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-900">{user.name || "Admin"}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name || "Admin"}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
