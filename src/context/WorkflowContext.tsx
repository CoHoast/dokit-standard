'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WorkflowConfig {
  [key: string]: any;
}

interface EnabledWorkflow {
  key: string;
  name: string;
  shortDescription: string;
  icon: string;
  color: string;
  category: string;
  enabledAt: string;
  config: WorkflowConfig;
}

interface WorkflowContextType {
  workflows: EnabledWorkflow[];
  loading: boolean;
  error: string | null;
  getWorkflowConfig: (key: string) => WorkflowConfig | undefined;
  isWorkflowEnabled: (key: string) => boolean;
  refetch: () => Promise<void>;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// Get client ID from environment or session
// In production, this would come from auth/session
const getClientId = () => {
  // For now, use environment variable or default to demo client
  return process.env.NEXT_PUBLIC_CLIENT_ID || '1';
};

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [workflows, setWorkflows] = useState<EnabledWorkflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkflows = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const clientId = getClientId();
      // Call the Super Admin API to get enabled workflows
      // In production, this would be an internal API or the client would have its own endpoint
      const apiUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
      
      const res = await fetch(`${apiUrl}/api/db/workflows/enabled?clientId=${clientId}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch workflows');
      }
      
      const data = await res.json();
      setWorkflows(data.workflows || []);
    } catch (err) {
      console.error('Error fetching workflows:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Fallback to empty array - sidebar will show minimal navigation
      setWorkflows([]);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const getWorkflowConfig = (key: string): WorkflowConfig | undefined => {
    return workflows.find(w => w.key === key)?.config;
  };

  const isWorkflowEnabled = (key: string): boolean => {
    return workflows.some(w => w.key === key);
  };

  return (
    <WorkflowContext.Provider value={{
      workflows,
      loading,
      error,
      getWorkflowConfig,
      isWorkflowEnabled,
      refetch: fetchWorkflows
    }}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflows() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflows must be used within a WorkflowProvider');
  }
  return context;
}
