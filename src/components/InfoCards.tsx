// Composant InfoCard Neumorphique Dark Mode
export default function InfoCard({ title, value }: { title: string, value: string | undefined }) {
  return (
    <div 
      className="h-full min-w-0 flex flex-col justify-center p-6 sm:p-8 rounded-2xl bg-surface transition-all duration-300 ease-in-out
                 shadow-[6px_6px_14px_rgba(0,0,0,0.5),-6px_-6px_14px_rgba(255,255,255,0.03)]
                 hover:shadow-[inset_6px_6px_14px_rgba(0,0,0,0.5),inset_-6px_-6px_14px_rgba(255,255,255,0.03)]
                 group cursor-pointer"
    >
      <h3 
        className="text-xs uppercase tracking-widest text-text-muted mb-2 
                   group-hover:text-primary transition-colors shrink-0"
      >
        {title}
      </h3>
      <p 
        className="font-serif text-lg sm:text-xl text-text-primary break-words"
      >
        {value}
      </p>
    </div>
  );
}