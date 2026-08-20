import { ProjectWorkspace } from "@/components/project/project-workspace";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    generating?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const resolvedSearchParams = (await searchParams) ?? {};
  const initialGenerating = resolvedSearchParams.generating === "true";

  return (
    <ProjectWorkspace
      projectId={id}
      initialGenerating={initialGenerating}
    />
  );
}
