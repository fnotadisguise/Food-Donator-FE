import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import httpService from "../../../shared/services/http-service";

function FoodBankComponent() {
  const navigate = useNavigate();
  const [foodTypes, setFoodTypes] = useState([]);
  const [foodBank, setFoodBank] = useState([]);
  const [autoLat, setAutoLat] = useState("");
  const [autoLog, setAutoLog] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [countryState, setCountryState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [foodBankId, setFoodBankId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  let map;
  const { google } = window;

  useEffect(() => {
    const hasId = window.location.pathname.split("/")[2];
    if (hasId) {
      setFoodBankId(hasId);
      getFoodBankById(hasId);
    }
    const selectionMap = document.getElementById("selectionMap");
    initializeSelectionMap(selectionMap);
  }, []);

  // For Multiple Checkboxes
  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setFoodTypes((prev) => [...prev, value]);
    } else {
      setFoodTypes((prev) => prev.filter((type) => type !== value));
    }
  };

  //For single checkbox
  // const handleCheckboxChange = (event) => {
  //   const { name, checked } = event.target;
  //   setFoodType((prevFoodType) => ({
  //     ...prevFoodType,
  //     [name]: checked,
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payLoad = {
      title: foodBank,
      phoneNumber: phoneNumber,
      location: {
        lat: autoLat,
        lng: autoLog,
      },
      address: {
        street: streetAddress,
        city: city,
        state: countryState,
        zip: zipCode,
      },
      foodTypes: foodTypes,
      author: localStorage.getItem("user"),
    };
    try {
      const res = isEdit
        ? await httpService.put("/food-bank/" + foodBankId, payLoad)
        : await httpService.post("/food-bank", payLoad);
      if (res) {
        navigate("/foodbank");
        resetForm();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setFoodBank("");
    setPhoneNumber("");
    setStreetAddress("");
    setCity("");
    setZipCode("");
    setCountryState("");
    setAutoLog("");
    setAutoLat("");
    setFoodTypes([]);
  };

  function initializeSelectionMap(selectionMap) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const { latitude, longitude } = position.coords;
        const currentLocation = { lat: latitude, lng: longitude };
        map = new google.maps.Map(selectionMap, {
          center: currentLocation,
          zoom: 15,
        });

        const marker = new google.maps.Marker({
          position: currentLocation,
          map: map,
          title: "Your Location",
        });

        // add a maker on click
        google.maps.event.addListener(map, "click", function (event) {
          placeMarker(event.latLng);
        });
        function placeMarker(location) {
          marker.setPosition(location);
          const latitude = location.lat();
          const longitude = location.lng();
          setAutoLat(latitude);
          setAutoLog(longitude);
        }
      });
    }
  }

  async function getFoodBankById(id) {
    try {
      const res = await httpService.get("/food-bank/" + id);
      if (res.status === 200) {
        setFoodBank(res.data.title);
        setPhoneNumber(res.data.phoneNumber);
        setStreetAddress(res.data.address.street);
        setCity(res.data.address.city);
        setZipCode(res.data.address.zip);
        setCountryState(res.data.address.state);
        setAutoLog(res.data.location.lng);
        setAutoLat(res.data.location.lat);
        setFoodTypes(res.data.foodTypes);
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
          {isEdit ? "Edit Food bank" : "Add Food bank"}
        </h4>
        <div className="d-flex justify-content-center align-items-center">
          <div className="card p-3" style={{ width: "40rem" }}>
            <form>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="foodBank" className="form-label">
                      Food Bank name
                    </label>
                    <div className="input-group flex-nowrap">
                      <span className="input-group-text" id="addon-wrapping">
                        <i className="fa-solid fa-utensils"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        id="foodBank"
                        onChange={(e) => setFoodBank(e.target.value)}
                        value={foodBank}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone
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
                <label htmlFor="address" className="form-label mb-0">
                  Address
                </label>
                <hr className="my-1" />
                <div className="row">
                  <div className="col-md-6 mb-2 mt-2">
                    <div className="form-group">
                      <label htmlFor="street">Street Address</label>
                      <input
                        type="text"
                        className="form-control"
                        id="street"
                        name="street"
                        placeholder="123 Main St"
                        onChange={(e) => setStreetAddress(e.target.value)}
                        value={streetAddress}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-2 mt-2">
                    <div className="form-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        placeholder="San Francisco"
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="form-group">
                      <label htmlFor="state">State</label>
                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        placeholder="California"
                        onChange={(e) => setCountryState(e.target.value)}
                        value={countryState}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="form-group">
                      <label htmlFor="zip">Zip Code</label>
                      <input
                        type="number"
                        className="form-control"
                        id="zip"
                        name="zip"
                        placeholder="94105"
                        onChange={(e) => setZipCode(e.target.value)}
                        value={zipCode}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 my-2">
                    <a
                      className="text-underline text-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      href="/"
                    >
                      Select location
                    </a>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="form-group">
                      <label htmlFor="latitude">Latitude</label>
                      <input
                        type="number"
                        className="form-control"
                        id="latitude"
                        name="latitude"
                        value={autoLat}
                        required
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-2">
                    <div className="form-group">
                      <label htmlFor="longitude">Longitude</label>
                      <input
                        type="number"
                        className="form-control"
                        id="longitude"
                        name="longitude"
                        value={autoLog}
                        required
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="">
                  Website
                  <span className="text-muted">(Optional)</span>
                </label>
                <div className="input-group flex-nowrap">
                  <span className="input-group-text" id="addon-wrapping">
                    <i className="fa-solid fa-globe"></i>
                  </span>
                  <input
                    type="url"
                    className="form-control"
                    name="website"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
              <div className="d-grid gap-2">
                <button
                  className="btn btn-block primaryBtn"
                  onClick={handleSubmit}
                >
                  {isEdit ? "Update Food bank" : "Add Food bank"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Select Location
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div
                id="selectionMap"
                style={{ minHeight: "300px", maxHeight: "400px" }}
              ></div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Save Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FoodBankComponent;
