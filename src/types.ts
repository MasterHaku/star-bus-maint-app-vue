// Définir l'interface Bus
export interface Bus {
    id: string;
    numero: number;
    marque: string;
    modele: string;
    codedepot: string;
    datemisecirculation: Date;
    nombrevalideurs: number;
    nombrecameras: number;
    autonomiekms: number;
    placesassises: number;
    placesdebout: number;
    nombreplacesufr: number;
    type: string[];
    codetransporteur: string;
  }

export interface Metro{
    id: string;
    numero: number;
    nom: number;
    marque: string;
    modele: string
    version: string;
    longueur:number;
    placesassises:number;
    placesdebout: number;
    placestotales: number;
    nombreplacesufr: number;
    datemiseservice: Date;
    idligne: string;
}

