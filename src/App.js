import "./App.css";
import { Route, Switch } from "react-router-dom";
import * as ROUTES from "./routes";
import SignUp from "./pages/SingUp";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path={ROUTES.SIGN_UP} component={SignUp} />
      </Switch>
    </div>
  );
}

export default App;
