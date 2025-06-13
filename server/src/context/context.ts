import type prisma from '@lib/prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

export type Context = {
  prisma: typeof prisma
}

export type MockContext = {
  prisma: DeepMockProxy<typeof prisma>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<typeof prisma>(),
  }
}