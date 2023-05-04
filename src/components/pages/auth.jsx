import { useNavigate } from "react-router-dom";
import httpService from "../../shared/services/http-service";

function AuthComponent(props) {
  const navigate = useNavigate();
  const handleChange = (event) => {
    props.onDataUpdate(event);
  };

  async function onLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await httpService.post("auth/login", data);
      if (response.status === 200) {
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("user", response.data.user);
        localStorage.setItem("role", response.data.role);
        navigate("/home", { replace: true });
        handleChange(response.data.role);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  async function onSignUp(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    try {
      const response = await httpService.post("auth/signup", data);
      if (response.status === 200) {
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("user", response.data.user);
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  return (
    <div className="container authContainer">
      <div className="d-flex justify-content-center">
        <h4
          className="text-muted text-center mb-4"
          style={{ marginTop: "50px" }}
        >
          Welcome to Food Donation Locator
        </h4>
      </div>
      <ul
        className="nav nav-tabs justify-content-between"
        id="myTab"
        role="tablist"
      >
        <li className="nav-item w-50" role="presentation">
          <button
            className="nav-link active w-100"
            id="Login-tab"
            data-bs-toggle="tab"
            data-bs-target="#Login"
            type="button"
            role="tab"
            aria-controls="Login"
            aria-selected="true"
          >
            Login
          </button>
        </li>
        <li className="nav-item w-50" role="presentation">
          <button
            className="nav-link  w-100"
            id="Register-tab"
            data-bs-toggle="tab"
            data-bs-target="#Register"
            type="button"
            role="tab"
            aria-controls="Register"
            aria-selected="false"
          >
            Register
          </button>
        </li>
      </ul>

      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="Login"
          role="tabpanel"
          aria-labelledby="Login-tab"
        >
          <div className="container-fluid px-0">
            <div className="d-flex justify-content-center align-items-center">
              <div className="card p-3 mt-4" style={{ width: "100%" }}>
                <form onSubmit={onLogin}>
                  <div className="mb-3">
                    <label htmlFor="emailInputLogin" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="emailInputLogin"
                      name="email"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="passwordInputLogin" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      id="passwordInputLogin"
                      required
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-block primaryBtn">
                      Login
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="tab-pane fade"
          id="Register"
          role="tabpanel"
          aria-labelledby="Register-tab"
        >
          <div className="container-fluid px-0">
            <div className="d-flex justify-content-center align-items-center">
              <div className="card p-3 mt-3" style={{ width: "100%" }}>
                <form onSubmit={onSignUp}>
                  <div className="mb-3">
                    <label htmlFor="userNameInput" className="form-label">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="userNameInput"
                      name="username"
                      required
                      autoComplete="off"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="emailInput" className="form-label">
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="emailInput"
                      name="email"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="passwordInput" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      id="passwordInput"
                      required
                      autoComplete="off"
                    />
                  </div>
                  <div className="d-grid gap-2">
                    <button className="btn btn-block primaryBtn">Signup</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthComponent;
