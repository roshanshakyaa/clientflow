"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import {
  Mail,
  Phone,
  Building2,
  ArrowLeft,
  ExternalLink,
  DollarSign,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = params.clientId as Id<"clients">;

  const client = useQuery(api.client.getClientById, { clientId });
  const projects = useQuery(api.project.getProjectsOfClient, { clientId });

  if (client === undefined || projects === undefined) {
    return <div className="p-8 animate-pulse">Loading Client Workspace...</div>;
  }

  if (client === null) {
    return <div className="p-8">Client not found.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/30">
      {/* Header */}
      <div className="bg-white border-b px-8 py-6">
        <div className="max-w-7xl mx-auto w-full space-y-4">
          <Link
            href="/dashboard/clients"
            className="text-xs text-muted-foreground hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="size-3" /> Back to Clients
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                {client.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                {client.company && (
                  <div className="flex items-center gap-1.5">
                    <Building2 className="size-4" /> {client.company}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Mail className="size-4" /> {client.email}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Edit Client
              </Button>
              <Button size="sm">New Project</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Contact */}
        <div className="space-y-6">
          <section className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Financial Overview
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${client.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-50">
                <p className="text-sm text-slate-500">Outstanding Balance</p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    client.outstandingBalance > 0
                      ? "text-red-500"
                      : "text-slate-400",
                  )}
                >
                  ${client.outstandingBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Quick Contact
            </h3>
            <div className="space-y-3">
              <Button
                variant="secondary"
                className="w-full justify-start gap-3 h-11"
                asChild
              >
                <a href={`mailto:${client.email}`}>
                  <Mail className="size-4" /> Email Client
                </a>
              </Button>
              {client.phone && (
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-11"
                  asChild
                >
                  <a href={`tel:${client.phone}`}>
                    <Phone className="size-4" /> {client.phone}
                  </a>
                </Button>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Projects List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Projects ({projects.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {projects.length === 0 ? (
              <div className="bg-white border-2 border-dashed rounded-2xl p-12 text-center text-slate-400">
                No projects assigned to this client.
              </div>
            ) : (
              projects.map((project) => (
                <Link
                  key={project._id}
                  href={`/dashboard/projects/${project._id}`}
                  className="group bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:border-blue-200 hover:shadow-md hover:shadow-blue-500/5 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                      <Briefcase className="size-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Deadline: {format(project.deadline, "MMM dd, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Status
                      </p>
                      <p className="text-sm font-medium capitalize">
                        {project.status}
                      </p>
                    </div>
                    <ExternalLink className="size-4 text-slate-300 group-hover:text-blue-500" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
