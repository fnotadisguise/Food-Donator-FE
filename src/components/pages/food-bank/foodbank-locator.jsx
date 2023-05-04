import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import httpService from "../../../shared/services/http-service";

function DonationLocatorComponent() {
  let map;
  const { google } = window;
  const [foodBanks, setFoodBanks] = useState([]);

  useEffect(() => {
    initMap();
    getFoodBanks();
    displayFoodBanks();
  }, []);

  function initMap() {
    const mapElement = document.getElementById("map");
    if (navigator.geolocation && mapElement) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const { latitude, longitude } = position.coords;
          const currentLocation = { lat: latitude, lng: longitude };

          // initialize the map
          map = new google.maps.Map(mapElement, {
            center: currentLocation,
            zoom: 15,
          });

          // get the nearby places
          const places = new google.maps.places.PlacesService(map);
          places.nearbySearch(
            {
              location: currentLocation, // current location
              radius: 1000, // 1000 meters
              type: ["restaurant"],
            },
            (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                results.forEach((place) => {
                  // display the marker
                  displayMarker(place);
                });
              }
            }
          );

          // if (smartCycleRestaurants.length) {
          //   smartCycleRestaurants.forEach(restaurant => {
          //     const marker = new google.maps.Marker({
          //       position: restaurant.location,
          //       map: map,
          //       title: restaurant.title,
          //       icon: {
          //         url: 'https://cdn.iconscout.com/icon/premium/png-512-thumb/restaurant-66-233145.png?f=avif&w=256',
          //         scaledSize: new google.maps.Size(30, 30)
          //       }

          //     });
          //     marker.addListener("click", () => {
          //       const infowindow = new google.maps.InfoWindow();
          //       const content = `
          //       <div id=${restaurant?._id} style="max-width:200px">
          //         <h5>${restaurant?.title}</h5>
          //         <p style="margin-top:5px;" class="mb-0"><b>Contact:</b> ${restaurant?.phoneNumber} </p>
          //         <p style="margin-top:5px;" class="mb-0"><b>Type:</b> ${restaurant?.foodTypes.join(', ')} </p>
          //         <p style="margin-top:5px;" class="mb-0">${restaurant?.address?.street}, ${restaurant?.address?.state}, ${restaurant?.address?.city}, ${restaurant?.address?.zip}</p>
          //       </div>
          //       `;
          //       infowindow.setContent(content);
          //       infowindow.open(map, marker);
          //     });
          //   });
          // }

          // display the marker
          const displayMarker = (location) => {
            let marker;
            marker = new google.maps.Marker({
              position: location.geometry.location,
              map: map,
              title: location.name,
            });
            marker.addListener("click", () => {
              const infowindow = new google.maps.InfoWindow();
              const content = displayFoodBank(location);
              infowindow.setContent(content);
              infowindow.open(map, marker);
              getFormattedPhoneNumber(location.place_id);
            });
          };
        },
        function (error) {
          console.log("error: ", error);
        },
        {
          enableHighAccuracy: true,
        }
      );
    }
  }

  function displayFoodBank(location) {
    return `
      <div id=${location.place_id} style="max-width:200px">
        <h5>${location.name}</h5> 
        <div class="images">
          ${
            location?.photos?.length
              ? location?.photos
                  ?.map(
                    (photo) =>
                      `<a href=${photo.getUrl()} target="_blank"><img src="${photo.getUrl()}" alt="${
                        location.name
                      }" width="50px"></a>`
                  )
                  .join("")
              : ""
          }
        </div>
        <p style="margin-top:5px;" class="mb-0">${location?.vicinity}</p>
      </div>
    `;
  }

  function getFormattedPhoneNumber(placeId) {
    setTimeout(() => {
      const popup = document.querySelectorAll(`#${placeId}`);
      if (popup) {
        const service = new google.maps.places.PlacesService(map);
        service.getDetails(
          {
            placeId: placeId,
            fields: ["formatted_phone_number"],
          },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              if (place.formatted_phone_number) {
                const contactNo = document.createElement("p");
                contactNo.style.marginTop = "5px";
                contactNo.innerHTML = `<b>Contact</b>: ${place.formatted_phone_number}`;
                popup[0].appendChild(contactNo);
              }
            }
          }
        );
      }
    }, 100);
  }

  async function getFoodBanks() {
    try {
      // eslint-disable-next-line no-undef
      const data = await httpService.get("/food-bank");
      if (data.status === 200) {
        setFoodBanks(data.data);
        displayFoodBanks();
      }
    } catch (error) {
      console.log("error: ", error);
    }
  }

  function displayFoodBanks() {
    foodBanks.forEach((foodBank) => {
      const marker = new google.maps.Marker({
        position: foodBank.location,
        map: map,
        title: foodBank.title,
        icon: {
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Food_Bank_icon.svg/100px-Food_Bank_icon.svg.png",
          scaledSize: new google.maps.Size(30, 30),
        },
      });
      marker.addListener("click", () => {
        const infowindow = new google.maps.InfoWindow();
        const content = `
          <div id=${foodBank?._id} style="max-width:200px">
            <h5>${foodBank?.title}</h5> 
            <p style="margin-top:5px;" class="mb-0"><b>Contact:</b> ${
              foodBank?.phoneNumber
            } </p>
            <p style="margin-top:5px;" class="mb-0"><b>Type:</b> ${foodBank?.foodTypes.join(
              ", "
            )} </p>
            <p style="margin-top:5px;" class="mb-0">${
              foodBank?.address?.street
            }, ${foodBank?.address?.state}, ${foodBank?.address?.city}, ${
          foodBank?.address?.zip
        }</p>
          </div>
          `;
        infowindow.setContent(content);
        infowindow.open(map, marker);
      });
    });
  }

  return (
    <div className="container mt-4">
      <div className="d-flex flex-column justify-content-center align-items-center">
        <div className="d-flex my-3 w-100 justify-content-between align-items-center">
          <h4 className="mb-0">Food Bank Locator</h4>
          <div>
            <Link to="/add-foodbank">
              <button className="btn primaryBtn">Add Food Bank</button>
            </Link>

            <Link to="/foodbank">
              <button className="btn btn-secondary ms-3">
                View Food Banks
              </button>
            </Link>
          </div>
        </div>
        <div id="map"></div>
      </div>
    </div>
  );
}
export default DonationLocatorComponent;
