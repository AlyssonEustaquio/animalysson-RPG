async function readMapImageInfo(file) {
    if (typeof window.ImageDecoder === "function" && file && typeof file.stream === "function") {
      var decoder = null;
      try {
        decoder = new window.ImageDecoder({ data: file.stream(), type: file.type });
        await decoder.tracks.ready;
        var track = decoder.tracks.selectedTrack;
        var width = track && Number(track.displayWidth || track.codedWidth);
        var height = track && Number(track.displayHeight || track.codedHeight);
        decoder.close();
        decoder = null;
        if (width > 0 && height > 0) return { width, height, image: null, release: function() {
        } };
      } catch (metadataError) {
        if (decoder) {
          try {
            decoder.close();
          } catch (e) {
          }
        }
      }
    }
    return loadMapImageElement(file);
  }

function imageRegionToLosslessWebp(image, sx, sy, sw, sh) {
    var canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(sw));
    canvas.height = Math.max(1, Math.round(sh));
    var context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return Promise.reject(new Error("Não foi possível preparar o canvas de otimização."));
    context.imageSmoothingEnabled = false;
    context.drawImage(image, sx, sy, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    function release() {
      canvas.width = 1;
      canvas.height = 1;
    }
    return canvasToWebp(canvas, 1).then(function(blob) {
      return verifyLosslessImage(canvas, blob, "WebP").then(function() {
        return blob;
      });
    }).catch(function(webpError) {
      return canvasToPng(canvas).then(function(pngBlob) {
        return verifyLosslessImage(canvas, pngBlob, "PNG").then(function() {
          return pngBlob;
        });
      }).catch(function(pngError) {
        throw new Error("Não foi possível preservar exatamente os pixels nem em WebP nem em PNG. WebP: " + (webpError && webpError.message ? webpError.message : "falha de codificação") + " PNG: " + (pngError && pngError.message ? pngError.message : "falha de codificação"));
      });
    }).then(function(blob) {
      release();
      return blob;
    }, function(error) {
      release();
      throw error;
    });
  }

async function optimizeMapImage(file, width, height, onProgress, initialImage) {
    var plan = planMapParts(width, height), files = [];
    var fallbackImage = initialImage || null;
    var ownsFallbackImage = false;
    var useCroppedBitmap = !fallbackImage && typeof createImageBitmap === "function";
    if (!fallbackImage && !useCroppedBitmap) {
      fallbackImage = await loadMapImageElement(file);
      ownsFallbackImage = true;
    }
    try {
      for (var index = 0; index < plan.parts.length; index++) {
        var part = plan.parts[index];
        if (onProgress) onProgress(index + 1, plan.parts.length);
        await new Promise(function(resolve) {
          setTimeout(resolve, 16);
        });
        var sourceImage = fallbackImage && fallbackImage.image ? fallbackImage.image : fallbackImage;
        var sourceX = part.x, sourceY = part.y, bitmap = null;
        if (useCroppedBitmap) {
          try {
            bitmap = await createImageBitmap(file, part.x, part.y, part.w, part.h);
            if (bitmap.width !== part.w || bitmap.height !== part.h) {
              bitmap.close();
              bitmap = null;
              throw new Error("O navegador retornou um recorte com dimensões inesperadas.");
            }
            sourceImage = bitmap;
            sourceX = 0;
            sourceY = 0;
          } catch (cropError) {
            useCroppedBitmap = false;
            if (!fallbackImage) {
              fallbackImage = await loadMapImageElement(file);
              ownsFallbackImage = true;
            }
            sourceImage = fallbackImage.image || fallbackImage;
            sourceX = part.x;
            sourceY = part.y;
          }
        }
        try {
          var blob = await imageRegionToLosslessWebp(sourceImage, sourceX, sourceY, part.w, part.h);
          files.push({ name: blob.type === "image/png" ? part.name.replace(/\.webp$/i, ".png") : part.name, blob });
        } finally {
          if (bitmap) bitmap.close();
        }
      }
      return { files, parts: plan.parts, cols: plan.cols, rows: plan.rows };
    } finally {
      if (ownsFallbackImage && fallbackImage && typeof fallbackImage.release === "function") fallbackImage.release();
    }
  }

function showOptimizeProgress(text) {
    var root = R && R.querySelector("#mp-root");
    if (!root) return;
    var box = root.querySelector("#mp-optimize-progress");
    if (!box) {
      box = document.createElement("div");
      box.id = "mp-optimize-progress";
      box.setAttribute("role", "status");
      box.style.cssText = "position:absolute;inset:0;z-index:150;display:flex;align-items:center;justify-content:center;padding:18px;box-sizing:border-box;background:rgba(0,0,0,.72);color:#f4f5f7;font-size:14px;text-align:center;";
      var inner = document.createElement("div");
      inner.style.cssText = "max-width:360px;padding:18px 20px;border:1px solid rgba(255,255,255,.2);border-radius:12px;background:#17191f;line-height:1.5;white-space:pre-line;";
      box.appendChild(inner);
      root.appendChild(box);
    }
    box.firstChild.textContent = text;
  }

function showOptimizeError(message) {
    hideOptimizeProgress();
    try {
      console.error("[Mapa] Falha ao importar a imagem:", message);
    } catch (e) {
    }
    var root = R && R.querySelector("#mp-root");
    if (!root) {
      window.alert(message);
      return;
    }
    showOptimizeProgress(message);
    var box = root.querySelector("#mp-optimize-progress");
    if (!box) {
      window.alert(message);
      return;
    }
    var close = document.createElement("button");
    close.type = "button";
    close.textContent = "Fechar";
    close.style.cssText = "display:block;margin:14px auto 0;min-height:36px;padding:7px 16px;border:1px solid #3c9bc7;border-radius:7px;background:#17688f;color:#fff;cursor:pointer;";
    close.onclick = hideOptimizeProgress;
    box.firstChild.appendChild(close);
  }

function hideOptimizeProgress() {
    var box = R && R.querySelector("#mp-optimize-progress");
    if (box && box.parentNode) box.parentNode.removeChild(box);
  }

function slugifyMapName(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "novo-mapa";
  }

function safeMapFileName(value) {
    return String(value || "").replace(/[\\/:*?"<>|]/g, "-").replace(/[\r\n]+/g, " ").trim() || "mapa";
  }

async function createCustomMapFromZip(file) {
    showOptimizeProgress("Lendo o pacote ZIP do mapa…");
    var pkg = null;
    try {
      pkg = await readMapPackage(file, file.name);
      var importedId = pkg.id;
      clearDeletedCustomMap(importedId);
      if (MAPS[importedId] && !MAPS[importedId].custom) {
        releaseMapPackage(pkg);
        pkg = null;
        throw new Error("Este pacote usa o identificador de um mapa original do projeto. Renomeie o mapa ao recriá-lo.");
      }
      var host = R;
      stopWorldTravel(false);
      save();
      unmount();
      if (!registerMapPackage(pkg)) throw new Error("Não foi possível registrar o pacote ZIP.");
      pkg = null;
      preferredMapId = importedId;
      try {
        localStorage.setItem(MAP_ID_KEY, importedId);
      } catch (e) {
      }
      mount(host);
      hideOptimizeProgress();
      appAlertMessage("msg009", "Mapa adicionado! O ZIP já contém a configuração e todas as imagens. Para mantê-lo disponível após reiniciar, publique este mesmo ZIP diretamente em mapas/ no GitHub; não extraia os arquivos e não precisa atualizar mapas.json.");
    } catch (error) {
      if (pkg) releaseMapPackage(pkg);
      showOptimizeError(error && error.message ? error.message : "Não foi possível abrir o pacote ZIP do mapa.");
    }
  }

function createCustomMapFromFile(file) {
    if (!file) return;
    if (/\.zip$/i.test(file.name || "") || /application\/(?:zip|x-zip-compressed)/i.test(file.type || "")) {
      createCustomMapFromZip(file);
      return;
    }
    if (!file.type || file.type.indexOf("image/") !== 0) {
      appAlertMessage("msg005", "Selecione uma imagem ou um pacote ZIP de mapa.");
      return;
    }
    var suggestedName = file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim() || "Novo mapa";
    var name = appPromptMessage("msg006", "Nome do novo mapa:", suggestedName);
    if (!name || !name.trim()) return;
    name = name.trim();
    var cellInput = appPromptMessage("msg007", "Tamanho da célula da grade em pixels:", "36");
    if (cellInput == null) return;
    var cell = Number(cellInput);
    if (!isFinite(cell) || cell < 8 || cell > 512) {
      appAlertMessage("msg008", "Informe um tamanho de célula entre 8 e 512 pixels.");
      return;
    }
    showOptimizeProgress("Lendo as dimensões da imagem…");
    (async function() {
      var runtimeUrls = [];
      var imageInfo = null;
      try {
        imageInfo = await readMapImageInfo(file);
        var width = imageInfo.width;
        var height = imageInfo.height;
        if (!width || !height) throw new Error("Não foi possível identificar as dimensões da imagem.");
        var requestedCell = cell;
        var maxGridCells = 5e5;
        var cols = Math.ceil(width / cell), rows = Math.ceil(height / cell);
        while (cols * rows > maxGridCells && cell < 512) {
          cell++;
          cols = Math.ceil(width / cell);
          rows = Math.ceil(height / cell);
        }
        if (cols * rows > maxGridCells) {
          throw new Error("A imagem foi processada sem redução, mas a grade ainda teria mais de 500.000 células mesmo com célula de 512 px. O navegador não consegue manter uma grade desse tamanho com segurança.");
        }
        var optimized = await optimizeMapImage(file, width, height, function(done, total) {
          showOptimizeProgress("Otimizando os blocos sem perda e verificando todos os pixels…\nParte " + done + " de " + total);
        }, imageInfo.image ? imageInfo : null);
        var id = slugifyMapName(name);
        var suffix = 2;
        while (MAPS[id]) {
          id = slugifyMapName(name) + "-" + suffix;
          suffix++;
        }
        var runtimeParts = optimized.parts.map(function(part, index) {
          var imageFile = optimized.files[index];
          var partUrl = URL.createObjectURL(imageFile.blob);
          runtimeUrls.push(partUrl);
          return { src: imageFile.name, x: part.x, y: part.y, w: part.w, h: part.h, localSrc: partUrl };
        });
        var config = {
          nome: name,
          icone: "🗺️",
          key: "animalysson-vtt-custom-" + id,
          custom: true,
          folder: "mapas/",
          stateFile: null,
          cell,
          cols,
          rows,
          w: width,
          h: height,
          spawn: { x: Math.floor(cols / 2), y: Math.floor(rows / 2) },
          fit: true,
          maxZoom: 4,
          parts: runtimeParts
        };
        var manifest = {
          format: MAP_PACKAGE_FORMAT,
          version: 1,
          id,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          config: serializableMapConfig(config)
        };
        var zipEntries = [{
          name: "mapa.json",
          blob: new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json;charset=utf-8" })
        }].concat(optimized.files);
        showOptimizeProgress("Montando o pacote ZIP com configuração e imagens…");
        var zipBlob = await createImagesZip(zipEntries);
        if (!registerCustomMap(id, config)) throw new Error("Não foi possível adicionar este mapa.");
        hideOptimizeProgress();
        var host = R;
        stopWorldTravel(false);
        save();
        unmount();
        applyMap(id);
        preferredMapId = id;
        try {
          localStorage.setItem(MAP_ID_KEY, id);
        } catch (e) {
        }
        state = defaultState();
        showGrid = true;
        showFog = true;
        dynLight = true;
        showWalls = true;
        selected = null;
        pendingMonster = null;
        measurePts = null;
        drag = null;
        save();
        mount(host);
        var gridMessage = cell !== requestedCell ? " Para manter a grade leve, o tamanho da célula foi ajustado automaticamente de " + requestedCell + " para " + cell + " px; a resolução da imagem não foi alterada." : "";
        var pngParts = optimized.files.filter(function(entry) {
          return entry.blob.type === "image/png";
        }).length;
        var webpParts = optimized.files.length - pngParts;
        var formatMessage = pngParts ? webpParts ? webpParts + " partes foram salvas em WebP sem perdas e " + pngParts + " em PNG sem perdas." : "Os " + pngParts + " blocos foram salvos em PNG sem perdas." : "Todas as partes foram salvas em WebP sem perdas e verificadas pixel a pixel.";
        var detailMessage = "A imagem (" + width + " × " + height + " px) foi dividida em " + optimized.parts.length + " partes (" + optimized.cols + " × " + optimized.rows + "), mantendo a resolução original. " + formatMessage + gridMessage;
        appAlertMessage("msg009", "Mapa criado e ZIP pronto! " + detailMessage + "\n\nPara disponibilizar em todos os dispositivos, coloque o arquivo ZIP diretamente na pasta mapas/ do repositório. Não extraia o ZIP e não precisa baixar nem atualizar mapas.json.");
        var zipName = safeMapFileName(name) + ".zip";
        downloadBlob(zipBlob, zipName);
      } catch (error) {
        runtimeUrls.forEach(function(url) {
          try {
            URL.revokeObjectURL(url);
          } catch (e) {
          }
        });
        showOptimizeError(error && error.message ? error.message : "Não foi possível otimizar a imagem do mapa.");
      } finally {
        if (imageInfo && typeof imageInfo.release === "function") imageInfo.release();
      }
    })();
  }

function save() {
    try {
      state._savedAt = Date.now();
      if (isHexMap()) {
        state.gridMode = FLANAESS_GRID_MODE;
        localStorage.setItem(KEY, JSON.stringify({
          v: 4,
          nome: MAPINFO.nome,
          gridMode: state.gridMode,
          gridMetrics: hexGridSnapshot(),
          spawn: state.spawn || MAPINFO.spawn,
          portals: state.portals || [],
          tokens: state.tokens || [],
          _savedAt: state._savedAt
        }));
      } else {
        localStorage.setItem(KEY, JSON.stringify(state));
      }
    } catch (e) {
    }
  }

function $(s) {
    return R.querySelector(s);
  }

function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

function idx(x, y) {
    return y * COLS + x;
  }

function hIdx(x, yEdge) {
    return yEdge * COLS + x;
  }

function vIdx(xEdge, y) {
    return y * (COLS + 1) + xEdge;
  }

function isCellWall(x, y) {
    if (x < 0 || y < 0 || x >= COLS || y >= ROWS) return true;
    if (isHexMap()) return false;
    return !!state.walls[idx(x, y)];
  }

function getH(x, yEdge) {
    if (x < 0 || x >= COLS || yEdge < 0 || yEdge > ROWS) return EDGE_MURO;
    return state.hEdges[hIdx(x, yEdge)] || 0;
  }

function getV(xEdge, y) {
    if (y < 0 || y >= ROWS || xEdge < 0 || xEdge > COLS) return EDGE_MURO;
    return state.vEdges[vIdx(xEdge, y)] || 0;
  }

function edgeMetaIndex(edge) {
    if (!edge) return -1;
    return edge.dir === "h" ? hIdx(edge.x, edge.yEdge) : vIdx(edge.xEdge, edge.y);
  }

function getEdgeMeta(edge) {
    if (!edge) return null;
    if (edge.custom) return edge.custom.meta || null;
    var arr = edge.dir === "h" ? state.hEdgeMeta : state.vEdgeMeta;
    return arr && arr[edgeMetaIndex(edge)] || null;
  }

function setEdgeMeta(edge, meta) {
    if (!edge) return;
    if (edge.custom) {
      edge.custom.meta = meta || null;
      return;
    }
    var arr = edge.dir === "h" ? state.hEdgeMeta : state.vEdgeMeta;
    if (!arr) {
      if (edge.dir === "h") state.hEdgeMeta = makeArr(COLS * (ROWS + 1), null);
      else state.vEdgeMeta = makeArr((COLS + 1) * ROWS, null);
      arr = edge.dir === "h" ? state.hEdgeMeta : state.vEdgeMeta;
    }
    arr[edgeMetaIndex(edge)] = meta || null;
  }

function setH(x, yEdge, val) {
    if (x < 0 || x >= COLS || yEdge < 0 || yEdge > ROWS) return;
    var i = hIdx(x, yEdge), old = state.hEdges[i];
    state.hEdges[i] = val;
    if (old !== val && state.hEdgeMeta) state.hEdgeMeta[i] = null;
  }

function setV(xEdge, y, val) {
    if (y < 0 || y >= ROWS || xEdge < 0 || xEdge > COLS) return;
    var i = vIdx(xEdge, y), old = state.vEdges[i];
    state.vEdges[i] = val;
    if (old !== val && state.vEdgeMeta) state.vEdgeMeta[i] = null;
  }

function edgeBlocks(val, edge) {
    var meta = getEdgeMeta(edge);
    if (val === EDGE_NONE || val === EDGE_ILLUSION_WALL) return false;
    if (val === EDGE_SECRET_WALL) return !(meta && meta.open);
    if (val === EDGE_SECRET_DOOR_O || val === EDGE_DOOR_O) return false;
    if (val === EDGE_SECRET_DOOR_C || val === EDGE_DOOR_C || val === EDGE_MURO) return true;
    if (val === EDGE_LOCKED_DOOR || val === EDGE_JAMMED_DOOR) return !(meta && meta.open);
    return val === EDGE_FORCE_WALL || val === EDGE_MAGIC_WALL;
  }
