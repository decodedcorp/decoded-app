"use client";

interface ShowcaseItem {
  item_id: string;
  image_url: string;
  brand: string;
  name: string;
  price: string;
}

interface EditorialItemShowcaseProps {
  items: ShowcaseItem[];
}

/** Asymmetric positioning patterns */
const ITEM_LAYOUTS = [
  { width: "w-[70%] md:w-[45%]", offset: "ml-[2%]", rotate: "-rotate-1" },
  { width: "w-[65%] md:w-[42%]", offset: "ml-[30%] md:ml-[52%]", rotate: "rotate-[1.5deg]" },
  { width: "w-[70%] md:w-[45%]", offset: "ml-[5%]", rotate: "rotate-1" },
  { width: "w-[65%] md:w-[42%]", offset: "ml-[28%] md:ml-[50%]", rotate: "-rotate-[1.5deg]" },
];

/**
 * EditorialItemShowcase - Asymmetric item cards with chartreuse glow.
 * No GSAP animations — cards are immediately visible.
 */
export function EditorialItemShowcase({ items }: EditorialItemShowcaseProps) {
  if (!items.length) return null;

  return (
    <section className="px-6 py-12 md:px-10">
      <p className="mb-8 text-[10px] font-medium uppercase tracking-[0.3em] text-mag-accent/70">
        Curated Items
      </p>

      <div className="space-y-6">
        {items.map((item, i) => {
          const layout = ITEM_LAYOUTS[i % ITEM_LAYOUTS.length];

          return (
            <div
              key={item.item_id}
              className={`relative ${layout.width} ${layout.offset} ${layout.rotate}`}
            >
              <div
                className="relative overflow-hidden rounded-lg ring-1 ring-[#eafd67]/30"
                style={{ boxShadow: "0 0 15px rgba(234,253,103,0.1)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute left-3 top-2.5 text-[10px] font-medium uppercase tracking-wider text-mag-text/60">
                  {item.brand}
                </span>
                <span className="absolute bottom-2.5 right-3 rounded-sm bg-mag-bg/70 px-2 py-0.5 text-xs font-semibold text-mag-accent backdrop-blur-sm">
                  {item.price}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-mag-text/50">{item.name}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
