import { Bookmark } from "lucide-react";
import { useBookmarks } from "@/contexts/BookmarkContext";

export default function Saved() {
  const { ids } = useBookmarks();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="h3">Saved Grants</h1>
        <p className="muted text-sm">{ids.length} saved items.</p>
      </div>
      {ids.length === 0 && (
        <div className="card p-10 text-center">
          <Bookmark className="h-6 w-6 mx-auto text-ink-400" />
          <div className="font-semibold mt-2">Nothing saved yet</div>
          <p className="muted text-sm mt-1">Items you save will appear here.</p>
        </div>
      )}
    </div>
  );
}
