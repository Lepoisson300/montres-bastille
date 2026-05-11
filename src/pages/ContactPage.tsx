import React, { useState, useRef } from "react";
import { GoArrowUpRight, GoMail, GoDeviceMobile } from "react-icons/go";
import Nav from "../components/Nav";
import { Helmet } from "react-helmet-async";

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
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
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
    }, 4000);
  };

  const subjects = [
    { value: 'general', label: 'Information Générale' },
    { value: 'custom', label: 'Personnalisation' },
    { value: 'order', label: 'Suivi de Commande' },
    { value: 'warranty', label: 'Garantie & SAV' },
    { value: 'partnership', label: 'Partenariat' }
  ];

  return (
    <div className="font-sans min-h-screen text-neutral-200 selection:bg-[#d4af37]/30">
      <Helmet>
        <title>Contact & SAV | Montre Bastille - Horlogerie à Bordeaux</title>
        <meta name="description" content="Une question sur nos montres personnalisées ? Besoin d'un service après-vente ou d'un partenariat ? Contactez l'atelier Montre Bastille. Réponse sous 24h." />
        <meta property="og:title" content="Contactez l'Atelier Montre Bastille" />
        <meta property="og:description" content="Experts en horlogerie à votre écoute pour vos projets de montres uniques." />
        <meta property="og:image" content="https://montre-bastille.fr/logo.webp" />
        <link rel="canonical" href="https://montre-bastille.fr/contact" />
      </Helmet>
      <Nav bg={false}/>

      {/* Main Container with Dark Metallic radial background */}
      <div 
        className="relative min-h-screen pt-28 pb-16 overflow-hidden" 
        style={{
          background: 'radial-gradient(circle at 70% 30%, #1a1a1c 0%, #050505 80%)'
        }}
      >
        {/* Subtle texture overlay for brushed metal look */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/brushed-alum.png")' }}></div>

       

        <div className="relative z-20 max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: Info */}
          <div className="lg:sticky lg:top-40 pt-10">
            <Reveal delay={0}>
              <div className="h-[1px] w-16 bg-[#d4af37] mb-8 opacity-60" />
              <h1 
                className="font-serif text-5xl md:text-7xl tracking-tight mb-8"
                style={{ 
                  color: '#d4af37',
                  textShadow: '0 2px 15px rgba(212, 175, 55, 0.2)'
                }}
              >
                Contactez l'Atelier
              </h1>
              <p className="text-lg md:text-xl text-neutral-400 leading-relaxed mb-16 font-sans max-w-md font-light">
                Notre équipe d'artisans horlogers est à votre disposition pour vous accompagner dans votre quête de la montre parfaite.
              </p>

              <div className="space-y-10">
                <div className="flex items-start gap-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-[#d4af37]/30 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-500 group-hover:border-[#d4af37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    <GoDeviceMobile className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">Téléphone</h3>
                    <p className="text-xl font-serif text-neutral-200 group-hover:text-[#d4af37] transition-colors">+33 6 23 25 65 46</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group cursor-pointer">
                  <div className="w-12 h-12 rounded-full border border-[#d4af37]/30 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-500 group-hover:border-[#d4af37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                    <GoMail className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-neutral-500 mb-2">Email</h3>
                    <p className="text-xl font-serif text-neutral-200 group-hover:text-[#d4af37] transition-colors">contact@montres-bastille.fr</p>
                    <p className="text-sm text-neutral-500 mt-1">Réponse sous 24h</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT COLUMN: Form */}
          <div className="lg:pt-20 pb-20">
            <Reveal delay={2}>
              <div className="bg-[#0a0a0c]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                {/* Form decorative accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>

                <h2 className="font-serif text-3xl tracking-wide mb-10 text-neutral-100">
                  Envoyez-nous un message
                </h2>

                {isSubmitted ? (
                  <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 rounded-full border border-[#d4af37]/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                      <GoMail className="w-8 h-8 text-[#d4af37]" />
                    </div>
                    <h3 className="font-serif text-2xl mb-4 text-[#d4af37]">Message Envoyé</h3>
                    <p className="text-neutral-400 font-sans max-w-sm">
                      Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                    <div className="grid gap-10 md:grid-cols-2">
                      <div className="relative">
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="peer w-full bg-transparent border-b border-white/10 py-3 text-neutral-200 font-sans focus:outline-none focus:border-[#d4af37] transition-colors placeholder-transparent"
                          placeholder="Prénom"
                        />
                        <label htmlFor="firstName" className="absolute left-0 -top-3.5 text-xs text-neutral-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#d4af37]">
                          Prénom
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="peer w-full bg-transparent border-b border-white/10 py-3 text-neutral-200 font-sans focus:outline-none focus:border-[#d4af37] transition-colors placeholder-transparent"
                          placeholder="Nom"
                        />
                        <label htmlFor="lastName" className="absolute left-0 -top-3.5 text-xs text-neutral-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#d4af37]">
                          Nom
                        </label>
                      </div>
                    </div>

                    <div className="grid gap-10 md:grid-cols-2">
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="peer w-full bg-transparent border-b border-white/10 py-3 text-neutral-200 font-sans focus:outline-none focus:border-[#d4af37] transition-colors placeholder-transparent"
                          placeholder="Email"
                        />
                        <label htmlFor="email" className="absolute left-0 -top-3.5 text-xs text-neutral-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#d4af37]">
                          Email
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="peer w-full bg-transparent border-b border-white/10 py-3 text-neutral-200 font-sans focus:outline-none focus:border-[#d4af37] transition-colors placeholder-transparent"
                          placeholder="Téléphone"
                        />
                        <label htmlFor="phone" className="absolute left-0 -top-3.5 text-xs text-neutral-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#d4af37]">
                          Téléphone
                        </label>
                      </div>
                    </div>

                    <div className="relative">
                      <select
                        name="subject"
                        id="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border-b border-white/10 py-3 text-neutral-200 font-sans focus:outline-none focus:border-[#d4af37] transition-colors appearance-none cursor-pointer"
                      >
                        {subjects.map(subject => (
                          <option key={subject.value} value={subject.value} className="bg-neutral-900 text-neutral-200">
                            {subject.label}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="subject" className="absolute left-0 -top-3.5 text-xs text-[#d4af37] uppercase tracking-widest transition-all">
                        Sujet
                      </label>
                      {/* Custom dropdown arrow */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-[#d4af37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>

                    <div className="relative pt-6">
                      <textarea
                        name="message"
                        id="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="peer w-full bg-transparent border-b border-white/10 py-3 text-neutral-200 font-sans focus:outline-none focus:border-[#d4af37] transition-colors resize-none placeholder-transparent"
                        placeholder="Message"
                      />
                      <label htmlFor="message" className="absolute left-0 top-0 text-xs text-neutral-500 uppercase tracking-widest transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-9 peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#d4af37]">
                        Message
                      </label>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="group flex items-center justify-center gap-4 w-full md:w-auto bg-transparent border border-[#d4af37] text-[#f5d47a] font-sans px-10 py-4 text-sm uppercase tracking-[0.2em] transition-all duration-500 hover:bg-[#d4af37] hover:text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
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
                        <span>Envoyer</span>
                        <GoArrowUpRight className="text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
      
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}