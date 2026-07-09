import type { User } from "./User";

export type PartOption = {
  id: string;
  material: string;
  name: string;
  price: number; // delta over base
  regions: string[]; // list of region codes where this part is available
  size: string;
  stock:number;
  description:string
  thumbnail: string; // small preview image
  type:string
};

export type PartsCatalog = {
  mouvement:PartOption[];
  cases: PartOption[];
  dials: PartOption[];
  hands: PartOption[];
  straps: PartOption[];
};


export type Watch = {
  id: number;
  creator: string;
  name: string;
  votes: number;
  image: string;
  components: PartOption[];
}

export type Region = {
    id: number,
    name: string,
    votes: number,
}

export type SharedWatch = {
  id: number,
  votes:User,
  watch:Watch
}