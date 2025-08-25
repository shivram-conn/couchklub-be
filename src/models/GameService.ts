export interface GameService {
    id: string;
    name: string;
    description: string;
    clubId: string;
    createdBy: string;
    status: string;
    members: string[];
    resources: string[];
    createdAt: Date;
    updatedAt: Date;
}