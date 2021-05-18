import { Route, Switch } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import * as ROUTES from "./routes";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path={ROUTES.HOME} component={Home} exact />
        <Route path={ROUTES.SIGN_UP} component={SignUp} />
        <Route path={ROUTES.SIGN_IN} component={SignIn} />
      </Switch>
    </AuthProvider>
  );
}

export default App;
