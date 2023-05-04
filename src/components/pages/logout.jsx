import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LogoutComponent(props) {
  const handleChange = useCallback((event) => {
    props.onDataUpdate(event);
  }, [props]);
  
  
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.clear();
    setTimeout(() => {
      navigate("/auth", { replace: true });
    }, 3000);
    handleChange("");
  }, [handleChange, navigate]);
  
  return (
    <div className="container" style={{ marginTop: "100px" }}>
      <h4 className="text-center">You are logged out</h4>
      <p className="text-center text-muted">
        Thank you for using our application.
      </p>
    </div>
  );
}
export default LogoutComponent;
