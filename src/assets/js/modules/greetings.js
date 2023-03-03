"use strict";
const greeting = document.querySelector('.workspace__greeting');

const greetingList = ['Good morning', 'Good afternoon', 'Good evening', 'Good night'];

function sayGreeting() {
  const date = new Date();
  const currentHour = parseInt(date.toLocaleTimeString([], { hour12: false, hour: "2-digit" }));
  if(currentHour >= 4 && currentHour < 12) {
    return greetingList[0];
  } else if (currentHour >= 12 && currentHour < 18) {
    return greetingList[1]
  } else if (currentHour >= 18 && currentHour < 23) {
    return greetingList[2];
  } else if (currentHour >= 23 && currentHour < 4){
    return greetingList[3];
  } else {
    console.log(currentHour);
  } 
}


export function renderGreeting() {
  greeting.innerHTML = sayGreeting();
}
console.log(sayGreeting());
