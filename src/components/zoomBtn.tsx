export default function ZoomBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-6 h-6 md:w-8 md:h-8 rounded-full hover:bg-white/10 transition flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {label}
    </button>
  );
}