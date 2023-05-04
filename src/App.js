import './App.css';
import {BrowserRouter as Router} from 'react-router-dom';
import LayoutComponent from './components/layout';

function App() {
  return (
    <Router>
      <LayoutComponent />
   </Router>
  );
}

export default App;
