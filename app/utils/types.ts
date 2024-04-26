export interface IWorkshopItem {
    id: string;
    name: string;
    description: string;
    thumb: string;
    images?: string[];
}

export interface IUser {
    id: string;
    username: string;
    thumb: string;
}

export interface WorkshopInfo {
    title: string;
    description: string;
    headerimage: string;
}