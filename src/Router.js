import React, { Children } from 'react'

const RouterContext = React.createContext({});

export function useRouter() {
  return React.useContext(RouterContext);
}

export const Router = ({ children }) => {
  const [path, setPath] = React.useState(document.location.pathname);

  React.useEffect(() => {
    const onPopState = () => setPath(document.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const push = (nextPath) => {
    if (nextPath !== path) {
      window.history.pushState({}, "", nextPath);
      setPath(nextPath);
      window.scrollTo(0, 0);
    }
  };
  

  return (
    <RouterContext.Provider value={{ path, push }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Routes = ({ children }) => {
  const { path: contextPath } = React.useContext(RouterContext);
  let found = null;

  Children.forEach(children, (child) => {
    if (!found && React.isValidElement(child) && child.props?.path === contextPath) {
      found = child;
    }
  });

  return found || null;
};



export const Route = ({ Component, path }) => {
  const { path: contextPath } = React.useContext(RouterContext);

  if (!path) {
    console.error("Une route a été créée sans 'path'.");
    return null;
  }

  if (contextPath !== path) return null;
  if (typeof Component !== "function") {
    console.error(`Le composant pour la route "${path}" n'est pas valide.`);
    return null;
  }

  return <Component />;
};

Route.defaultProps = {
  path: "",
  Component: () => null,
};

