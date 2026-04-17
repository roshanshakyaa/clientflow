import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Hero2 = () => (
  <div className="w-full ">
    <div className="container mx-auto ">
      <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
        <div>
          <Badge variant="outline">We&apos;re live!</Badge>
        </div>
        <div className="flex gap-4 flex-col">
          <h1 className="text-5xl md:text-7xl max-w-3xl tracking-tighter text-center font-regular">
            Manage Clients, Projects, and Payments
            <br />
            All in One Place
          </h1>
          <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
            ClientFlow is a simple workspace for freelancers to track clients,
            organize projects, manage tasks, and handle invoices without the
            chaos of spreadsheets and scattered tools.
          </p>
        </div>
        <div className="flex flex-row gap-3">
          <Button size="lg" className="gap-4" variant="outline">
            Learn more <PhoneCall className="w-4 h-4" />
          </Button>
          <Button size="lg" className="gap-4">
            Sign up here <MoveRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
);
