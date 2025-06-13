interface CreateTask {
    projectId: number;
    newDescription: string;
};

interface IndexTask {
    projectId: number;
};

interface UpdateTask {
    taskId: number;
    newDescription: string; 
    newCompletedStatus: boolean;
};

interface TaskWithId {
    taskId: number;
}
