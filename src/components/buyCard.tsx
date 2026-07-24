export default function BuyCard({ price, onCheckout }: any) {
  return (
    <div className="bg-surface/30 flex flex-col backdrop-blur-md w-full lg:w-65 p-5 md:p-6 rounded-2xl border border-primary/20 shadow-2xl shadow-black/40">
      <p className="text-2xl md:text-3xl font-serif text-primary mb-4 md:mb-6">Total : {price}€</p>
      <button
        onClick={onCheckout}
        className="w-full px-3 text-xs md:text-sm bg-primary text-dark font-bold py-3 md:py-4 rounded-xl gap-2 hover:bg-primary-dark transition shadow-lg shadow-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        Commander
      </button>
    </div>
  );
}