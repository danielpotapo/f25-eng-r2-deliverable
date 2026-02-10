"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import Image from "next/image";
import type { Database } from "@/lib/schema";

type Species = Database["public"]["Tables"]["species"]["Row"];

// We use zod (z) to define a schema for the "Add species" form.
// zod handles validation of the input values with methods like .string(), .nullable(). It also processes the form inputs with .transform() before the inputs are sent to the database.


// Default values for the form fields.
/* Because the react-hook-form (RHF) used here is a controlled form (not an uncontrolled form),
fields that are nullable/not required should explicitly be set to `null` by default.
Otherwise, they will be `undefined` by default, which will raise warnings because `undefined` conflicts with controlled components.
All form fields should be set to non-undefined default values.
Read more here: https://legacy.react-hook-form.com/api/useform/
*/

export default function LearnMoreDialog({ spec }: { spec: Species }) {
  // Control open/closed state of the dialog
  const [open, setOpen] = useState<boolean>(false);

  // I'll remove the exclamation mark later
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">
          Read More
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{spec.scientific_name}</DialogTitle>
          <DialogDescription>
            <em>
              {spec.common_name}
            </em>
          </DialogDescription>
        </DialogHeader>
        <div className="relative h-80 w-full">
            <Image src={spec.image!} alt={spec.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
        <div className="relative h-100 w-full">
            <strong>Total Population: </strong><p>{spec.total_population}</p>
            <strong>Kingdom: </strong><p>{spec.kingdom}</p>
            <strong>Description: </strong><p>{spec.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
