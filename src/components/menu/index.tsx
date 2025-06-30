// src/components/Menu.tsx
import React from "react";
import { useLogout, useMenu } from "@refinedev/core";
import { NavLink } from "react-router";
import { LogOut, Menu as MenuIcon, X } from "lucide-react";
import { UserMicroProfile } from "../layout/UserMicroProfile";
import { cn } from "@/utility";
import { Button, ScrollArea, Separator } from "../ui";

interface MenuProps {
  onClose?: () => void;
}

export const Menu: React.FC<MenuProps> = ({ onClose }) => {
  const { mutate: logout } = useLogout();
  const { menuItems } = useMenu();

  const handleNavClick = () => {
    // Zamknij menu na mobile po kliknięciu w link
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b px-6">
        <div className="flex items-center">
          <MenuIcon className="h-6 w-6 mr-2" />
          <span className="font-semibold">Logo.com</span>
        </div>
        {/* Close button - widoczny tylko na mobile */}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.route ?? "/"}
              onClick={handleNavClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )
              }
            >
              {item.icon && (
                <span className="mr-3 flex items-center">
                  {React.isValidElement(item.icon) ? item.icon : item.icon}
                </span>
              )}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {/* User Profile Section */}
      <Separator />
      <UserMicroProfile className="border-b" />

      {/* Footer */}
      <div className="p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            logout();
            if (onClose) onClose();
          }}
          className="w-full justify-start"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};