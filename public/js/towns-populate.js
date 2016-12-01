$(function () {
  // populates town options
  $.ajax({
    url: '/json-data/towns.json',
    method: 'get',
    dataType: 'json',
    success: function (towns) {
      let $townsField = $('#towns')

      towns.forEach(function (town) {
        let townName = town

        let $optionElement = $('<option></option>')
          .val(townName)
          .text(townName)

        $townsField.append($optionElement)
      })
    }
  })
})

