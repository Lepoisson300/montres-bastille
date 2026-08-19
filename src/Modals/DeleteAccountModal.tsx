import type { User } from '../types/User';
import { useAlert } from '../Logic/AlertContext';
import { useAuth0 } from '@auth0/auth0-react';

interface DeleteAccountInterface {
    isOpen: boolean;
    onClose(): void;
    user: User;
}

export default function DeleteAccountModal({ isOpen, onClose, user }: DeleteAccountInterface) {

    const { showAlert } = useAlert();
    const apiAddress = import.meta.env.VITE_API_URL;
    const { logout, user: auth0User } = useAuth0();

    async function deleteAccount(e: React.FormEvent) {
        // 2. Prevent the default page reload
        e.preventDefault();
        if (!user?.email) {
            showAlert('error', "Impossible d'identifier le compte à supprimer.");
            return;
        }
        
        fetch(`${apiAddress}/api/users/delete`, {
            method: 'DELETE', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: user.email, 
                auth0Id: auth0User?.sub
            }) 
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                showAlert('error', data.error);
                return;
            }
            // Déconnexion après la suppression réussie
            logout({ logoutParams: { returnTo: window.location.origin } });
        })
        .catch((error) => {
            console.error(error);
            showAlert('error', "Impossible de supprimer le compte");
        });
    }

    // Si le modal n'est pas ouvert, on ne rend rien
    if (!isOpen) return null;

    return (
        /* Overlay sombre et flouté en arrière-plan */
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onClose} // Ferme le modal si on clique à l'extérieur
        >
            {/* Conteneur principal du Modal */}
            <div 
                className="relative w-full max-w-md p-8 rounded-2xl shadow-2xl bg-surface border border-border"
                onClick={(e) => e.stopPropagation()} // Empêche la fermeture au clic à l'intérieur
            >
                {/* En-tête du modal */}
                <h2 className="text-3xl font-bold text-text-primary mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
                    Suppression du compte
                </h2>
                
                {/* Explications légales et avertissements */}
                <div className="text-text-secondary text-sm mb-8 space-y-3" style={{ fontFamily: 'var(--font-sans)' }}>
                    <p>
                        Êtes-vous sûr de vouloir supprimer votre compte ? <strong>Cette action est irréversible.</strong>
                    </p>
                    <p>
                        Votre profil, l'ensemble de vos données personnelles renseignées sur le site, ainsi que vos accès de connexion (Auth0) seront définitivement effacés.
                    </p>
                    <p>
                        <em>À noter :</em> Conformément à nos obligations légales et fiscales, seules vos factures seront conservées à des fins de traçabilité comptable.
                    </p>
                    <p className="pt-2 text-xs opacity-90 border-t border-border mt-2">
                        Pour en savoir plus sur le traitement de vos données, consultez notre{' '}
                        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-(--color-primary) transition-colors">
                            Politique de confidentialité
                        </a>
                        {' '}et nos{' '}
                        <a href="/cgv" target="_blank" rel="noopener noreferrer" className="underline hover:text-(--color-primary) transition-colors">
                            CGV
                        </a>.
                    </p>
                </div>

                {/* Formulaire */}
                <form onSubmit={deleteAccount} className="flex flex-col gap-6" style={{ fontFamily: 'var(--font-sans)' }}>
                    {/* Boutons d'action */}
                    <div className="flex justify-end gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-(--color-text-secondary) hover:bg-(--color-surface-hover) transition-colors text-sm font-medium"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-xl bg-(--color-primary) text-(--color-dark) hover:bg-amber-600 transition-colors text-sm font-bold shadow-[0_0_15px_rgba(201,169,110,0.2)]"
                        >
                            Oui, supprimer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}