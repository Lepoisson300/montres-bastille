import type { PartsCatalog } from "../types/Parts";

export const REGION_NAMES: Record<string, string> = {
  "FR-A": "Alsace",
  "FR-B": "Aquitaine",
  "FR-C": "Auvergne",
  "FR-D": "Bourgogne",
  "FR-E": "Bretagne",
  "FR-F": "Centre-Val de Loire",
  "FR-G": "Champagne-Ardenne",
  "FR-H": "Corse",
  "FR-I": "Franche-Compté",
  "FR-J": "Ile-deFrance",
  "FR-K": "Languedoc-Roussillon",
  "FR-L": "Limousin",
  "FR-M": "Lorraine",
  "FR-N": "Midi-Pyrénées",
  "FR-O": "Nord-Pas-de-Calais",
  "FR-P": "Basse-Normandie",
  "FR-Q": "Haute-Normandie",
  "FR-R": "Pays de la Loire",
  "FR-S": "Picardie",
  "FR-T": "Poitou-Charentes",
  "FR-U": "Provence-Alpes-Côte d'Azur",
  "FR-V": "Rhône-Alpes",
};


export const WATCH_COMPONENTS: PartsCatalog = {
  cases: [
    { 
      id: 'c1', 
      name: 'Classic Round', 
      price: 2500, 
      thumbnail: '/images/cases/classic-round.jpg',
      stock: 'in',
      material: 'Stainless Steel', 
      size: '40mm', 
      regions: ['FR-E', 'FR-A', 'FR-U']
    },
    { 
      id: 'c2', 
      name: 'Sport Chronograph', 
      price: 3200, 
      thumbnail: '/images/cases/sport-chronograph.jpg',
      stock: 'low',
      material: 'Titanium', 
      size: '42mm', 
      regions: ['FR-E', 'FR-A', 'FR-U']
    },


  ],
  dials: [
    { 
      id: 'd1', 
      name: 'Sunburst Blue', 
      price: 800, 
      thumbnail: '/images/dials/sunburst-blue.jpg',
      stock: 'in',
      color: 'Blue',
      finish: 'Lacquer', 
      markers: 'Roman', 
      regions: ['FR-E', 'FR-A', 'FR-U']
    },
    { 
      id: 'd2', 
      name: 'Black Carbon', 
      price: 1200, 
      thumbnail: '/images/dials/black-carbon.jpg',
      stock: 'in',
      color: 'Black',
      finish: 'Carbon Fiber', 
      markers: 'Index', 
      regions: ['FR-E', 'FR-U']
    },
    { 
      id: 'd3', 
      name: 'Champagne Guilloché', 
      price: 2500, 
      thumbnail: '/images/dials/champagne-guilloche.jpg',
      stock: 'low',
      color: 'Champagne',
      finish: 'Hand-engraved', 
      markers: 'Roman', 
      regions: ['FR-A']
    },

  ],
  hands: [
    { 
      id: 'h1', 
      name: 'Dauphine', 
      price: 200, 
      thumbnail: '/images/hands/dauphine.jpg',
      stock: 'in',
      style: 'Classic', 
      luminous: true, 
      regions: ['FR-E', 'FR-A', 'FR-U']
    },
    { 
      id: 'h2', 
      name: 'Sword', 
      price: 250, 
      thumbnail: '/images/hands/sword.jpg',
      stock: 'low' ,
      style: 'Vintage', 
      luminous: true, 
      regions: ['FR-A', 'FR-U']
    },

  ],
  straps: [
    { 
      id: 's1', name: 'Alligator Leather', price: 600, thumbnail: '/images/straps/alligator-leather.jpg', stock: 'in',
      material: 'Alligator Leather',
      color: 'Black', 
      clasp: 'Deployant', 
      regions: ['FR-E', 'FR-A', 'FR-U']
    },
    { 
      id: 's2', name: 'Steel Bracelet', price: 800, thumbnail: '/images/straps/steel-bracelet.jpg', stock: 'low', material: 'Steel', color: 'Silver', 
      clasp: 'Folding', regions: ['FR-E', 'FR-A', 'FR-U']
    },
    { 
      id: 's3', name: 'Rubber Sport', price: 350, thumbnail: '/images/straps/rubber-sport.jpg', stock: 'in', material: 'Rubber', color: 'Blue', 
      clasp: 'Tang', regions: ['FR-E', 'FR-U']
    },

  ],
};