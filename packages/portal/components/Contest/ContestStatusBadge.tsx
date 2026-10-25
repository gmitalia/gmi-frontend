import type { ContestStatus } from "../../src/contestStatus";
import { ContestStatusLabel } from "../Competition/ContestStatusLabel";

type ContestStatusBadgeProps = {
  variant: ContestStatus;
  className?: string;
};

/** Badge di stato usato nella testata della competizione. */
export const ContestStatusBadge = ({
  variant,
  className = "",
}: ContestStatusBadgeProps) => (
  <ContestStatusLabel status={variant} className={className} />
);

export default ContestStatusBadge;
