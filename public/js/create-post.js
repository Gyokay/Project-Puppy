$(function () {
  const minTitleLength = 2
  const maxTitleLength = 30
  const minDescriptionLength = 2
  const maxDescriptionLength = 300
  const maxFileCount = 4
  const maxFileSizeInBytes = 8388608 // 8 MB
  const allowedFileFormats = ['image/png', 'image/jpeg', 'image/gif']

  const shortTitleErrMsg = 'Title is too short!'
  const longTitleErrMsg = 'Title is too long!'
  const shortDescriptionErrMsg = 'Description is too short!'
  const longDescriptionErrMsg = 'Description is too long!'
  const largeFileErrMsg = 'Images should be maximum 8 MB!'
  const fileCountErrMsg = 'Maximum 4 images are allowed!'
  const notAllowedFileErrMsg = 'You can upload only png, jpeg and gif imag files!'
  const invalidTownErrMsg = 'Shoul chose valid town!'
  const invalidPetTypeErrMsg = 'Should chose valid pet type!'

  let errors = new Set()

  $('#submitPost').submit(function (e) {
    let title = $('#titleInput').val()
    let description = $('#descriptionInput').val()
    let towns = $('#towns').val()
    let petType = $('#petType').val()
    let files = $('input:file', this)[0].files
    let fileCount = files.length

    // console.log(files)

    if (title.length < minTitleLength) {
      errors.add(shortTitleErrMsg)
    } else if (title.length > maxTitleLength) {
      errors.add(longTitleErrMsg)
    }

    if (description.length < minDescriptionLength) {
      errors.add(shortDescriptionErrMsg)
    } else if (description.length > maxDescriptionLength) {
      errors.add(longDescriptionErrMsg)
    }

    if (towns === null || towns === '') {
      errors.add(invalidTownErrMsg)
    }

    if (petType === null || petType === '') {
      errors.add(invalidPetTypeErrMsg)
    }

    if (fileCount > maxFileCount) {
      errors.add(fileCountErrMsg)
    }

    if (fileCount > 0) {
      for (let i = 0; i < files.length; i += 1) {
        if (allowedFileFormats.indexOf(files[i].type) < 0) {
          errors.add(notAllowedFileErrMsg)
        }

        if (files[i].size > maxFileSizeInBytes) {
          errors.add(largeFileErrMsg)
        }
      }
    }

    if (Array.from(errors).length > 0) {
      e.preventDefault()

      $('.error').remove()
      errors.forEach(function (error) {
        $('.pageTitle').after(`<p class='error'>${error}</p>`)
      })

      errors.clear()
    }
  })
})
