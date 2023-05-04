import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import httpService from "../../../shared/services/http-service";

function DonationsListComponent() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    getDonations();
  }, []);

  async function getDonations() {
    try {
      const data = await httpService.get("/donations");
      if (data.status === 200) {
        setDonations(data.data);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  async function deleteDonationRecord(id) {
    try {
      const res = await httpService.delete("/donations/" + id);
      if (res.status === 200) {
        getDonations();
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Donations List</h4>
            <Link to="/add-donation">
              <button className="btn primaryBtn">Add Donation</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="row mt-3">
        <table className="table table-responsive table-borderless">
          <thead>
            <tr className="bg-light">
              <th scope="col" width="5%">
                #
              </th>
              <th scope="col" width="20%">
                Title
              </th>
              <th scope="col" width="20%">
                Food Types
              </th>
              <th scope="col" width="20%">
                Description
              </th>
              <th scope="col" width="10%">
                Donated By
              </th>
              <th scope="col" width="10%">
                Budget
              </th>
              <th scope="col" width="10%">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>{donation.title}</td>
                <td>{donation.foodTypes.join(', ')}</td>
                <td>{donation.description}</td>
                <td>{donation.author.username}</td>
                <td>${donation.budget}</td>
                <td>
                  <Link to={"/edit-donation/" + donation._id}>
                    <button className="btn btn-sm btn-primary mx-2">
                      Edit
                    </button>
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteDonationRecord(donation._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default DonationsListComponent;
