// export default function RequestPage() {
//   redirect("/request/upload");
// }

import Link from "next/link";

export default function RequestPage() {
  return (
    <div className="p-4">
      <Link href="/request/upload" className="text-blue-500 underline">
        Go to Upload
      </Link>
    </div>
  );
}
