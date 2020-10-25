const images = require('images');

module.exports = function render(viewport, element) {
  if (element.style) {
    var img = images(element.style.width, element.style.height);

    if (element.style['background-color']) {
      let color = element.style['background-color'] || 'rgb(0,0,0)';
      var res = color.match(/rgb\((\d+),(\d+),(\d+)\)/);
      img.fill(Number(res[1]), Number(res[2]), Number(res[3]));
      viewport.draw(img, element.style.left || 0, element.style.top || 0);
    }
  }
  if (element.children) {
    for (let el of element.children) {
      render(viewport, el);
    }
  }
};
