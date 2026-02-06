
export default function CartButton({ onClick, itemCount = 0 }) {
  return (
    <button
      onClick={onClick}
      aria-label="Voir le panier"
      className="group relative flex items-center justify-center rounded-full p-2 text-text-primary transition-all duration-300 hover:bg-surface hover:text-primary"
    >
      {/* SVG Sac de Shopping élégant */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5" // Trait fin pour l'élégance
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 transition-transform duration-300 group-hover:scale-105"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>

      {/* Badge de notification (S'affiche seulement si itemCount > 0) */}
      {itemCount > 0 && (
        <span className="absolute top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-dark animate-in fade-in zoom-in duration-300">
          {itemCount}
        </span>
      )}
    </button>
  );
}