import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SearchFlight from './components/SearchFlight';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<SearchFlight/>}/>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
