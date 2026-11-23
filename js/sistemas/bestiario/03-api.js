function open(opts) {
    opts = opts || {};
    if (root) close();
    ui.ctx = opts.ctx || null;
    ui.q = "";
    ui.type = "Todos";
    ui.cat = "Todos";
    ui.sel = opts.id && byId(opts.id) ? opts.id : null;
    ui.mode = "view";
    ui.draft = null;
    ui.isNew = false;
    build();
    renderList();
    renderPane();
    if (opts.edit && ui.sel) startEdit(byId(ui.sel), false);
    if (opts.create) startEdit(blank(), true);
    if (ui.sel) {
      var el = root.querySelector(".bst-item.on");
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "center" });
    }
  }

rebuild();

window.Bestiary = {
    open,
    edit: function(id, opts) {
      open(Object.assign({}, opts || {}, { id, edit: true }));
    },
    create: function(opts) {
      open(Object.assign({}, opts || {}, { create: true }));
    },
    onChange: function(fn) {
      if (typeof fn === "function") listeners.push(fn);
    }
  };
