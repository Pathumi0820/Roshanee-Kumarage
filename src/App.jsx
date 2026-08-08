import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import Admin, { Login } from './pages/Admin';
import './styles.css';

export default function App(){return <BrowserRouter><Routes><Route path="/" element={<Portfolio/>}/><Route path="/admin/login" element={<Login/>}/><Route path="/admin" element={<Admin/>}/></Routes></BrowserRouter>}
