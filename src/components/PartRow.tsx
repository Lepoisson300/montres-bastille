import type { PartOption } from "../types/Parts";

// Les composants sont désormais intégrés dans le flux du grand slider parent
export default function PartRow({ title, options, current, onSelect }: any) {
  return (
    <div className="shrink-0">
      <div className="flex items-center gap-3 mb-4 md:mb-5">
        <h5 className="font-serif text-sm md:text-base text-ivory/90 uppercase tracking-widest whitespace-nowrap">{title}</h5>
        <span className="w-12 md:w-20 h-px bg-white/10" />
      </div>
      <div className="flex gap-3 md:gap-4">
        {options.map((opt: PartOption) => {
          const isActive = current?.id === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              // Le composant individuel agit comme point d'ancrage pour le scroll naturel mobile
              className={`group relative shrink-0 snap-start w-20 md:w-40 rounded-2xl border p-2 md:p-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isActive ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
            >
              <div className="aspect-square rounded-full overflow-hidden bg-background/60 mb-2">
                <img
                  src={opt.thumbnail}
                  alt={opt.name}
                  className={`w-full h-full pt-2 lg:pt-4 object-contain transition-transform ${opt.type === "strap" ? "scale-150 hover:scale-275" : "scale-520 hover:scale-450"}`}
                />
              </div>
              <p className="text-[8px] md:text-[9px] text-center uppercase tracking-tighter truncate text-ivory/80">{opt.name}</p>
              {opt.price ? <p className="text-[9px] md:text-[10px] text-center text-primary mt-0.5">{opt.price}€</p> : null}
              {isActive && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_8px_rgba(197,160,89,0.8)]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}