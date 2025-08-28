export default function ColorPalette() {
  const colors = {
    ink: "bg-mb-ink",
    ink2: "bg-mb-ink2",
    parchment: "bg-mb-parchment",
    sand200: "bg-mb-sand-200",
    sand300: "bg-mb-sand-300",
    sand400: "bg-mb-sand-400",
    wheat500: "bg-mb-wheat-500",
    wheat600: "bg-mb-wheat-600",
    champagne: "bg-mb-champagne",
    midnight: "bg-mb-midnight",
    racing: "bg-mb-racing",
    bordeaux: "bg-mb-bordeaux",
    slate: "bg-mb-slate",
    ivory: "bg-mb-ivory",
  };

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
      {Object.entries(colors).map(([name, cls]) => (
        <div key={name} className="flex flex-col items-center">
          <div className={`w-24 h-16 rounded-lg shadow-md ${cls}`} />
          <p className="mt-2 text-sm font-mono">{name}</p>
        </div>
      ))}
    </div>
  );
}
