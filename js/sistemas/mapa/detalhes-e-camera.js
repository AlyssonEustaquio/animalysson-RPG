var detailCache = {};
var DETAIL_MAX = 6;
function drawDetail(W, H) {
    var d = MAPINFO && MAPINFO.detail;
    if (!d || zoom < d.minZoom) return;
    var tw = MAP_W / d.n, th = MAP_H / d.n;
    var c0 = Math.max(0, Math.floor(-ox / zoom / tw));
    var c1 = Math.min(d.n - 1, Math.floor((W - ox) / zoom / tw));
    var r0 = Math.max(0, Math.floor(-oy / zoom / th));
    var r1 = Math.min(d.n - 1, Math.floor((H - oy) / zoom / th));
    var now = Date.now(), visible = {};
    for (var r = r0; r <= r1; r++) {
      for (var c = c0; c <= c1; c++) {
        var k = r + "_" + c;
        visible[k] = 1;
        var t = detailCache[k];
        if (!t) {
          t = detailCache[k] = { img: new Image(), t: now };
          t.img.onload = function() {
            draw();
          };
          var runtimeTile = d.runtimeTiles && d.runtimeTiles[k];
          t.img.src = runtimeTile || d.src.replace("{r}", r).replace("{c}", c);
        }
        t.t = now;
        if (t.img.complete && t.img.naturalWidth) cx.drawImage(t.img, c * tw, r * th, tw + 0.5, th + 0.5);
      }
    }
    var keys = Object.keys(detailCache);
    if (keys.length > DETAIL_MAX) {
      keys.filter(function(k2) {
        return !visible[k2];
      }).sort(function(a, b) {
        return detailCache[a].t - detailCache[b].t;
      }).slice(0, keys.length - DETAIL_MAX).forEach(function(k2) {
        detailCache[k2].img.onload = null;
        detailCache[k2].img.src = "";
        delete detailCache[k2];
      });
    }
  }
function focusCameraOnPlayer(viewW, viewH, force) {
    if (!isHexMap() || !cv || appMode === "editor" && !force) return;
    zoom = FLANAESS_ZOOM;
    var player = currentPlayer();
    if (!player) return;
    var center = worldTravelPos || cellCenter(player.x, player.y);
    var width = viewW == null ? cv.clientWidth : viewW;
    var height = viewH == null ? cv.clientHeight : viewH;
    ox = width / 2 - center.x * zoom + (force ? 0 : camPan.x);
    oy = height / 2 - center.y * zoom + (force ? 0 : camPan.y);
  }
function visionZoom(viewW, viewH) {
    var p = currentPlayer();
    var r = Math.max(1, p && p.luz || lightRadius);
    var w = viewW == null ? cv.clientWidth : viewW;
    var h = viewH == null ? cv.clientHeight : viewH;
    return Math.max(0.04, Math.min(w, h) / ((r * 2 + 1) * CELL));
  }
function centerCameraOnPlayer(viewW, viewH, force) {
    if (isHexMap() || !cv || appMode === "editor" && !force) return;
    var p = currentPlayer();
    var width = viewW == null ? cv.clientWidth : viewW;
    var height = viewH == null ? cv.clientHeight : viewH;
    if (!p || !width || !height) return;
    var minZoom = visionZoom(width, height);
    zoom = Math.max(minZoom, zoom);
    var c = keyMoveVis || tokenAnchor(p, p.x, p.y);
    ox = width / 2 - c.x * zoom + (force ? 0 : camPan.x);
    oy = height / 2 - c.y * zoom + (force ? 0 : camPan.y);
  }
function changeCameraZoom(factor, anchorX, anchorY) {
    if (!cv) return;
    if (appMode === "editor") {
      var viewW = cv.clientWidth, viewH = cv.clientHeight;
      var ax = anchorX == null ? viewW / 2 : anchorX;
      var ay = anchorY == null ? viewH / 2 : anchorY;
      var worldX = (ax - ox) / zoom, worldY = (ay - oy) / zoom;
      zoom = Math.max(0.02, Math.min(32, zoom * factor));
      ox = ax - worldX * zoom;
      oy = ay - worldY * zoom;
      draw();
      return;
    }
    if (isHexMap()) return;
    var minZoom = visionZoom();
    var maxZoom = 16;
    zoom = Math.max(minZoom, Math.min(maxZoom, zoom * factor));
    centerCameraOnPlayer();
    draw();
  }
function onWindowResize() {
    centerCameraOnPlayer();
    draw();
  }
