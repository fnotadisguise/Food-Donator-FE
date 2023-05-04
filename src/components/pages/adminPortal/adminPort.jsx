import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import httpService from "../../../shared/services/http-service";
import "./adminPortal.css";

function AdminPortal() {
  const [foodBanks, setFoodBanksData] = useState([]);
  const [donations, setDonationsData] = useState([]);
  const [filter, setFilter] = useState(0);
  const [donationsFilter, setDonationsFilter] = useState(0);

  useEffect(() => {
    getApiData();
    getData();
  }, []);

  const getApiData = async () => {
    try {
      const response = await httpService.get("/food-bank");
      if (response.status === 200) {
        setFoodBanksData(response.data);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };

  const getData = async () => {
    try {
      const response = await httpService.get("/donations");
      if (response.status === 200) {
        setDonationsData(response.data);
      }
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };

  const handleFilter = (timeFrame) => {
    setFilter(timeFrame);
  };

  const handleDon_Filter = (timeFrame) => {
    setDonationsFilter(timeFrame);
  };

  const foodBankList = foodBanks.filter((item) => {
    const date = new Date(item.createdAt);
    const diffTime = Math.abs(new Date() - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return filter === "7 days" ? diffDays <= 7 : diffDays <= 30;
  });

  const donationsList = donations.filter((item) => {
    const date = new Date(item.createdAt);
    const diffTime = Math.abs(new Date() - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return donationsFilter === "7 days" ? diffDays <= 7 : diffDays <= 30;
  });

  async function deleteFoodBank(id) {
    try {
      const res = await httpService.delete("/food-bank/" + id);
      if (res.status === 200) {
        getApiData();
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  return (
    <div className="p-5">
      <div>
        <div className="d-flex justify-content-start align-items-center">
          <div>
            <h4 className="me-4 mb-0">
              Food Bank List ({foodBankList.length})
            </h4>
          </div>
          <div style={{ marginLeft: "5px" }}>
            <div className="dropdown">
              <button className="dropbtn">Filter by Date</button>
              <div className="dropdown-content">
                <a
                  onClick={() => handleFilter("7 days")}
                  style={{ cursor: "pointer" }}
                >
                  7 Days
                </a>
                <a
                  onClick={() => handleFilter("30 days")}
                  style={{ cursor: "pointer" }}
                >
                  30 Days
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          {foodBankList.length ? (
            foodBankList?.map((data, index) => {
              return (
                <div key={index} className="col-lg-3 pb-3 col-md-4 col-6">
                  <div className="card h-100 flex-grow-1">
                    <div className="card-body">
                      <div className="d-flex flex-column align-items-start h-100 justify-content-between">
                        <div>
                          <div className="card-title ">
                            <h5 className=" mb-3">{data.title}</h5>
                          </div>
                          <span className="d-flex align-items-center justify-content-start pb-3">
                            <i className="fa fa-phone primary"></i>
                            <h6 className="text-muted ms-3 mb-0">
                              {data.phoneNumber}
                            </h6>
                          </span>
                          <span className="d-flex align-items-start justify-content-start pb-3">
                            <i className="fa fa-address-card primary"></i>
                            <span className="d-flex align-items-start justify-content-start pb-3">
                              <h6 className="text-muted ms-3 mb-0">
                                {data.address.street}
                                {data.address.city}
                                {data.address.state}
                              </h6>
                            </span>
                          </span>
                        </div>
                        <div className="d-flex flex-column w-100">
                          <Link
                            className="w-100"
                            to={`/edit-foodbank/${data._id}`}
                          >
                            <button className="btn btn-block primaryBtn w-100 mb-2">
                              Edit / view
                            </button>
                          </Link>
                        </div>
                        <button
                          className="btn btn-block btn-danger w-100"
                          onClick={() => deleteFoodBank(data._id)}
                        >
                          Remove / Ban
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div>Not data found</div>
          )}
        </div>
      </div>

      <div>
        <div className="d-flex justify-content-start align-items-center mt-5">
          <div>
            <h4 className="me-4 mb-0">
              Donation List ({donationsList.length})
            </h4>
          </div>
          <div style={{ marginLeft: "5px" }}>
            <div className="dropdown ml-4">
              <button className="dropbtn">Filter by Date</button>
              <div className="dropdown-content">
                <a
                  onClick={() => handleDon_Filter("7 days")}
                  style={{ cursor: "pointer" }}
                >
                  7 Days
                </a>
                <a
                  onClick={() => handleDon_Filter("30 days")}
                  style={{ cursor: "pointer" }}
                >
                  30 Days
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-3">
          {donationsList.length ? (
            donationsList?.map((data, index) => {
              return (
                <div key={index} className="col-lg-3 pb-3 col-md-4 col-6">
                  <div className="card h-100 flex-grow-1">
                    <div className="card-body">
                      <div className="d-flex flex-column align-items-start h-100 justify-content-between">
                        <div>
                          <div className="card-title ">
                            <h5 className=" mb-3">{data.title}</h5>
                          </div>
                          <span className="d-flex align-items-center justify-content-start pb-3">
                            <i className="fa fa-phone primary"></i>
                            <h6 className="text-muted ms-3 mb-0">
                              {data.phoneNumber}
                            </h6>
                          </span>
                        </div>
                        <div className="d-flex flex-column w-100">
                          <Link
                            className="w-100"
                            to={`/edit-donation/${data._id}`}
                          >
                            <button className="btn btn-block primaryBtn w-100 mb-2">
                              Edit / view
                            </button>
                          </Link>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-muted">No data found</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminPortal;
