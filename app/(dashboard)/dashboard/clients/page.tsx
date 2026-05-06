"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AddClientBtn } from "./_components/AddClientBtn";
import {
  User,
  Mail,
  DollarSign,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react";

const ClientsPage = () => {
  const clients = useQuery(api.client.getClient);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">
            Manage your relationships and track client revenue.
          </p>
        </div>
        <AddClientBtn />
      </div>

      {/* Stats Overview (Optional but looks great) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* You can add summary cards here later */}
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients === undefined ? (
          // Skeleton loaders would go here
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 w-full bg-gray-100 animate-pulse rounded-xl"
            />
          ))
        ) : clients.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">
              No clients found. Click the button above to add your first one.
            </p>
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client._id}
              className="group relative bg-card border rounded-xl p-5 transition-all hover:shadow-lg hover:border-primary/50"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {client.name.charAt(0)}
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="font-semibold text-lg leading-none group-hover:text-primary transition-colors">
                  {client.name}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-3 w-3" />
                  {client.email}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Total Revenue
                  </p>
                  <p className="text-sm font-bold text-green-600">
                    ${client.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                    Outstanding
                  </p>
                  <p className="text-sm font-bold text-orange-600">
                    ${client.outstandingBalance.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
