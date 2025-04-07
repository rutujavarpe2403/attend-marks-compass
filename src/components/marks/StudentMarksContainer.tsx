
import { StudentMarksView } from "./StudentMarksView";

interface StudentMarksContainerProps {
  profileId: string;
}

export const StudentMarksContainer = ({ profileId }: StudentMarksContainerProps) => {
  return <StudentMarksView profileId={profileId} />;
};
