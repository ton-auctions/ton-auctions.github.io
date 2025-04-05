import { useContext } from "react";

import { ServiceControllerContext } from "./contexts";

export { ServiceControllerProvider } from "./contexts";

export const useServiceController = () => useContext(ServiceControllerContext);
