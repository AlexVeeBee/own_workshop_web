export type AssetProperties = 
    | "ASSETSPATH" 
    | "CSS" 
    | "VISIBILITY"
    ;

interface IWorkshopItemLimits {
    name: string;
}

export interface IWorkshopItemMedia {
    src: string;
    type: "image" | "video";
}

export interface IWorkshopItem {
    id: number;
    name: string;
    description: string;
    version: string;
    tags: string[];
    thumb: string;
    media?: IWorkshopItemMedia[];
    authors: IUser[];
    owner: IUser;
    limits?: string[];
    properties?: {
        [key in AssetProperties]?: string;
    }
}

export interface IUser {
    id: string | number;
    username: string;
    pfp: string;
    banner?: string | null;
}

export interface WorkshopInfo {
    title: string;
    description: string;
    headerimage: string;
}

export type imageFitOptions = "contain" | "cover" | "original";