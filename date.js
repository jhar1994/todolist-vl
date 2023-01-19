//jshint esversion:6
exports.getDate = function() {
  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  };
  const today = new Date();
  return today.toLocaleDateString("en-US", options);

}

exports.getDay = function() {
  let options = {
    weekday: 'long',
  };
  const day = new Date();
  return today.toLocaleDateString("en-US", options);

}

console.log(module.exports);
