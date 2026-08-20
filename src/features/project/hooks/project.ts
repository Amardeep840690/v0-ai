import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProject,
  getProjects,
  getProjectById,
  getLatestProject,
  deleteProject,
  renameProject,
  createMessage,
} from "../action";

export type ActionError = {
  error: string;
};

function isActionError(value: unknown): value is ActionError {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as ActionError).error === "string"
  );
}

async function unwrapActionResult<T>(
  result: T | { error: string },
): Promise<T> {
  if (isActionError(result)) {
    throw new Error(result.error);
  }

  return result;
}

type CreateProjectPayload = {
  projectName?: string;
  prompt?: string;
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectName, prompt }: CreateProjectPayload) =>
      unwrapActionResult(await createProject(projectName, prompt)),
    onSuccess: () => {
      //refresh sidebar projects
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => unwrapActionResult(await getProjects()),
  });
};

export const useGetProjectById = (
  id: string,
  options?: { refetchInterval?: number | false },
) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => unwrapActionResult(await getProjectById(id)),
    refetchInterval: options?.refetchInterval,
  });
};

export const useGetLatestProject = () => {
  return useQuery({
    queryKey: ["latest_project"],
    queryFn: async () => unwrapActionResult(await getLatestProject()),
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      return unwrapActionResult(await deleteProject(projectId));
    },

    onSuccess: async () => {
      // Refresh sidebar projects
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      // Refresh Continue Working
      await queryClient.invalidateQueries({
        queryKey: ["latest_project"],
      });
    },
  });
};

type RenameProjectType = {
  projectId: string;
  projectName: string;
};

export const useRenameProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, projectName }: RenameProjectType) => {
      return unwrapActionResult(await renameProject(projectId, projectName));
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });

      await queryClient.invalidateQueries({
        queryKey: ["latest_project"],
      });
    },
  });
};

interface CreateMessageParams {
  projectId: string;
  content: string;
  role: "USER" | "ASSISTANT";
  type: "RESULT" | "ERROR";
}

export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      content,
      role,
      type,
    }: CreateMessageParams) => {
      return unwrapActionResult(
        await createMessage({ projectId, content, role, type }),
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
    },
  });
};
