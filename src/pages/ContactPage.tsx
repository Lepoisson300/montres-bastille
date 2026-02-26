import React, { useState, useRef } from "react";
import { GoArrowUpRight, GoMail, GoLocation, GoClock, GoDeviceMobile } from "react-icons/go";
import Nav from "../components/Nav";

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
      icon: GoDeviceMobile,
      title: "Téléphone",
      details: ["+33 6 23 25 65 46"],    },
    {
      icon: GoMail,
      title: "Email",
      details: ["contact@montres-bastille.fr"],
      subtitle: "Réponse sous 24h"
    },
  
  ];

  const subjects = [
    { value: 'general', label: 'Information Générale' },
    { value: 'custom', label: 'Personnalisation' },
    { value: 'order', label: 'Suivi de Commande' },
    { value: 'warranty', label: 'Garantie & SAV' },
    { value: 'partnership', label: 'Partenariat' }
  ];

  return (
    <div className="font-sans min-h-screen bg-background text-text-secondary ">
      <Nav bg={false}/>

      {/* HERO SECTION */}
      <section className="bg-dark text-text-primary pt-24 pb-20">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <div className="h-px w-32 bg-linear-to-r from-transparent via-primary to-transparent mb-8 mx-auto" />
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

          <div className="flex justify-center">
        <div className="grid gap-8 md:grid-cols-2 max-w-2xl">
          {contactInfo.map((info, index) => (
            <Reveal key={info.title} delay={index + 1}>
          <div className="bg-surface rounded-2xl shadow-lg border border-border/20 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-surface-hover h-full flex flex-col">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <info.icon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-serif text-xl mb-2 text-text-primary">{info.title}</h3>
            <div className="text-sm text-text-subtle mb-4 font-sans">{info.subtitle}</div>
            <div className="space-y-1 mt-auto">
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
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section className="py-20 bg-dark text-text-primary ">
          <div className="px-6 md:px-4 mx-auto">
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
                      onClick={() => {
                      const emailSubject = encodeURIComponent(`Contact: ${subjects.find(s => s.value === formData.subject)?.label || 'Message'}`);
                      const emailBody = encodeURIComponent(
                        `Prénom: ${formData.firstName}\n` +
                        `Nom: ${formData.lastName}\n` +
                        `Email: ${formData.email}\n` +
                        `Téléphone: ${formData.phone}\n` +
                        `Sujet: ${subjects.find(s => s.value === formData.subject)?.label || 'N/A'}\n\n` +
                        `Message:\n${formData.message}`
                      );
                      window.location.href = `mailto:boguiste@montres-bastille.fr?subject=${emailSubject}&body=${emailBody}`;
                      }}
                    >
                      <GoArrowUpRight />
                      Envoyer le Message
                    </button>
                  </form>
                )}
              </div>
            </Reveal>

           
          </div>
        </div>
      </section>

      
    </div>
  );
}