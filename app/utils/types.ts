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
    smallSrc?: string;
    type: "image" | "video";
}

export interface IWorkshopPageConfig {
    css: string;
    globalCss: string;
    headerimage: string;
}

export interface IWorkshopPageDetails {
    config: IWorkshopPageConfig;
    title: string;
    description: string;
    shortDescription: string;
}

export interface IWorkshopItem {
    id: number;
    name: string;
    description: string[];
    shortDescription: string;
    version: string;
    tags: string[];
    thumb: string;
    media?: IWorkshopItemMedia[];
    authors: IUser[];
    owner: IUser;
    latestVersion: string | null;
    limits?: string[];
    nsfw: boolean;
    properties?: {
        [key in AssetProperties]?: string;
    }
}

export interface AssetVersion {
    version: string,
    date: Date,
}
export interface IUser {
    id: string | number;
    username: string;
    pfp: string;
    banner?: string | null;
    admin: boolean;
    nsfw: boolean;
}

export interface WorkshopInfo {
    title: string;
    description: string;
    headerimage: string;
}

export type imageFitOptions = "contain" | "cover" | "original";