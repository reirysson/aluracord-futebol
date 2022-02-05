import React from "react";

const UserContext = React.createContext();

const UserProvider = ({ children }) => {
  const [userName, setUsername] = React.useState("");

  return (
    <UserContext.Provider value={{ userName, setUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };