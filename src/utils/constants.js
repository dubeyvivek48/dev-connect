export const allowedUserFields = [
  '_id',
  'firstName',
  'lastName',
  'emailId',
  'photoUrl',
  'about',
  'skills',
  'age',
  'gender',
];

export const getAllowedData = (data) => {
  return allowedUserFields.reduce((ac, item) => {
    return { ...ac, [item]: data?.[item] };
  }, {});
};
