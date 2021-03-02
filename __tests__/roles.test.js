const roles = require('../models/roles')

it('Check if there are 3 supported roles', () => {
  expect(roles.SUPPORTED_ROLES.length).toBe(3)
})

it('Expect USER_ROLE to be user', () => {
  expect(roles.USER_ROLE).toBe('user')
})

it('Expect ADMIN_ROLE to be admin', () => {
  expect(roles.ADMIN_ROLE).toBe('admin')
})

it('Expect USER_ROLE to be user', () => {
  expect(roles.HOTEL_OWNER_ROLE).toBe('hotelOwner')
})
