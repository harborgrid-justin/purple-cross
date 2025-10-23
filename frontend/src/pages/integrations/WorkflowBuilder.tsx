/**
 * WF-COMP-XXX | WorkflowBuilder.tsx - Visual Workflow Builder
 * Purpose: Drag-and-drop visual workflow builder with React Flow
 * Dependencies: React, React Flow, API
 * Last Updated: 2025-10-23 | File Type: .tsx
 */

import { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  NodeChange,
  EdgeChange,
  BackgroundVariant,
  NodeTypes,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { workflowTemplatesApi, WorkflowAction } from '../../services/modules/workflowsApi';
import ActionNode from './components/ActionNode';
import '../../styles/Page.css';

// Node data type
interface ActionNodeData {
  label: string;
  actionType: string;
  config: Record<string, unknown>;
  isParallel: boolean;
  onEdit: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
}

// Action type options
const actionTypes = [
  { value: 'send_email', label: 'Send Email', icon: '📧' },
  { value: 'send_notification', label: 'Send Notification', icon: '🔔' },
  { value: 'update_record', label: 'Update Record', icon: '✏️' },
  { value: 'create_record', label: 'Create Record', icon: '➕' },
  { value: 'webhook', label: 'Call Webhook', icon: '🌐' },
  { value: 'wait', label: 'Wait/Delay', icon: '⏰' },
  { value: 'condition', label: 'Condition', icon: '🔀' },
];

const WorkflowBuilder = () => {
  const [nodes, setNodes] = useState<Node<ActionNodeData>[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Template metadata
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [templateCategory, setTemplateCategory] = useState('general');
  const [triggerType, setTriggerType] = useState<'manual' | 'event' | 'schedule'>('manual');

  // Node types configuration
  const nodeTypes: NodeTypes = {
    actionNode: ActionNode,
  };

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          type: 'default',
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
        },
        eds
      )
    );
  }, []);

  const addActionNode = (actionType: string) => {
    const actionInfo = actionTypes.find((a) => a.value === actionType);
    const newNode: Node<ActionNodeData> = {
      id: `node-${Date.now()}`,
      type: 'actionNode',
      position: {
        x: Math.random() * 300 + 100,
        y: Math.random() * 300 + 100,
      },
      data: {
        label: actionInfo?.label || actionType,
        actionType,
        config: {},
        isParallel: false,
        onEdit: handleEditNode,
        onDelete: handleDeleteNode,
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleEditNode = (nodeId: string) => {
    setSelectedNode(nodeId);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
  };

  const updateNodeData = (nodeId: string | null, updates: Partial<ActionNodeData>) => {
    if (!nodeId) return;
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: { ...node.data, ...updates },
            }
          : node
      )
    );
  };

  const handleSaveWorkflow = async () => {
    if (!templateName.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    if (nodes.length === 0) {
      alert('Please add at least one action');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Convert nodes and edges to workflow actions
      const actions = convertNodesToActions(nodes, edges);

      await workflowTemplatesApi.createTemplate({
        name: templateName,
        description: templateDescription,
        category: templateCategory,
        triggerType,
        triggerConfig: {},
        actions,
        isPublic: false,
      });

      alert('Workflow template saved successfully!');
      setShowSaveDialog(false);

      // Reset form
      setTemplateName('');
      setTemplateDescription('');
      setTemplateCategory('general');
      setTriggerType('manual');
      setNodes([]);
      setEdges([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workflow');
    } finally {
      setLoading(false);
    }
  };

  const convertNodesToActions = (
    flowNodes: Node<ActionNodeData>[],
    flowEdges: Edge[]
  ): WorkflowAction[] => {
    // Build adjacency list for parallel execution detection
    const adjacencyMap = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    flowNodes.forEach((node) => {
      adjacencyMap.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    flowEdges.forEach((edge) => {
      const targets = adjacencyMap.get(edge.source) || [];
      targets.push(edge.target);
      adjacencyMap.set(edge.source, targets);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    return flowNodes.map((node) => ({
      id: node.id,
      type: node.data.actionType,
      name: node.data.label,
      config: {
        ...node.data.config,
        isParallel: node.data.isParallel,
        nextActions: adjacencyMap.get(node.id) || [],
      },
    }));
  };

  const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null;

  return (
    <div className="page" style={{ height: 'calc(100vh - 4rem)' }}>
      <header className="page-header">
        <h1>
          <span aria-hidden="true">🎨</span> Visual Workflow Builder
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn-secondary"
            onClick={() => {
              if (window.confirm('Clear all nodes and edges?')) {
                setNodes([]);
                setEdges([]);
                setSelectedNode(null);
              }
            }}
          >
            Clear
          </button>
          <button
            className="btn-primary"
            onClick={() => setShowSaveDialog(true)}
            disabled={nodes.length === 0}
          >
            Save Template
          </button>
        </div>
      </header>

      {error && (
        <div
          style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            margin: '1rem',
          }}
        >
          <strong>Error:</strong> {error}
          <button
            style={{ marginLeft: '1rem' }}
            className="btn-secondary"
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          height: 'calc(100% - 5rem)',
          gap: '1rem',
          padding: '0 1rem 1rem',
        }}
      >
        {/* Action Palette */}
        <div
          style={{
            width: '250px',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            overflowY: 'auto',
          }}
        >
          <h3 style={{ marginTop: 0 }}>Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {actionTypes.map((action) => (
              <button
                key={action.value}
                className="btn-secondary"
                onClick={() => addActionNode(action.value)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'flex-start',
                  padding: '0.75rem',
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>{action.icon}</span>
                <span style={{ fontSize: '0.875rem' }}>{action.label}</span>
              </button>
            ))}
          </div>

          <div
            style={{
              marginTop: '2rem',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1rem',
            }}
          >
            <h4 style={{ marginTop: 0, fontSize: '0.875rem' }}>Tips</h4>
            <ul style={{ fontSize: '0.75rem', paddingLeft: '1.25rem', margin: 0 }}>
              <li>Click an action to add it to the canvas</li>
              <li>Drag actions to position them</li>
              <li>Connect actions by dragging from handles</li>
              <li>Click a node to edit its settings</li>
              <li>Mark actions as parallel for concurrent execution</li>
            </ul>
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={reactFlowWrapper}
          style={{
            flex: 1,
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background variant={BackgroundVariant.Dots} />
            <Controls />
          </ReactFlow>
        </div>

        {/* Properties Panel */}
        {selectedNodeData && (
          <div
            style={{
              width: '300px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              overflowY: 'auto',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Action Properties</h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                Action Name
              </label>
              <input
                type="text"
                value={selectedNodeData.data.label}
                onChange={(e) => updateNodeData(selectedNode, { label: e.target.value })}
                style={{ width: '100%', padding: '0.5rem' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontSize: '0.875rem' }}>
                <input
                  type="checkbox"
                  checked={selectedNodeData.data.isParallel}
                  onChange={(e) => updateNodeData(selectedNode, { isParallel: e.target.checked })}
                  style={{ marginRight: '0.5rem' }}
                />
                Execute in parallel
              </label>
              <p
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  margin: '0.25rem 0 0 1.5rem',
                }}
              >
                When enabled, this action can run concurrently with other parallel actions
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong style={{ fontSize: '0.875rem' }}>Action Type:</strong>{' '}
              <span style={{ fontSize: '0.875rem' }}>{selectedNodeData.data.actionType}</span>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                className="btn-action"
                onClick={() => selectedNode && handleDeleteNode(selectedNode)}
                style={{ color: '#ef4444', width: '100%' }}
              >
                Delete Action
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowSaveDialog(false)}
        >
          <div
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0 }}>Save Workflow Template</h2>

            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="templateName" style={{ display: 'block', marginBottom: '0.5rem' }}>
                Template Name *
              </label>
              <input
                type="text"
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                style={{ width: '100%', padding: '0.5rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="templateDescription"
                style={{ display: 'block', marginBottom: '0.5rem' }}
              >
                Description
              </label>
              <textarea
                id="templateDescription"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', minHeight: '80px' }}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem',
              }}
            >
              <div>
                <label htmlFor="category" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>
              <div>
                <label htmlFor="triggerType" style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Trigger Type
                </label>
                <select
                  id="triggerType"
                  value={triggerType}
                  onChange={(e) =>
                    setTriggerType(e.target.value as 'manual' | 'event' | 'schedule')
                  }
                  style={{ width: '100%', padding: '0.5rem' }}
                >
                  <option value="manual">Manual</option>
                  <option value="event">Event</option>
                  <option value="schedule">Schedule</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                className="btn-secondary"
                onClick={() => setShowSaveDialog(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleSaveWorkflow}
                disabled={loading || !templateName.trim()}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowBuilder;
