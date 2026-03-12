import api from "./axios";
import type { WorkflowDefinition } from "@/types/workflow";

export const createWorkflow = async (name: string, description: string, definition: WorkflowDefinition) => {
  const { data } = await api.post("/workflows", { name, description, definition });
  return data;
};
