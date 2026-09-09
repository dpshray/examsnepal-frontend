"use client";

import { useGetBlockedUsers, useUnblockUser } from "@/hooks/use-forum";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldOff, UserX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export default function BlockedUsers() {
  const { data, isLoading } = useGetBlockedUsers();
  const { mutate: unblockUser, isPending, variables } = useUnblockUser();

  const blockedUsers = data?.data ?? [];

  return (
    <div className="w-full max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <ShieldOff className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold font-poppins text-black">
            Blocked Users
          </h1>
          {!isLoading && (
            <p className="text-sm text-gray-500">
              {blockedUsers.length}{" "}
              {blockedUsers.length === 1 ? "person" : "people"} blocked
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : blockedUsers.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 bg-gray-50 rounded-2xl"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-white shadow-sm rounded-full flex items-center justify-center">
            <UserX className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            No blocked users
          </h3>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            Anyone you block will show up here, and you can unblock them
            anytime.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {blockedUsers.map((user: any) => {
              const isThisPending = isPending && variables === user.blocked_id;
              return (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:border-red-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-sm font-semibold font-poppins">
                      {getInitials(user.blocked_name)}
                    </div>
                    <span className="font-medium text-sm text-gray-800 truncate">
                      {user.blocked_name}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isThisPending}
                    onClick={() => unblockUser(user.blocked_id)}
                    className="shrink-0 border-gray-300 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    {isThisPending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Unblocking
                      </>
                    ) : (
                      "Unblock"
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
