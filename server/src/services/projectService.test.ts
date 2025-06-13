import { MockContext, Context, createMockContext } from '@context/context';
import { findUserRecordWithProjects, createProject, updateProject, deleteProject } from './projectServices';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

afterAll(() => {
    jest.restoreAllMocks();
});

describe('CreateProject', () => {
    it('Creates a project', async () => {
        const input = {
            title: 'title',
            userId: 1,
        };

        const project = {
            id: 1,
            ...input,
        };

        mockCtx.prisma.project.create.mockResolvedValue(project);

        await expect(createProject(input, ctx)).resolves.toEqual(project);
    });

    
})
