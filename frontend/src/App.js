import './App.css';
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import BuscarVagas from './components/BuscarVagas';
import Perfil from './components/Perfil';
import ModalLogin from './components/ModalLogin';
import Footer from './components/Footer';

function App() {
  const [tab, setTab] = useState('home');
  const [modalOpen, setModalOpen] = useState(false);
  const [usuario, setUsuario] = useState(() => {
    const u = localStorage.getItem('usuarioLogado');
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('usuarioLogado');
    }
  }, [usuario]);

  function handleLoginSuccess(userData) {
    setUsuario(userData);
    setModalOpen(false);
  }

  function handleLogout() {
    setUsuario(null);
    setTab('home');
  }

  return (
    <div className="App">
      <Header onNavigate={setTab} onOpenLogin={() => setModalOpen(true)} usuario={usuario} onLogout={handleLogout} />
      <main className="main-content">
        <div className="container">
          {tab === 'home' && <Home onBuscarVagas={() => setTab('buscar')} />}
          {tab === 'buscar' && <BuscarVagas usuario={usuario} onOpenLogin={() => setModalOpen(true)} />}
          {tab === 'perfil' && <Perfil usuario={usuario} />}
        </div>
      </main>
      <ModalLogin open={modalOpen} onClose={() => setModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
      <Footer />
    </div>
  );
}

export default App;
