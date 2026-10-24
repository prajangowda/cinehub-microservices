import AppRoutes from './routes/AppRoutes.jsx';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-[#080808] text-slate-100">
      <AppRoutes />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
