exports.get = (vendor) => {
  if (vendor === 'github') {
    return require('./github');
  } else if (vendor === 'bitbucket') {
    return require('./bitbucket');
  } else if (vendor === 'gitlab') {
    return require('./gitlab');
  } else {
    throw new Error(`unknown vendor [${vendor}]`);
  }
};
