import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import { BarPopover } from "./BarPopover";
import { Mail } from "lucide-react";

interface iAppProps {
  _id: Id<"clients">;
  _creationTime: number;
  company?: string | undefined;
  phone?: string | undefined;
  imageUrl?: string | undefined;
  lastContacted?: number | undefined;
  name: string;
  email: string;
  totalRevenue: number;
  outstandingBalance: number;
  userId: string;
}

const ClientCard = ({ client }: { client: iAppProps }) => {
  return (
    <div
      key={client._id}
      className="group relative bg-card border rounded-xl p-5 transition-all hover:shadow-lg "
    >
      <div className="flex justify-between items-start mb-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
          {client.name.charAt(0)}
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <BarPopover />
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
    </div>
  );
};

export default ClientCard;
