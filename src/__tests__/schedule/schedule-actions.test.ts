import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock supabase/server
const mockGetUser = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      auth: {
        getUser: mockGetUser,
      },
    }),
  ),
}));

// Mock db
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

const mockReturning = vi.fn();
const mockValues = vi.fn(() => ({ returning: mockReturning }));
const mockFrom = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockSet = vi.fn();
const mockLimit = vi.fn();

vi.mock('@/lib/db', () => ({
  db: {
    insert: (...args: unknown[]) => {
      mockInsert(...args);
      return { values: mockValues };
    },
    select: (...args: unknown[]) => {
      mockSelect(...args);
      return {
        from: (...fromArgs: unknown[]) => {
          mockFrom(...fromArgs);
          return {
            where: (...whereArgs: unknown[]) => {
              mockWhere(...whereArgs);
              const resultPromise = Promise.resolve([]);
              // Make it thenable AND chainable (some queries chain .orderBy, others await directly)
              return Object.assign(resultPromise, {
                orderBy: (...orderByArgs: unknown[]) => {
                  mockOrderBy(...orderByArgs);
                  return Promise.resolve([]);
                },
                limit: (...limitArgs: unknown[]) => {
                  mockLimit(...limitArgs);
                  return Promise.resolve([]);
                },
              });
            },
            orderBy: (...orderByArgs: unknown[]) => {
              mockOrderBy(...orderByArgs);
              return Promise.resolve([]);
            },
          };
        },
      };
    },
    update: (...args: unknown[]) => {
      mockUpdate(...args);
      return {
        set: (...setArgs: unknown[]) => {
          mockSet(...setArgs);
          return {
            where: (...whereArgs: unknown[]) => {
              mockWhere(...whereArgs);
              return { returning: mockReturning };
            },
          };
        },
      };
    },
    delete: (...args: unknown[]) => {
      mockDelete(...args);
      return {
        where: (...whereArgs: unknown[]) => {
          mockWhere(...whereArgs);
          return Promise.resolve();
        },
      };
    },
  },
}));

// Import after mocks
const { createJob, updateJob, deleteJob, getJobsForMonth, getIncomeStats } =
  await import('@/actions/schedule');

beforeEach(() => {
  vi.clearAllMocks();
});

describe('createJob', () => {
  const validJobData = {
    jobDate: '2026-03-20',
    clientName: 'Test Client',
    location: 'Studio A',
    startTime: '09:00',
    endTime: '17:00',
    payAmount: 5000000,
    status: 'pending' as const,
    notes: null,
  };

  it('creates a job when authenticated and returns it', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });
    const mockJob = { id: 'job-1', ...validJobData };
    mockReturning.mockResolvedValue([mockJob]);

    const result = await createJob(validJobData);

    expect(result).toEqual(mockJob);
    expect(mockInsert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalled();
  });

  it('throws Unauthorized when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(createJob(validJobData)).rejects.toThrow('Unauthorized');
  });

  it('throws validation error for empty clientName', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    await expect(
      createJob({ ...validJobData, clientName: '' }),
    ).rejects.toThrow();
  });

  it('throws validation error for invalid date format', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    await expect(
      createJob({ ...validJobData, jobDate: '20-03-2026' }),
    ).rejects.toThrow();
  });
});

describe('getJobsForMonth', () => {
  it('throws Unauthorized when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(getJobsForMonth(2026, 3)).rejects.toThrow('Unauthorized');
  });

  it('queries for jobs in the given month', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    await getJobsForMonth(2026, 3);

    expect(mockSelect).toHaveBeenCalled();
    expect(mockFrom).toHaveBeenCalled();
    expect(mockWhere).toHaveBeenCalled();
  });
});

describe('updateJob', () => {
  it('throws Unauthorized when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      updateJob('550e8400-e29b-41d4-a716-446655440000', {
        clientName: 'Updated',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('updates job fields when authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });
    const mockUpdated = { id: 'job-1', clientName: 'Updated' };
    mockReturning.mockResolvedValue([mockUpdated]);

    const result = await updateJob('550e8400-e29b-41d4-a716-446655440000', {
      clientName: 'Updated',
    });

    expect(result).toEqual(mockUpdated);
    expect(mockUpdate).toHaveBeenCalled();
    expect(mockSet).toHaveBeenCalled();
  });

  it('throws for invalid UUID', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    await expect(
      updateJob('not-a-uuid', { clientName: 'Updated' }),
    ).rejects.toThrow();
  });
});

describe('deleteJob', () => {
  it('throws Unauthorized when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(
      deleteJob('550e8400-e29b-41d4-a716-446655440000'),
    ).rejects.toThrow('Unauthorized');
  });

  it('deletes job when authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });

    const result = await deleteJob('550e8400-e29b-41d4-a716-446655440000');

    expect(result).toEqual({ success: true });
    expect(mockDelete).toHaveBeenCalled();
  });
});

describe('getIncomeStats', () => {
  it('throws Unauthorized when not authenticated', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    await expect(getIncomeStats(2026, 3)).rejects.toThrow('Unauthorized');
  });

  it('returns zeros for empty months', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-123' } },
    });
    // mockWhere returns empty array by default via orderBy chain

    const result = await getIncomeStats(2026, 3);

    expect(result).toEqual({
      totalPaid: 0,
      totalPending: 0,
      total: 0,
      jobCount: 0,
    });
  });
});
