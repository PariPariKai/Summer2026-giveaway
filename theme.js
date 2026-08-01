/* ============================================================
   ЛЕТНИЙ РОЗЫГРЫШ 2026 — АВГУСТ · «ЯНТАРНЫЙ ЗАКАТ»
   Вставляет фоновую сцену (солнце, море, облака, пальмы) в начало
   <body> на любой странице, где подключён theme.css + theme.js.
   Разметку сцены дублировать по страницам не нужно.
   ============================================================ */
(function () {
  // Силуэт пальмы: изогнутый ствол + расходящиеся листья.
  function palmSvg() {
    var fronds = '';
    // угол наклона листа, длина, изгиб — «веер» вокруг макушки
    var leaves = [
      [-166, 108, -34], [-140, 128, -30], [-112, 132, -22],
      [-84, 120, -12],  [-46, 112, 16],   [-16, 96, 26],
      [14, 78, 30],     [-196, 92, -30]
    ];
    for (var i = 0; i < leaves.length; i++) {
      var a = leaves[i][0], len = leaves[i][1], bend = leaves[i][2];
      // лист как вытянутая «линза» с провисанием
      fronds +=
        '<path d="M0 0 Q' + (len * 0.55) + ' ' + (bend - 20) + ' ' + len + ' ' + bend +
        ' Q' + (len * 0.5) + ' ' + (bend + 12) + ' 0 7 Z" ' +
        'transform="rotate(' + a + ')" fill="#0b0616"/>';
    }
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 460" preserveAspectRatio="xMidYMax meet">' +
        '<g fill="#0b0616">' +
          // ствол
          '<path d="M132 460 C138 350 150 268 178 196 L196 202 C170 274 158 352 154 460 Z"/>' +
          // кокосы
          '<circle cx="184" cy="196" r="9"/><circle cx="199" cy="204" r="7"/>' +
        '</g>' +
        '<g transform="translate(190 194)">' + fronds + '</g>' +
      '</svg>'
    );
  }

  function palmUrl() {
    return 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(palmSvg()) + '")';
  }

  // Дорожка света на воде: блики от солнца к наблюдателю.
  // Чем дальше от солнца — тем блик короче, тусклее, тоньше,
  // а расстояние между бликами больше (отсюда степень t^1.6).
  function buildSunPath(el) {
    var COUNT = 17;
    for (var i = 0; i < COUNT; i++) {
      var t = i / (COUNT - 1);
      var ray = document.createElement('div');
      ray.className = 'ray';
      ray.style.top = (Math.pow(t, 1.6) * 100).toFixed(2) + '%';
      ray.style.width = (100 - t * 89).toFixed(2) + '%';
      ray.style.height = (3.4 - t * 1.9).toFixed(2) + 'px';
      ray.style.opacity = (0.95 - t * 0.78).toFixed(2);
      ray.style.animationDuration = (3.4 + (i % 5) * 0.8).toFixed(2) + 's';
      ray.style.animationDelay = (-i * 0.37).toFixed(2) + 's';
      // свой сдвиг у каждого блика — дорожка не выглядит «по линейке»
      ray.style.setProperty('--dx', (Math.sin(i * 2.3) * 7).toFixed(1) + 'px');
      el.appendChild(ray);
    }
  }

  function buildScene() {
    if (document.querySelector('.scene')) return;

    var scene = document.createElement('div');
    scene.className = 'scene';
    scene.setAttribute('aria-hidden', 'true');

    var layers = [
      'sun-glow', 'sun',
      'cloud cloud-1', 'cloud cloud-2', 'cloud cloud-3', 'cloud cloud-4',
      'sea', 'sun-pool', 'sun-path', 'horizon-line',
      'palm palm-left', 'palm palm-right',
      'scene-veil', 'scene-vignette', 'scene-grain'
    ];

    layers.forEach(function (cls) {
      var el = document.createElement('div');
      el.className = cls;
      if (cls.indexOf('palm') === 0) el.style.backgroundImage = palmUrl();
      if (cls === 'sun-path') buildSunPath(el);
      scene.appendChild(el);
    });

    document.body.insertBefore(scene, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildScene);
  } else {
    buildScene();
  }
})();
