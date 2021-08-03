import React, { useState, createContext } from "react";

export const CRMContext = createContext([{}, () => {}]);

const CRMProvider = (props) => {
  // estado inicial
  const [auth, setAuth] = useState({
    token: "",
    auth: false,
  });

  return (
    <CRMContext.Provider value={[auth, setAuth]}>
      {props.children}
    </CRMContext.Provider>
  );
};

export default CRMProvider;

// export { CRMContext, CRMProvider };
