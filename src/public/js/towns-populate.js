$(() => {
  // populates town options
  $.ajax({
    url: '/json-data/towns.json',
    method: 'get',
    dataType: 'json',
    success: towns => {
      let $townsField = $('#towns')

      towns.forEach(town => {
        let townName = town

        let $optionElement = $('<option></option>')
          .val(townName)
          .text(townName)

        $townsField.append($optionElement)
      })
    }
  })
})

