import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NotificationItem({ notification, onMarkAsRead, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const IconComponent = notification.icon;

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(() => {
      onDelete(notification.id);
    }, 300);
  };

  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id);
  };

  return (
    <AnimatePresence>
      {!isDeleting && (
        <motion.div
          initial={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className={`rounded-xl p-4 border transition-all duration-200 hover:shadow-md ${
            notification.isRead 
              ? 'bg-white border-emerald-200' 
              : 'bg-emerald-50 border-2 border-emerald-600'
          }`}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-emerald-600">
              <IconComponent className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm leading-tight mb-1 text-emerald-800">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {notification.message}
                  </p>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-emerald-50">
                      <MoreVertical className="w-4 h-4 text-emerald-700" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dialog-bg">
                    {!notification.isRead && (
                      <DropdownMenuItem onClick={handleMarkAsRead} className="hover:bg-emerald-50">
                        <Check className="w-4 h-4 mr-2 text-emerald-800" />
                        Mark as Read
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleDelete} className="hover:bg-red-50 text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-emerald-700">
                  {notification.timestamp}
                </span>
                {!notification.isRead && (
                  <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}