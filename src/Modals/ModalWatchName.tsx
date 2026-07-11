import React, { useState } from 'react';

export default function ModalWatchName({ isOpen, onClose, onSubmit, order }){

   const [watchName, setWatchName] = useState('');

    // Si le modal n'est pas ouvert, on ne rend rien
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (watchName.trim()) {
           const finalOrder = { 
                ...order, 
                name: watchName 
            };
            onSubmit(finalOrder);
            setWatchName(''); // Réinitialise l'input après soumission
        }
    };

    return (
        /* Overlay sombre et flouté en arrière-plan */
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose} // Ferme le modal si on clique à l'extérieur
        >
            {/* Conteneur principal du Modal */}
            <div 
                className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
                onClick={(e) => e.stopPropagation()} // Empêche la fermeture au clic à l'intérieur
            >
                {/* En-tête du modal */}
                <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
                    Baptisez votre création
                </h2>
                <p className="text-[var(--color-text-secondary)] text-sm mb-8" style={{ fontFamily: 'var(--font-sans)' }}>
                    Chaque chef-d'œuvre mérite un nom. Comment souhaitez-vous appeler cette montre unique avant de valider votre commande ?
                </p>

                {/* Formulaire */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6" style={{ fontFamily: 'var(--font-sans)' }}>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="watch-name" className="text-sm font-medium text-[var(--color-text-muted)]">
                            Nom de la montre
                        </label>
                        <input
                            id="watch-name"
                            type="text"
                            value={watchName}
                            onChange={(e) => setWatchName(e.target.value)}
                            placeholder="ex: L'Éclipse Astrale..."
                            className="w-full px-4 py-3 rounded-xl bg-[var(--color-background)] text-[var(--color-text-primary)] border border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all placeholder:text-[var(--color-text-subtle)]"
                            required
                            autoFocus
                        />
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors text-sm font-medium"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={!watchName.trim()}
                            className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-[var(--color-dark)] hover:bg-[var(--color-primary-dark)] transition-colors text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(201,169,110,0.2)]"
                        >
                            Commander
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};