import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routes.jsx'
import 'react-multi-carousel/lib/styles.css';

createRoot(document.getElementById('root')).render(
  <AppRoutes />
)
