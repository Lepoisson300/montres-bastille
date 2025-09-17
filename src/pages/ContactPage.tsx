import React, { useState, useRef } from "react";
import { GoArrowUpRight, GoMail, GoLocation, GoClock, GoDeviceMobile } from "react-icons/go";

// Background grain effect
const Grain = () => (
  <svg
    className="pointer-events-none fixed inset-0 -z-10 opacity-[0.05]"
    aria-hidden="true"
  >
    <filter id="n" x="0" y="0">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.8"
        numOctaves="4"
        stitchTiles="stitch"
      />
    </filter>
    <rect width="100%" height="100%" filter="url(#n)" />
  </svg>
);

// Reveal animation component
const Reveal = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 120);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </div>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: 'general',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Reset form after showing success message
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: 'general',
        message: ''
      });
    }, 3000);
  };

  const contactInfo = [
    {
      icon: GoLocation,
      title: "Atelier Parisien",
      details: ["15 Place Vendôme", "75001 Paris", "France"],
      subtitle: "Siège social & Atelier"
    },
    {
      icon: GoDeviceMobile,
      title: "Téléphone",
      details: ["+33 1 42 60 38 15"],
      subtitle: "Lun-Ven 9h-18h"
    },
    {
      icon: GoMail,
      title: "Email",
      details: ["contact@montres-bastille.fr"],
      subtitle: "Réponse sous 24h"
    },
    {
      icon: GoClock,
      title: "Horaires d'Ouverture",
      details: ["Lun-Ven: 9h-18h", "Sam: 10h-17h", "Dim: Fermé"],
      subtitle: "Atelier & Showroom"
    }
  ];

  const subjects = [
    { value: 'general', label: 'Information Générale' },
    { value: 'custom', label: 'Personnalisation' },
    { value: 'order', label: 'Suivi de Commande' },
    { value: 'warranty', label: 'Garantie & SAV' },
    { value: 'partnership', label: 'Partenariat' }
  ];

  return (
    <div className="font-sans min-h-screen bg-background text-text-secondary">
      <Grain />

      {/* HERO SECTION */}
      <section className="bg-dark text-text-primary pt-24 pb-20">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent mb-8 mx-auto" />
              <h1 className="font-serif text-4xl md:text-6xl tracking-tight mb-6 text-text-primary">
                Contactez-Nous
              </h1>
              <p className="text-lg text-text-muted leading-relaxed mb-10 font-sans">
                Notre équipe d'artisans horlogers est à votre disposition pour vous accompagner dans votre quête de la montre parfaite, reflet du patrimoine français.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT INFO CARDS */}
      <section className="py-20 bg-background">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 text-text-primary">
                Nos Coordonnées
              </h2>
              <p className="text-lg text-text-muted leading-relaxed max-w-2xl mx-auto font-sans">
                Plusieurs moyens pour nous joindre et découvrir l'univers Montres-Bastille.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {contactInfo.map((info, index) => (
              <Reveal key={info.title} delay={index + 1}>
                <div className="bg-surface rounded-2xl shadow-lg border border-border/20 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-surface-hover">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <info.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-xl mb-2 text-text-primary">{info.title}</h3>
                  <div className="text-sm text-text-subtle mb-4 font-sans">{info.subtitle}</div>
                  <div className="space-y-1">
                    {info.details.map((detail, i) => (
                      <div key={i} className="text-sm font-sans font-medium text-text-secondary">
                        {detail}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="py-20 bg-dark text-text-primary">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="grid gap-16 lg:grid-cols-2 items-start">
            
            {/* Form */}
            <Reveal>
              <div>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent mb-8" />
                <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 text-text-primary">
                  Envoyez-nous un Message
                </h2>
                <p className="text-lg text-text-muted leading-relaxed mb-10 font-sans">
                  Que ce soit pour une question technique, une demande de personnalisation ou simplement pour découvrir notre savoir-faire, nous sommes là pour vous répondre.
                </p>

                {isSubmitted ? (
                  <div className="bg-primary/20 border border-primary/40 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                      <GoMail className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl mb-2 text-primary">Message Envoyé</h3>
                    <p className="text-text-muted font-sans">
                      Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-sans uppercase tracking-wider text-text-muted mb-2">
                          Prénom
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-surface border border-primary/40 rounded-xl text-text-primary placeholder-text-subtle font-sans focus:border-primary focus:outline-none transition-colors"
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-sans uppercase tracking-wider text-text-muted mb-2">
                          Nom
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-surface border border-primary/40 rounded-xl text-text-primary placeholder-text-subtle font-sans focus:border-primary focus:outline-none transition-colors"
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="block text-sm font-sans uppercase tracking-wider text-text-muted mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-surface border border-primary/40 rounded-xl text-text-primary placeholder-text-subtle font-sans focus:border-primary focus:outline-none transition-colors"
                          placeholder="votre@email.fr"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-sans uppercase tracking-wider text-text-muted mb-2">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-surface border border-primary/40 rounded-xl text-text-primary placeholder-text-subtle font-sans focus:border-primary focus:outline-none transition-colors"
                          placeholder="+33 1 23 45 67 89"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-sans uppercase tracking-wider text-text-muted mb-2">
                        Sujet
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-surface border border-primary/40 rounded-xl text-text-primary font-sans focus:border-primary focus:outline-none transition-colors"
                      >
                        {subjects.map(subject => (
                          <option key={subject.value} value={subject.value} className="bg-surface">
                            {subject.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-sans uppercase tracking-wider text-text-muted mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-surface border border-primary/40 rounded-xl text-text-primary placeholder-text-subtle font-sans focus:border-primary focus:outline-none transition-colors resize-none"
                        placeholder="Décrivez votre demande..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-primary text-dark font-sans px-8 py-4 text-base uppercase tracking-[0.2em] 
                                 transition-all duration-300 shadow-md font-medium
                                 hover:bg-primary-dark hover:-translate-y-[2px] hover:shadow-lg"
                    >
                      <GoArrowUpRight />
                      Envoyer le Message
                    </button>
                  </form>
                )}
              </div>
            </Reveal>

            {/* Map and Additional Info */}
            <Reveal delay={1}>
              <div className="space-y-8">
                {/* Map Placeholder */}
                <div className="bg-surface border border-primary/40 rounded-2xl p-8">
                  <h3 className="font-serif text-xl mb-4 text-text-primary">Notre Atelier</h3>
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center mb-4">
                    <div className="text-center">
                      <GoLocation className="w-12 h-12 text-primary mx-auto mb-2" />
                      <div className="text-primary font-sans text-sm">15 Place Vendôme</div>
                      <div className="text-text-subtle font-sans text-xs">Paris 1er</div>
                    </div>
                  </div>
                  <p className="text-text-muted font-sans text-sm">
                    Situé au cœur du quartier de la haute horlogerie parisienne, notre atelier vous accueille pour découvrir l'artisanat français d'exception.
                  </p>
                </div>

                {/* Visit Info */}
                <div className="bg-surface border border-primary/40 rounded-2xl p-8">
                  <h3 className="font-serif text-xl mb-4 text-text-primary">Prendre Rendez-vous</h3>
                  <p className="text-text-muted font-sans text-sm mb-6">
                    Venez découvrir nos créations et rencontrer nos maîtres horlogers. Sur rendez-vous uniquement pour une expérience personnalisée.
                  </p>
                  <button className="inline-flex items-center gap-2 rounded-full border border-primary text-primary font-sans px-6 py-3 text-sm uppercase tracking-[0.2em] 
                                     transition-all duration-300
                                     hover:bg-primary hover:text-dark hover:-translate-y-[2px] hover:shadow-lg">
                    <GoClock />
                    Réserver un Créneau
                  </button>
                </div>

                {/* FAQ Link */}
                <div className="bg-surface border border-primary/40 rounded-2xl p-8">
                  <h3 className="font-serif text-xl mb-4 text-text-primary">Questions Fréquentes</h3>
                  <p className="text-text-muted font-sans text-sm mb-6">
                    Consultez notre FAQ pour trouver rapidement les réponses aux questions les plus courantes.
                  </p>
                  <a
                    href="/montres-bastille/faq"
                    className="inline-flex items-center gap-2 text-sm font-sans uppercase tracking-[0.15em] text-primary 
                               transition-all duration-300 hover:text-primary-dark hover:-translate-y-[2px]"
                  >
                    <GoArrowUpRight />
                    Voir la FAQ
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / TESTIMONIALS */}
      <section className="py-20 bg-background">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 text-text-primary">
                Ce Que Disent Nos Clients
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                text: "Un service client exceptionnel et une attention aux détails remarquable. Ma montre Normandie est exactement ce que j'espérais.",
                author: "Marie Dubois",
                location: "Lyon"
              },
              {
                text: "L'équipe a su comprendre ma vision et créer une pièce unique qui reflète parfaitement mes origines provençales.",
                author: "Jean-Pierre Martin",
                location: "Marseille"
              },
              {
                text: "Un véritable savoir-faire artisanal. Chaque détail de ma montre raconte une histoire du patrimoine français.",
                author: "Sophie Laurent",
                location: "Bordeaux"
              }
            ].map((testimonial, index) => (
              <Reveal key={index} delay={index + 1}>
                <div className="bg-surface rounded-2xl shadow-lg border border-border/20 p-8 text-center hover:bg-surface-hover transition-colors duration-300">
                  <div className="text-primary text-4xl mb-4 font-serif">"</div>
                  <p className="text-text-secondary font-sans leading-relaxed mb-6">
                    {testimonial.text}
                  </p>
                  <div className="font-serif text-lg text-text-primary">{testimonial.author}</div>
                  <div className="text-text-subtle font-sans text-sm">{testimonial.location}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}