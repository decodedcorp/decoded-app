import FashionScanScene from "@/lib/components/fashion-scan/FashionScanScene";
import type { ScanData } from "@/lib/components/fashion-scan/types";

const MOCK_DATA: ScanData = {
  photoUrl: "/images/mock_fashion_001.jpg",
  items: [
    {
      id: "item_1",
      name: "SUNGLASSES",
      confidence: 98,
      box: { top: 22.0, left: 33.5, width: 21.0, height: 13.0 },
    },
    {
      id: "item_2",
      name: "GREY TANK TOP",
      confidence: 95,
      box: { top: 49.0, left: 27.0, width: 26.5, height: 37.0 },
    },
    {
      id: "item_3",
      name: "BLACK TRACK PANTS",
      confidence: 90,
      box: { top: 87.0, left: 35.5, width: 29.0, height: 13.0 },
    },
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen bg-black text-white">
      <FashionScanScene data={MOCK_DATA} />
    </div>
  );
}
