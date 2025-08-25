export interface GameResource {
    id: string;
    name: string;
    description: string;
    type: string;
    clubId: string;
    ownerId: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}