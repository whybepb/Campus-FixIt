import { API_CONFIG, STORAGE_KEYS } from '@/constants';
import { CreateIssuePayload, Issue, IssueFilters, UpdateIssuePayload } from '@/types';
import { apiClient } from './apiClient';
import { storageService } from './storageService';

// Set to true to use mock data (no backend needed)
const USE_MOCK_API = false;

// Mock issues data for development
const MOCK_ISSUES: Issue[] = [
  {
    id: '1',
    title: 'Broken Light in Library',
    description: 'The main light in the library reading area has been flickering for days and finally stopped working. Students are having difficulty studying in that area.',
    category: 'electrical',
    status: 'open',
    priority: 'high',
    location: 'Main Library, 2nd Floor',
    createdBy: '1',
    createdByName: 'John Student',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Water Leakage in Restroom',
    description: 'There is a significant water leak from one of the pipes in the mens restroom on the ground floor. Water is pooling on the floor creating a slip hazard.',
    category: 'water',
    status: 'in_progress',
    priority: 'urgent',
    location: 'Building A, Ground Floor Restroom',
    createdBy: '1',
    createdByName: 'John Student',
    adminRemarks: 'Plumber has been contacted and will arrive tomorrow.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'WiFi Not Working in Lab',
    description: 'The WiFi connection in Computer Lab 3 has been very unstable. It keeps disconnecting every few minutes making it impossible to work.',
    category: 'internet',
    status: 'resolved',
    priority: 'medium',
    location: 'Computer Lab 3, IT Building',
    createdBy: '1',
    createdByName: 'John Student',
    adminRemarks: 'Router has been replaced. Issue resolved.',
    resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'Broken Window in Classroom',
    description: 'One of the windows in Room 204 is cracked and needs to be replaced. It is causing cold air to enter the classroom.',
    category: 'infrastructure',
    status: 'open',
    priority: 'medium',
    location: 'Room 204, Academic Block',
    createdBy: '1',
    createdByName: 'John Student',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    title: 'AC Not Cooling',
    description: 'The air conditioning unit in the seminar hall is running but not cooling. The room becomes very hot during afternoon sessions.',
    category: 'electrical',
    status: 'in_progress',
    priority: 'high',
    location: 'Seminar Hall, Admin Building',
    createdBy: '1',
    createdByName: 'John Student',
    adminRemarks: 'Technician is scheduled to check the AC compressor.',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

let mockIssues = [...MOCK_ISSUES];

// Mock implementation for testing
const mockIssueService = {
  async getAllIssues(filters?: IssueFilters): Promise<Issue[]> {
    await new Promise(resolve => setTimeout(resolve, 800));

    let filtered = [...mockIssues];

    if (filters?.category) {
      filtered = filtered.filter(i => i.category === filters.category);
    }
    if (filters?.status) {
      filtered = filtered.filter(i => i.status === filters.status);
    }
    if (filters?.priority) {
      filtered = filtered.filter(i => i.priority === filters.priority);
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(i =>
        i.title.toLowerCase().includes(search) ||
        i.description.toLowerCase().includes(search)
      );
    }

    return filtered.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async getMyIssues(filters?: IssueFilters): Promise<Issue[]> {
    return this.getAllIssues(filters);
  },

  async getIssueById(id: string): Promise<Issue> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const issue = mockIssues.find(i => i.id === id);
    if (!issue) {
      throw new Error('Issue not found');
    }
    return issue;
  },

  async createIssue(payload: CreateIssuePayload): Promise<Issue> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newIssue: Issue = {
      id: Date.now().toString(),
      ...payload,
      status: 'open',
      priority: payload.priority || 'medium',
      createdBy: '1',
      createdByName: 'John Student',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockIssues = [newIssue, ...mockIssues];
    return newIssue;
  },

  async updateIssue(id: string, payload: UpdateIssuePayload): Promise<Issue> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const index = mockIssues.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Issue not found');
    }

    const updatedIssue: Issue = {
      ...mockIssues[index],
      ...payload,
      updatedAt: new Date(),
      resolvedAt: payload.status === 'resolved' ? new Date() : mockIssues[index].resolvedAt,
    };

    mockIssues[index] = updatedIssue;
    return updatedIssue;
  },

  async deleteIssue(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockIssues = mockIssues.filter(i => i.id !== id);
  },

  async uploadImage(uri: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return uri;
  },
};

// Real API implementation
const realIssueService = {
  async getAllIssues(filters?: IssueFilters): Promise<Issue[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    const endpoint = `/issues${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<{ issues: Issue[] }>(endpoint);
    return response.issues;
  },

  async getMyIssues(filters?: IssueFilters): Promise<Issue[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);

    const queryString = params.toString();
    const endpoint = `/issues/my${queryString ? `?${queryString}` : ''}`;

    const response = await apiClient.get<{ issues: Issue[] }>(endpoint);
    return response.issues;
  },

  async getIssueById(id: string): Promise<Issue> {
    const response = await apiClient.get<{ issue: Issue }>(`/issues/${id}`);
    return response.issue;
  },

  async createIssue(payload: CreateIssuePayload): Promise<Issue> {
    // Use FormData to upload with images
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('category', payload.category);
    formData.append('location', payload.location);
    if (payload.priority) {
      formData.append('priority', payload.priority);
    }

    // Add image if present
    if (payload.imageUrl) {
      const uri = payload.imageUrl;
      const filename = uri.split('/').pop() || 'image.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      formData.append('images', {
        uri,
        name: filename,
        type,
      } as any);
    }

    // Make request with FormData
    const token = await storageService.get(STORAGE_KEYS.authToken);
    const response = await fetch(`${API_CONFIG.baseUrl}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - fetch will set it with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create issue');
    }

    const data = await response.json();
    return data.issue;
  },

  async updateIssue(id: string, payload: UpdateIssuePayload): Promise<Issue> {
    const response = await apiClient.put<{ issue: Issue }>(`/issues/${id}`, payload);
    return response.issue;
  },

  async deleteIssue(id: string): Promise<void> {
    await apiClient.delete(`/issues/${id}`);
  },

  async uploadImage(uri: string): Promise<string> {
    // TODO: Implement actual image upload with FormData
    return uri;
  },

  async getStats(): Promise<any> {
    return apiClient.get('/issues/stats');
  },
};

export const issueService = USE_MOCK_API ? mockIssueService : realIssueService;
