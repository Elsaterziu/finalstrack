import { Outlet, Link } from "react-router-dom";

const StudentLayout = () => {
  return (
    <div className="container-fluid">
      <div className="row">

        {/* Sidebar */}
        <nav className="col-md-2 d-none d-md-block bg-dark text-white min-vh-100">
          <div className="pt-3">
            <h5 className="text-center">FinalsTrack</h5>
            <ul className="nav flex-column mt-4">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/student">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/student/exams">Exams</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/student/subjects">Subjects</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/student/study-blocks">Study Blocks</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/student/stress-logs">Stress Logs</Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="col-md-10 ms-sm-auto px-4 py-4">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default StudentLayout;
