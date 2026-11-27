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
          createdAt: ( new Date()).toISOString(),
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
