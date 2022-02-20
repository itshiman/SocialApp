function followedLanguages() {
  var result = '';
  const python = '6144a688ebca52731f75514d';
  // if (user.followings.includes(python)) {
  //   result = [...result, python];
  // }
  result = [...result, python];
  return result;
}

module.exports.followedLanguages = followedLanguages;
