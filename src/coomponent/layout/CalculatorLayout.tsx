import type { ReactNode } from "react";

const CalculatorLayout = ({ children }: { children: ReactNode }) => {
  return <div className="px-[1.5rem] pt-[2rem] ">{children}</div>;
};
export default CalculatorLayout;
