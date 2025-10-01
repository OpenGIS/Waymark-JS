/* 
  ======= Constants =======
*/

export const fitBoundsOptions = {
  padding: { top: 50, bottom: 50, left: 50, right: 50 },
  duration: 0,
};

export const flyToOptions = {
  duration: 1000,
};

export const mapOptions = {
  center: [-1.8261632, 51.1788144], // Default to Stonehenge
  zoom: 18,
  style: "https://tiles.openfreemap.org/styles/liberty",
};

/*
  ======= Helpers =======
*/

export function doBoundsIntersect(boundsA, boundsB) {
  // Check if north and south are the same or different
  const northA = boundsA.getNorth();
  const southA = boundsA.getSouth();
  const eastA = boundsA.getEast();
  const westA = boundsA.getWest();

  const northB = boundsB.getNorth();
  const southB = boundsB.getSouth();
  const eastB = boundsB.getEast();
  const westB = boundsB.getWest();

  // Logic to check for intersection
  // if one box is entirely above the other, they do not intersect
  if (northA < southB || southA > northB) {
    return false;
  }

  // if one box is entirely to the left of the other, they do not intersect
  if (eastA < westB || westA > eastB) {
    return false;
  }

  return true; // If no non-intersecting condition is met, they intersect
}
