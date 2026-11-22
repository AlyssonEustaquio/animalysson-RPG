/* Animalysson RPG — configurações compartilhadas de carregamento */
window.AnimalyssonRuntime = window.AnimalyssonRuntime || {};

window.AnimalyssonRuntime.loadScript = function loadScript(src) {
  return new Promise(function (resolve, reject) {
    var existing = document.querySelector('script[data-animalysson-src="' + src + '"]');
    if (existing) {
      resolve();
      return;
    }

    var script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.defer = false;
    script.dataset.animalyssonSrc = src;
    script.onload = resolve;
    script.onerror = function () { reject(new Error('Não foi possível carregar ' + src)); };
    document.body.appendChild(script);
  });
};
