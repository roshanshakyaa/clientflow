import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

export function BarPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <MoreHorizontal className="h-5 w-5 cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-25">
        <Link href={"/"}>Open</Link>
        <Link href={"/"}>Edit</Link>
      </PopoverContent>
    </Popover>
  );
}
