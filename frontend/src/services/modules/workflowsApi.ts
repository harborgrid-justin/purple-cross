/**
 * WF-COMP-XXX | workflowsApi.ts - Workflows API service module
 * Purpose: Workflows domain API operations with type safety and validation
 * Upstream: ../config/apiConfig, ../utils/apiUtils | Dependencies: axios
 * Downstream: Components, Redux stores | Called by: Workflow components and stores
 * Related: Workflow types, workflow builder pages
 * Exports: workflowsApi instance, types | Key Features: Template CRUD, execution tracking, analytics
 * Last Updated: 2025-10-23 | File Type: .ts
 * Critical Path: Component request → API call → Backend → Response transformation → Component update
 * LLM Context: Domain-specific API service for workflow management and execution
 */

import { apiInstance } from '../config/apiConfig';
import { buildUrlParams, handleApiError, extractApiData } from '../utils/apiUtils';

// ==========================================
// INTERFACES & TYPES
// ==========================================

export interface WorkflowAction {
  id: string;
  type: string;
  name: string;
  config: Record<string, unknown>;
  onSuccess?: string;
  onFailure?: string;
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  triggerType: string;
  triggerConfig: Record<string, unknown>;
  actions: WorkflowAction[];
  isPublic: boolean;
  isActive: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkflowTemplateData {
  name: string;
  description?: string;
  category?: string;
  triggerType: string;
  triggerConfig: Record<string, unknown>;
  actions: WorkflowAction[];
  isPublic?: boolean;
}

export interface UpdateWorkflowTemplateData {
  name?: string;
  description?: string;
  category?: string;
  triggerType?: string;
  triggerConfig?: Record<string, unknown>;
  actions?: WorkflowAction[];
  isActive?: boolean;
  isPublic?: boolean;
}

export interface WorkflowTemplateFilters extends Record<string, unknown> {
  category?: string;
  triggerType?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface WorkflowExecution {
  id: string;
  templateId?: string;
  workflowName: string;
  triggerType: string;
  triggerData: Record<string, unknown>;
  status: string;
  currentActionId?: string;
  variables: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
  template?: {
    id: string;
    name: string;
    category: string;
  };
  steps?: WorkflowExecutionStep[];
}

export interface WorkflowExecutionStep {
  id: string;
  executionId: string;
  actionId: string;
  actionType: string;
  actionName: string;
  actionConfig: Record<string, unknown>;
  status: string;
  output?: Record<string, unknown>;
  error?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowExecutionFilters extends Record<string, unknown> {
  status?: string;
  templateId?: string;
  page?: number;
  limit?: number;
}

export interface WorkflowExecutionStats {
  total: number;
  pending: number;
  running: number;
  completed: number;
  failed: number;
  cancelled: number;
  successRate: number;
}

export interface ExecuteCustomWorkflowData {
  workflowName: string;
  actions: WorkflowAction[];
  triggerData?: Record<string, unknown>;
}

export interface ExecuteTemplateData {
  triggerData?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ==========================================
// WORKFLOW TEMPLATES API CLASS
// ==========================================

class WorkflowTemplatesApi {
  private basePath = '/workflow-templates';

  /**
   * Get all workflow templates
   */
  async getTemplates(filters?: WorkflowTemplateFilters): Promise<PaginatedResponse<WorkflowTemplate>> {
    try {
      const params = filters ? buildUrlParams(filters) : '';
      const response = await apiInstance.get<{
        status: string;
        data: WorkflowTemplate[];
        pagination: PaginatedResponse<WorkflowTemplate>['pagination'];
      }>(`${this.basePath}${params}`);

      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get template by ID
   */
  async getTemplateById(id: string): Promise<WorkflowTemplate> {
    try {
      const response = await apiInstance.get<{ status: string; data: WorkflowTemplate }>(
        `${this.basePath}/${id}`
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Create a new workflow template
   */
  async createTemplate(data: CreateWorkflowTemplateData): Promise<WorkflowTemplate> {
    try {
      const response = await apiInstance.post<{ status: string; data: WorkflowTemplate }>(
        this.basePath,
        data
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Update a workflow template
   */
  async updateTemplate(id: string, data: UpdateWorkflowTemplateData): Promise<WorkflowTemplate> {
    try {
      const response = await apiInstance.put<{ status: string; data: WorkflowTemplate }>(
        `${this.basePath}/${id}`,
        data
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Delete a workflow template
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      await apiInstance.delete(`${this.basePath}/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get popular templates
   */
  async getPopularTemplates(limit?: number): Promise<WorkflowTemplate[]> {
    try {
      const params = limit ? `?limit=${limit}` : '';
      const response = await apiInstance.get<{ status: string; data: WorkflowTemplate[] }>(
        `${this.basePath}/popular${params}`
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get template categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await apiInstance.get<{ status: string; data: string[] }>(
        `${this.basePath}/categories`
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get templates by category
   */
  async getTemplatesByCategory(category: string): Promise<WorkflowTemplate[]> {
    try {
      const response = await apiInstance.get<{ status: string; data: WorkflowTemplate[] }>(
        `${this.basePath}/category/${category}`
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Execute a workflow template
   */
  async executeTemplate(id: string, data?: ExecuteTemplateData): Promise<{ message: string; templateId: string }> {
    try {
      const response = await apiInstance.post<{
        status: string;
        message: string;
        data: { templateId: string };
      }>(`${this.basePath}/${id}/execute`, data || {});
      return {
        message: 'Operation successful',
        ...extractApiData(response),
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// ==========================================
// WORKFLOW EXECUTIONS API CLASS
// ==========================================

class WorkflowExecutionsApi {
  private basePath = '/workflow-executions';

  /**
   * Get all workflow executions
   */
  async getExecutions(filters?: WorkflowExecutionFilters): Promise<PaginatedResponse<WorkflowExecution>> {
    try {
      const params = filters ? buildUrlParams(filters) : '';
      const response = await apiInstance.get<{
        status: string;
        data: WorkflowExecution[];
        pagination: PaginatedResponse<WorkflowExecution>['pagination'];
      }>(`${this.basePath}${params}`);

      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get execution by ID
   */
  async getExecutionById(id: string): Promise<WorkflowExecution> {
    try {
      const response = await apiInstance.get<{ status: string; data: WorkflowExecution }>(
        `${this.basePath}/${id}`
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Cancel an execution
   */
  async cancelExecution(id: string): Promise<WorkflowExecution> {
    try {
      const response = await apiInstance.post<{ status: string; data: WorkflowExecution }>(
        `${this.basePath}/${id}/cancel`
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get execution statistics
   */
  async getExecutionStats(templateId?: string): Promise<WorkflowExecutionStats> {
    try {
      const params = templateId ? `?templateId=${templateId}` : '';
      const response = await apiInstance.get<{ status: string; data: WorkflowExecutionStats }>(
        `${this.basePath}/stats${params}`
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Get recent executions
   */
  async getRecentExecutions(limit?: number): Promise<WorkflowExecution[]> {
    try {
      const params = limit ? `?limit=${limit}` : '';
      const response = await apiInstance.get<{ status: string; data: WorkflowExecution[] }>(
        `${this.basePath}/recent${params}`
      );
      return extractApiData(response);
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Execute a custom workflow
   */
  async executeCustomWorkflow(data: ExecuteCustomWorkflowData): Promise<{ message: string; workflowName: string }> {
    try {
      const response = await apiInstance.post<{
        status: string;
        message: string;
        data: { workflowName: string };
      }>(`${this.basePath}/execute`, data);
      return {
        message: 'Operation successful',
        ...extractApiData(response),
      };
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

// Export singleton instances
export const workflowTemplatesApi = new WorkflowTemplatesApi();
export const workflowExecutionsApi = new WorkflowExecutionsApi();
