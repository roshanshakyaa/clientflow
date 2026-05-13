import { Id } from "@/convex/_generated/dataModel";

interface Props {
  params: Promise<{ projectId: Id<"projects"> }>;
}

const ProjectPage = async ({ params }: Props) => {
  const { projectId } = await params;
  return <div>ProjectPage</div>;
};

export default ProjectPage;
