export interface CreateProject {
    title: string;
    userId: number;
};

export interface IndexProject {
    userId: number;
};

export interface UpdateProject {
    newTitle: string;
    projectId: number;
    userId: number;
};

export interface DeleteProject {
    projectId: number;
    userId: number;
}