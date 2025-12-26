import { issueService } from '@/services/issueService';
import { checkAndNotifyStatusChanges, showLocalNotification } from '@/services/notificationService';
import { CreateIssuePayload, Issue, IssueFilters, UpdateIssuePayload } from '@/types';
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface IssueContextType {
  issues: Issue[];
  myIssues: Issue[];
  isLoading: boolean;
  filters: IssueFilters;
  setFilters: (filters: IssueFilters) => void;
  fetchIssues: () => Promise<void>;
  fetchMyIssues: () => Promise<void>;
  createIssue: (payload: CreateIssuePayload) => Promise<Issue>;
  updateIssue: (id: string, payload: UpdateIssuePayload) => Promise<Issue>;
  deleteIssue: (id: string) => Promise<void>;
  getIssueById: (id: string) => Issue | undefined;
  refreshIssues: () => Promise<void>;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};

interface IssueProviderProps {
  children: ReactNode;
}

export const IssueProvider: React.FC<IssueProviderProps> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<IssueFilters>({});

  const fetchIssues = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await issueService.getAllIssues(filters);
      setIssues(data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const fetchMyIssues = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await issueService.getMyIssues(filters);

      // Check for status changes and show notifications
      const issuesForNotification = data.map(issue => ({
        id: issue.id || (issue as any)._id,
        title: issue.title,
        status: issue.status,
      }));
      await checkAndNotifyStatusChanges(issuesForNotification);

      setMyIssues(data);
    } catch (error) {
      console.error('Error fetching my issues:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const createIssue = async (payload: CreateIssuePayload): Promise<Issue> => {
    try {
      setIsLoading(true);
      const newIssue = await issueService.createIssue(payload);
      setMyIssues(prev => [newIssue, ...prev]);
      setIssues(prev => [newIssue, ...prev]);

      // Show confirmation notification to student
      await showLocalNotification(
        '📝 Issue Submitted!',
        'We are on it! Expect an update soon.',
        { issueId: newIssue.id, type: 'issue_created' }
      );

      return newIssue;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateIssue = async (id: string, payload: UpdateIssuePayload): Promise<Issue> => {
    try {
      setIsLoading(true);
      const updatedIssue = await issueService.updateIssue(id, payload);

      setIssues(prev => prev.map(issue => issue.id === id ? updatedIssue : issue));
      setMyIssues(prev => prev.map(issue => issue.id === id ? updatedIssue : issue));

      return updatedIssue;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIssue = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      await issueService.deleteIssue(id);

      // Filter out by both id and _id to handle MongoDB documents
      setIssues(prev => prev.filter(issue => issue.id !== id && (issue as any)._id !== id));
      setMyIssues(prev => prev.filter(issue => issue.id !== id && (issue as any)._id !== id));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getIssueById = useCallback((id: string): Issue | undefined => {
    return issues.find(issue => issue.id === id) || myIssues.find(issue => issue.id === id);
  }, [issues, myIssues]);

  const refreshIssues = useCallback(async () => {
    await Promise.all([fetchIssues(), fetchMyIssues()]);
  }, [fetchIssues, fetchMyIssues]);

  // Don't auto-fetch on mount - let screens fetch when user is authenticated

  return (
    <IssueContext.Provider
      value={{
        issues,
        myIssues,
        isLoading,
        filters,
        setFilters,
        fetchIssues,
        fetchMyIssues,
        createIssue,
        updateIssue,
        deleteIssue,
        getIssueById,
        refreshIssues,
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};
