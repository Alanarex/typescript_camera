import CameraComponent from './pages/camera'
import Geolocalisation from './pages/geolocalisation'
import './App.css'

function App() {
  return (
    <>
      <div className="card">
        <CameraComponent />
      </div>
      <div className="card">
        <Geolocalisation />
      </div>
    </>
  )
}

export default App
