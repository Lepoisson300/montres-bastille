import type { Watch } from "./Parts";

export type User = {
  id: string;
  email: string;
  numero: string;
  nom: string;
  prenom: string;
  commandes: Order[];
  pseudo: string;
};

export type Order = {
  _id: string; // Vous pouvez utiliser 'ObjectId' si vous êtes côté backend avec le driver MongoDB/Mongoose
  numero_commande: string;
  adresse_livraison: {
    city: string;
    country: string;
    line1: string;
    line2: string | null;
    postal_code: string;
    state: string | null;
  };
  date_commande: string; // Peut aussi être de type 'Date' si vous parsez la chaîne ISO dans votre code
  etape_actuelle: number;
  stripe_session_id: string;
  montres: Watch[];
};
