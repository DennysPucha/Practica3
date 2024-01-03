
import Menu from '@/componentes/menu';
export default function Home() {
  return (
    <div className="container">
      <header>
        <Menu />
      </header>
      <div className="container d-flex align-items-center justify-content-center">
      <h1>Ventas de autos online</h1>
      </div>
      <div className="container-fluid">
        <div class="row">
          <div class="col-lg-4 col-md-12 mb-4 mb-lg-0">
            <img
              src="https://resizer.glanacion.com/resizer/v2/los-cinco-autos-mas-caros-del-mundo-y-un-bonus-de-W7PDP6QM2NDP3IHNPRMLL6P2CI.jpg?auth=ff38663a9ff982cccf8bca1d4ea97d72e82c53bb2367c842fb1d7a1acff31b15&width=768&quality=70&smart=false"
              class="w-100 shadow-1-strong rounded mb-4"
              alt="Boat on Calm Water"
            />

            <img
              src="https://i.pinimg.com/736x/2e/92/cf/2e92cfb586a24e2fedebf8fe0ac03849.jpg"
              class="w-100 shadow-1-strong rounded mb-4"
              alt="Wintry Mountain Landscape"
            />
          </div>

          <div class="col-lg-4 mb-4 mb-lg-0">
            <img
              src="https://i.pinimg.com/736x/a2/d0/91/a2d091c8163e437bf8d66a9876949280.jpg"
              class="w-100 shadow-1-strong rounded mb-4"
              alt="Mountains in the Clouds"
            />

            <img
              src="https://tiempoderelojes.com/wp-content/uploads/2021/05/P90399217_highRes-1920x1281.jpg"
              class="w-100 shadow-1-strong rounded mb-4"
              alt="Boat on Calm Water"
            />
          </div>

          <div class="col-lg-4 mb-4 mb-lg-0">
            <img
              src="https://www.pruebaderuta.com/wp-content/uploads/2015/05/superautos.jpg"
              class="w-100 shadow-1-strong rounded mb-4"
              alt="Waves at Sea"
            />

            <img
              src="https://w0.peakpx.com/wallpaper/351/764/HD-wallpaper-auto-deportivo-car-cars.jpg"
              class="w-100 shadow-1-strong rounded mb-4"
              alt="Yosemite National Park"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
