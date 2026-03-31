import { useEffect, useState, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Nav from "../components/Nav";
import { Helmet } from "react-helmet-async";
import { useParams, useSearchParams } from "react-router-dom";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrderStep {
  id: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

interface Order {
  id: string;
  numero_commande: string;
  nom_montre: string;
  date_commande: string;
  etape_actuelle: number; // 0-indexed
  numero_suivi?: string;
  transporteur?: string;
  lien_suivi?: string;
  configuration?: {
    cadran_id?: string;
    boitier_id?: string;
    bracelet_id?: string;
    mouvement_id?: string;
  };
}

// ─── Animation Reveal ────────────────────────────────────────────────────────

const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 100);
        }
      },
      { threshold: 0.05 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
};

// ─── Étapes ──────────────────────────────────────────────────────────────────

const STEPS: OrderStep[] = [
  {
    id: "design",
    label: "Design de la Montre",
    sublabel: "Conception et validation de votre création unique",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
      </svg>
    ),
  },
  {
    id: "fabrication",
    label: "Découpage & Fabrication",
    sublabel: "Usinage de précision de chaque composant",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z" />
      </svg>
    ),
  },
  {
    id: "assemblage",
    label: "Assemblage",
    sublabel: "Montage méticuleux des composants",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
  },
  {
    id: "finition",
    label: "Finitions",
    sublabel: "Polissage, gravure et contrôle qualité",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
  },
  {
    id: "preparation",
    label: "Préparation",
    sublabel: "Emballage et documentation personnalisés",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    id: "envoi",
    label: "Envoi",
    sublabel: "En route vers vous",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
];

// ─── Mock API fetch (à remplacer par votre vraie API) ─────────────────────────

async function fetchOrder(orderNumber: string): Promise<Order | null> {
  try {
    const response = await fetch(
      `https://montre-bastille-api.onrender.com/api/commandes/${orderNumber}`
    );
    if (!response.ok) return null;
    return await response.json();
  } catch(error) {
    // Pour le dev, on retourne un mock si l'API échoue
    console.log(error)
}
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function OrderTrackingPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const { orderNumber: routeOrderNumber } = useParams<{ orderNumber?: string }>();
  const [searchParams] = useSearchParams();

  const [inputValue, setInputValue] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // Auto-lookup si numéro dans l'URL (/suivi/MB-2024-001) ou ?commande=...
  useEffect(() => {
    const num = routeOrderNumber || searchParams.get("commande");
    if (num) {
      setInputValue(num);
      handleSearch(num);
    }
  }, [routeOrderNumber]);

  async function handleSearch(num?: string) {
    const orderNum = (num || inputValue).trim().toUpperCase();
    if (!orderNum) return;
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const result = await fetchOrder(orderNum);
      if (result) {
        setOrder(result);
      } else {
        setOrder(null);
        setError("Aucune commande trouvée avec ce numéro. Vérifiez le numéro présent dans votre email de confirmation.");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setOrder(null);
    setError(null);
    setSearched(false);
    setInputValue("");
  }

  if (authLoading) return <LoadingScreen />;

  return (
    <>
      <Helmet>
        <title>Suivi de Commande | Montre Bastille</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Nav bg={false} />

      <div className="relative min-h-screen bg-background font-sans overflow-hidden pt-24 pb-24">
        
        {/* Fond décoratif */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] opacity-20 rounded-full blur-3xl"
            style={{ background: "radial-gradient(ellipse, #C9A96E 0%, transparent 70%)" }}
          />
          <svg
            className="absolute bottom-0 left-0 w-full opacity-5"
            viewBox="0 0 1440 200"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,100 C360,200 1080,0 1440,100 L1440,200 L0,200 Z" fill="#C9A96E" />
          </svg>

        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6">

          {/* ── En-tête ── */}
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-xs uppercase tracking-[0.35em] text-primary mb-4 font-sans">
                Atelier Bastille
              </p>
              <h1 className="font-serif text-5xl md:text-6xl text-text-primary mb-4 tracking-tight">
                Suivi de Commande
              </h1>
              <div className="h-px w-16 bg-primary mx-auto opacity-60 mb-6" />
              <p className="text-text-muted text-base max-w-xl mx-auto leading-relaxed">
                Chaque pièce est façonnée avec soin. Consultez l'avancement
                de votre création en temps réel.
              </p>
            </div>
          </Reveal>

          {/* ── Recherche ── */}
          {!order && (
            <Reveal delay={2}>
              <div className="max-w-lg mx-auto mb-16">
                <div className="bg-surface/50 border border-white/8 rounded-2xl p-8 backdrop-blur-sm">
                  <label className="block text-xs uppercase tracking-widest text-text-muted mb-3">
                    Numéro de commande
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="ex. MB-"
                      className="flex-1 bg-background/60 border border-white/10 rounded-xl px-5 py-3.5 text-text-primary placeholder:text-text-subtle font-sans text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                      onClick={() => handleSearch()}
                      disabled={loading || !inputValue.trim()}
                      className="px-6 py-3.5 bg-primary text-dark font-sans text-sm uppercase tracking-widest rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                      ) : (
                        "Chercher"
                      )}
                    </button>
                  </div>

                  {error && (
                    <div className="mt-4 p-4 rounded-xl bg-red-950/30 border border-red-500/20">
                      <p className="text-sm text-red-300/80 leading-relaxed">{error}</p>
                    </div>
                  )}

                  {searched && !error && !loading && (
                    <p className="mt-3 text-xs text-text-subtle text-center">
                      Vous pouvez retrouver votre numéro dans l'email de confirmation de commande.
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          )}

          {/* ── Résultat ── */}
          {order && (
            <div>
              {/* Header commande */}
              <Reveal delay={1}>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-primary mb-1">Commande confirmée</p>
                    <h2 className="font-serif text-4xl text-text-primary mb-1">{order.nom_montre}</h2>
                    <p className="text-text-muted text-sm">
                      Réf. <span className="text-text-secondary font-mono">{order.numero_commande}</span>
                      {" · "}
                      Commandée le {new Date(order.date_commande).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-xs uppercase tracking-widest text-text-muted border border-white/10 rounded-full px-5 py-2.5 hover:border-primary/40 hover:text-primary transition-all shrink-0"
                  >
                    ← Autre commande
                  </button>
                </div>
              </Reveal>

              {/* Timeline */}
              <Reveal delay={2}>
                <div className="relative mb-16">
                  <OrderTimeline steps={STEPS} currentStep={order.etape_actuelle} />
                </div>
              </Reveal>

              {/* Bouton suivi livraison si envoi */}
              {order.etape_actuelle >= 5 && order.numero_suivi && (
                <Reveal delay={3}>
                  <div className="mb-16 p-8 rounded-2xl bg-primary/8 border border-primary/25 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-primary mb-2">Votre colis est en route</p>
                        <h3 className="font-serif text-2xl text-text-primary mb-1">Suivi de livraison</h3>
                        <p className="text-text-muted text-sm">
                          Transporteur : <span className="text-text-secondary">{order.transporteur}</span>
                          {" · "}
                          N° de suivi : <span className="text-text-secondary font-mono">{order.numero_suivi}</span>
                        </p>
                      </div>
                      <a
                        href={order.lien_suivi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-3 bg-primary text-dark px-8 py-4 rounded-xl text-sm uppercase tracking-widest font-sans hover:bg-primary-dark transition-colors"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                        Suivre la livraison
                      </a>
                    </div>
                  </div>
                </Reveal>
              )}

              {/* Récapitulatif configuration corrigé */}
              {order.configuration && (
                <Reveal delay={4}>
                  <div>
                    <h3 className="font-serif text-2xl text-text-primary border-l-2 border-primary pl-4 mb-6">
                      Votre Configuration
                    </h3>
                    
                    {/* Si le backend renvoie un résumé texte (votre système actuel) */}
                    {(order.configuration as any).resume ? (
                      <div className="p-5 rounded-xl bg-surface/40 border border-white/5">
                        <p className="text-xs uppercase tracking-widest text-text-muted mb-2">Composants choisis</p>
                        <p className="font-serif text-text-primary leading-relaxed">
                          {(order.configuration as any).resume.split(' + ').join(' • ')}
                        </p>
                      </div>
                    ) : (
                      /* L'ancien système avec les colonnes (si vous l'utilisez un jour) */
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Cadran", value: order.configuration.cadran_id },
                          { label: "Boîtier", value: order.configuration.boitier_id },
                          { label: "Bracelet", value: order.configuration.bracelet_id },
                          { label: "Mouvement", value: order.configuration.mouvement_id },
                        ].map((item) => item.value && (
                          <div key={item.label} className="p-5 rounded-xl bg-surface/40 border border-white/5 hover:border-primary/20 transition-colors">
                            <p className="text-xs uppercase tracking-widest text-text-muted mb-2">{item.label}</p>
                            <p className="font-serif text-text-primary">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Reveal>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Timeline Component ───────────────────────────────────────────────────────

function OrderTimeline({ steps, currentStep }: { steps: OrderStep[]; currentStep: number }) {
  const [animatedStep, setAnimatedStep] = useState(-1);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= currentStep) {
        setAnimatedStep(i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 220);
    return () => clearInterval(interval);
  }, [currentStep]);

  // Progress fill width
  const progressPct = steps.length > 1
    ? (Math.min(animatedStep, currentStep) / (steps.length - 1)) * 100
    : 0;

  return (
    <div className="relative">
      {/* Desktop layout */}
      <div className="hidden md:block">
        {/* Rail */}
        <div className="relative mx-8 mb-2" style={{ height: 2 }}>
          <div className="absolute inset-0 bg-white/8 rounded-full" />
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Steps row */}
        <div className="grid grid-cols-6 gap-0">
          {steps.map((step, index) => {
            const status =
              index < currentStep ? "done" :
              index === currentStep ? "active" : "pending";
            const animated = index <= animatedStep;
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center text-center px-2 transition-all duration-500 ${animated ? "opacity-100" : "opacity-0 translate-y-3"}`}
              >
                {/* Node */}
                <div className={`relative w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                  status === "done" ? "bg-primary text-dark shadow-lg shadow-primary/25" :
                  status === "active" ? "bg-primary/15 border-2 border-primary text-primary" :
                  "bg-surface border border-white/10 text-text-subtle"
                }`}>
                  {status === "done" ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : (
                    step.icon
                  )}
                  {status === "active" && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                  )}
                </div>

                {/* Label */}
                <p className={`text-xs font-sans leading-tight mb-1 transition-colors ${
                  status === "done" ? "text-primary" :
                  status === "active" ? "text-text-primary font-semibold" :
                  "text-text-subtle"
                }`}>
                  {step.label}
                </p>
                {status !== "pending" && (
                  <p className="text-[10px] text-text-subtle leading-tight mt-0.5 hidden lg:block">
                    {step.sublabel}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile layout - vertical */}
      <div className="md:hidden space-y-0">
        {steps.map((step, index) => {
          const status =
            index < currentStep ? "done" :
            index === currentStep ? "active" : "pending";
          const animated = index <= animatedStep;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.id}
              className={`flex gap-4 transition-all duration-500 ${animated ? "opacity-100" : "opacity-0 translate-x-4"}`}
            >
              {/* Left: node + connector */}
              <div className="flex flex-col items-center">
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
                  status === "done" ? "bg-primary text-dark shadow-md shadow-primary/20" :
                  status === "active" ? "bg-primary/15 border-2 border-primary text-primary" :
                  "bg-surface border border-white/10 text-text-subtle"
                }`}>
                  {status === "done" ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  ) : (
                    <span className="w-4 h-4">{step.icon}</span>
                  )}
                  {status === "active" && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                  )}
                </div>
                {!isLast && (
                  <div className={`w-px flex-1 mt-1 mb-1 min-h-8 transition-all duration-700 ${
                    index < currentStep ? "bg-primary/50" : "bg-white/8"
                  }`} />
                )}
              </div>

              {/* Right: content */}
              <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
                <p className={`font-sans text-sm font-medium mb-0.5 ${
                  status === "done" ? "text-primary" :
                  status === "active" ? "text-text-primary" :
                  "text-text-subtle"
                }`}>
                  {step.label}
                </p>
                <p className="text-xs text-text-subtle leading-relaxed">{step.sublabel}</p>
                {status === "active" && (
                  <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary bg-primary/10 rounded-full px-3 py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    En cours
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Loading screen ───────────────────────────────────────────────────────────

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-primary font-serif">
      <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
      <p className="animate-pulse tracking-widest text-sm uppercase text-text-muted">Chargement...</p>
    </div>
  );
}