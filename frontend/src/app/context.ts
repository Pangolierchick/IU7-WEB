import { createContext } from "react";

const PageContext = createContext<React.Dispatch<
  React.SetStateAction<boolean>
> | null>(null);

export default PageContext;
