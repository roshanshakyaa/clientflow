"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AddClientBtn } from "./_components/AddClientBtn";
import ClientCard from "./_components/ClientCard";

const ClientsPage = () => {
  const clients = useQuery(api.client.getClient);

  return (
    <div className="p-6  space-y-8">
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
            <ClientCard client={client} key={client._id} />
          ))
        )}
      </div>
    </div>
  );
};

export default ClientsPage;
