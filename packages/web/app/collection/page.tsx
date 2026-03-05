import { CollectionClient } from "@/lib/components/collection/CollectionClient";

/**
 * Collection page - server component that renders the client-side bookshelf.
 * No server-side data fetching; mock data loaded client-side from store.
 */
export default function CollectionPage() {
  return <CollectionClient />;
}
