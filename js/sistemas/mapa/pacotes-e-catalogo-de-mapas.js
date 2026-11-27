var repositoryMapCatalogPromise = null;
var MAP_PACKAGE_FORMAT = "animalysson-rpg-map-package";
var MAP_PACKAGE_REPOSITORY_API = "https://api.github.com/repos/AlyssonEustaquio/animalysson-RPG/contents/mapas";
function zipEntryMime(name) {
    var lower = String(name || "").toLowerCase();
    if (/\.png$/.test(lower)) return "image/png";
    if (/\.jpe?g$/.test(lower)) return "image/jpeg";
    if (/\.webp$/.test(lower)) return "image/webp";
    if (/\.json$/.test(lower)) return "application/json;charset=utf-8";
    return "application/octet-stream";
  }
async function readStoredZipEntries(zipBlob) {
    if (!zipBlob || typeof zipBlob.slice !== "function" || !isFinite(zipBlob.size)) throw new Error("Arquivo ZIP inválido.");
    var entries =  new Map(), offset = 0, totalSize = zipBlob.size;
    var decoder = new TextDecoder("utf-8");
    while (offset + 30 <= totalSize) {
      var header = new DataView(await zipBlob.slice(offset, offset + 30).arrayBuffer());
      if (header.getUint32(0, true) !== 67324752) break;
      var flags = header.getUint16(6, true), method = header.getUint16(8, true);
      var crc = header.getUint32(14, true), compressedSize = header.getUint32(18, true);
      var uncompressedSize = header.getUint32(22, true), nameLength = header.getUint16(26, true);
      var extraLength = header.getUint16(28, true);
      if (flags & 8) throw new Error("O ZIP usa descritor de dados. Gere o pacote pelo editor do projeto.");
      if (method !== 0) throw new Error("O ZIP está compactado internamente. Selecione o ZIP sem compressão gerado pelo editor.");
      if (compressedSize === 4294967295 || uncompressedSize === 4294967295) throw new Error("Uma entrada individual do ZIP excede 4 GB.");
      if (compressedSize !== uncompressedSize) throw new Error("O ZIP contém uma entrada com tamanho inconsistente.");
      var nameStart = offset + 30, dataStart = nameStart + nameLength + extraLength;
      var dataEnd = dataStart + compressedSize;
      if (dataEnd > totalSize || dataStart < nameStart) throw new Error("O ZIP está incompleto ou corrompido.");
      var name = decoder.decode(await zipBlob.slice(nameStart, nameStart + nameLength).arrayBuffer()).replace(/\\/g, "/");
      if (!name || name.indexOf("../") >= 0 || name.charAt(0) === "/") throw new Error("O ZIP contém um caminho de arquivo inválido.");
      var body = zipBlob.slice(dataStart, dataEnd, zipEntryMime(name));
      var bodyBytes = new Uint8Array(await body.arrayBuffer());
      if (crc32Bytes(bodyBytes) !== crc) throw new Error("Falha na integridade do arquivo " + name + " dentro do ZIP.");
      entries.set(name, body);
      offset = dataEnd;
    }
    if (!entries.size) throw new Error("Não encontrei arquivos válidos dentro do ZIP.");
    return entries;
  }
async function getZipImageDimensions(blob) {
    if (typeof createImageBitmap === "function") {
      var bitmap = await createImageBitmap(blob), size = { width: bitmap.width, height: bitmap.height };
      bitmap.close();
      return size;
    }
    return new Promise(function(resolve, reject) {
      var url = URL.createObjectURL(blob), img = new Image();
      img.onload = function() {
        var size2 = { width: img.naturalWidth, height: img.naturalHeight };
        img.src = "";
        URL.revokeObjectURL(url);
        resolve(size2);
      };
      img.onerror = function() {
        URL.revokeObjectURL(url);
        reject(new Error("Não foi possível ler uma parte antiga do mapa."));
      };
      img.src = url;
    });
  }
async function buildLegacyMapPackage(entries, zipFilename) {
    var parts = [];
    entries.forEach(function(blob, name2) {
      var match = name2.match(/(?:^|\/)hi_part(\d+)\.(webp|png)$/i);
      if (match) parts.push({ index: Number(match[1]), name: name2, blob });
    });
    parts.sort(function(a, b) {
      return a.index - b.index;
    });
    if (!parts.length || parts.some(function(part, i2) {
      return part.index !== i2 + 1;
    })) throw new Error("O ZIP antigo não contém todas as partes hi_part1, hi_part2 etc.");
    var dimensions = [];
    for (var i = 0; i < parts.length; i++) dimensions.push(await getZipImageDimensions(parts[i].blob));
    var candidates = [];
    for (var cols = 1; cols <= parts.length; cols++) {
      if (parts.length % cols) continue;
      var rows = parts.length / cols, colWidths = [], rowHeights = [];
      for (var c = 0; c < cols; c++) colWidths.push(dimensions[c].width);
      for (var r = 0; r < rows; r++) rowHeights.push(dimensions[r * cols].height);
      var width = colWidths.reduce(function(a, b) {
        return a + b;
      }, 0);
      var height = rowHeights.reduce(function(a, b) {
        return a + b;
      }, 0), valid = true;
      for (var rr = 0; rr < rows && valid; rr++) for (var cc = 0; cc < cols; cc++) {
        var dim = dimensions[rr * cols + cc];
        if (dim.width !== colWidths[cc] || dim.height !== rowHeights[rr]) {
          valid = false;
          break;
        }
      }
      var expected = planMapParts(width, height, 1024);
      var expectedLegacy = planMapParts(width, height, 2048);
      if (valid && (expected.cols === cols && expected.rows === rows || expectedLegacy.cols === cols && expectedLegacy.rows === rows)) candidates.push({ cols, rows, width, height });
    }
    if (candidates.length !== 1) throw new Error("Não foi possível reconstruir com segurança a grade deste ZIP antigo. Recrie o pacote usando a versão atual do editor.");
    var layout = candidates[0];
    var name = String(zipFilename || "Mapa").replace(/\.zip$/i, "").replace(/-imagens-(?:sem-perda|webp)$/i, "").replace(/[_-]+/g, " ").trim() || "Mapa";
    var cell = 36, urls = [], mapCols = Math.ceil(layout.width / cell), mapRows = Math.ceil(layout.height / cell);
    var config = {
      nome: name,
      icone: "🗺️",
      key: "animalysson-vtt-custom-" + slugifyMapName(name),
      custom: true,
      folder: "mapas/",
      stateFile: null,
      cell,
      cols: mapCols,
      rows: mapRows,
      w: layout.width,
      h: layout.height,
      spawn: { x: Math.floor(mapCols / 2), y: Math.floor(mapRows / 2) },
      fit: true,
      maxZoom: 4,
      parts: []
    };
    for (var r = 0; r < layout.rows; r++) for (var c = 0; c < layout.cols; c++) {
      var partIndex = r * layout.cols + c;
      var x = Math.round(c * layout.width / layout.cols), x1 = Math.round((c + 1) * layout.width / layout.cols);
      var y = Math.round(r * layout.height / layout.rows), y1 = Math.round((r + 1) * layout.height / layout.rows);
      var url = URL.createObjectURL(parts[partIndex].blob);
      urls.push(url);
      config.parts.push({ src: parts[partIndex].name.split("/").pop(), x, y, w: x1 - x, h: y1 - y, localSrc: url });
    }
    return { id: slugifyMapName(name), config, urls, manifest: null };
  }
async function readMapPackage(zipBlob, zipFilename) {
    var entries = await readStoredZipEntries(zipBlob);
    var manifestBlob = entries.get("mapa.json") || entries.get("map-package.json");
    if (!manifestBlob) return buildLegacyMapPackage(entries, zipFilename);
    var manifest;
    try {
      manifest = JSON.parse(await manifestBlob.text());
    } catch (error) {
      throw new Error("O arquivo mapa.json dentro do ZIP está inválido.");
    }
    if (!manifest || manifest.format !== MAP_PACKAGE_FORMAT || !manifest.config) throw new Error("Este ZIP não é um pacote de mapa compatível com o Animalysson RPG.");
    var config = JSON.parse(JSON.stringify(manifest.config));
    var id = slugifyMapName(manifest.id || config.id || config.nome);
    if (!config.nome || !Number(config.w) || !Number(config.h) || !Array.isArray(config.parts) || !config.parts.length) throw new Error("O ZIP não contém as dimensões ou as partes necessárias para montar o mapa.");
    var urls = [];
    try {
      config.parts = config.parts.map(function(part) {
        var entryName = String(part.src || "").replace(/\\/g, "/").replace(/^\.\//, ""), imageBlob = entries.get(entryName);
        if (!imageBlob) {
          var leaf = entryName.substring(entryName.lastIndexOf("/") + 1);
          entries.forEach(function(candidate, name) {
            if (!imageBlob && name.substring(name.lastIndexOf("/") + 1) === leaf) imageBlob = candidate;
          });
        }
        if (!imageBlob) throw new Error("A parte " + entryName + " não foi encontrada dentro do ZIP.");
        var url = URL.createObjectURL(imageBlob);
        urls.push(url);
        return { src: entryName.substring(entryName.lastIndexOf("/") + 1), x: Number(part.x), y: Number(part.y), w: Number(part.w), h: Number(part.h), localSrc: url };
      });
    } catch (error) {
      urls.forEach(function(url) {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
        }
      });
      throw error;
    }
    config.custom = true;
    config.folder = "mapas/";
    config.stateFile = null;
    config.packageState = manifest.state || null;
    config.packageStateExportedAt = manifest.exportedAt || manifest.createdAt || null;
    config.key = config.key || "animalysson-vtt-custom-" + id;
    config.cell = Math.max(8, Math.min(512, Number(config.cell) || 36));
    config.cols = Number(config.cols) || Math.ceil(config.w / config.cell);
    config.rows = Number(config.rows) || Math.ceil(config.h / config.cell);
    return { id, config, urls, manifest };
  }
function releaseMapPackage(pkg) {
    if (!pkg || !pkg.urls) return;
    pkg.urls.forEach(function(url) {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
      }
    });
    pkg.urls = [];
  }
function registerMapPackage(pkg) {
    if (!pkg || !pkg.id || !pkg.config || MAPS[pkg.id] && !MAPS[pkg.id].custom) {
      releaseMapPackage(pkg);
      return false;
    }
    if (MAPS[pkg.id] && MAPS[pkg.id].custom) revokeMapRuntimeUrls(MAPS[pkg.id]);
    return registerCustomMap(pkg.id, pkg.config);
  }
async function loadServerMapPackages() {
    if (typeof window.fetch !== "function") return;
    var allFiles = [];
    for (var page = 1; page <= 10; page++) {
      var response = await fetch(MAP_PACKAGE_REPOSITORY_API + "?per_page=100&page=" + page, { cache: "no-store", headers: { Accept: "application/vnd.github+json" } });
      if (!response.ok) throw new Error("Não foi possível listar os pacotes ZIP no GitHub.");
      var items = await response.json();
      if (!Array.isArray(items)) break;
      allFiles = allFiles.concat(items.filter(function(item2) {
        return item2 && item2.type === "file" && /\.zip$/i.test(item2.name || "") && item2.download_url;
      }));
      if (items.length < 100) break;
    }
    for (var i = 0; i < allFiles.length; i++) {
      var item = allFiles[i];
      try {
        var zipResponse = await fetch(item.download_url, { cache: "no-store" });
        if (!zipResponse.ok) continue;
        var pkg = await readMapPackage(await zipResponse.blob(), item.name);
        if (isCustomMapDeleted(pkg.id) || MAPS[pkg.id]) releaseMapPackage(pkg);
        else registerMapPackage(pkg);
      } catch (error) {
        try {
          console.warn("[Mapa] Pacote ignorado: " + item.name, error);
        } catch (e) {
        }
      }
    }
  }
async function loadLegacyMapCatalog() {
    if (typeof window.fetch !== "function") return;
    try {
      var response = await fetch(MAP_CATALOG_FILE + "?v=" + Date.now(), { cache: "no-store" });
      if (!response.ok) return;
      var payload = await response.json();
      if (!payload || payload.format !== "animalysson-rpg-map-catalog" || !Array.isArray(payload.maps)) return;
      payload.maps.forEach(function(entry) {
        if (entry && entry.id && entry.config && !MAPS[entry.id] && !isCustomMapDeleted(entry.id)) registerCustomMap(entry.id, entry.config);
      });
    } catch (error) {
    }
  }
function loadStoredServerMapSettings() {
    try {
      var entries = JSON.parse(localStorage.getItem(CUSTOM_MAPS_KEY) || "[]");
      if (!Array.isArray(entries)) return;
      entries.forEach(function(entry) {
        var current = entry && entry.id && MAPS[entry.id];
        var saved = entry && entry.config;
        if (!current || !current.custom || !saved) return;
        var remoteTime = Date.parse(current.packageStateExportedAt || "") || 0;
        var localSettingsTime = Date.parse(saved.settingsUpdatedAt || "") || 0;
        if (remoteTime && localSettingsTime && remoteTime >= localSettingsTime) return;
        var merged = serializableMapConfig(current);
        var cell = Number(saved.cell);
        if (isFinite(cell) && cell >= 8 && cell <= 512) {
          merged.cell = cell;
          merged.cols = Math.ceil(Number(merged.w) / cell);
          merged.rows = Math.ceil(Number(merged.h) / cell);
        }
        if (saved.spawn && isFinite(Number(saved.spawn.x)) && isFinite(Number(saved.spawn.y))) {
          merged.spawn = { x: Number(saved.spawn.x), y: Number(saved.spawn.y) };
        }
        registerCustomMap(entry.id, merged);
      });
    } catch (error) {
    }
  }
function loadRepositoryMapCatalog(done) {
    if (!repositoryMapCatalogPromise) {
      repositoryMapCatalogPromise = (async function() {
        try {
          await loadServerMapPackages();
        } catch (error) {
          try {
            console.warn("[Mapa] Não foi possível descobrir os ZIPs em mapas/.", error);
          } catch (e) {
          }
        }
        await loadLegacyMapCatalog();
        loadStoredServerMapSettings();
      })();
    }
    repositoryMapCatalogPromise.then(function() {
      done();
    }, function() {
      done();
    });
  }
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
