$(document).ready(function () {
  const selectedAmenities = {};
  const selectedStates = {};
  const selectedCities = {};

  $('input:checkbox').change(function () {
    const inputType = $(this).attr('class');
    const itemId = $(this).data('id');
    const itemName = $(this).data('name');

    if (inputType === 'checkbox-amenities') {
      if ($(this).is(':checked')) {
        selectedAmenities[itemId] = itemName;
      } else {
        delete selectedAmenities[itemId];
      }
      updateAmenitiesList();
    } else if (inputType === 'checkbox-state') {
      if ($(this).is(':checked')) {
        selectedStates[itemId] = itemName;
      } else {
        delete selectedStates[itemId];
      }
      updateLocations('States', selectedStates);
    } else if (inputType === 'checkbox-city') {
      if ($(this).is(':checked')) {
        selectedCities[itemId] = itemName;
      } else {
        delete selectedCities[itemId];
      }
      updateLocations('Cities', selectedCities);
    }
  });

  $.get('http://localhost:5001/api/v1/status/', function (data) {
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  function updateAmenitiesList () {
    const amenitiesList = Object.values(selectedAmenities).join(', ');
    $('.amenities h4').text(amenitiesList);
  }

  function updateLocations (type, selectedItems) {
    const itemsList = Object.values(selectedItems).join(', ');
    $(`.${type.toLowerCase()} h4`).text(itemsList);
  }

  // New code for fetching places
  $.ajax({
    type: 'POST',
    url: 'http://localhost:5001/api/v1/places_search/',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (data) {
      for (const place of data) {
        const template = `
          <article>
            <div class="title_box">
              <h2>${place.name}</h2>
              <div class="price_by_night">$${place.price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
              <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
              <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
            </div>
            <div class="description">${place.description}</div>
          </article>
        `;
        $('.places').append(template);
      }
    },
    error: function () {
      console.error('Error fetching places data');
    }
  });

  // New code for filtering places
  $('#filter_button').click(function () {
    const amenityList = Object.keys(selectedAmenities);
    const stateList = Object.keys(selectedStates);
    const cityList = Object.keys(selectedCities);

    $.ajax({
      type: 'POST',
      url: 'http://localhost:5001/api/v1/places_search/',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: amenityList,
        states: stateList,
        cities: cityList
      }),
      success: function (data) {
        // Clear existing places
        $('.places').empty();

        for (const place of data) {
          const template = `
            <article>
              <div class="title_box">
                <h2>${place.name}</h2>
                <div class="price_by_night">$${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
                <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
                <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
              </div>
              <div class="description">${place.description}</div>
            </article>
          `;
          $('.places').append(template);
        }
      },
      error: function () {
        console.error('Error fetching filtered places data');
      }
    });
  });
});
