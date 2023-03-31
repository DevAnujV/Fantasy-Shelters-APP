var rentalObjsArray = [
  {
    headline: "Luxury High End House",
    numSleeps: 8,
    numBedrooms: 4,
    numBathrooms: 3,
    pricePerNight: 425.99,
    city: "Scugog",
    province: "Ontario",
    imageUrl: "./images/h3.jpg",
    featuredRental: true,
  },
  {
    headline: "Yellow Ambience with pool",
    numSleeps: 4,
    numBedrooms: 2,
    numBathrooms: 2,
    pricePerNight: 165.99,
    city: "Scugog",
    province: "Ontario",
    imageUrl: "./images/h2.jpg",
    featuredRental: true,
  },
  {
    headline: "Classic House with Garden",
    numSleeps: 2,
    numBedrooms: 1,
    numBathrooms: 1,
    pricePerNight: 125.99,
    city: "Scugog",
    province: "Ontario",
    imageUrl: "./images/h1.jpg",
    featuredRental: true,
  },
  {
    headline: "Log Cabin",
    numSleeps: 6,
    numBedrooms: 3,
    numBathrooms: 2,
    pricePerNight: 225.99,
    city: "Toronto",
    province: "Ontario",
    imageUrl: "./images/h2.jpg",
    featuredRental: false,
  },
  {
    headline: "Cozy Cabin",
    numSleeps: 3,
    numBedrooms: 2,
    numBathrooms: 1,
    pricePerNight: 149.99,
    city: "Toronto",
    province: "Ontario",
    imageUrl: "./images/h3.jpg",
    featuredRental: false,
  },
  {
    headline: "Cozy Large Cabin",
    numSleeps: 6,
    numBedrooms: 3,
    numBathrooms: 3,
    pricePerNight: 225.99,
    city: "Scugog",
    province: "Ontario",
    imageUrl: "./images/h1.jpg",
    featuredRental: false,
  }
];

module.exports.getFeaturedRentals = function () {
  return rentalObjsArray.filter((value) => value.featuredRental);
};

module.exports.getRentalsByCityAndProvince = function () {
  var arr1 = [];

  var x = "";

  for (var i = 0; i < rentalObjsArray.length; i++) {
    var continues = true;

    for (var j = 0; j < arr1.length && i > 0 && continues; j++) {
      if (
        arr1[j].cityProvince ==
        rentalObjsArray[i].city + "," + rentalObjsArray[i].province
      ) {
        continues = false;
      }
    }

    if (continues) {
      var x = rentalObjsArray[i].city + "," + rentalObjsArray[i].province;
      var obj = {
        cityProvince:
          rentalObjsArray[i].city + "," + rentalObjsArray[i].province,
        rentals: rentalObjsArray.filter(function (something) {
          return (
            something.city == rentalObjsArray[i].city &&
            something.province == rentalObjsArray[i].province
          );
        }),
      };
      arr1.push(obj);
    }
  }
  return arr1;
};
