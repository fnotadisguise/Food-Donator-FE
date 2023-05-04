import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpService from "../../../shared/services/http-service";

function DonationsComponent() {
  const navigate = useNavigate();
  const [foodBanks, setFoodBanks] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState("");
  const [donationId, setDonationId] = useState("");
  const [foodTypes, setFoodTypes] = useState([]);
  const [placeId, setPlaceId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [budget, setBudget] = useState("");

  useEffect(() => {
    setAuthor(localStorage.getItem("user"));
    getFoodBanks();
    const hasId = window.location.pathname.split("/")[2];
    if (hasId) {
      getDonationDetail(hasId);
    }
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

  // For Multiple Checkboxes
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setFoodTypes((prev) => [...prev, value]);
    } else {
      setFoodTypes((prev) => prev.filter((type) => type !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payLoad = {
      title: title,
      description: description,
      phoneNumber: phoneNumber,
      foodTypes: foodTypes,
      author: author,
      placeId: placeId,
      budget: budget,
    };
    try {
      const res = isEdit
        ? await httpService.put("/donations/" + donationId, payLoad)
        : await httpService.post("/donations", payLoad);
      if (res) {
        navigate("/donations");
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function getDonationDetail(id) {
    try {
      const res = await httpService.get("/donations/" + id);
      if (res.status === 200) {
        setTitle(res.data.title);
        setPhoneNumber(res.data.phoneNumber);
        setFoodTypes(res.data.foodTypes);
        setAuthor(res.data.author);
        setBudget(res.data.budget);
        setDonationId(res.data._id);
        setDescription(res.data.description);
        setPlaceId(res.data.placeId);
        setIsEdit(true);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  return (
    <div className="container my-4">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <h4 className="text-center my-3">
          {" "}
          {isEdit ? "Edit Donation Details" : "Add Donation"}
        </h4>
        <div className="d-flex justify-content-center align-items-center">
          <div className="card p-3" style={{ width: "40rem" }}>
            <form>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title
                    </label>
                    <div className="input-group flex-nowrap">
                      <span className="input-group-text" id="addon-wrapping">
                        <i className="fa-solid fa-pencil"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        id="title"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                      Your Phone No.
                    </label>
                    <div className="input-group flex-nowrap">
                      <span className="input-group-text" id="addon-wrapping">
                        <i className="fa-solid fa-phone"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="phoneNumber"
                        id="phoneNumber"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="mb-0">Food Type</label>
                <hr className="my-1" />
                <div className="row mt-2">
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="Fancy"
                        name="foodTypes"
                        id="Fancy"
                        checked={foodTypes.includes("Fancy")}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label" htmlFor="Fancy">
                        Fancy
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="General"
                        name="foodTypes"
                        id="General"
                        checked={foodTypes.includes("General")}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label" htmlFor="General">
                        General
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="Fast"
                        name="foodTypes"
                        id="Fast"
                        checked={foodTypes.includes("Fast")}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label" htmlFor="Fast">
                        Fast Food
                      </label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value="Take-Out"
                        name="foodTypes"
                        id="Take-Out"
                        checked={foodTypes.includes("Take-Out")}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label" htmlFor="Take-Out">
                        Take-Out
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="budget" className="form-label">
                  Budget
                </label>
                <div className="input-group flex-nowrap">
                  <span className="input-group-text" id="addon-wrapping">
                    <i className="fa-solid fa-dollar"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    id="budget"
                    onChange={(e) => setBudget(e.target.value)}
                    value={budget}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Select Food Banks</label>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={(e) => setPlaceId(e.target.value)}
                  value={placeId}
                >
                  {foodBanks.map((foodBank) => (
                    <option key={foodBank._id} value={foodBank._id}>
                      {foodBank.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Donation Details
                </label>
                <div className="input-group flex-nowrap">
                  <span className="input-group-text" id="addon-wrapping">
                    <i className="fa-solid fa-message"></i>
                  </span>
                  <textarea
                    type="text"
                    className="form-control"
                    name="title"
                    id="description"
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                  ></textarea>
                </div>
              </div>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-block primaryBtn"
                  onClick={handleSubmit}
                >
                  {isEdit ? "Update Donation Details" : "Add Donation Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DonationsComponent;
