$(document).ready(function () {
  const selectedAmenities = {};
  $('input:checkbox').change(function () {
    const amenityId = $(this).data('id');
    const amenityName = $(this).data('name');

    if ($(this).is(':checked')) {
      selectedAmenities[amenityId] = amenityName;
    } else {
      delete selectedAmenities[amenityId];
    }
    const amenitiesList = Object.values(selectedAmenities).join(', ');
    $('.amenities h4').text(amenitiesList);
  });
  $.get('http://localhost:5001/api/v1/status/', function (data) {
    //console.log(data);
    if (data.status === 'OK') {
      $('#api_status').addClass('available');
      //console.log('hola');
    } else {
      $('#api_status').removeClass('available');
    }
  });
});
