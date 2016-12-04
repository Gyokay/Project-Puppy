$(function () {
  const minUsernameLength = 6
  const maxUsernameLength = 20
  const minPasswordLength = 6
  const maxPasswordLength = 20

  const shortUsernameErrMsg = 'Username is too short!'
  const longUsernameErrMsg = 'Username is to long!'
  const shortPasswordErrMsg = 'Password is to short!'
  const longPasswordErrMsg = 'Password is to long!'
  const invalidEmailErrMsg = 'Invalid email!'

  let errors = new Set()

  $('#submitRegister').submit(function (e) {
    let username = $('#usernameInput').val()
    let email = $('#emailInput').val()
    let password = $('#passwordInput').val()

    if (username.length < minUsernameLength) {
      errors.add(shortUsernameErrMsg)
    } else if (username.length > maxUsernameLength) {
      errors.add(longUsernameErrMsg)
    }

    if (password.length < minPasswordLength) {
      errors.add(shortPasswordErrMsg)
    } else if (password.length > maxPasswordLength) {
      errors.add(longPasswordErrMsg)
    }

    if (!validateEmail(email)) {
      errors.add(invalidEmailErrMsg)
    }

    $('.error').remove()

    if (Array.from(errors).length > 0) {
      e.preventDefault()

      errors.forEach(function (error) {
        $('.pageTitle').after(`<p class='error alert'>${error}</p>`)
      })

      errors.clear()
    }
  })

  function validateEmail (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  }
})
