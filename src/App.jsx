import { BrowserRouter, Routes, Route } from "react-router";
import {Login} from './login';
import {Signup} from './signup';
import {Home} from './Home';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
