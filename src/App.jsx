import { useState, useEffect } from "react";

export default function App() {
  const [selectedGuest, setSelectedGuest] = useState(null); //boolean
  const [guests, setGuests] = useState([]); //array of ojbects
  const [guestDetails, setGuestDetails] = useState(null); //boolean?
  const cohort = "2601-FTB-ET-WEB-FT"; //api cohort path

  //fetch function for all guests
  async function getAllGuests() {
    try {
      const response = await fetch(
        `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${cohort}/guests`,
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  }

  /* 
  need to include a useEffect. This is how our program is able to actually use the data. It's like
  event listeners in vanilla JS. 
  Reference notes at bottom [not for teacher]
  */

  //useEffect to access getAllGuests data
  useEffect(() => {
    async function pullGuests() {
      const data = await getAllGuests();
      setGuests(data.data); //object data
    }
    pullGuests();
  }, []);

  //fetch func for grabbing individual guest details via id
  async function getGuestDetails(id) {
    try {
      const response = await fetch(
        `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${cohort}/guests/${id}`,
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Unable to fetch guest details", error);
    }
  }

  //useEffect for the guest details
  useEffect(() => {
    if (selectedGuest) {
      async function pullGuestDetails() {
        const data = await getGuestDetails(selectedGuest.id);
        setGuestDetails(data.data);
      }
      pullGuestDetails();
    }
  }, [selectedGuest]); //needed agent to help me remember to put this here

  // if guest selected, show details
  if (selectedGuest) {
    return (
      <div>
        <h1>Guest Details</h1>
        <p>
          <strong>Name:</strong> {guestDetails?.name}
          {/* ?. allows for the program to not crach if the guestDetails are null */}
        </p>
        <p>
          <strong>Email:</strong> {guestDetails?.email}
        </p>
        <p>
          <strong>Phone:</strong> {guestDetails?.phone}
        </p>
        <p>
          <strong>Bio:</strong> {guestDetails?.bio}
        </p>
        <p>
          <strong>Job:</strong> {guestDetails?.job}
        </p>
        <button onClick={() => setSelectedGuest(null)}>Back</button>
      </div>
    );
  }

  // else show guest list
  return (
    <div className="guestList">
      <h1>Guest List</h1>
      <table>
        <thead>
          <tr className="headers">
            <th className="nameHeader">Name</th>
            <th className="emailHeader">Email</th>
            <th className="phoneHeader">Phone</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest.id} onClick={() => setSelectedGuest(guest)}>
              <td>{guest.name}</td>
              <td>{guest.email}</td>
              <td>{guest.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Select a guest to see more details.</p>
    </div>
  );
}

/* 
Teacher can skip this. This is reference material for my future assignments.

useState() > .addEventListener()

Whenever I think;

let count = 0
function setCount(newValue) {
  count = newCount;
  updateUI();
}

it's

const [count, setCount] = useState(0);


For useRef it's something like;

const inputElement = document.querySelector('#myInput');
inputElement.focus();

is something like

const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus();

useRef is like storing a direct reference into DOM ele (or whatever) without triggering re-render >>

When stuck, go back to Vanilla JS, then work forward.
*/
