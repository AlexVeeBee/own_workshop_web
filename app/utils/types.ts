export type AssetProperties = 
    | "ASSETSPATH" 
    | "CSS" 
    | "VISIBILITY"
    ;

export interface IWorkshopItem {
    id: number;
    name: string;
    description: string;
    tags: string[];
    thumb: string;
    images?: string[];
    authors: IUser[];
    properties?: {
        [key in AssetProperties]?: string;
    }
}

export interface IUser {
    id: string | number;
    username: string;
    pfp: string;
}

export interface WorkshopInfo {
    title: string;
    description: string;
    headerimage: string;
}