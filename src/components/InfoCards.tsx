
// Composant InfoCard épuré et premium
export default function InfoCard({ title, value }: { title: string, value: string | undefined }) {
  return (
    <div className="p-8 rounded-xl bg-surface/40 border border-white/5 transition-colors duration-300 hover:border-primary/30 group">
      <h3 className="text-xs uppercase tracking-widest text-text-muted mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="font-serif text-xl text-text-primary">{value}</p>
    </div>
  );
}