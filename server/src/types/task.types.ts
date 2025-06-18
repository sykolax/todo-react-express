export interface CreateTask {
    projectId: number;
    newDescription: string;
};

export interface IndexTask {
    projectId: number;
};

export interface UpdateTask {
    taskId: number;
    newDescription: string; 
    newCompletedStatus: boolean;
};

export interface TaskWithId {
    taskId: number;
}
