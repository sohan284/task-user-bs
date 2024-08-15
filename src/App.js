import logo from "./logo.svg";
import "./App.css";
import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
import Form from "./components/Form";
import Users from "./components/Users";

function App() {
  return (
    <div>
      <Form />
      <Users />
    </div>
  );
}

export default App;
