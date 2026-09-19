"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import SpeciesCard, { type SpeciesWithAuthor } from "./species-card";

export default function SpeciesList({ species, userId }: { species: SpeciesWithAuthor[]; userId: string }) {
  const [query, setQuery] = useState<string>("");

  // Case-insensitive substring match against scientific name, common name, and description.
  // Species data is fetched server-side in species/page.tsx and filtered here on the client with state.
  const trimmedQuery = query.trim().toLowerCase();
  const filteredSpecies =
    trimmedQuery === ""
      ? species
      : species.filter(
          (s) =>
            s.scientific_name.toLowerCase().includes(trimmedQuery) ||
            (s.common_name?.toLowerCase().includes(trimmedQuery) ?? false) ||
            (s.description?.toLowerCase().includes(trimmedQuery) ?? false),
        );

  return (
    <>
      <Input
        type="search"
        placeholder="Search species by scientific name, common name, or description..."
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="mb-4"
      />
      <div className="flex flex-wrap justify-center">
        {filteredSpecies.length === 0 ? (
          <p className="mt-8 text-muted-foreground">No species match your search.</p>
        ) : (
          filteredSpecies.map((species) => <SpeciesCard key={species.id} species={species} userId={userId} />)
        )}
      </div>
    </>
  );
}
