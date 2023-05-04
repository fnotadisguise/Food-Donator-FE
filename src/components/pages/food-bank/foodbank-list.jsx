import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import httpService from "../../../shared/services/http-service";

function FoodBankListComponent() {
  const [foodBanks, setFoodBanks] = useState([]);

  useEffect(() => {
    getFoodBanks();
  }, []);

  async function getFoodBanks() {
    try {
      const data = await httpService.get("/food-bank");
      if (data.status === 200) {
        setFoodBanks(data.data);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  async function deleteFoodBank(id) {
    try {
      const res = await httpService.delete("/food-bank/" + id);
      if (res.status === 200) {
        getFoodBanks();
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <h4>Food Banks</h4>
        </div>
      </div>
      <div className="row mt-3">
        {foodBanks.map((foodbank) => (
          <div key={foodbank._id} className="col-lg-3 pb-3 col-md-4 col-6">
            <div className="card h-100 flex-grow-1">
              <div className="card-body">
                <div className="d-flex flex-column align-items-start h-100 justify-content-between">
                  <div>
                    <div className="card-title ">
                      <h5 className=" mb-3">{foodbank.title}</h5>
                    </div>

                    <h6 className="text-muted mb-3">
                      {foodbank.foodTypes.join(", ")}
                    </h6>
                    <span className="d-flex align-items-center justify-content-start pb-3">
                      <i className="fa fa-phone primary"></i>
                      <h6 className="text-muted ms-3 mb-0">
                        {foodbank.phoneNumber}
                      </h6>
                    </span>
                    <span className="d-flex align-items-start justify-content-start pb-3">
                      <i className="fa fa-address-card primary"></i>
                      <h6 className="text-muted ms-3 mb-0">{`${foodbank.address.street}, ${foodbank.address.city}, ${foodbank.address.state}, ${foodbank.address.zip}`}</h6>
                    </span>
                  </div>
                  <div className="d-flex flex-column w-100">
                    <Link
                      className="w-100"
                      to={`/edit-foodbank/${foodbank._id}`}
                    >
                      <button className="btn btn-block primaryBtn w-100 mb-2">
                        Edit
                      </button>
                    </Link>
                    <button
                      className="btn btn-block btn-danger w-100"
                      onClick={() => deleteFoodBank(foodbank._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default FoodBankListComponent;
