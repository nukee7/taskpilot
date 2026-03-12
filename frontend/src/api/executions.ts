import api from "./axios";

export const executeWorkflow = async (workflowId: string) => {
  const { data } = await api.post(`/executions/${workflowId}/run`);
  return data as { executionId: string };
};

export const getExecutionStatus = async (executionId: string) => {
  const { data } = await api.get(`/executions/${executionId}`);
  return data;
};
