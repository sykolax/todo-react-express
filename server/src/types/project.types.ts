interface CreateProject {
    title: string;
    userId: number;
};

interface IndexProject {
    userId: number;
};

interface UpdateProject {
    newTitle: string;
    projectId: number;
    userId: number;
};

interface DeleteProject {
    projectId: number;
    userId: number;
}