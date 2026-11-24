function loadRepositoryMapState(done) {
    var requestedMapId = mapId;
    var file = MAPINFO && MAPINFO.stateFile;
    if (!file || typeof window.fetch !== "function") {
      done();
      return;
    }
    var localSavedAt = Number(state && state._savedAt) || 0;
    fetch(encodeURI(file) + "?v=" + Date.now(), { cache: "no-store" }).then(function(response) {
      if (!response.ok) return null;
      return response.json();
    }).then(function(payload) {
      if (mapId !== requestedMapId || !payload) return;
      if (payload.format !== "animalysson-rpg-map" || payload.mapId !== requestedMapId || !payload.state) return;
      var remoteSavedAt = Date.parse(payload.exportedAt) || 0;
      if (remoteSavedAt <= localSavedAt) return;
      if (isHexMap()) applyExportedHexGridProfile(payload);
      var remoteState = normalizeMapState(payload.state);
      if (!remoteState) return;
      remoteState._savedAt = remoteSavedAt;
      state = migrateFlanaessState(remoteState);
    }).catch(function() {
    }).then(function() {
      done();
    });
  }

function downloadBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function() {
      URL.revokeObjectURL(url);
    }, 1500);
  }

function exportMapCatalog(allowEmpty) {
    var entries = customMapEntries();
    if (!entries.length && !allowEmpty) {
      appAlertMessage("msg001", "Ainda não há mapas adicionados pelo botão +.");
      return;
    }
    var payload = {
      format: "animalysson-rpg-map-catalog",
      version: 1,
      updatedAt: ( new Date()).toISOString(),
      maps: entries
    };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" }), "mapas.json");
  }

function exportMapFile() {
    var mapFolder = MAPINFO.folder || (MAPINFO.stateFile ? MAPINFO.stateFile.substring(0, MAPINFO.stateFile.lastIndexOf("/") + 1) : "mapas/");
    var assets = (MAPINFO.parts || []).map(function(part) {
      return part.src;
    });
    if (MAPINFO.detail) {
      for (var detailRow = 0; detailRow < MAPINFO.detail.n; detailRow++) {
        for (var detailCol = 0; detailCol < MAPINFO.detail.n; detailCol++) {
          assets.push(MAPINFO.detail.src.replace("{r}", detailRow).replace("{c}", detailCol));
        }
      }
    }
    var exportedState = isHexMap() ? { v: 4, nome: MAPINFO.nome, gridMode: FLANAESS_GRID_MODE, gridMetrics: hexGridSnapshot(), spawn: state.spawn || MAPINFO.spawn, portals: state.portals || [], tokens: state.tokens || [] } : JSON.parse(JSON.stringify(state));
    if (exportedState && Object.prototype.hasOwnProperty.call(exportedState, "_savedAt")) delete exportedState._savedAt;
    var payload = {
      format: "animalysson-rpg-map",
      version: 1,
      mapId,
      mapName: MAPINFO.nome,
      exportedAt: ( new Date()).toISOString(),
      dimensions: { width: MAP_W, height: MAP_H, columns: COLS, rows: ROWS },
      imageFolder: mapFolder,
      images: assets,
      mapConfig: serializableMapConfig(MAPINFO),
      catalogFile: MAPINFO.custom ? MAP_CATALOG_FILE : null,
      state: exportedState
    };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" }), safeMapFileName(MAPINFO.nome) + ".json");
  }

async function exportMapPackage() {
    if (!MAPINFO || !MAPINFO.custom) {
      exportMapFile();
      return;
    }
    showOptimizeProgress("Preparando o pacote ZIP atualizado…");
    try {
      var config = serializableMapConfig(MAPINFO);
      config.folder = "mapas/";
      config.stateFile = null;
      var entries = [];
      config.parts = config.parts.map(function(part) {
        return {
          src: String(part.src || "").replace(/\\/g, "/").split("/").pop(),
          x: part.x,
          y: part.y,
          w: part.w,
          h: part.h
        };
      });
      for (var i = 0; i < MAPINFO.parts.length; i++) {
        var livePart = MAPINFO.parts[i];
        var imageResponse = await fetch(livePart.localSrc || livePart.src);
        if (!imageResponse.ok) throw new Error("Não foi possível ler a imagem " + livePart.src + " para atualizar o ZIP.");
        var imageBlob = await imageResponse.blob();
        entries.push({ name: config.parts[i].src, blob: imageBlob });
      }
      var exportedState = isHexMap() ? { v: 4, nome: MAPINFO.nome, gridMode: FLANAESS_GRID_MODE, gridMetrics: hexGridSnapshot(), spawn: state.spawn || MAPINFO.spawn, portals: state.portals || [], tokens: state.tokens || [] } : JSON.parse(JSON.stringify(state));
      if (exportedState && Object.prototype.hasOwnProperty.call(exportedState, "_savedAt")) delete exportedState._savedAt;
      var manifest = {
        format: MAP_PACKAGE_FORMAT,
        version: 1,
        id: mapId,
        createdAt: MAPINFO.packageStateExportedAt || ( new Date()).toISOString(),
        exportedAt: ( new Date()).toISOString(),
        config,
        state: exportedState
      };
      entries.unshift({ name: "mapa.json", blob: new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json;charset=utf-8" }) });
      var zipBlob = await createImagesZip(entries);
      hideOptimizeProgress();
      downloadBlob(zipBlob, safeMapFileName(MAPINFO.nome) + ".zip");
    } catch (error) {
      showOptimizeError(error && error.message ? error.message : "Não foi possível gerar o ZIP atualizado.");
    }
  }

function revokeMapRuntimeUrls(info) {
    if (!info) return;
    (info.parts || []).forEach(function(part) {
      if (part.localSrc && String(part.localSrc).indexOf("blob:") === 0) {
        try {
          URL.revokeObjectURL(part.localSrc);
        } catch (e) {
        }
      }
    });
    var tiles = info.detail && info.detail.runtimeTiles;
    if (tiles) Object.keys(tiles).forEach(function(key) {
      if (String(tiles[key]).indexOf("blob:") === 0) {
        try {
          URL.revokeObjectURL(tiles[key]);
        } catch (e) {
        }
      }
    });
  }

function deleteCurrentCustomMap() {
    if (!MAPINFO || !MAPINFO.custom) {
      appAlertMessage("msg002", "Os mapas originais do projeto não podem ser excluídos. Este botão remove somente mapas adicionados pelo botão +.");
      return;
    }
    var deletedId = mapId;
    var deletedInfo = MAPINFO;
    var host = R;
    var confirmed = appConfirmMessage(
      "msg003",
      'Excluir o mapa "' + deletedInfo.nome + '" deste navegador?\n\nEle será removido do seletor e os dados locais deste mapa serão apagados.\n\nSe ele veio de um ZIP publicado, apague também o arquivo ZIP correspondente da pasta mapas/ no GitHub para removê-lo de todos os dispositivos.'
    );
    if (!confirmed) return;
    save();
    try {
      localStorage.removeItem(deletedInfo.key);
    } catch (e) {
    }
    rememberDeletedCustomMap(deletedId);
    revokeMapRuntimeUrls(deletedInfo);
    delete MAPS[deletedId];
    persistCustomMaps();
    preferredMapId = "tumba";
    try {
      localStorage.setItem(MAP_ID_KEY, "tumba");
    } catch (e) {
    }
    stopWorldTravel(false);
    unmount();
    applyMap("tumba");
    state = loadCurrentMapState();
    selected = null;
    pendingMonster = null;
    measurePts = null;
    drag = null;
    mount(host);
    appAlertMessage("msg004", "Mapa removido deste navegador. Para removê-lo também dos outros dispositivos, exclua o arquivo ZIP correspondente da pasta mapas/ no GitHub.");
  }

function canvasToWebp(canvas, quality) {
    return new Promise(function(resolve, reject) {
      if (!canvas.toBlob) {
        reject(new Error("Este navegador não oferece conversão WebP pelo canvas."));
        return;
      }
      canvas.toBlob(function(blob) {
        if (!blob) {
          reject(new Error("Não foi possível gerar a imagem WebP."));
          return;
        }
        if (blob.type !== "image/webp") {
          reject(new Error("Este navegador não consegue exportar WebP. Use o Google Chrome ou o Microsoft Edge atualizados."));
          return;
        }
        resolve(blob);
      }, "image/webp", quality);
    });
  }

function canvasToPng(canvas) {
    return new Promise(function(resolve, reject) {
      if (!canvas.toBlob) {
        reject(new Error("Este navegador não oferece exportação de PNG pelo canvas."));
        return;
      }
      canvas.toBlob(function(blob) {
        if (!blob || blob.type !== "image/png") {
          reject(new Error("Não foi possível gerar o PNG sem perdas."));
          return;
        }
        resolve(blob);
      }, "image/png");
    });
  }

function crc32Bytes(bytes) {
    var crc = 4294967295;
    for (var i = 0; i < bytes.length; i++) {
      crc ^= bytes[i];
      for (var bit = 0; bit < 8; bit++) crc = crc >>> 1 ^ (crc & 1 ? 3988292384 : 0);
    }
    return (crc ^ 4294967295) >>> 0;
  }

function zipSetUint64(view, offset, value) {
    var big = BigInt(Math.floor(value));
    var mask = BigInt(4294967295);
    view.setUint32(offset, Number(big & mask), true);
    view.setUint32(offset + 4, Number(big >> BigInt(32)), true);
  }

async function createImagesZip(entries) {
    var localParts = [], centralParts = [], offset = 0, centralSize = 0;
    var now =  new Date();
    var dosTime = now.getHours() << 11 | now.getMinutes() << 5 | Math.floor(now.getSeconds() / 2);
    var dosDate = Math.max(1980, now.getFullYear()) - 1980 << 9 | now.getMonth() + 1 << 5 | now.getDate();
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      var nameBytes = new TextEncoder().encode(entry.name);
      var size = entry.blob.size;
      if (size > 4294967295) throw new Error("Uma parte individual ultrapassou 4 GB, acima do tamanho suportado por um tile.");
      var buffer = await entry.blob.arrayBuffer();
      var crc = crc32Bytes(new Uint8Array(buffer));
      buffer = null;
      var local = new Uint8Array(30 + nameBytes.length);
      var lv = new DataView(local.buffer);
      lv.setUint32(0, 67324752, true);
      lv.setUint16(4, 20, true);
      lv.setUint16(6, 2048, true);
      lv.setUint16(8, 0, true);
      lv.setUint16(10, dosTime, true);
      lv.setUint16(12, dosDate, true);
      lv.setUint32(14, crc, true);
      lv.setUint32(18, size, true);
      lv.setUint32(22, size, true);
      lv.setUint16(26, nameBytes.length, true);
      lv.setUint16(28, 0, true);
      local.set(nameBytes, 30);
      localParts.push(local, entry.blob);
      var needsOffset64 = offset > 4294967295;
      var extraLength = needsOffset64 ? 12 : 0;
      var central = new Uint8Array(46 + nameBytes.length + extraLength);
      var cv2 = new DataView(central.buffer);
      cv2.setUint32(0, 33639248, true);
      cv2.setUint16(4, 45, true);
      cv2.setUint16(6, needsOffset64 ? 45 : 20, true);
      cv2.setUint16(8, 2048, true);
      cv2.setUint16(10, 0, true);
      cv2.setUint16(12, dosTime, true);
      cv2.setUint16(14, dosDate, true);
      cv2.setUint32(16, crc, true);
      cv2.setUint32(20, size, true);
      cv2.setUint32(24, size, true);
      cv2.setUint16(28, nameBytes.length, true);
      cv2.setUint16(30, extraLength, true);
      cv2.setUint16(32, 0, true);
      cv2.setUint16(34, 0, true);
      cv2.setUint32(36, 0, true);
      cv2.setUint32(38, 0, true);
      cv2.setUint32(42, needsOffset64 ? 4294967295 : offset, true);
      central.set(nameBytes, 46);
      if (needsOffset64) {
        var extraView = new DataView(central.buffer);
        var extraAt = 46 + nameBytes.length;
        extraView.setUint16(extraAt, 1, true);
        extraView.setUint16(extraAt + 2, 8, true);
        zipSetUint64(extraView, extraAt + 4, offset);
      }
      centralParts.push(central);
      offset += local.length + size;
      centralSize += central.length;
    }
    var needsZip64 = entries.length > 65535 || centralSize > 4294967295 || offset > 4294967295;
    var endParts = [];
    if (needsZip64) {
      var zip64Offset = offset + centralSize;
      var zip64End = new Uint8Array(56), z64 = new DataView(zip64End.buffer);
      z64.setUint32(0, 101075792, true);
      zipSetUint64(z64, 4, 44);
      z64.setUint16(12, 45, true);
      z64.setUint16(14, 45, true);
      z64.setUint32(16, 0, true);
      z64.setUint32(20, 0, true);
      zipSetUint64(z64, 24, entries.length);
      zipSetUint64(z64, 32, entries.length);
      zipSetUint64(z64, 40, centralSize);
      zipSetUint64(z64, 48, offset);
      endParts.push(zip64End);
      var locator = new Uint8Array(20), loc = new DataView(locator.buffer);
      loc.setUint32(0, 117853008, true);
      loc.setUint32(4, 0, true);
      zipSetUint64(loc, 8, zip64Offset);
      loc.setUint32(16, 1, true);
      endParts.push(locator);
    }
    var end = new Uint8Array(22), ev = new DataView(end.buffer);
    ev.setUint32(0, 101010256, true);
    ev.setUint16(4, 0, true);
    ev.setUint16(6, 0, true);
    ev.setUint16(8, Math.min(entries.length, 65535), true);
    ev.setUint16(10, Math.min(entries.length, 65535), true);
    ev.setUint32(12, Math.min(centralSize, 4294967295), true);
    ev.setUint32(16, Math.min(offset, 4294967295), true);
    ev.setUint16(20, 0, true);
    endParts.push(end);
    return new Blob(localParts.concat(centralParts, endParts), { type: "application/zip" });
  }

var MAP_PART_MAX_EDGE = 1024;

function planMapParts(width, height, maxEdge) {
    var limit = maxEdge || MAP_PART_MAX_EDGE;
    function pieces(size) {
      return Math.max(size > 1024 ? 2 : 1, Math.ceil(size / limit));
    }
    var cols = pieces(width), rows = pieces(height), parts = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var x0 = Math.round(c * width / cols), x1 = Math.round((c + 1) * width / cols);
        var y0 = Math.round(r * height / rows), y1 = Math.round((r + 1) * height / rows);
        parts.push({ name: "hi_part" + (r * cols + c + 1) + ".webp", x: x0, y: y0, w: x1 - x0, h: y1 - y0 });
      }
    }
    return { cols, rows, parts };
  }

function verifyLosslessImage(sourceCanvas, blob, formatName) {
    var w = sourceCanvas.width, h = sourceCanvas.height;
    return new Promise(function(resolve, reject) {
      var url = URL.createObjectURL(blob), decoded = new Image();
      decoded.onload = function() {
        URL.revokeObjectURL(url);
        resolve(decoded);
      };
      decoded.onerror = function() {
        URL.revokeObjectURL(url);
        reject(new Error("Não foi possível conferir a imagem convertida."));
      };
      decoded.src = url;
    }).then(function(decoded) {
      var check = document.createElement("canvas");
      check.width = w;
      check.height = h;
      var checkContext = check.getContext("2d", { willReadFrequently: true });
      checkContext.imageSmoothingEnabled = false;
      checkContext.drawImage(decoded, 0, 0);
      var original = sourceCanvas.getContext("2d").getImageData(0, 0, w, h).data;
      var converted = checkContext.getImageData(0, 0, w, h).data;
      check.width = 1;
      check.height = 1;
      for (var i = 0; i < original.length; i += 4) {
        var same = original[i] === converted[i] && original[i + 1] === converted[i + 1] && original[i + 2] === converted[i + 2] && original[i + 3] === converted[i + 3];
        if (!same) {
          var px = i / 4;
          throw new Error("O navegador não gerou um " + formatName + " idêntico à imagem original.\n(pixel " + px % w + "," + Math.floor(px / w) + ": original " + original[i] + "," + original[i + 1] + "," + original[i + 2] + "," + original[i + 3] + " → convertido " + converted[i] + "," + converted[i + 1] + "," + converted[i + 2] + "," + converted[i + 3] + ")");
        }
      }
    });
  }

function loadMapImageElement(file) {
    return new Promise(function(resolve, reject) {
      var url = URL.createObjectURL(file);
      var image = new Image();
      image.onload = function() {
        var width = image.naturalWidth || image.width;
        var height = image.naturalHeight || image.height;
        if (!width || !height) {
          URL.revokeObjectURL(url);
          reject(new Error("Não foi possível identificar as dimensões da imagem."));
          return;
        }
        resolve({
          width,
          height,
          image,
          release: function() {
            image.onload = null;
            image.onerror = null;
            image.src = "";
            URL.revokeObjectURL(url);
          }
        });
      };
      image.onerror = function() {
        URL.revokeObjectURL(url);
        reject(new Error("Não foi possível abrir essa imagem. Ela pode estar corrompida ou em um formato não suportado pelo navegador."));
      };
      image.src = url;
    });
  }
