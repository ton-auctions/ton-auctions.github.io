import { useContext } from "react";

import { TonClientContext } from "./contexts";

export { TonClientProvider, TonContextValue } from "./contexts";

export const useTon = () => useContext(TonClientContext);
