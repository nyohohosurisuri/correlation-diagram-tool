(() => {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const STORAGE_KEY = "correlationDiagramToolState_v4";
  const PROJECT_META_KEY = "correlationDiagramToolProjectMeta_v1";
  const PNG_SCALE_KEY = "correlationDiagramToolPngScale_v1";
  const AUTO_SAVE_ENABLED_KEY = "correlationDiagramToolAutoSaveEnabled_v1";
  const IMAGE_ASSET_REF_PREFIX = "asset:";
  const HISTORY_LIMIT = 40;
  const AUTO_SAVE_INTERVAL_MS = 60000;
  const BOOT_PROJECT_LOAD_TIMEOUT_MS = 2500;
  const STATIC_PWA_MODE = isStaticPwaMode();
  const DOUBLE_TAP_TIMEOUT_MS = 520;
  const DOUBLE_TAP_DISTANCE_PX = 42;
  const LINK_LABEL_DEFAULT_BACKGROUND = "#ffffff";
  const LINK_LABEL_DEFAULT_BORDER = "#202329";
  const PNG_MAX_DIMENSION = 12000;
  const PNG_MAX_PIXELS = 64000000;
  const NODE_DEFAULT_WIDTH = 120;
  const NODE_DEFAULT_HEIGHT = 130;
  const TEXT_DEFAULT_WIDTH = 180;
  const SHAPE_DEFAULT_WIDTH = 120;
  const SHAPE_DEFAULT_HEIGHT = 90;
  const INSERTED_IMAGE_MAX_WIDTH = 360;
  const INSERTED_IMAGE_MAX_HEIGHT = 280;
  const LEGEND_DEFAULT_WIDTH = 260;
  const LEGEND_DEFAULT_FONT_SIZE = 14;
  const GROUP_MIN_WIDTH = 96;
  const GROUP_MIN_HEIGHT = 52;
  const GROUP_MAX_WIDTH = 1600;
  const GROUP_MAX_HEIGHT = 1200;
  const GROUP_TITLE_DEFAULT_FONT_SIZE = 15;
  const GROUP_TITLE_FONTS = [
    ["default", "既定", "\"Yu Gothic UI\", \"Hiragino Sans\", \"Meiryo\", system-ui, sans-serif"],
    ["gothic", "ゴシック", "\"Yu Gothic\", \"Yu Gothic UI\", \"Hiragino Kaku Gothic ProN\", \"Meiryo\", sans-serif"],
    ["mincho", "明朝", "\"Yu Mincho\", \"Hiragino Mincho ProN\", \"Noto Serif JP\", serif"],
    ["rounded", "丸ゴシック", "\"Hiragino Maru Gothic ProN\", \"Yu Gothic UI\", \"Meiryo\", sans-serif"],
    ["pop", "ポップ", "\"HGSoeiKakupoptai\", \"Yu Gothic UI\", \"Meiryo\", sans-serif"],
    ["mono", "等幅", "\"Consolas\", \"Menlo\", \"Yu Gothic UI\", monospace"]
  ];
  const GROUP_TITLE_FONT_IDS = new Set(GROUP_TITLE_FONTS.map(([id]) => id));
  const LINK_AVOID_PADDING = 16;
  const LINK_ROUTE_OUTER_PADDING = 80;
  const LINK_TERMINAL_STUB = 22;
  const LINK_ROUTE_CACHE_LIMIT = 1800;
  const PALETTE = [
    "#e53935",
    "#d81b60",
    "#8e24aa",
    "#5e35b1",
    "#3949ab",
    "#1e88e5",
    "#039be5",
    "#00acc1",
    "#00897b",
    "#43a047",
    "#7cb342",
    "#c0ca33",
    "#fdd835",
    "#f9a825",
    "#fb8c00",
    "#f4511e",
    "#f2b84b",
    "#e8795f",
    "#61a875",
    "#4c8fc1",
    "#8c72c7",
    "#d46fa6",
    "#6c7a89",
    "#2f6f68",
    "#111827",
    "#374151",
    "#6b7280",
    "#ffffff"
  ];
  const ANCHOR_OPTIONS = [
    ["auto", "自動"],
    ["top-left", "左上"],
    ["top-left-edge", "上左寄り"],
    ["top", "上"],
    ["top-right-edge", "上右寄り"],
    ["top-right", "右上"],
    ["right-top-edge", "右上寄り"],
    ["right", "右"],
    ["right-bottom-edge", "右下寄り"],
    ["bottom-right", "右下"],
    ["bottom-right-edge", "下右寄り"],
    ["bottom", "下"],
    ["bottom-left-edge", "下左寄り"],
    ["bottom-left", "左下"],
    ["left-bottom-edge", "左下寄り"],
    ["left", "左"],
    ["left-top-edge", "左上寄り"]
  ];
  const ANCHOR_KEYS = new Set(ANCHOR_OPTIONS.map(([key]) => key));
  const CUSTOM_ANCHOR_OPTION = "custom";
  const CUSTOM_ANCHOR_PREFIX = "custom:";
  const NODE_MARKS = [
    { id: "enemy", label: "敵", color: "#d94d3f" },
    { id: "dead", label: "死亡", color: "#30343a" },
    { id: "past", label: "過去", color: "#b8842e" },
    { id: "future", label: "未来", color: "#3478b8" },
    { id: "otherworld", label: "異世界", color: "#7b5db7" },
    { id: "skyworld", label: "神域", color: "#4f6edb" },
    { id: "dark", label: "闇の力", color: "#49385f" },
    { id: "light", label: "光の力", color: "#d9a51f" },
    { id: "transcendent", label: "超越者", color: "#7f5af0" },
    { id: "assigned-role", label: "役割を与えられた者", color: "#0f766e" }
  ];
  const NODE_MARK_IDS = new Set(NODE_MARKS.map((mark) => mark.id));
  const SHAPE_TYPES = [
    ["circle", "丸"],
    ["triangle", "三角"],
    ["rect", "四角"],
    ["arrow", "太い矢印"],
    ["star", "星"]
  ];
  const SHAPE_TYPE_IDS = new Set(SHAPE_TYPES.map(([id]) => id));
  const GRADIENT_DIRECTIONS = [
    ["horizontal", "左から右"],
    ["vertical", "上から下"],
    ["diagonal", "左上から右下"],
    ["reverse-diagonal", "右上から左下"]
  ];
  const GRADIENT_DIRECTION_IDS = new Set(GRADIENT_DIRECTIONS.map(([id]) => id));

  const svg = document.querySelector("#diagram");
  const statusText = document.querySelector("#statusText");
  const selectionList = document.querySelector("#selectionList");
  const inspectorContent = document.querySelector("#inspectorContent");
  const toolPanel = document.querySelector(".tool-panel");
  const toggleToolsBtn = document.querySelector("#toggleToolsBtn");
  const mobileToolButtons = [...document.querySelectorAll("[data-mobile-tool]")];
  const fileInput = document.querySelector("#fileInput");
  const imageInsertInput = document.querySelector("#imageInsertInput");
  const projectDialog = document.querySelector("#projectDialog");
  const projectDialogTitle = document.querySelector("#projectDialogTitle");
  const projectDialogContent = document.querySelector("#projectDialogContent");
  const projectCloseBtn = document.querySelector("#projectCloseBtn");
  const connectBtn = document.querySelector("#connectBtn");
  const alignHorizontalBtn = document.querySelector("#alignHorizontalBtn");
  const alignVerticalBtn = document.querySelector("#alignVerticalBtn");
  const alignSpacingInput = document.querySelector("#alignSpacingInput");
  const alignSpacingValue = document.querySelector("#alignSpacingValue");
  const alignHint = document.querySelector("#alignHint");
  const undoBtn = document.querySelector("#undoBtn");
  const redoBtn = document.querySelector("#redoBtn");
  const zoomLabel = document.querySelector("#zoomLabel");
  ensureCropEditorMarkup();
  const cropEditor = document.querySelector("#cropEditor");
  const cropStage = document.querySelector("#cropStage");
  const cropFrame = document.querySelector("#cropFrame");
  const cropImage = document.querySelector("#cropImage");
  const cropCancelBtn = document.querySelector("#cropCancelBtn");
  const cropApplyBtn = document.querySelector("#cropApplyBtn");
  const cropZoomOutBtn = document.querySelector("#cropZoomOutBtn");
  const cropZoomInBtn = document.querySelector("#cropZoomInBtn");
  const cropResetBtn = document.querySelector("#cropResetBtn");

  let state = createInitialState();
  let selected = null;
  let multiSelectedNodeIds = new Set();
  let inspectorOpen = false;
  let mode = "select";
  let pendingConnection = null;
  let drag = null;
  let workspacePointers = new Map();
  let workspacePinch = null;
  let lastTap = null;
  let history = [];
  let future = [];
  let changeTimer = 0;
  let storageTimer = 0;
  let autoSaveTimer = 0;
  let diagramRenderFrame = 0;
  let viewportRenderFrame = 0;
  let autoSaveInFlight = false;
  let lastAutoSaveSnapshot = "";
  let autoSaveEnabled = loadAutoSaveEnabled();
  let imageObjectUrlCache = new Map();
  let diagramRoot = null;
  let linkRouteCache = new Map();
  let cropSession = null;
  let projectStoreAvailable = null;
  let projectDialogMode = "load";
  let currentProjectId = "";
  let currentProjectTitle = "";
  let toolsCollapsed = localStorage.getItem("correlationDiagramToolToolsCollapsed_v1") === "true";

  boot();

  async function boot() {
    registerServiceWorker();
    document.body.dataset.toolsCollapsed = toolsCollapsed ? "true" : "false";
    updateToolsToggle();
    loadProjectMeta();
    const saved = loadFromStorage();
    const suppressInitialAutoSave = !saved;
    if (saved) {
      state = saved;
    }
    if (STATIC_PWA_MODE) {
      projectStoreAvailable = false;
      currentProjectId = "";
      currentProjectTitle = "";
      saveProjectMeta();
    } else {
      await restoreSavedProjectOnBoot();
    }
    pushHistory();
    installMobileGestureGuards();
    bindEvents();
    detectProjectStore();
    startAutoSave();
    requestAnimationFrame(() => {
      fitToContent(false);
      if (suppressInitialAutoSave && !currentProjectId) lastAutoSaveSnapshot = autoSaveStateSnapshot();
      render();
    });
  }

  function createInitialState() {
    return {
      nodes: [
        {
          id: uid("node"),
          name: "主人公",
          role: "中心人物",
          memo: "",
          x: 420,
          y: 240,
          w: NODE_DEFAULT_WIDTH,
          h: NODE_DEFAULT_HEIGHT,
          color: "#f2b84b",
          gradient: defaultGradient("#f2b84b"),
          marks: [],
          image: "",
          imageScale: 1,
          imageOffsetX: 0,
          imageOffsetY: 0
        },
        {
          id: uid("node"),
          name: "協力者",
          role: "味方",
          memo: "",
          x: 175,
          y: 140,
          w: NODE_DEFAULT_WIDTH,
          h: NODE_DEFAULT_HEIGHT,
          color: "#61a875",
          gradient: defaultGradient("#61a875"),
          marks: [],
          image: "",
          imageScale: 1,
          imageOffsetX: 0,
          imageOffsetY: 0
        },
        {
          id: uid("node"),
          name: "ライバル",
          role: "競争相手",
          memo: "",
          x: 660,
          y: 155,
          w: NODE_DEFAULT_WIDTH,
          h: NODE_DEFAULT_HEIGHT,
          color: "#e8795f",
          gradient: defaultGradient("#e8795f"),
          marks: [],
          image: "",
          imageScale: 1,
          imageOffsetX: 0,
          imageOffsetY: 0
        },
        {
          id: uid("node"),
          name: "組織",
          role: "所属先",
          memo: "",
          x: 420,
          y: 430,
          w: NODE_DEFAULT_WIDTH,
          h: NODE_DEFAULT_HEIGHT,
          color: "#4c8fc1",
          gradient: defaultGradient("#4c8fc1"),
          marks: [],
          image: "",
          imageScale: 1,
          imageOffsetX: 0,
          imageOffsetY: 0
        }
      ],
      links: [],
      groups: [
        {
          id: uid("group"),
          title: "チーム",
          x: 110,
          y: 85,
          w: 300,
          h: 210,
          color: "#61a875",
          gradient: defaultGradient("#61a875"),
          titleFontSize: GROUP_TITLE_DEFAULT_FONT_SIZE,
          titleFontFamily: "default"
        }
      ],
      texts: [],
      shapes: [],
      legends: [],
      images: [],
      imageAssets: [],
      viewport: {
        x: 0,
        y: 0,
        scale: 1
      }
    };
  }

  function createBlankState() {
    return {
      nodes: [],
      links: [],
      groups: [],
      texts: [],
      shapes: [],
      legends: [],
      images: [],
      imageAssets: [],
      viewport: {
        x: 0,
        y: 0,
        scale: 1
      }
    };
  }

  function bindEvents() {
    toggleToolsBtn?.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleToolsPanel();
    });

    mobileToolButtons.forEach((button) => {
      button.addEventListener("click", () => toggleMobileToolPanel(button.dataset.mobileTool || "none"));
    });

    document.querySelector("#addNodeBtn").addEventListener("click", () => {
      const center = screenCenterWorld();
      const node = {
        id: uid("node"),
        name: `人物${state.nodes.length + 1}`,
        role: "",
        memo: "",
        x: center.x - NODE_DEFAULT_WIDTH / 2,
        y: center.y - NODE_DEFAULT_HEIGHT / 2,
        w: NODE_DEFAULT_WIDTH,
        h: NODE_DEFAULT_HEIGHT,
        color: PALETTE[state.nodes.length % PALETTE.length],
        gradient: defaultGradient(PALETTE[state.nodes.length % PALETTE.length]),
        marks: [],
        image: "",
        imageScale: 1,
        imageOffsetX: 0,
        imageOffsetY: 0
      };
      state.nodes.push(node);
      selected = { type: "node", id: node.id };
      inspectorOpen = true;
      commitChange();
      render();
    });

    connectBtn.addEventListener("click", () => {
      mode = mode === "connect" ? "select" : "connect";
      pendingConnection = null;
      updateStatus();
      render();
    });

    document.querySelector("#addGroupBtn").addEventListener("click", () => {
      const center = screenCenterWorld();
      const group = {
        id: uid("group"),
        title: `グループ${state.groups.length + 1}`,
        x: center.x - 150,
        y: center.y - 100,
        w: 300,
        h: 200,
        color: PALETTE[(state.groups.length + 2) % PALETTE.length],
        gradient: defaultGradient(PALETTE[(state.groups.length + 2) % PALETTE.length]),
        titleFontSize: GROUP_TITLE_DEFAULT_FONT_SIZE,
        titleFontFamily: "default"
      };
      state.groups.push(group);
      selected = { type: "group", id: group.id };
      inspectorOpen = true;
      commitChange();
      render();
    });

    document.querySelector("#addTextBtn").addEventListener("click", () => {
      const center = screenCenterWorld();
      const textItem = {
        id: uid("text"),
        content: "テキスト",
        x: center.x - TEXT_DEFAULT_WIDTH / 2,
        y: center.y,
        w: TEXT_DEFAULT_WIDTH,
        fontSize: 20,
        color: "#202329",
        align: "left",
        backgroundColor: "",
        borderColor: "",
        borderWidth: 1
      };
      state.texts.push(textItem);
      selected = { type: "text", id: textItem.id };
      inspectorOpen = true;
      mode = "select";
      pendingConnection = null;
      commitChange();
      render();
    });

    document.querySelector("#addShapeBtn").addEventListener("click", () => {
      const center = screenCenterWorld();
      const shape = {
        id: uid("shape"),
        type: "rect",
        x: center.x - SHAPE_DEFAULT_WIDTH / 2,
        y: center.y - SHAPE_DEFAULT_HEIGHT / 2,
        w: SHAPE_DEFAULT_WIDTH,
        h: SHAPE_DEFAULT_HEIGHT,
        rotation: 0,
        fill: "#ffffff",
        stroke: "#202329",
        strokeWidth: 2,
        opacity: 1
      };
      state.shapes.push(shape);
      selected = { type: "shape", id: shape.id };
      inspectorOpen = true;
      mode = "select";
      pendingConnection = null;
      commitChange();
      render();
    });

    document.querySelector("#addLegendBtn").addEventListener("click", () => {
      const center = screenCenterWorld();
      const legend = createDefaultLegend(center);
      state.legends.push(legend);
      selected = { type: "legend", id: legend.id };
      inspectorOpen = true;
      mode = "select";
      pendingConnection = null;
      commitChange();
      render();
    });

    document.querySelector("#addImageBtn").addEventListener("click", () => {
      imageInsertInput.value = "";
      imageInsertInput.click();
    });

    document.querySelector("#zoomOutBtn").addEventListener("click", () => zoomBy(0.85));
    document.querySelector("#zoomInBtn").addEventListener("click", () => zoomBy(1.18));
    document.querySelector("#fitBtn").addEventListener("click", () => {
      fitToContent(true);
      render();
    });
    alignHorizontalBtn?.addEventListener("click", () => alignSelectedNodes("horizontal"));
    alignVerticalBtn?.addEventListener("click", () => alignSelectedNodes("vertical"));
    alignSpacingInput?.addEventListener("input", () => updateAlignControls());
    document.querySelector("#centerBtn").addEventListener("click", () => {
      centerViewport();
      render();
    });

    document.querySelector("#clearBtn").addEventListener("click", () => {
      if (!window.confirm("相関図を全削除します。")) return;
      state.nodes = [];
      state.links = [];
      state.groups = [];
      state.texts = [];
      state.shapes = [];
      state.legends = [];
      state.images = [];
      state.imageAssets = [];
      selected = null;
      multiSelectedNodeIds.clear();
      inspectorOpen = false;
      mode = "select";
      pendingConnection = null;
      commitChange();
      render();
    });

    document.querySelector("#newBtn").addEventListener("click", createNewProject);
    document.querySelector("#saveBtn").addEventListener("click", openSaveDialog);
    document.querySelector("#loadBtn").addEventListener("click", openLoadDialog);
    document.querySelector("#pngBtn").addEventListener("click", openPngDialog);

    fileInput.addEventListener("change", loadJson);
    imageInsertInput.addEventListener("change", insertUploadedImage);
    projectCloseBtn.addEventListener("click", closeProjectDialog);
    projectDialog.addEventListener("click", (event) => {
      if (event.target === projectDialog) closeProjectDialog();
    });
    undoBtn.addEventListener("click", undo);
    redoBtn.addEventListener("click", redo);

    cropCancelBtn.addEventListener("click", closeCropEditor);
    cropApplyBtn.addEventListener("click", applyCropEditor);
    cropZoomOutBtn.addEventListener("click", () => zoomCrop(0.9));
    cropZoomInBtn.addEventListener("click", () => zoomCrop(1.1));
    cropResetBtn.addEventListener("click", resetCropEditor);
    cropFrame.addEventListener("pointerdown", onCropPointerDown);
    cropFrame.addEventListener("pointermove", onCropPointerMove);
    cropFrame.addEventListener("pointerup", onCropPointerUp);
    cropFrame.addEventListener("pointercancel", onCropPointerUp);
    cropFrame.addEventListener("wheel", onCropWheel, { passive: false });

    svg.addEventListener("pointerdown", onPointerDown);
    svg.addEventListener("pointermove", onPointerMove);
    svg.addEventListener("pointerup", onPointerUp);
    svg.addEventListener("pointercancel", onPointerUp);
    svg.addEventListener("wheel", onWheel, { passive: false });

    document.querySelector(".inspector")?.addEventListener("pointerdown", resetWorkspaceGesture);
    window.addEventListener("pointerup", onGlobalPointerRelease);
    window.addEventListener("pointercancel", onGlobalPointerRelease);
    window.addEventListener("blur", resetWorkspaceGesture);
    window.addEventListener("beforeunload", () => {
      saveToStorage(true);
      stopAutoSave();
      revokeImageObjectUrls();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) resetWorkspaceGesture();
    });

    svg.addEventListener("keydown", (event) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        deleteSelected();
      }
      if (event.key === "Escape") {
        if (cropSession) {
          closeCropEditor();
          return;
        }
        mode = "select";
        pendingConnection = null;
        selected = null;
        multiSelectedNodeIds.clear();
        inspectorOpen = false;
        render();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
      }
    });

    window.addEventListener("resize", () => {
      render();
      renderCropEditor();
    });
  }

  function installMobileGestureGuards() {
    ["gesturestart", "gesturechange", "gestureend"].forEach((type) => {
      document.addEventListener(type, (event) => {
        event.preventDefault();
      }, { passive: false });
    });

    document.addEventListener("touchmove", (event) => {
      if (event.touches?.length > 1) event.preventDefault();
    }, { passive: false });
  }

  function toggleToolsPanel() {
    toolsCollapsed = !toolsCollapsed;
    localStorage.setItem("correlationDiagramToolToolsCollapsed_v1", toolsCollapsed ? "true" : "false");
    render();
  }

  function updateToolsToggle() {
    if (!toggleToolsBtn) return;
    toggleToolsBtn.textContent = toolsCollapsed ? "›" : "‹";
    toggleToolsBtn.setAttribute("aria-label", toolsCollapsed ? "左パネルを開く" : "左パネルを閉じる");
    toggleToolsBtn.setAttribute("aria-pressed", toolsCollapsed ? "true" : "false");
    toggleToolsBtn.title = toolsCollapsed ? "左パネルを開く" : "左パネルを閉じる";
  }

  function toggleMobileToolPanel(panel) {
    if (!toolPanel) return;
    const next = toolPanel.dataset.mobilePanel === panel ? "none" : panel;
    toolPanel.dataset.mobilePanel = next;
    updateMobileToolPanel();
  }

  function closeMobileToolPanel() {
    if (!toolPanel) return;
    toolPanel.dataset.mobilePanel = "none";
    updateMobileToolPanel();
  }

  function updateMobileToolPanel() {
    if (!toolPanel) return;
    const current = toolPanel.dataset.mobilePanel || "none";
    mobileToolButtons.forEach((button) => {
      const active = button.dataset.mobileTool === current;
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function render() {
    cancelScheduledRenders();
    const currentSelection = selected ? getSelectedItem() : null;
    document.body.dataset.selection = currentSelection ? selected.type : "none";
    document.body.dataset.mode = mode;
    document.body.dataset.inspectorOpen = inspectorOpen || mode === "connect" ? "true" : "false";
    document.body.dataset.toolsCollapsed = toolsCollapsed ? "true" : "false";
    renderDiagram();
    renderSelectionList();
    renderInspector();
    updateStatus();
    updateAlignControls();
    updateMobileToolPanel();
    updateToolsToggle();
  }

  function renderDiagram() {
    cancelScheduledRenders();
    connectBtn.setAttribute("aria-pressed", mode === "connect" ? "true" : "false");
    zoomLabel.value = `${Math.round(state.viewport.scale * 100)}%`;
    undoBtn.disabled = history.length <= 1;
    redoBtn.disabled = future.length === 0;

    svg.replaceChildren();
    const defs = createSvg("defs");
    appendArrowMarkers(defs, state.links);
    appendObjectGradients(defs);
    svg.appendChild(defs);

    const root = createSvg("g", {
      "data-diagram-root": "true",
      transform: `translate(${state.viewport.x} ${state.viewport.y}) scale(${state.viewport.scale})`
    });
    diagramRoot = root;
    svg.appendChild(root);

    const linkLabelLayer = createSvg("g", { "data-layer": "link-labels" });
    state.groups.forEach((group) => root.appendChild(renderGroup(group)));
    state.links.forEach((link) => appendLinkWithLiftedLabel(root, linkLabelLayer, link));
    if (drag?.type === "connect") root.appendChild(renderConnectionPreview(drag));
    root.appendChild(linkLabelLayer);
    state.nodes.forEach((node) => root.appendChild(renderNode(node)));
    state.shapes.forEach((shape) => root.appendChild(renderShape(shape)));
    state.images.forEach((imageItem) => root.appendChild(renderInsertedImage(imageItem)));
    state.legends.forEach((legend) => root.appendChild(renderLegend(legend)));
    state.texts.forEach((textItem) => root.appendChild(renderTextItem(textItem)));
    state.groups.forEach((group) => {
      const handle = renderGroupResizeHandle(group);
      if (handle) root.appendChild(handle);
    });
    appendSelectedLinkAnchorHandles(root);
  }

  function appendLinkWithLiftedLabel(root, labelLayer, link) {
    const linkGroup = renderLink(link);
    linkGroup.querySelectorAll("[data-type='link-label']").forEach((label) => {
      labelLayer.appendChild(label);
    });
    root.appendChild(linkGroup);
  }

  function cancelScheduledRenders() {
    if (diagramRenderFrame) {
      window.cancelAnimationFrame(diagramRenderFrame);
      diagramRenderFrame = 0;
    }
    if (viewportRenderFrame) {
      window.cancelAnimationFrame(viewportRenderFrame);
      viewportRenderFrame = 0;
    }
  }

  function requestDiagramRender() {
    if (diagramRenderFrame) return;
    if (viewportRenderFrame) {
      window.cancelAnimationFrame(viewportRenderFrame);
      viewportRenderFrame = 0;
    }
    diagramRenderFrame = window.requestAnimationFrame(() => {
      diagramRenderFrame = 0;
      renderDiagram();
    });
  }

  function requestViewportRender() {
    if (diagramRenderFrame || viewportRenderFrame) return;
    viewportRenderFrame = window.requestAnimationFrame(() => {
      viewportRenderFrame = 0;
      if (!updateViewportTransformOnly()) renderDiagram();
    });
  }

  function updateViewportTransformOnly() {
    if (!diagramRoot?.isConnected) {
      diagramRoot = svg.querySelector("[data-diagram-root='true']");
    }
    if (!diagramRoot) return false;
    diagramRoot.setAttribute("transform", `translate(${state.viewport.x} ${state.viewport.y}) scale(${state.viewport.scale})`);
    zoomLabel.value = `${Math.round(state.viewport.scale * 100)}%`;
    return true;
  }

  function appendArrowMarkers(defs, links) {
    const colors = new Set(["#202329"]);
    links.forEach((link) => colors.add(link.color || "#202329"));
    colors.forEach((color) => {
      const marker = createSvg("marker", {
        id: arrowMarkerId(color),
        viewBox: "0 0 10 10",
        refX: 8.5,
        refY: 5,
        markerWidth: 7,
        markerHeight: 7,
        orient: "auto-start-reverse"
      });
      marker.appendChild(createSvg("path", {
        d: "M 0 0 L 10 5 L 0 10 z",
        fill: color
      }));
      defs.appendChild(marker);
    });
  }

  function appendObjectGradients(defs) {
    state.nodes.forEach((node) => {
      appendObjectGradient(defs, node, "node", 1);
      appendObjectGradient(defs, node, "node-bg", 0.08);
    });
    state.groups.forEach((group) => {
      appendObjectGradient(defs, group, "group", 1);
      appendObjectGradient(defs, group, "group-bg", 0.13);
    });
  }

  function appendRasterImage(parent, source, attrs) {
    const href = resolveImageSource(source);
    if (!href) return;
    parent.appendChild(createSvg("image", {
      ...attrs,
      href
    }));
  }

  function appendObjectGradient(defs, item, kind, opacity = 1) {
    const gradient = normalizeGradient(item.gradient, item.color || PALETTE[0]);
    if (!gradient.enabled) return;
    const [start, end] = gradientVector(gradient.direction);
    const linearGradient = createSvg("linearGradient", {
      id: objectGradientId(item, kind, opacity),
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y
    });
    linearGradient.appendChild(createSvg("stop", {
      offset: "0%",
      "stop-color": item.color || PALETTE[0],
      "stop-opacity": opacity
    }));
    linearGradient.appendChild(createSvg("stop", {
      offset: "100%",
      "stop-color": gradient.color,
      "stop-opacity": opacity
    }));
    defs.appendChild(linearGradient);
  }

  function objectGradientFill(item, kind, opacity = 1) {
    const gradient = normalizeGradient(item.gradient, item.color || PALETTE[0]);
    if (gradient.enabled) return `url(#${objectGradientId(item, kind, opacity)})`;
    return opacity >= 1 ? item.color || PALETTE[0] : hexToRgba(item.color || PALETTE[0], opacity);
  }

  function objectGradientId(item, kind, opacity = 1) {
    const safeId = String(item.id || "item").replace(/[^a-zA-Z0-9_-]/g, "");
    const safeKind = String(kind || "gradient").replace(/[^a-zA-Z0-9_-]/g, "");
    const safeOpacity = String(Math.round((Number(opacity) || 1) * 1000));
    return `gradient_${safeKind}_${safeId}_${safeOpacity}`;
  }

  function imageAssetRef(id) {
    return `${IMAGE_ASSET_REF_PREFIX}${id}`;
  }

  function isImageAssetRef(value) {
    return typeof value === "string" && value.startsWith(IMAGE_ASSET_REF_PREFIX);
  }

  function imageAssetIdFromRef(value) {
    return isImageAssetRef(value) ? value.slice(IMAGE_ASSET_REF_PREFIX.length) : "";
  }

  function getImageAsset(id) {
    return (state.imageAssets || []).find((asset) => asset.id === id) || null;
  }

  function getImageAssetFromRef(value) {
    const id = imageAssetIdFromRef(value);
    return id ? getImageAsset(id) : null;
  }

  function resolveImageSource(value) {
    if (!value) return "";
    const asset = getImageAssetFromRef(value);
    if (asset?.data) return imageAssetObjectUrl(asset);
    return isImageAssetRef(value) ? "" : value;
  }

  function imageAssetObjectUrl(asset) {
    const cached = imageObjectUrlCache.get(asset.id);
    if (cached?.data === asset.data) return cached.url;
    if (cached?.url) URL.revokeObjectURL(cached.url);
    const url = dataUrlToObjectUrl(asset.data);
    imageObjectUrlCache.set(asset.id, { data: asset.data, url });
    return url;
  }

  function dataUrlToObjectUrl(dataUrl) {
    try {
      const [header, body] = String(dataUrl).split(",");
      if (!header || !body) return dataUrl;
      const mimeMatch = header.match(/^data:([^;]+);base64$/);
      if (!mimeMatch) return dataUrl;
      const binary = atob(body);
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }
      return URL.createObjectURL(new Blob([bytes], { type: mimeMatch[1] }));
    } catch {
      return dataUrl;
    }
  }

  function revokeImageObjectUrls() {
    imageObjectUrlCache.forEach((entry) => {
      if (entry?.url?.startsWith("blob:")) URL.revokeObjectURL(entry.url);
    });
    imageObjectUrlCache = new Map();
  }

  function storeImageAsset(data, naturalWidth = 0, naturalHeight = 0) {
    if (!data) return "";
    return addImageAssetToState(state, data, naturalWidth, naturalHeight);
  }

  function addImageAssetToState(targetState, data, naturalWidth = 0, naturalHeight = 0, preferredId = "") {
    if (!data) return "";
    if (!Array.isArray(targetState.imageAssets)) targetState.imageAssets = [];
    const existing = targetState.imageAssets.find((asset) => asset.data === data);
    if (existing) {
      if (!existing.naturalWidth && naturalWidth) existing.naturalWidth = Math.max(0, Number(naturalWidth) || 0);
      if (!existing.naturalHeight && naturalHeight) existing.naturalHeight = Math.max(0, Number(naturalHeight) || 0);
      return imageAssetRef(existing.id);
    }
    let id = preferredId || uid("asset");
    while (targetState.imageAssets.some((asset) => asset.id === id)) id = uid("asset");
    const asset = {
      id,
      data,
      naturalWidth: Math.max(0, Number(naturalWidth) || 0),
      naturalHeight: Math.max(0, Number(naturalHeight) || 0)
    };
    targetState.imageAssets.push(asset);
    return imageAssetRef(asset.id);
  }

  function migrateEmbeddedImagesToAssets(targetState) {
    if (!targetState) return;
    if (!Array.isArray(targetState.imageAssets)) targetState.imageAssets = [];
    (targetState.nodes || []).forEach((node) => {
      node.image = normalizeImageReference(targetState, node.image, node.imageNaturalWidth, node.imageNaturalHeight);
    });
    (targetState.images || []).forEach((imageItem) => {
      imageItem.src = normalizeImageReference(targetState, imageItem.src, imageItem.naturalWidth, imageItem.naturalHeight);
    });
  }

  function normalizeImageReference(targetState, value, naturalWidth = 0, naturalHeight = 0) {
    if (typeof value !== "string" || !value) return "";
    if (isImageAssetRef(value)) {
      return targetState.imageAssets.some((asset) => asset.id === imageAssetIdFromRef(value)) ? value : "";
    }
    if (value.startsWith("data:image/")) {
      return addImageAssetToState(targetState, value, naturalWidth, naturalHeight);
    }
    return value;
  }

  function usedImageAssetIds(sourceState = state) {
    const ids = new Set();
    (sourceState.nodes || []).forEach((node) => {
      const id = imageAssetIdFromRef(node.image);
      if (id) ids.add(id);
    });
    (sourceState.images || []).forEach((imageItem) => {
      const id = imageAssetIdFromRef(imageItem.src);
      if (id) ids.add(id);
    });
    return ids;
  }

  function gradientVector(direction) {
    if (direction === "vertical") return [{ x: "0%", y: "0%" }, { x: "0%", y: "100%" }];
    if (direction === "diagonal") return [{ x: "0%", y: "0%" }, { x: "100%", y: "100%" }];
    if (direction === "reverse-diagonal") return [{ x: "100%", y: "0%" }, { x: "0%", y: "100%" }];
    return [{ x: "0%", y: "0%" }, { x: "100%", y: "0%" }];
  }

  function arrowMarkerUrl(link) {
    return `url(#${arrowMarkerId(link.color || "#202329")})`;
  }

  function arrowMarkerId(color) {
    const safe = String(color || "#202329").replace(/[^a-zA-Z0-9_-]/g, "");
    return `arrow_${safe || "202329"}`;
  }

  function renderGroup(group) {
    const active = isSelected("group", group.id);
    const titleFontSize = normalizeGroupTitleFontSize(group.titleFontSize);
    const g = createSvg("g", {
      "data-type": "group",
      "data-id": group.id,
      class: "node-handle"
    });
    g.appendChild(createSvg("rect", {
      x: group.x,
      y: group.y,
      width: group.w,
      height: group.h,
      rx: 8,
      fill: objectGradientFill(group, "group-bg", 0.13),
      stroke: active ? "#202329" : objectGradientFill(group, "group"),
      "stroke-width": active ? 3 : 2,
      "stroke-dasharray": "8 6"
    }));
    g.appendChild(createSvg("text", {
      x: group.x + 12,
      y: group.y + 12 + titleFontSize * 0.82,
      fill: group.color,
      "font-size": titleFontSize,
      "font-family": groupTitleFontFamily(group.titleFontFamily),
      "font-weight": 700
    }, group.title || "グループ"));
    return g;
  }

  function renderGroupResizeHandle(group) {
    if (!isSelected("group", group.id)) return null;
    const handleX = group.x + group.w - 24;
    const handleY = group.y + group.h - 24;
    const g = createSvg("g", {
      "data-type": "group-resize",
      "data-id": group.id,
      class: "resize-handle-layer"
    });
    g.appendChild(createSvg("rect", {
      x: group.x + group.w - 42,
      y: group.y + group.h - 42,
      width: 42,
      height: 42,
      fill: "transparent",
      "pointer-events": "all",
      "data-type": "group-resize",
      "data-id": group.id,
      class: "resize-hit"
    }));
    g.appendChild(createSvg("rect", {
      x: handleX,
      y: handleY,
      width: 24,
      height: 24,
      rx: 4,
      fill: "#ffffff",
      stroke: "#202329",
      "stroke-width": 2,
      "data-type": "group-resize",
      "data-id": group.id,
      class: "resize-handle"
    }));
    g.appendChild(createSvg("path", {
      d: `M ${group.x + group.w - 18} ${group.y + group.h - 5} L ${group.x + group.w - 5} ${group.y + group.h - 18}`,
      stroke: "#202329",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "pointer-events": "none"
    }));
    return g;
  }

  function renderNode(node) {
    const active = isSelected("node", node.id) || multiSelectedNodeIds.has(node.id);
    const {
      nameLines,
      roleLines,
      roleBandHeight,
      nameBandHeight,
      roleFontSize,
      roleLineGap,
      roleBlockHeight,
      nameFontSize,
      nameLineGap,
      nameBlockHeight
    } = nodeFrameMetrics(node);
    const imageY = node.y + roleBandHeight;
    const imageHeight = Math.max(30, node.h - roleBandHeight - nameBandHeight);
    const imageBox = { x: node.x, y: imageY, w: node.w, h: imageHeight };
    const imageDraw = computeImageDraw(node, imageBox);
    const corner = 8;
    const g = createSvg("g", {
      "data-type": "node",
      "data-id": node.id,
      class: "node-handle"
    });
    g.appendChild(createSvg("rect", {
      x: node.x,
      y: node.y,
      width: node.w,
      height: node.h,
      rx: 8,
      fill: "#ffffff",
      stroke: active ? "#202329" : objectGradientFill(node, "node"),
      "stroke-width": active ? 3 : 2,
      style: "filter: drop-shadow(0 7px 12px rgba(31, 38, 43, 0.12))"
    }));

    g.appendChild(createSvg("path", {
      d: roundedTopPath(node.x, node.y, node.w, roleBandHeight, corner),
      fill: objectGradientFill(node, "node")
    }));

    g.appendChild(createSvg("path", {
      d: roundedBottomPath(node.x, node.y + node.h - nameBandHeight, node.w, nameBandHeight, corner),
      fill: objectGradientFill(node, "node")
    }));

    const nodeImageSrc = resolveImageSource(node.image);
    if (nodeImageSrc) {
      const clipId = `clip_${node.id}`;
      const clip = createSvg("clipPath", { id: clipId });
      clip.appendChild(createSvg("rect", {
        x: imageBox.x,
        y: imageBox.y,
        width: imageBox.w,
        height: imageBox.h
      }));
      g.appendChild(clip);
      appendRasterImage(g, node.image, {
        x: imageDraw.x,
        y: imageDraw.y,
        width: imageDraw.w,
        height: imageDraw.h,
        "clip-path": `url(#${clipId})`,
        preserveAspectRatio: imageDraw.preserveAspectRatio || "none"
      });
    } else {
      g.appendChild(createSvg("rect", {
        x: node.x,
        y: imageY,
        width: node.w,
        height: imageHeight,
        fill: objectGradientFill(node, "node-bg", 0.08)
      }));
      g.appendChild(createSvg("text", {
        x: node.x + node.w / 2,
        y: imageY + imageHeight / 2 + 1,
        fill: node.color,
        "font-size": 26,
        "font-weight": 700,
        "text-anchor": "middle",
        "dominant-baseline": "middle"
      }, "？"));
    }

    renderNodeMarks(node, imageBox).forEach((mark) => g.appendChild(mark));

    const roleFirstY = node.y + (roleBandHeight - roleBlockHeight) / 2 + roleFontSize * 0.82;
    const roleText = createSvg("text", {
      x: node.x + node.w / 2,
      y: roleFirstY,
      "font-size": roleFontSize,
      "font-weight": 700,
      "text-anchor": "middle",
      ...nodeLabelTextAttrs(node, "role")
    });
    roleLines.forEach((line, index) => {
      roleText.appendChild(createSvg("tspan", {
        x: node.x + node.w / 2,
        dy: index === 0 ? 0 : roleLineGap
      }, line));
    });
    g.appendChild(roleText);

    const nameBandTop = node.y + node.h - nameBandHeight;
    const firstY = nameBandTop + (nameBandHeight - nameBlockHeight) / 2 + nameFontSize * 0.82;
    const nameText = createSvg("text", {
      x: node.x + node.w / 2,
      y: firstY,
      "font-size": nameFontSize,
      "font-weight": 700,
      "text-anchor": "middle",
      ...nodeLabelTextAttrs(node, "name")
    });
    nameLines.forEach((line, index) => {
      nameText.appendChild(createSvg("tspan", {
        x: node.x + node.w / 2,
        dy: index === 0 ? 0 : nameLineGap
      }, line));
    });
    g.appendChild(nameText);

    if (active) {
      g.appendChild(createSvg("circle", {
        cx: node.x + node.w,
        cy: node.y,
        r: 5,
        fill: "#202329"
      }));
    }
    return g;
  }

  function renderNodeMarks(node, imageBox) {
    const marks = normalizeNodeMarks(node.marks);
    const size = marks.length > 6 ? 12 : 16;
    const gap = marks.length > 6 ? 2 : 3;
    const maxCount = Math.max(0, Math.floor((imageBox.w - 8 + gap) / (size + gap)));
    return marks.slice(0, maxCount).map((markId, index) => {
      const mark = NODE_MARKS.find((candidate) => candidate.id === markId);
      if (!mark) return null;
      const x = imageBox.x + 4 + index * (size + gap);
      const y = imageBox.y + 4;
      return renderNodeMarkBadge(mark, x, y, size);
    }).filter(Boolean);
  }

  function nodeLabelTextAttrs(node, kind) {
    const color = kind === "role" ? node.roleTextColor : node.nameTextColor;
    const outlineColor = kind === "role" ? node.roleOutlineColor : node.nameOutlineColor;
    const outlineWidth = normalizeNodeOutlineWidth(kind === "role" ? node.roleOutlineWidth : node.nameOutlineWidth);
    return {
      fill: color || "#ffffff",
      "paint-order": outlineWidth > 0 ? "stroke" : "",
      stroke: outlineWidth > 0 ? outlineColor || "#202329" : "",
      "stroke-width": outlineWidth,
      "stroke-linejoin": "round"
    };
  }

  function normalizeNodeOutlineWidth(value) {
    if (value === undefined || value === null || value === "") return 1;
    return clamp(Number(value) || 0, 0, 8);
  }

  function renderNodeMarkBadge(mark, x, y, size) {
    const scale = size / 16;
    const px = (value) => x + value * scale;
    const py = (value) => y + value * scale;
    const sw = (value) => value * scale;
    const g = createSvg("g", {
      class: "node-mark",
      "aria-label": mark.label,
      "pointer-events": "none"
    });
    g.appendChild(createSvg("circle", {
      cx: x + size / 2,
      cy: y + size / 2,
      r: size / 2,
      fill: mark.color,
      stroke: "#ffffff",
      "stroke-width": sw(1.5)
    }));

    if (mark.id === "enemy") {
      g.appendChild(createSvg("path", {
        d: `M ${px(4.2)} ${py(4.2)} L ${px(11.8)} ${py(11.8)} M ${px(11.8)} ${py(4.2)} L ${px(4.2)} ${py(11.8)}`,
        stroke: "#ffffff",
        "stroke-width": sw(2),
        "stroke-linecap": "round"
      }));
    }
    if (mark.id === "dead") {
      g.appendChild(createSvg("path", {
        d: `M ${px(8)} ${py(3.6)} L ${px(8)} ${py(12.6)} M ${px(5)} ${py(6.2)} L ${px(11)} ${py(6.2)}`,
        stroke: "#ffffff",
        "stroke-width": sw(2.1),
        "stroke-linecap": "round"
      }));
    }
    if (mark.id === "past") {
      g.appendChild(createSvg("path", {
        d: `M ${px(5)} ${py(3.8)} L ${px(11)} ${py(3.8)} M ${px(5)} ${py(12.2)} L ${px(11)} ${py(12.2)} M ${px(5.8)} ${py(4.5)} C ${px(6.2)} ${py(7)} ${px(9.8)} ${py(7)} ${px(10.2)} ${py(4.5)} M ${px(5.8)} ${py(11.5)} C ${px(6.2)} ${py(9)} ${px(9.8)} ${py(9)} ${px(10.2)} ${py(11.5)}`,
        fill: "none",
        stroke: "#ffffff",
        "stroke-width": sw(1.55),
        "stroke-linecap": "round"
      }));
    }
    if (mark.id === "future") {
      g.appendChild(createSvg("path", {
        d: `M ${px(4)} ${py(8)} L ${px(11.2)} ${py(8)} M ${px(8.4)} ${py(4.7)} L ${px(11.6)} ${py(8)} L ${px(8.4)} ${py(11.3)}`,
        fill: "none",
        stroke: "#ffffff",
        "stroke-width": sw(2),
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }));
    }
    if (mark.id === "otherworld") {
      g.appendChild(createSvg("ellipse", {
        cx: px(7.7),
        cy: py(8),
        rx: sw(4.2),
        ry: sw(5.4),
        fill: "none",
        stroke: "#ffffff",
        "stroke-width": sw(1.7)
      }));
      g.appendChild(createSvg("path", {
        d: `M ${px(11.8)} ${py(3.6)} L ${px(12.6)} ${py(5.3)} L ${px(14.2)} ${py(6.1)} L ${px(12.6)} ${py(6.9)} L ${px(11.8)} ${py(8.6)} L ${px(11)} ${py(6.9)} L ${px(9.4)} ${py(6.1)} L ${px(11)} ${py(5.3)} Z`,
        fill: "#ffffff"
      }));
    }
    if (mark.id === "skyworld") {
      g.appendChild(createSvg("path", {
        d: `M ${px(3.1)} ${py(4.2)} L ${px(12.9)} ${py(4.2)} M ${px(3.9)} ${py(5.9)} L ${px(12.1)} ${py(5.9)} M ${px(4.6)} ${py(12.5)} L ${px(11.4)} ${py(12.5)} M ${px(5.2)} ${py(5.9)} L ${px(5.2)} ${py(12.2)} M ${px(10.8)} ${py(5.9)} L ${px(10.8)} ${py(12.2)} M ${px(6.4)} ${py(7.5)} L ${px(9.6)} ${py(7.5)} M ${px(7.1)} ${py(7.5)} L ${px(7.1)} ${py(10.7)} M ${px(8.9)} ${py(7.5)} L ${px(8.9)} ${py(10.7)}`,
        fill: "none",
        stroke: "#ffffff",
        "stroke-width": sw(1.55),
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }));
      g.appendChild(createSvg("path", {
        d: `M ${px(8)} ${py(2.2)} L ${px(8.4)} ${py(3.1)} L ${px(9.3)} ${py(3.5)} L ${px(8.4)} ${py(3.9)} L ${px(8)} ${py(4.8)} L ${px(7.6)} ${py(3.9)} L ${px(6.7)} ${py(3.5)} L ${px(7.6)} ${py(3.1)} Z`,
        fill: "#ffffff"
      }));
    }
    if (mark.id === "dark") {
      g.appendChild(createSvg("path", {
        d: `M ${px(10.4)} ${py(3.6)} C ${px(7)} ${py(4.1)} ${px(5)} ${py(6.5)} ${px(5)} ${py(9)} C ${px(5)} ${py(11.5)} ${px(7.1)} ${py(13)} ${px(10.2)} ${py(12.4)} C ${px(8.7)} ${py(11.5)} ${px(7.9)} ${py(10.2)} ${px(7.9)} ${py(8.7)} C ${px(7.9)} ${py(6.7)} ${px(8.7)} ${py(5)} ${px(10.4)} ${py(3.6)} Z`,
        fill: "#ffffff"
      }));
      g.appendChild(createSvg("path", {
        d: `M ${px(11.8)} ${py(5.2)} L ${px(12.3)} ${py(6.2)} L ${px(13.3)} ${py(6.7)} L ${px(12.3)} ${py(7.2)} L ${px(11.8)} ${py(8.2)} L ${px(11.3)} ${py(7.2)} L ${px(10.3)} ${py(6.7)} L ${px(11.3)} ${py(6.2)} Z`,
        fill: "#ffffff"
      }));
    }
    if (mark.id === "light") {
      g.appendChild(createSvg("path", {
        d: `M ${px(8)} ${py(2.7)} L ${px(8.9)} ${py(6.2)} L ${px(12.2)} ${py(4.4)} L ${px(10.4)} ${py(7.6)} L ${px(14)} ${py(8)} L ${px(10.4)} ${py(8.8)} L ${px(12.1)} ${py(12.1)} L ${px(8.8)} ${py(10.1)} L ${px(8)} ${py(13.7)} L ${px(7.2)} ${py(10.1)} L ${px(3.9)} ${py(12.1)} L ${px(5.6)} ${py(8.8)} L ${px(2)} ${py(8)} L ${px(5.6)} ${py(7.6)} L ${px(3.8)} ${py(4.4)} L ${px(7.1)} ${py(6.2)} Z`,
        fill: "#ffffff",
        "stroke-linejoin": "round"
      }));
    }
    if (mark.id === "transcendent") {
      g.appendChild(createSvg("ellipse", {
        cx: px(8),
        cy: py(4.2),
        rx: sw(3.6),
        ry: sw(1.35),
        fill: "none",
        stroke: "#ffffff",
        "stroke-width": sw(1.35)
      }));
      g.appendChild(createSvg("path", {
        d: `M ${px(8)} ${py(5.9)} L ${px(8.8)} ${py(7.5)} L ${px(10.6)} ${py(7.8)} L ${px(9.3)} ${py(9.1)} L ${px(9.6)} ${py(10.9)} L ${px(8)} ${py(10)} L ${px(6.4)} ${py(10.9)} L ${px(6.7)} ${py(9.1)} L ${px(5.4)} ${py(7.8)} L ${px(7.2)} ${py(7.5)} Z`,
        fill: "#ffffff",
        "stroke-linejoin": "round"
      }));
      g.appendChild(createSvg("path", {
        d: `M ${px(4.3)} ${py(12.2)} C ${px(5.8)} ${py(13.3)} ${px(10.2)} ${py(13.3)} ${px(11.7)} ${py(12.2)}`,
        fill: "none",
        stroke: "#ffffff",
        "stroke-width": sw(1.35),
        "stroke-linecap": "round"
      }));
    }
    if (mark.id === "assigned-role") {
      g.appendChild(createSvg("circle", {
        cx: px(5.4),
        cy: py(6.4),
        r: sw(2.1),
        fill: "none",
        stroke: "#ffffff",
        "stroke-width": sw(1.65)
      }));
      g.appendChild(createSvg("path", {
        d: `M ${px(7)} ${py(8)} L ${px(12.5)} ${py(13.5)} M ${px(9.7)} ${py(10.8)} L ${px(11.5)} ${py(9)} M ${px(11.1)} ${py(12.2)} L ${px(12.9)} ${py(10.4)}`,
        fill: "none",
        stroke: "#ffffff",
        "stroke-width": sw(1.65),
        "stroke-linecap": "round",
        "stroke-linejoin": "round"
      }));
      g.appendChild(createSvg("path", {
        d: `M ${px(10.3)} ${py(2.9)} L ${px(10.8)} ${py(4.1)} L ${px(12)} ${py(4.6)} L ${px(10.8)} ${py(5.1)} L ${px(10.3)} ${py(6.3)} L ${px(9.8)} ${py(5.1)} L ${px(8.6)} ${py(4.6)} L ${px(9.8)} ${py(4.1)} Z`,
        fill: "#ffffff"
      }));
    }
    return g;
  }

  function renderTextItem(textItem) {
    const active = isSelected("text", textItem.id);
    const lines = wrapTextLines(textItem.content || "テキスト", textItem.w, textItem.fontSize);
    const lineHeight = textItem.fontSize * 1.32;
    const height = Math.max(textItem.fontSize, lines.length * lineHeight);
    const align = ["left", "center", "right"].includes(textItem.align) ? textItem.align : "left";
    const textX = align === "center"
      ? textItem.x + textItem.w / 2
      : align === "right"
        ? textItem.x + textItem.w
        : textItem.x;
    const box = {
      x: textItem.x - 6,
      y: textItem.y - 6,
      width: textItem.w + 12,
      height: height + 12
    };
    const g = createSvg("g", {
      "data-type": "text",
      "data-id": textItem.id,
      class: "text-handle"
    });
    g.appendChild(createSvg("rect", {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
      rx: 5,
      fill: textItem.backgroundColor || "transparent",
      stroke: textItem.borderColor || "transparent",
      "stroke-width": textItem.borderColor ? clamp(Number(textItem.borderWidth) || 1, 1, 10) : 0,
      "pointer-events": "all"
    }));
    if (active) {
      g.appendChild(createSvg("rect", {
        x: box.x - 2,
        y: box.y - 2,
        width: box.width + 4,
        height: box.height + 4,
        rx: 6,
        fill: "rgba(20, 125, 114, 0.08)",
        stroke: "#147d72",
        "stroke-width": 1.5,
        "stroke-dasharray": "5 4",
        "pointer-events": "none"
      }));
    }
    const text = createSvg("text", {
      x: textX,
      y: textItem.y + textItem.fontSize,
      fill: textItem.color || "#202329",
      "font-size": textItem.fontSize,
      "font-weight": textItem.bold ? 700 : 500,
      "text-anchor": align === "center" ? "middle" : align === "right" ? "end" : "start",
      "paint-order": textItem.outline ? "stroke" : "",
      stroke: textItem.outline ? "#ffffff" : "",
      "stroke-width": textItem.outline ? 4 : 0,
      "stroke-linejoin": "round",
      "pointer-events": "none"
    });
    lines.forEach((line, index) => {
      text.appendChild(createSvg("tspan", {
        x: textX,
        dy: index === 0 ? 0 : lineHeight
      }, line || " "));
    });
    g.appendChild(text);
    return g;
  }

  function renderShape(shape) {
    const active = isSelected("shape", shape.id);
    const g = createSvg("g", {
      "data-type": "shape",
      "data-id": shape.id,
      class: "shape-handle"
    });
    const cx = shape.x + shape.w / 2;
    const cy = shape.y + shape.h / 2;
    const common = {
      fill: shape.fill || "transparent",
      stroke: shape.stroke || "transparent",
      "stroke-width": clamp(Number(shape.strokeWidth) || 0, 0, 24),
      "stroke-linejoin": "round",
      opacity: clamp(Number(shape.opacity) || 1, 0.05, 1),
      "pointer-events": "all"
    };
    const transform = Number(shape.rotation)
      ? `rotate(${Number(shape.rotation) || 0} ${cx} ${cy})`
      : undefined;

    g.appendChild(createSvg("rect", {
      x: shape.x,
      y: shape.y,
      width: shape.w,
      height: shape.h,
      fill: "transparent",
      stroke: "transparent",
      "pointer-events": "all"
    }));

    if (shape.type === "circle") {
      g.appendChild(createSvg("ellipse", {
        cx,
        cy,
        rx: Math.max(1, shape.w / 2),
        ry: Math.max(1, shape.h / 2),
        transform,
        ...common
      }));
    } else if (shape.type === "triangle") {
      g.appendChild(createSvg("polygon", {
        points: `${cx},${shape.y} ${shape.x + shape.w},${shape.y + shape.h} ${shape.x},${shape.y + shape.h}`,
        transform,
        ...common
      }));
    } else if (shape.type === "arrow") {
      g.appendChild(createSvg("path", {
        d: thickArrowPath(shape),
        transform,
        ...common
      }));
    } else if (shape.type === "star") {
      g.appendChild(createSvg("polygon", {
        points: starPoints(cx, cy, shape.w, shape.h),
        transform,
        ...common
      }));
    } else {
      g.appendChild(createSvg("rect", {
        x: shape.x,
        y: shape.y,
        width: shape.w,
        height: shape.h,
        rx: 0,
        transform,
        ...common
      }));
    }

    if (active) {
      g.appendChild(createSvg("rect", {
        x: shape.x - 3,
        y: shape.y - 3,
        width: shape.w + 6,
        height: shape.h + 6,
        rx: 4,
        fill: "rgba(20, 125, 114, 0.08)",
        stroke: "#147d72",
        "stroke-width": 1.5,
        "stroke-dasharray": "5 4",
        "pointer-events": "none"
      }));
    }
    return g;
  }

  function renderInsertedImage(imageItem) {
    const active = isSelected("image", imageItem.id);
    const g = createSvg("g", {
      "data-type": "image",
      "data-id": imageItem.id,
      class: "image-handle"
    });
    appendRasterImage(g, imageItem.src, {
      x: imageItem.x,
      y: imageItem.y,
      width: imageItem.w,
      height: imageItem.h,
      opacity: clamp(Number(imageItem.opacity) || 1, 0.05, 1),
      preserveAspectRatio: "none",
      "pointer-events": "all"
    });
    if (imageItem.borderColor) {
      g.appendChild(createSvg("rect", {
        x: imageItem.x,
        y: imageItem.y,
        width: imageItem.w,
        height: imageItem.h,
        fill: "transparent",
        stroke: imageItem.borderColor,
        "stroke-width": clamp(Number(imageItem.borderWidth) || 1, 1, 24),
        "pointer-events": "none"
      }));
    }
    if (active) {
      g.appendChild(createSvg("rect", {
        x: imageItem.x - 3,
        y: imageItem.y - 3,
        width: imageItem.w + 6,
        height: imageItem.h + 6,
        rx: 4,
        fill: "rgba(20, 125, 114, 0.08)",
        stroke: "#147d72",
        "stroke-width": 1.5,
        "stroke-dasharray": "5 4",
        "pointer-events": "none"
      }));
    }
    return g;
  }

  function renderLegend(legend) {
    const active = isSelected("legend", legend.id);
    const metrics = legendMetrics(legend);
    const g = createSvg("g", {
      "data-type": "legend",
      "data-id": legend.id,
      class: "legend-handle"
    });
    g.appendChild(createSvg("rect", {
      x: legend.x,
      y: legend.y,
      width: legend.w,
      height: metrics.height,
      rx: 7,
      fill: legend.backgroundColor || "#ffffff",
      stroke: active ? "#202329" : legend.borderColor || "#d8ded8",
      "stroke-width": active ? 2.5 : 1.5,
      "pointer-events": "all",
      style: "filter: drop-shadow(0 8px 18px rgba(31, 38, 43, 0.10))"
    }));
    g.appendChild(createSvg("text", {
      x: legend.x + 12,
      y: legend.y + 20,
      fill: legend.color || "#202329",
      "font-size": 14,
      "font-weight": 800,
      "pointer-events": "none"
    }, legend.title || "属性マーク凡例"));
    g.appendChild(createSvg("line", {
      x1: legend.x + 10,
      y1: legend.y + 30,
      x2: legend.x + legend.w - 10,
      y2: legend.y + 30,
      stroke: hexToRgba(legend.borderColor || "#d8ded8", 0.9),
      "stroke-width": 1,
      "pointer-events": "none"
    }));

    if (!metrics.rows.length) {
      g.appendChild(createSvg("text", {
        x: legend.x + 12,
        y: legend.y + 54,
        fill: "#626a73",
        "font-size": 12,
        "font-weight": 600,
        "pointer-events": "none"
      }, "表示する項目なし"));
      return g;
    }

    metrics.rows.forEach((row) => {
      g.appendChild(renderNodeMarkBadge(row.mark, legend.x + 12, row.y + 3, metrics.markSize));
      const text = createSvg("text", {
        x: legend.x + 12 + metrics.markSize + 10,
        y: row.y + metrics.fontSize,
        fill: legend.color || "#202329",
        "font-size": metrics.fontSize,
        "font-weight": 650,
        "pointer-events": "none"
      });
      row.lines.forEach((line, index) => {
        text.appendChild(createSvg("tspan", {
          x: legend.x + 12 + metrics.markSize + 10,
          dy: index === 0 ? 0 : metrics.lineHeight
        }, line || " "));
      });
      g.appendChild(text);
    });
    return g;
  }

  function thickArrowPath(shape) {
    const x = shape.x;
    const y = shape.y;
    const w = shape.w;
    const h = shape.h;
    return [
      `M ${x} ${y + h * 0.32}`,
      `L ${x + w * 0.62} ${y + h * 0.32}`,
      `L ${x + w * 0.62} ${y + h * 0.12}`,
      `L ${x + w} ${y + h * 0.5}`,
      `L ${x + w * 0.62} ${y + h * 0.88}`,
      `L ${x + w * 0.62} ${y + h * 0.68}`,
      `L ${x} ${y + h * 0.68}`,
      "Z"
    ].join(" ");
  }

  function starPoints(cx, cy, width, height) {
    const outer = Math.max(1, Math.min(width, height) / 2);
    const inner = outer * 0.43;
    const points = [];
    for (let i = 0; i < 10; i += 1) {
      const radius = i % 2 === 0 ? outer : inner;
      const angle = -Math.PI / 2 + i * Math.PI / 5;
      points.push(`${cx + Math.cos(angle) * radius},${cy + Math.sin(angle) * radius}`);
    }
    return points.join(" ");
  }

  function createDefaultLegend(center) {
    return {
      id: uid("legend"),
      title: "属性マーク凡例",
      x: center.x - LEGEND_DEFAULT_WIDTH / 2,
      y: center.y - 90,
      w: LEGEND_DEFAULT_WIDTH,
      fontSize: LEGEND_DEFAULT_FONT_SIZE,
      color: "#202329",
      backgroundColor: "#ffffff",
      borderColor: "#d8ded8",
      items: NODE_MARKS.map((mark) => ({
        markId: mark.id,
        text: mark.label,
        visible: true
      }))
    };
  }

  function legendMetrics(legend) {
    const fontSize = clamp(Number(legend.fontSize) || LEGEND_DEFAULT_FONT_SIZE, 9, 28);
    const lineHeight = fontSize * 1.25;
    const markSize = clamp(fontSize + 5, 14, 28);
    const textWidth = Math.max(28, (Number(legend.w) || LEGEND_DEFAULT_WIDTH) - markSize - 34);
    let cursorY = legend.y + 38;
    const rows = normalizeLegendItems(legend.items)
      .filter((item) => item.visible)
      .map((item) => {
        const mark = NODE_MARKS.find((candidate) => candidate.id === item.markId);
        if (!mark) return null;
        const lines = wrapTextLines(item.text || mark.label, textWidth, fontSize);
        const rowHeight = Math.max(markSize + 6, lines.length * lineHeight + 7);
        const row = {
          mark,
          lines,
          y: cursorY,
          height: rowHeight
        };
        cursorY += rowHeight;
        return row;
      })
      .filter(Boolean);
    const height = Math.max(58, cursorY - legend.y + 8);
    return {
      fontSize,
      lineHeight,
      markSize,
      rows,
      height
    };
  }

  function renderLink(link) {
    const fromEndpoints = getLinkEndpointEntries(link, "from");
    const toEndpoints = getLinkEndpointEntries(link, "to");
    if (!fromEndpoints.length || !toEndpoints.length) return createSvg("g");

    const active = isSelected("link", link.id);
    const g = createSvg("g", {
      "data-type": "link",
      "data-id": link.id
    });

    const route = link.route || "orthogonal";
    if (route === "straight") {
      renderStraightLink(g, link, fromEndpoints, toEndpoints, active);
      return g;
    }
    if (route === "curve" && fromEndpoints.length === 1 && toEndpoints.length === 1) {
      renderCurveLink(g, link, fromEndpoints[0], toEndpoints[0], active);
      return g;
    }

    renderOrthogonalLink(g, link, fromEndpoints, toEndpoints, active);
    return g;
  }

  function renderStraightLink(g, link, fromEndpoints, toEndpoints, active) {
    const labelPoints = [];
    fromEndpoints.forEach((fromEndpoint) => {
      toEndpoints.forEach((toEndpoint) => {
        if (fromEndpoint.id === toEndpoint.id) return;
        const start = attachmentPoint(fromEndpoint.item, fromEndpoint.id, link, "from", toEndpoint.center);
        const end = attachmentPoint(toEndpoint.item, toEndpoint.id, link, "to", fromEndpoint.center);
        appendLinkPath(g, link, `M ${start.x} ${start.y} L ${end.x} ${end.y}`, active, {
          markerEnd: link.type === "bidirectional" || link.type === "arrow",
          markerStart: link.type === "bidirectional"
        });
        labelPoints.push(pointOnPolyline([start, end], normalizedLinkLabelPosition(link)));
      });
    });
    if (labelPoints.length) appendLinkLabel(g, link, averagePoint(labelPoints));
  }

  function renderCurveLink(g, link, fromEndpoint, toEndpoint, active) {
    const start = attachmentPoint(fromEndpoint.item, fromEndpoint.id, link, "from", toEndpoint.center);
    const end = attachmentPoint(toEndpoint.item, toEndpoint.id, link, "to", fromEndpoint.center);
    const midpointPoint = midpoint(start, end);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    const curve = Math.min(70, Math.max(28, length * 0.14));
    const normal = { x: -dy / length, y: dx / length };
    const control = {
      x: midpointPoint.x + normal.x * curve + normalizedLinkRouteOffsetX(link),
      y: midpointPoint.y + normal.y * curve + normalizedLinkRouteOffsetY(link)
    };
    const obstacles = linkNodeObstacles(new Set([fromEndpoint.id, toEndpoint.id]));
    if (quadraticCurveIntersectsObstacles(start, control, end, obstacles)) {
      renderOrthogonalLink(g, link, [fromEndpoint], [toEndpoint], active);
      return;
    }
    const pathData = `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}`;
    appendLinkPath(g, link, pathData, active, {
      markerEnd: link.type === "bidirectional" || link.type === "arrow",
      markerStart: link.type === "bidirectional"
    });
    appendLinkLabel(g, link, quadraticPoint(start, control, end, normalizedLinkLabelPosition(link)));
    if (active) appendLinkRouteHandle(g, link, control);
  }

  function renderOrthogonalLink(g, link, fromEndpoints, toEndpoints, active) {
    if (fromEndpoints.length === 1 && toEndpoints.length === 1) {
      renderSingleOrthogonalLink(g, link, fromEndpoints[0], toEndpoints[0], active);
      return;
    }

    const fromCenter = averagePoint(fromEndpoints.map((endpoint) => endpoint.center));
    const toCenter = averagePoint(toEndpoints.map((endpoint) => endpoint.center));
    const useHorizontalTrunk = Math.abs(toCenter.x - fromCenter.x) >= Math.abs(toCenter.y - fromCenter.y);
    const nodeObstacles = linkNodeObstacles();
    const allBranches = [];
    let trunkPath = "";
    let labelPoint;
    let routeHandlePoint;
    let trunkPoints = [];
    const terminalHandles = [];

    if (useHorizontalTrunk) {
      const estimatedYs = [...fromEndpoints, ...toEndpoints].map((endpoint) => endpoint.center.y);
      const trunkX = chooseTrunkCoordinate(
        "vertical",
        (fromCenter.x + toCenter.x) / 2,
        Math.min(...estimatedYs),
        Math.max(...estimatedYs),
        nodeObstacles
      ) + normalizedLinkRouteOffsetX(link);
      const sourceBranches = fromEndpoints.map((endpoint) => {
        let join = { x: trunkX, y: endpoint.center.y };
        const anchor = attachmentPoint(endpoint.item, endpoint.id, link, "from", join);
        const terminal = linkTerminalStubPoint(link, "from", endpoint.id, endpoint.item, anchor);
        if (terminal) terminalHandles.push({ point: terminal.point, side: "from", endpointId: endpoint.id, axis: terminal.axis });
        join = { x: trunkX, y: (terminal?.point || anchor).y };
        return {
          anchor,
          join,
          side: "from",
          endpointId: endpoint.id,
          terminal,
          obstacles: nodeObstacles
        };
      });
      const targetBranches = toEndpoints.map((endpoint) => {
        let join = { x: trunkX, y: endpoint.center.y };
        const anchor = attachmentPoint(endpoint.item, endpoint.id, link, "to", join);
        const terminal = linkTerminalStubPoint(link, "to", endpoint.id, endpoint.item, anchor);
        if (terminal) terminalHandles.push({ point: terminal.point, side: "to", endpointId: endpoint.id, axis: terminal.axis });
        join = { x: trunkX, y: (terminal?.point || anchor).y };
        return {
          start: join,
          join,
          anchor,
          side: "to",
          endpointId: endpoint.id,
          terminal,
          obstacles: nodeObstacles
        };
      });
      const ys = [...sourceBranches, ...targetBranches].map((branch) => branch.join.y);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      trunkPath = `M ${trunkX} ${minY} L ${trunkX} ${maxY}`;
      trunkPoints = [{ x: trunkX, y: minY }, { x: trunkX, y: maxY }];
      labelPoint = pointOnPolyline(trunkPoints, normalizedLinkLabelPosition(link));
      routeHandlePoint = pointOnPolyline(trunkPoints, 0.5);
      sourceBranches.forEach((branch) => {
        const points = orthogonalBranchPoints(branch.anchor, branch.join, "horizontal", "from", branch.obstacles, { start: branch.terminal });
        allBranches.push({
          d: polylinePath(points),
          points,
          side: branch.side,
          endpointId: branch.endpointId,
          terminal: branch.terminal,
          markerStart: link.type === "bidirectional",
          markerEnd: false
        });
      });
      targetBranches.forEach((branch) => {
        const points = orthogonalBranchPoints(branch.join, branch.anchor, "horizontal", "to", branch.obstacles, { end: branch.terminal });
        allBranches.push({
          d: polylinePath(points),
          points,
          side: branch.side,
          endpointId: branch.endpointId,
          terminal: branch.terminal,
          markerStart: false,
          markerEnd: link.type === "bidirectional" || link.type === "arrow"
        });
      });
    } else {
      const estimatedXs = [...fromEndpoints, ...toEndpoints].map((endpoint) => endpoint.center.x);
      const trunkY = chooseTrunkCoordinate(
        "horizontal",
        (fromCenter.y + toCenter.y) / 2,
        Math.min(...estimatedXs),
        Math.max(...estimatedXs),
        nodeObstacles
      ) + normalizedLinkRouteOffsetY(link);
      const sourceBranches = fromEndpoints.map((endpoint) => {
        let join = { x: endpoint.center.x, y: trunkY };
        const anchor = attachmentPoint(endpoint.item, endpoint.id, link, "from", join);
        const terminal = linkTerminalStubPoint(link, "from", endpoint.id, endpoint.item, anchor);
        if (terminal) terminalHandles.push({ point: terminal.point, side: "from", endpointId: endpoint.id, axis: terminal.axis });
        join = { x: (terminal?.point || anchor).x, y: trunkY };
        return {
          anchor,
          join,
          side: "from",
          endpointId: endpoint.id,
          terminal,
          obstacles: nodeObstacles
        };
      });
      const targetBranches = toEndpoints.map((endpoint) => {
        let join = { x: endpoint.center.x, y: trunkY };
        const anchor = attachmentPoint(endpoint.item, endpoint.id, link, "to", join);
        const terminal = linkTerminalStubPoint(link, "to", endpoint.id, endpoint.item, anchor);
        if (terminal) terminalHandles.push({ point: terminal.point, side: "to", endpointId: endpoint.id, axis: terminal.axis });
        join = { x: (terminal?.point || anchor).x, y: trunkY };
        return {
          start: join,
          join,
          anchor,
          side: "to",
          endpointId: endpoint.id,
          terminal,
          obstacles: nodeObstacles
        };
      });
      const xs = [...sourceBranches, ...targetBranches].map((branch) => branch.join.x);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      trunkPath = `M ${minX} ${trunkY} L ${maxX} ${trunkY}`;
      trunkPoints = [{ x: minX, y: trunkY }, { x: maxX, y: trunkY }];
      labelPoint = pointOnPolyline(trunkPoints, normalizedLinkLabelPosition(link));
      routeHandlePoint = pointOnPolyline(trunkPoints, 0.5);
      sourceBranches.forEach((branch) => {
        const points = orthogonalBranchPoints(branch.anchor, branch.join, "vertical", "from", branch.obstacles, { start: branch.terminal });
        allBranches.push({
          d: polylinePath(points),
          points,
          side: branch.side,
          endpointId: branch.endpointId,
          terminal: branch.terminal,
          markerStart: link.type === "bidirectional",
          markerEnd: false
        });
      });
      targetBranches.forEach((branch) => {
        const points = orthogonalBranchPoints(branch.join, branch.anchor, "vertical", "to", branch.obstacles, { end: branch.terminal });
        allBranches.push({
          d: polylinePath(points),
          points,
          side: branch.side,
          endpointId: branch.endpointId,
          terminal: branch.terminal,
          markerStart: false,
          markerEnd: link.type === "bidirectional" || link.type === "arrow"
        });
      });
    }

    appendLinkPath(g, link, trunkPath, active, { lineCap: "butt" });
    allBranches.forEach((branch) => {
      appendLinkPath(g, link, branch.d, active, { ...branch, lineCap: "butt" });
    });
    if (active) {
      appendLinkSegmentHandles(g, link, trunkPoints);
      allBranches.forEach((branch) => {
        appendLinkSegmentHandles(g, link, branch.points || []);
        appendLinkTerminalSegmentHandle(g, link, branch.points || [], branch.terminal, branch.side, branch.endpointId);
      });
    }
    appendLinkLabel(g, link, labelPoint);
    if (active && routeHandlePoint) appendLinkRouteHandle(g, link, routeHandlePoint, useHorizontalTrunk ? "vertical" : "horizontal");
    if (active) {
      terminalHandles.forEach((handle) => {
        appendLinkTerminalHandle(g, link, handle.point, handle.side, handle.endpointId, handle.axis);
      });
    }
  }

  function renderSingleOrthogonalLink(g, link, fromEndpoint, toEndpoint, active) {
    if (fromEndpoint.id === toEndpoint.id) return;
    const geometry = singleOrthogonalGeometry(link, fromEndpoint, toEndpoint);
    const points = geometry.points;
    appendLinkPath(g, link, polylinePath(points), active, {
      markerStart: link.type === "bidirectional",
      markerEnd: link.type === "bidirectional" || link.type === "arrow",
      lineCap: "butt"
    });
    appendLinkLabel(g, link, pointOnPolyline(points, normalizedLinkLabelPosition(link)));
    if (active) appendLinkRouteHandle(g, link, pointOnPolyline(points, 0.5));
    if (active) {
      appendLinkSegmentHandles(g, link, points);
      appendLinkTerminalSegmentHandle(g, link, points, geometry.startTerminal, "from", fromEndpoint.id);
      appendLinkTerminalSegmentHandle(g, link, points, geometry.endTerminal, "to", toEndpoint.id);
    }
    if (active && geometry.startTerminal) appendLinkTerminalHandle(g, link, geometry.startTerminal.point, "from", fromEndpoint.id, geometry.startTerminal.axis);
    if (active && geometry.endTerminal) appendLinkTerminalHandle(g, link, geometry.endTerminal.point, "to", toEndpoint.id, geometry.endTerminal.axis);
  }

  function appendLinkPath(g, link, pathData, active, markers) {
    const visible = createSvg("path", {
      d: pathData,
      fill: "none",
      stroke: link.color || "#202329",
      "stroke-width": active ? Number(link.width || 1.5) + 1.5 : link.width || 1.5,
      "stroke-linecap": markers.lineCap || "round",
      "stroke-linejoin": "miter",
      "stroke-dasharray": link.type === "dashed" ? "9 8" : "",
      "marker-end": markers.markerEnd ? arrowMarkerUrl(link) : "",
      "marker-start": markers.markerStart ? arrowMarkerUrl(link) : ""
    });
    g.appendChild(visible);

    const hit = createSvg("path", {
      d: pathData,
      fill: "none",
      stroke: "transparent",
      "stroke-width": 26,
      "stroke-linecap": "round"
    });
    g.appendChild(hit);
  }

  function appendLinkLabel(g, link, point) {
    if (link.label) {
      const labelPoint = linkLabelDisplayPoint(link, point);
      const lines = linkLabelLines(link.label);
      const metrics = linkLabelMetrics(lines);
      const labelBackgroundColor = linkLabelPaintColor(normalizeLinkLabelBackgroundColor(link.labelBackgroundColor));
      const labelBorderColor = linkLabelPaintColor(normalizeLinkLabelBorderColor(link.labelBorderColor));
      const labelGroup = createSvg("g", {
        "data-type": "link-label",
        "data-id": link.id,
        class: "link-label"
      });
      labelGroup.appendChild(createSvg("rect", {
        x: labelPoint.x - metrics.width / 2,
        y: labelPoint.y - metrics.height / 2,
        width: metrics.width,
        height: metrics.height,
        rx: 4,
        fill: labelBackgroundColor || "transparent",
        stroke: labelBorderColor || "transparent",
        "stroke-width": labelBorderColor ? normalizeLinkLabelBorderWidth(link.labelBorderWidth) : 0,
        "pointer-events": "all"
      }));
      const text = createSvg("text", {
        x: labelPoint.x,
        y: labelPoint.y - metrics.textHeight / 2 + 10.5,
        fill: link.labelColor || link.color || "#202329",
        "font-size": 13,
        "font-weight": 700,
        "text-anchor": "middle",
        "paint-order": "stroke",
        stroke: "#ffffff",
        "stroke-width": 5,
        "stroke-linejoin": "round",
        "pointer-events": "none"
      });
      lines.forEach((line, index) => {
        text.appendChild(createSvg("tspan", {
          x: labelPoint.x,
          dy: index === 0 ? 0 : metrics.lineHeight
        }, line || " "));
      });
      labelGroup.appendChild(text);
      g.appendChild(labelGroup);
    }
  }

  function appendLinkRouteHandle(g, link, point, axis = "") {
    const handle = createSvg("g", {
      "data-type": "link-route",
      "data-id": link.id,
      "data-axis": axis,
      class: "link-route-handle"
    });
    handle.appendChild(createSvg("circle", {
      cx: point.x,
      cy: point.y,
      r: 18,
      fill: "transparent",
      "pointer-events": "all"
    }));
    handle.appendChild(createSvg("circle", {
      cx: point.x,
      cy: point.y,
      r: 7,
      fill: "#ffffff",
      stroke: "#202329",
      "stroke-width": 2,
      "pointer-events": "none"
    }));
    handle.appendChild(createSvg("circle", {
      cx: point.x,
      cy: point.y,
      r: 3,
      fill: link.color || "#202329",
      "pointer-events": "none"
    }));
    g.appendChild(handle);
  }

  function appendLinkSegmentHandles(g, link, points) {
    for (let index = 1; index < points.length; index += 1) {
      appendLinkRouteSegmentHandle(g, link, points[index - 1], points[index]);
    }
  }

  function appendLinkRouteSegmentHandle(g, link, start, end) {
    const axis = segmentAxis(start, end);
    if (!axis || distance(start, end) < 20) return;
    const point = midpoint(start, end);
    const handle = createSvg("g", {
      "data-type": "link-route",
      "data-id": link.id,
      "data-axis": axis,
      class: "link-route-handle link-segment-handle"
    });
    handle.appendChild(createSvg("path", {
      d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
      fill: "none",
      stroke: "transparent",
      "stroke-width": 30,
      "stroke-linecap": "round",
      "pointer-events": "stroke"
    }));
    handle.appendChild(createSvg("rect", {
      x: point.x - 7,
      y: point.y - 7,
      width: 14,
      height: 14,
      rx: 3,
      fill: "#ffffff",
      stroke: "#202329",
      "stroke-width": 1.5,
      "pointer-events": "none"
    }));
    handle.appendChild(createSvg("path", {
      d: axis === "horizontal"
        ? `M ${point.x} ${point.y - 4} L ${point.x} ${point.y + 4}`
        : `M ${point.x - 4} ${point.y} L ${point.x + 4} ${point.y}`,
      stroke: link.color || "#202329",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "pointer-events": "none"
    }));
    g.appendChild(handle);
  }

  function appendLinkTerminalSegmentHandle(g, link, points, terminal, side, endpointId) {
    if (!terminal) return;
    for (let index = 1; index < points.length; index += 1) {
      const start = points[index - 1];
      const end = points[index];
      const axis = segmentAxis(start, end);
      if (!axis) continue;
      const terminalMovesSegment = (terminal.axis === "vertical" && axis === "horizontal")
        || (terminal.axis === "horizontal" && axis === "vertical");
      if (!terminalMovesSegment || !pointIsOnSegment(terminal.point, start, end)) continue;
      const point = midpoint(start, end);
      const handle = createSvg("g", {
        "data-type": "link-terminal",
        "data-id": link.id,
        "data-side": side,
        "data-endpoint-id": endpointId,
        "data-axis": terminal.axis,
        class: "link-terminal-handle link-segment-handle"
      });
      handle.appendChild(createSvg("path", {
        d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`,
        fill: "none",
        stroke: "transparent",
        "stroke-width": 34,
        "stroke-linecap": "round",
        "pointer-events": "stroke"
      }));
      handle.appendChild(createSvg("rect", {
        x: point.x - 7,
        y: point.y - 7,
        width: 14,
        height: 14,
        rx: 3,
        fill: "#ffffff",
        stroke: link.color || "#202329",
        "stroke-width": 1.8,
        "pointer-events": "none"
      }));
      handle.appendChild(createSvg("path", {
        d: terminal.axis === "vertical"
          ? `M ${point.x} ${point.y - 4} L ${point.x} ${point.y + 4}`
          : `M ${point.x - 4} ${point.y} L ${point.x + 4} ${point.y}`,
        stroke: "#202329",
        "stroke-width": 2,
        "stroke-linecap": "round",
        "pointer-events": "none"
      }));
      g.appendChild(handle);
      return;
    }
  }

  function appendLinkTerminalHandle(g, link, point, side, endpointId, axis) {
    const handle = createSvg("g", {
      "data-type": "link-terminal",
      "data-id": link.id,
      "data-side": side,
      "data-endpoint-id": endpointId,
      "data-axis": axis,
      class: "link-terminal-handle"
    });
    handle.appendChild(createSvg("circle", {
      cx: point.x,
      cy: point.y,
      r: 16,
      fill: "transparent",
      "pointer-events": "all"
    }));
    handle.appendChild(createSvg("circle", {
      cx: point.x,
      cy: point.y,
      r: 6,
      fill: "#ffffff",
      stroke: link.color || "#202329",
      "stroke-width": 2,
      "pointer-events": "none"
    }));
    if (axis === "horizontal") {
      handle.appendChild(createSvg("path", {
        d: `M ${point.x - 9} ${point.y} L ${point.x + 9} ${point.y}`,
        stroke: "#202329",
        "stroke-width": 2,
        "stroke-linecap": "round",
        "pointer-events": "none"
      }));
    } else {
      handle.appendChild(createSvg("path", {
        d: `M ${point.x} ${point.y - 9} L ${point.x} ${point.y + 9}`,
        stroke: "#202329",
        "stroke-width": 2,
        "stroke-linecap": "round",
        "pointer-events": "none"
      }));
    }
    g.appendChild(handle);
  }

  function appendSelectedLinkAnchorHandles(root) {
    if (selected?.type !== "link") return;
    const link = getLink(selected.id);
    if (!link) return;
    const fromEndpoints = getLinkEndpointEntries(link, "from");
    const toEndpoints = getLinkEndpointEntries(link, "to");
    if (!fromEndpoints.length || !toEndpoints.length) return;
    const fromCenter = averagePoint(fromEndpoints.map((endpoint) => endpoint.center));
    const toCenter = averagePoint(toEndpoints.map((endpoint) => endpoint.center));
    const layer = createSvg("g", { "data-layer": "link-anchors" });
    fromEndpoints.forEach((endpoint) => {
      appendLinkAnchorHandle(layer, link, attachmentPoint(endpoint.item, endpoint.id, link, "from", toCenter), "from", endpoint.id);
    });
    toEndpoints.forEach((endpoint) => {
      appendLinkAnchorHandle(layer, link, attachmentPoint(endpoint.item, endpoint.id, link, "to", fromCenter), "to", endpoint.id);
    });
    root.appendChild(layer);
  }

  function appendLinkAnchorHandle(g, link, point, side, endpointId) {
    const handle = createSvg("g", {
      "data-type": "link-anchor",
      "data-id": link.id,
      "data-side": side,
      "data-endpoint-id": endpointId,
      class: "link-anchor-handle"
    });
    handle.appendChild(createSvg("circle", {
      cx: point.x,
      cy: point.y,
      r: 18,
      fill: "transparent",
      "pointer-events": "all"
    }));
    handle.appendChild(createSvg("circle", {
      cx: point.x,
      cy: point.y,
      r: 7,
      fill: "#ffffff",
      stroke: link.color || "#202329",
      "stroke-width": 2,
      "pointer-events": "none"
    }));
    handle.appendChild(createSvg("path", {
      d: `M ${point.x - 4.5} ${point.y} L ${point.x + 4.5} ${point.y} M ${point.x} ${point.y - 4.5} L ${point.x} ${point.y + 4.5}`,
      stroke: link.color || "#202329",
      "stroke-width": 1.8,
      "stroke-linecap": "round",
      "pointer-events": "none"
    }));
    g.appendChild(handle);
  }

  function linkLabelDisplayPoint(link, point) {
    return {
      x: point.x + normalizedLinkLabelOffsetX(link),
      y: point.y + normalizedLinkLabelOffsetY(link)
    };
  }

  function linkLabelLines(label) {
    return String(label || "")
      .replace(/\r/g, "")
      .split("\n")
      .map((line) => truncate(line, 22))
      .slice(0, 6);
  }

  function linkLabelMetrics(lines) {
    const lineHeight = 15;
    const textHeight = Math.max(13, lines.length * lineHeight);
    const width = Math.max(24, Math.max(...lines.map((line) => estimateTextWidth(line, 13, 22)), 0) + 12);
    return {
      width,
      height: textHeight + 8,
      lineHeight,
      textHeight
    };
  }

  function estimateTextWidth(text, fontSize, maxChars = 80) {
    const source = [...String(text || "")].slice(0, maxChars);
    return source.reduce((sum, char) => {
      const code = char.codePointAt(0) || 0;
      const wide = code > 0x2e80 || char === "ー" || char === "―";
      return sum + fontSize * (wide ? 0.95 : 0.58);
    }, 0);
  }

  function normalizedLinkLabelPosition(link) {
    return clamp(Number(link.labelPosition ?? 0.5), 0, 1);
  }

  function normalizedLinkLabelOffsetX(link) {
    return normalizeFreeOffset(link.labelOffsetX);
  }

  function normalizedLinkLabelOffsetY(link) {
    return normalizeFreeOffset(link.labelOffsetY);
  }

  function normalizedLinkRouteOffsetX(link) {
    return normalizeFreeOffset(link.routeOffsetX);
  }

  function normalizedLinkRouteOffsetY(link) {
    return normalizeFreeOffset(link.routeOffsetY);
  }

  function normalizeFreeOffset(value) {
    const number = Number(value);
    return Number.isFinite(number) ? clamp(number, -5000, 5000) : 0;
  }

  function linkLabelPositionFromPoint(link, point) {
    const polyline = representativeLinkLabelPolyline(link);
    if (polyline.length < 2) return normalizedLinkLabelPosition(link);
    return nearestPositionOnPolyline(polyline, point);
  }

  function representativeLinkLabelPolyline(link) {
    const fromEndpoints = getLinkEndpointEntries(link, "from");
    const toEndpoints = getLinkEndpointEntries(link, "to");
    if (!fromEndpoints.length || !toEndpoints.length) return [];
    const fromEndpoint = fromEndpoints[0];
    const toEndpoint = toEndpoints[0];
    const start = attachmentPoint(fromEndpoint.item, fromEndpoint.id, link, "from", toEndpoint.center);
    const end = attachmentPoint(toEndpoint.item, toEndpoint.id, link, "to", fromEndpoint.center);
    const route = link.route || "orthogonal";
    if (route === "straight") return [start, end];
    if (route === "curve" && fromEndpoints.length === 1 && toEndpoints.length === 1) {
      const midpointPoint = midpoint(start, end);
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.hypot(dx, dy) || 1;
      const curve = Math.min(70, Math.max(28, length * 0.14));
      const control = {
        x: midpointPoint.x + (-dy / length) * curve + normalizedLinkRouteOffsetX(link),
        y: midpointPoint.y + (dx / length) * curve + normalizedLinkRouteOffsetY(link)
      };
      return approximateQuadraticPolyline(start, control, end, 24);
    }
    return orthogonalLabelPolyline(link, fromEndpoints, toEndpoints);
  }

  function orthogonalLabelPolyline(link, fromEndpoints, toEndpoints) {
    if (fromEndpoints.length === 1 && toEndpoints.length === 1) {
      return singleOrthogonalPolyline(link, fromEndpoints[0], toEndpoints[0]);
    }

    const fromCenter = averagePoint(fromEndpoints.map((endpoint) => endpoint.center));
    const toCenter = averagePoint(toEndpoints.map((endpoint) => endpoint.center));
    const useHorizontalTrunk = Math.abs(toCenter.x - fromCenter.x) >= Math.abs(toCenter.y - fromCenter.y);
    const nodeObstacles = linkNodeObstacles();
    if (useHorizontalTrunk) {
      const estimatedYs = [...fromEndpoints, ...toEndpoints].map((endpoint) => endpoint.center.y);
      const trunkX = chooseTrunkCoordinate(
        "vertical",
        (fromCenter.x + toCenter.x) / 2,
        Math.min(...estimatedYs),
        Math.max(...estimatedYs),
        nodeObstacles
      ) + normalizedLinkRouteOffsetX(link);
      const ys = [
        ...fromEndpoints.map((endpoint) => ({ endpoint, side: "from" })),
        ...toEndpoints.map((endpoint) => ({ endpoint, side: "to" }))
      ].map(({ endpoint, side }) => {
        const anchor = attachmentPoint(endpoint.item, endpoint.id, link, side, { x: trunkX, y: endpoint.center.y });
        const terminal = linkTerminalStubPoint(link, side, endpoint.id, endpoint.item, anchor);
        return (terminal?.point || anchor).y;
      });
      return [{ x: trunkX, y: Math.min(...ys) }, { x: trunkX, y: Math.max(...ys) }];
    }
    const estimatedXs = [...fromEndpoints, ...toEndpoints].map((endpoint) => endpoint.center.x);
    const trunkY = chooseTrunkCoordinate(
      "horizontal",
      (fromCenter.y + toCenter.y) / 2,
      Math.min(...estimatedXs),
      Math.max(...estimatedXs),
      nodeObstacles
    ) + normalizedLinkRouteOffsetY(link);
    const xs = [
      ...fromEndpoints.map((endpoint) => ({ endpoint, side: "from" })),
      ...toEndpoints.map((endpoint) => ({ endpoint, side: "to" }))
    ].map(({ endpoint, side }) => {
      const anchor = attachmentPoint(endpoint.item, endpoint.id, link, side, { x: endpoint.center.x, y: trunkY });
      const terminal = linkTerminalStubPoint(link, side, endpoint.id, endpoint.item, anchor);
      return (terminal?.point || anchor).x;
    });
    return [{ x: Math.min(...xs), y: trunkY }, { x: Math.max(...xs), y: trunkY }];
  }

  function pointOnPolyline(points, ratio) {
    const compact = compactPolyline(points);
    if (!compact.length) return { x: 0, y: 0 };
    if (compact.length === 1) return compact[0];
    const total = polylineLength(compact);
    if (total <= 0) return compact[0];
    let remaining = clamp(Number(ratio) || 0, 0, 1) * total;
    for (let index = 1; index < compact.length; index += 1) {
      const start = compact[index - 1];
      const end = compact[index];
      const segmentLength = distance(start, end);
      if (remaining <= segmentLength || index === compact.length - 1) {
        const t = segmentLength > 0 ? remaining / segmentLength : 0;
        return {
          x: start.x + (end.x - start.x) * t,
          y: start.y + (end.y - start.y) * t
        };
      }
      remaining -= segmentLength;
    }
    return compact[compact.length - 1];
  }

  function nearestPositionOnPolyline(points, point) {
    const compact = compactPolyline(points);
    const total = polylineLength(compact);
    if (compact.length < 2 || total <= 0) return 0.5;
    let walked = 0;
    let bestDistance = Infinity;
    let bestPosition = 0.5;
    for (let index = 1; index < compact.length; index += 1) {
      const start = compact[index - 1];
      const end = compact[index];
      const segmentLength = distance(start, end);
      if (segmentLength <= 0) continue;
      const projection = closestPointOnSegment(point, start, end);
      const currentDistance = distance(point, projection.point);
      if (currentDistance < bestDistance) {
        bestDistance = currentDistance;
        bestPosition = (walked + projection.t * segmentLength) / total;
      }
      walked += segmentLength;
    }
    return clamp(bestPosition, 0, 1);
  }

  function polylineLength(points) {
    let total = 0;
    for (let index = 1; index < points.length; index += 1) {
      total += distance(points[index - 1], points[index]);
    }
    return total;
  }

  function closestPointOnSegment(point, start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSq = dx * dx + dy * dy;
    const t = lengthSq > 0
      ? clamp(((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSq, 0, 1)
      : 0;
    return {
      t,
      point: {
        x: start.x + dx * t,
        y: start.y + dy * t
      }
    };
  }

  function approximateQuadraticPolyline(start, control, end, steps = 20) {
    const points = [];
    for (let step = 0; step <= steps; step += 1) {
      points.push(quadraticPoint(start, control, end, step / steps));
    }
    return points;
  }

  function renderConnectionPreview(connectionDrag) {
    const fromEndpoint = getConnectionEndpoint(connectionDrag.from);
    if (!fromEndpoint || !connectionDrag.current) return createSvg("g");
    const from = fromEndpoint.item;
    const end = connectionDrag.current;
    const start = edgePoint(from, {
      x: end.x - 1,
      y: end.y - 1,
      w: 2,
      h: 2
    });
    const g = createSvg("g", {
      "pointer-events": "none"
    });
    g.appendChild(createSvg("line", {
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
      stroke: "#202329",
      "stroke-width": 3,
      "stroke-linecap": "round",
      "stroke-dasharray": "8 7",
      opacity: 0.72
    }));
    g.appendChild(createSvg("circle", {
      cx: end.x,
      cy: end.y,
      r: 8,
      fill: "#202329",
      opacity: 0.18
    }));
    return g;
  }

  function renderSelectionList() {
    const items = [
      ...state.nodes.map((node) => ({ type: "node", id: node.id, name: node.name || "人物", color: node.color, dotStyle: selectionDotStyle(node) })),
      ...state.groups.map((group) => ({ type: "group", id: group.id, name: group.title || "グループ", color: group.color, dotStyle: selectionDotStyle(group) })),
      ...state.links.map((link) => ({ type: "link", id: link.id, name: truncate(firstTextLine(link.label) || "関係", 18), color: link.color || "#202329" })),
      ...state.texts.map((textItem) => ({
        type: "text",
        id: textItem.id,
        name: truncate(firstTextLine(textItem.content) || "テキスト", 18),
        color: textItem.color || "#202329"
      })),
      ...state.shapes.map((shape) => ({
        type: "shape",
        id: shape.id,
        name: shapeLabel(shape),
        color: shape.fill || shape.stroke || "#202329"
      })),
      ...state.images.map((imageItem) => ({
        type: "image",
        id: imageItem.id,
        name: imageItem.name || "画像",
        color: imageItem.borderColor || "#6b7280"
      })),
      ...state.legends.map((legend) => ({
        type: "legend",
        id: legend.id,
        name: legend.title || "属性マーク凡例",
        color: legend.borderColor || "#202329"
      }))
    ];
    selectionList.replaceChildren();
    if (!items.length) {
      selectionList.appendChild(el("div", { class: "empty-state" }, "項目なし"));
      return;
    }
    items.forEach((item) => {
      const row = el("div", {
        class: [
          "selection-item",
          isSelected(item.type, item.id) ? "is-active" : "",
          item.type === "node" && multiSelectedNodeIds.has(item.id) ? "is-multi-selected" : ""
        ].filter(Boolean).join(" ")
      });
      if (item.type === "node") {
        const checkbox = el("input", {
          type: "checkbox",
          class: "selection-check",
          title: "整列対象"
        });
        checkbox.checked = multiSelectedNodeIds.has(item.id);
        checkbox.addEventListener("click", (event) => {
          event.stopPropagation();
        });
        checkbox.addEventListener("change", () => {
          toggleMultiSelectedNode(item.id, checkbox.checked);
        });
        row.appendChild(checkbox);
      } else {
        row.appendChild(el("span", { class: "selection-check-spacer" }));
      }
      const button = el("button", {
        type: "button",
        class: "selection-select"
      });
      button.appendChild(el("span", {
        class: "selection-dot",
        style: item.dotStyle || `background:${item.color}`
      }));
      button.appendChild(el("span", { class: "selection-name" }, item.name));
      button.addEventListener("click", () => {
        selected = { type: item.type, id: item.id };
        inspectorOpen = false;
        mode = "select";
        pendingConnection = null;
        render();
      });
      button.addEventListener("dblclick", () => {
        selected = { type: item.type, id: item.id };
        inspectorOpen = true;
        mode = "select";
        pendingConnection = null;
        render();
      });
      row.appendChild(button);
      selectionList.appendChild(row);
    });
  }

  function toggleMultiSelectedNode(id, force) {
    if (!getNode(id)) return;
    const shouldSelect = force === undefined ? !multiSelectedNodeIds.has(id) : Boolean(force);
    if (shouldSelect) multiSelectedNodeIds.add(id);
    else multiSelectedNodeIds.delete(id);
    render();
  }

  function selectedAlignmentNodes() {
    return state.nodes.filter((node) => multiSelectedNodeIds.has(node.id));
  }

  function alignmentSpacing() {
    return clamp(Number(alignSpacingInput?.value) || 0, 0, 240);
  }

  function updateAlignControls() {
    const validIds = new Set(state.nodes.map((node) => node.id));
    [...multiSelectedNodeIds].forEach((id) => {
      if (!validIds.has(id)) multiSelectedNodeIds.delete(id);
    });
    const count = selectedAlignmentNodes().length;
    const disabled = count < 2;
    if (alignHorizontalBtn) alignHorizontalBtn.disabled = disabled;
    if (alignVerticalBtn) alignVerticalBtn.disabled = disabled;
    if (alignSpacingValue) {
      alignSpacingValue.value = `${alignmentSpacing()}px`;
      alignSpacingValue.textContent = `${alignmentSpacing()}px`;
    }
    if (alignHint) {
      alignHint.textContent = disabled
        ? "人物を2人以上チェック"
        : `${count}人を整列対象にしています`;
    }
  }

  function alignSelectedNodes(direction) {
    const nodes = selectedAlignmentNodes();
    if (nodes.length < 2) return;
    const spacing = alignmentSpacing();
    if (direction === "horizontal") {
      const ordered = [...nodes].sort((a, b) => (a.x + a.w / 2) - (b.x + b.w / 2) || (a.y + a.h / 2) - (b.y + b.h / 2));
      const centerY = ordered.reduce((sum, node) => sum + node.y + node.h / 2, 0) / ordered.length;
      let cursorX = Math.min(...ordered.map((node) => node.x));
      ordered.forEach((node) => {
        node.x = cursorX;
        node.y = centerY - node.h / 2;
        cursorX += node.w + spacing;
      });
      commitChange();
      return;
    }
    if (direction === "vertical") {
      const ordered = [...nodes].sort((a, b) => (a.y + a.h / 2) - (b.y + b.h / 2) || (a.x + a.w / 2) - (b.x + b.w / 2));
      const centerX = ordered.reduce((sum, node) => sum + node.x + node.w / 2, 0) / ordered.length;
      let cursorY = Math.min(...ordered.map((node) => node.y));
      ordered.forEach((node) => {
        node.x = centerX - node.w / 2;
        node.y = cursorY;
        cursorY += node.h + spacing;
      });
      commitChange();
    }
  }

  function renderInspector() {
    inspectorContent.replaceChildren();
    if (mode === "connect") {
      const message = pendingConnection ? "接続先を選択" : "1人目を選択";
      inspectorContent.appendChild(el("div", { class: "empty-state" }, message));
      return;
    }
    const item = selected ? getSelectedItem() : null;
    if (!item || !inspectorOpen) {
      inspectorContent.appendChild(el("div", { class: "empty-state" }, "未選択"));
      return;
    }
    if (selected.type === "node") renderNodeInspector(item);
    if (selected.type === "group") renderGroupInspector(item);
    if (selected.type === "link") renderLinkInspector(item);
    if (selected.type === "text") renderTextInspector(item);
    if (selected.type === "shape") renderShapeInspector(item);
    if (selected.type === "image") renderImageInspector(item);
    if (selected.type === "legend") renderLegendInspector(item);
  }

  function renderNodeInspector(node) {
    const form = el("div", { class: "form" });
    form.appendChild(field("名前", textInput(node.name, (value) => {
      node.name = value;
      scheduleChange();
    })));
    form.appendChild(field("肩書き", textarea(node.role, (value) => {
      node.role = value;
      scheduleChange();
    })));
    form.appendChild(field("名前文字色", swatches(node.nameTextColor || "#ffffff", (value) => {
      node.nameTextColor = value;
      scheduleChange();
    }, ["#ffffff", "#202329", ...PALETTE])));
    form.appendChild(field("名前フチ色", swatches(node.nameOutlineColor || "#202329", (value) => {
      node.nameOutlineColor = value;
      scheduleChange();
    }, ["#202329", "#ffffff", ...PALETTE])));
    form.appendChild(field("名前フチ幅", rangeWithValue(normalizeNodeOutlineWidth(node.nameOutlineWidth), 0, 8, (value) => {
      node.nameOutlineWidth = value;
      scheduleChange();
    }, 1, "px")));
    form.appendChild(field("肩書き文字色", swatches(node.roleTextColor || "#ffffff", (value) => {
      node.roleTextColor = value;
      scheduleChange();
    }, ["#ffffff", "#202329", ...PALETTE])));
    form.appendChild(field("肩書きフチ色", swatches(node.roleOutlineColor || "#202329", (value) => {
      node.roleOutlineColor = value;
      scheduleChange();
    }, ["#202329", "#ffffff", ...PALETTE])));
    form.appendChild(field("肩書きフチ幅", rangeWithValue(normalizeNodeOutlineWidth(node.roleOutlineWidth), 0, 8, (value) => {
      node.roleOutlineWidth = value;
      scheduleChange();
    }, 1, "px")));
    form.appendChild(field("メモ", textarea(node.memo, (value) => {
      node.memo = value;
      scheduleChange(false);
    })));
    form.appendChild(field("色", swatches(node.color, (value) => {
      node.color = value;
      scheduleChange();
    })));
    form.appendChild(field("グラデーション", gradientControls(node)));
    form.appendChild(field("属性マーク", nodeMarkControls(node)));
    form.appendChild(field("画像", imageUploadControl(node)));
    if (node.image) form.appendChild(imageCropControls(node));
    form.appendChild(sizeControls(node, "node"));
    form.appendChild(el("div", { class: "divider" }));
    form.appendChild(actionRow(() => duplicateNode(node), deleteSelected));
    inspectorContent.appendChild(form);
  }

  function renderGroupInspector(group) {
    const form = el("div", { class: "form" });
    form.appendChild(field("グループ名", textInput(group.title, (value) => {
      group.title = value;
      scheduleChange();
    })));
    form.appendChild(field("文字サイズ", rangeWithValue(normalizeGroupTitleFontSize(group.titleFontSize), 9, 36, (value) => {
      group.titleFontSize = value;
      scheduleChange();
    })));
    form.appendChild(field("フォント", groupTitleFontSelect(group)));
    form.appendChild(field("色", swatches(group.color, (value) => {
      group.color = value;
      scheduleChange();
    })));
    form.appendChild(field("グラデーション", gradientControls(group)));
    form.appendChild(sizeControls(group, "group"));
    form.appendChild(el("div", { class: "divider" }));
    form.appendChild(actionRow(() => duplicateGroup(group), deleteSelected));
    inspectorContent.appendChild(form);
  }

  function renderLinkInspector(link) {
    const form = el("div", { class: "form" });
    form.addEventListener("pointerdown", resetWorkspaceGesture);
    form.appendChild(field("関係名", textarea(link.label, (value) => {
      link.label = value;
      scheduleChange();
    })));
    const select = el("select");
    [
      ["line", "線"],
      ["arrow", "矢印"],
      ["bidirectional", "双方向"],
      ["dashed", "破線"]
    ].forEach(([value, label]) => {
      const option = el("option", { value }, label);
      option.selected = link.type === value;
      select.appendChild(option);
    });
    select.addEventListener("change", () => {
      link.type = select.value;
      scheduleChange();
    });
    form.appendChild(field("種類", select));
    const routeSelect = el("select");
    [
      ["straight", "直線"],
      ["orthogonal", "直角"],
      ["curve", "カーブ"]
    ].forEach(([value, label]) => {
      const option = el("option", { value }, label);
      option.selected = (link.route || "orthogonal") === value;
      routeSelect.appendChild(option);
    });
    routeSelect.addEventListener("change", () => {
      link.route = routeSelect.value;
      scheduleChange();
    });
    form.appendChild(field("形状", routeSelect));
    form.appendChild(field("接続元", endpointChecklist(link, "fromIds")));
    form.appendChild(field("接続先", endpointChecklist(link, "toIds")));
    form.appendChild(field("太さ", rangeInput(link.width || 1.5, 0.5, 9, (value) => {
      link.width = value;
      scheduleChange();
    }, 0.5)));
    form.appendChild(field("線の色", swatches(link.color || "#202329", (value) => {
      link.color = value;
      scheduleChange();
    }, ["#202329", ...PALETTE])));
    form.appendChild(field("関係名の色", swatches(link.labelColor || link.color || "#202329", (value) => {
      link.labelColor = value;
      scheduleChange();
    }, ["#202329", ...PALETTE])));
    form.appendChild(field("関係名位置", rangeWithValue(Math.round(normalizedLinkLabelPosition(link) * 100), 0, 100, (value) => {
      link.labelPosition = clamp(value / 100, 0, 1);
      scheduleChange();
    }, 1, "%")));
    form.appendChild(field("自由移動", linkFreeMoveControls(link)));
    form.appendChild(field("関係名背景", optionalSwatches(linkLabelPaintColor(normalizeLinkLabelBackgroundColor(link.labelBackgroundColor)), (value) => {
      link.labelBackgroundColor = value || "transparent";
      scheduleChange();
    }, ["#ffffff", "#f9faf7", "#eef4ef", "#fff2ef", ...PALETTE])));
    form.appendChild(field("関係名枠線", optionalSwatches(linkLabelPaintColor(normalizeLinkLabelBorderColor(link.labelBorderColor)), (value) => {
      link.labelBorderColor = value || "transparent";
      scheduleChange();
    }, ["#202329", "#ffffff", "#d8ded8", ...PALETTE])));
    form.appendChild(field("枠線幅", rangeWithValue(normalizeLinkLabelBorderWidth(link.labelBorderWidth), 0, 10, (value) => {
      link.labelBorderWidth = value;
      scheduleChange();
    }, 1, "px")));
    form.appendChild(el("div", { class: "divider" }));
    form.appendChild(actionRow(null, deleteSelected));
    inspectorContent.appendChild(form);
  }

  function linkFreeMoveControls(link) {
    const row = el("div", { class: "field-row" });
    const resetLabel = el("button", { type: "button" }, "関係名を戻す");
    resetLabel.addEventListener("click", () => {
      link.labelOffsetX = 0;
      link.labelOffsetY = 0;
      commitChange();
    });
    const resetLine = el("button", { type: "button" }, "線を戻す");
    resetLine.addEventListener("click", () => {
      link.routeOffsetX = 0;
      link.routeOffsetY = 0;
      link.fromTerminalOffsets = {};
      link.toTerminalOffsets = {};
      commitChange();
    });
    const resetAll = el("button", { type: "button" }, "両方戻す");
    resetAll.addEventListener("click", () => {
      link.labelOffsetX = 0;
      link.labelOffsetY = 0;
      link.routeOffsetX = 0;
      link.routeOffsetY = 0;
      link.fromTerminalOffsets = {};
      link.toTerminalOffsets = {};
      commitChange();
    });
    row.appendChild(resetLabel);
    row.appendChild(resetLine);
    row.appendChild(resetAll);
    return row;
  }

  function renderTextInspector(textItem) {
    const form = el("div", { class: "form" });
    form.addEventListener("pointerdown", resetWorkspaceGesture);
    form.appendChild(field("文章", textarea(textItem.content, (value) => {
      textItem.content = value;
      scheduleChange();
    })));
    form.appendChild(field("幅", rangeInput(textItem.w || TEXT_DEFAULT_WIDTH, 60, 520, (value) => {
      textItem.w = value;
      scheduleChange();
    })));
    form.appendChild(field("文字サイズ", rangeInput(textItem.fontSize || 20, 8, 56, (value) => {
      textItem.fontSize = value;
      scheduleChange();
    })));
    const alignSelect = el("select");
    [
      ["left", "左揃え"],
      ["center", "中央揃え"],
      ["right", "右揃え"]
    ].forEach(([value, label]) => {
      const option = el("option", { value }, label);
      option.selected = (textItem.align || "left") === value;
      alignSelect.appendChild(option);
    });
    alignSelect.addEventListener("change", () => {
      textItem.align = alignSelect.value;
      scheduleChange();
    });
    form.appendChild(field("配置", alignSelect));
    form.appendChild(field("色", swatches(textItem.color || "#202329", (value) => {
      textItem.color = value;
      scheduleChange();
    }, ["#202329", ...PALETTE])));
    form.appendChild(field("背景色", optionalSwatches(textItem.backgroundColor || "", (value) => {
      textItem.backgroundColor = value;
      scheduleChange();
    }, ["#ffffff", "#f9faf7", "#eef4ef", "#fff2ef", ...PALETTE])));
    form.appendChild(field("枠線色", optionalSwatches(textItem.borderColor || "", (value) => {
      textItem.borderColor = value;
      if (value && !textItem.borderWidth) textItem.borderWidth = 1;
      scheduleChange();
    }, ["#202329", "#ffffff", ...PALETTE])));
    form.appendChild(field("枠線の太さ", rangeInput(textItem.borderWidth || 1, 1, 10, (value) => {
      textItem.borderWidth = value;
      scheduleChange();
    })));
    form.appendChild(field("白フチ", checkboxControl(Boolean(textItem.outline), (checked) => {
      textItem.outline = checked;
      scheduleChange();
    })));
    form.appendChild(field("太字", checkboxControl(Boolean(textItem.bold), (checked) => {
      textItem.bold = checked;
      scheduleChange();
    })));
    form.appendChild(el("div", { class: "divider" }));
    form.appendChild(actionRow(() => duplicateText(textItem), deleteSelected));
    inspectorContent.appendChild(form);
  }

  function renderShapeInspector(shape) {
    const form = el("div", { class: "form" });
    form.addEventListener("pointerdown", resetWorkspaceGesture);
    form.appendChild(field("図形", shapeTypeControl(shape)));
    form.appendChild(sizeControls(shape, "shape"));
    form.appendChild(field("回転", rangeWithValue(shape.rotation || 0, -180, 180, (value) => {
      shape.rotation = value;
      scheduleChange();
    }, 1, "°")));
    form.appendChild(field("塗り", optionalSwatches(shape.fill || "", (value) => {
      shape.fill = value;
      scheduleChange();
    }, ["#ffffff", "#202329", "#f9faf7", "#fff2ef", "#eef4ef", ...PALETTE])));
    form.appendChild(field("枠線", optionalSwatches(shape.stroke || "", (value) => {
      shape.stroke = value;
      scheduleChange();
    }, ["#202329", "#ffffff", ...PALETTE])));
    form.appendChild(field("枠線の太さ", rangeWithValue(shape.strokeWidth || 0, 0, 24, (value) => {
      shape.strokeWidth = value;
      scheduleChange();
    }, 1, "px")));
    form.appendChild(field("透明度", rangeInput(shape.opacity || 1, 0.05, 1, (value) => {
      shape.opacity = value;
      scheduleChange();
    }, 0.05)));
    form.appendChild(el("div", { class: "divider" }));
    form.appendChild(actionRow(() => duplicateShape(shape), deleteSelected));
    inspectorContent.appendChild(form);
  }

  function renderImageInspector(imageItem) {
    const form = el("div", { class: "form" });
    form.addEventListener("pointerdown", resetWorkspaceGesture);
    form.appendChild(field("名前", textInput(imageItem.name, (value) => {
      imageItem.name = value;
      scheduleChange();
    })));
    form.appendChild(field("縦横比固定", checkboxControl(imageItem.keepAspect !== false, (checked) => {
      imageItem.keepAspect = checked;
      scheduleChange();
    })));
    form.appendChild(imageSizeControls(imageItem));
    form.appendChild(field("透明度", rangeInput(imageItem.opacity || 1, 0.05, 1, (value) => {
      imageItem.opacity = value;
      scheduleChange();
    }, 0.05)));
    form.appendChild(field("枠線色", optionalSwatches(imageItem.borderColor || "", (value) => {
      imageItem.borderColor = value;
      if (value && !imageItem.borderWidth) imageItem.borderWidth = 1;
      scheduleChange();
    }, ["#202329", "#ffffff", ...PALETTE])));
    form.appendChild(field("枠線の太さ", rangeWithValue(imageItem.borderWidth || 1, 1, 24, (value) => {
      imageItem.borderWidth = value;
      scheduleChange();
    }, 1, "px")));
    form.appendChild(el("div", { class: "divider" }));
    form.appendChild(actionRow(() => duplicateImage(imageItem), deleteSelected));
    inspectorContent.appendChild(form);
  }

  function imageSizeControls(imageItem) {
    const row = el("div", { class: "field-row" });
    row.appendChild(field("幅", rangeWithValue(imageItem.w, 24, 1200, (value) => {
      const aspect = imageAspectRatio(imageItem);
      imageItem.w = value;
      if (imageItem.keepAspect !== false) imageItem.h = Math.max(24, Math.round(value / aspect));
      scheduleChange();
    })));
    row.appendChild(field("高さ", rangeWithValue(imageItem.h, 24, 1200, (value) => {
      const aspect = imageAspectRatio(imageItem);
      imageItem.h = value;
      if (imageItem.keepAspect !== false) imageItem.w = Math.max(24, Math.round(value * aspect));
      scheduleChange();
    })));
    return row;
  }

  function renderLegendInspector(legend) {
    const form = el("div", { class: "form" });
    form.addEventListener("pointerdown", resetWorkspaceGesture);
    form.appendChild(field("見出し", textInput(legend.title, (value) => {
      legend.title = value;
      scheduleChange();
    })));
    form.appendChild(field("幅", rangeWithValue(legend.w || LEGEND_DEFAULT_WIDTH, 150, 620, (value) => {
      legend.w = value;
      scheduleChange();
    })));
    form.appendChild(field("文字サイズ", rangeWithValue(legend.fontSize || LEGEND_DEFAULT_FONT_SIZE, 9, 28, (value) => {
      legend.fontSize = value;
      scheduleChange();
    }, 1, "px")));
    form.appendChild(field("文字色", swatches(legend.color || "#202329", (value) => {
      legend.color = value;
      scheduleChange();
    }, ["#202329", "#ffffff", ...PALETTE])));
    form.appendChild(field("背景色", optionalSwatches(legend.backgroundColor || "", (value) => {
      legend.backgroundColor = value || "transparent";
      scheduleChange();
    }, ["#ffffff", "#f9faf7", "#eef4ef", "#fff2ef", ...PALETTE])));
    form.appendChild(field("枠線色", optionalSwatches(legend.borderColor || "", (value) => {
      legend.borderColor = value;
      scheduleChange();
    }, ["#202329", "#d8ded8", "#ffffff", ...PALETTE])));
    form.appendChild(field("項目", legendItemControls(legend)));
    form.appendChild(el("div", { class: "divider" }));
    form.appendChild(actionRow(() => duplicateLegend(legend), deleteSelected));
    inspectorContent.appendChild(form);
  }

  function legendItemControls(legend) {
    legend.items = normalizeLegendItems(legend.items);
    const wrap = el("div", { class: "legend-item-options" });
    legend.items.forEach((item) => {
      const mark = NODE_MARKS.find((candidate) => candidate.id === item.markId);
      if (!mark) return;
      const row = el("label", {
        class: `legend-item-option${item.visible ? " is-active" : ""}`
      });
      const check = el("input", { type: "checkbox" });
      check.checked = Boolean(item.visible);
      check.addEventListener("change", () => {
        item.visible = check.checked;
        commitChange();
        render();
      });
      row.appendChild(check);
      row.appendChild(el("span", {
        class: "mark-option-badge",
        style: `background:${mark.color}`
      }));
      const input = el("input", {
        type: "text",
        value: item.text || mark.label,
        "aria-label": `${mark.label}の説明`
      });
      input.addEventListener("input", () => {
        item.text = input.value;
        scheduleChange();
      });
      input.addEventListener("change", () => commitChange());
      row.appendChild(input);
      wrap.appendChild(row);
    });
    return wrap;
  }

  function shapeTypeControl(shape) {
    const wrap = el("div", { class: "shape-type-options" });
    SHAPE_TYPES.forEach(([type, label]) => {
      const button = el("button", {
        type: "button",
        class: `shape-type-option${shape.type === type ? " is-active" : ""}`,
        title: label
      });
      button.appendChild(shapeTypeIcon(type));
      button.appendChild(el("span", {}, label));
      button.addEventListener("click", () => {
        shape.type = type;
        scheduleChange();
        renderInspector();
      });
      wrap.appendChild(button);
    });
    return wrap;
  }

  function shapeTypeIcon(type) {
    const icon = el("span", { class: `shape-type-icon shape-type-icon--${type}` });
    if (type === "circle") icon.textContent = "○";
    else if (type === "triangle") icon.textContent = "△";
    else if (type === "arrow") icon.textContent = "➜";
    else if (type === "star") icon.textContent = "☆";
    else icon.textContent = "□";
    return icon;
  }

  function endpointChecklist(link, side) {
    const wrap = el("div", { class: "endpoint-list" });
    const current = getLinkEndpointIds(link, side);
    const oppositeSide = side === "fromIds" ? "toIds" : "fromIds";
    const opposite = getLinkEndpointIds(link, oppositeSide);
    const candidates = getConnectionCandidates();
    const candidateById = new Map(candidates.map((candidate) => [candidate.id, candidate]));
    const connected = current.map((id) => candidateById.get(id)).filter(Boolean);
    const unconnected = candidates.filter((candidate) => !current.includes(candidate.id));
    const connectedWrap = el("div", { class: "endpoint-connected-list" });
    if (connected.length) {
      connected.forEach((candidate) => {
        connectedWrap.appendChild(endpointOptionRow(link, side, candidate, true, current, opposite));
      });
    } else {
      connectedWrap.appendChild(el("div", { class: "endpoint-empty" }, "接続中の項目はありません"));
    }
    wrap.appendChild(connectedWrap);
    if (unconnected.length) {
      const details = el("details", { class: "endpoint-candidates" });
      details.appendChild(el("summary", {}, `候補を表示（${unconnected.length}件）`));
      const candidateWrap = el("div", { class: "endpoint-candidate-list" });
      unconnected.forEach((candidate) => {
        candidateWrap.appendChild(endpointOptionRow(link, side, candidate, false, current, opposite));
      });
      details.appendChild(candidateWrap);
      wrap.appendChild(details);
    }
    return wrap;
  }

  function endpointOptionRow(link, side, candidate, checked, current, opposite) {
    const lockedOnlyChoice = checked && current.length <= 1;
    const lockedOppositeOnlyChoice = !checked && opposite.includes(candidate.id) && opposite.length <= 1;
    const row = el("div", {
      class: `endpoint-option${!checked && lockedOppositeOnlyChoice ? " is-disabled" : ""}`
    });
    const label = el("label", { class: "endpoint-choice" });
    const input = el("input", { type: "checkbox" });
    input.checked = checked;
    input.disabled = lockedOnlyChoice || lockedOppositeOnlyChoice;
    input.addEventListener("change", () => {
      updateLinkEndpoint(link, side, candidate.id, input.checked);
    });
    label.appendChild(input);
    label.appendChild(el("span", {}, candidate.label));
    row.appendChild(label);
    if (checked) {
      row.appendChild(endpointAnchorControls(link, side, candidate.id));
    }
    return row;
  }

  function endpointAnchorControls(link, side, endpointId) {
    const wrap = el("div", { class: "endpoint-anchor-controls" });
    wrap.appendChild(anchorSelect(link, side, endpointId));
    const picker = anchorPicker(link, side, endpointId);
    if (picker) wrap.appendChild(picker);
    return wrap;
  }

  function anchorSelect(link, side, endpointId) {
    const select = el("select", {
      class: "endpoint-anchor-select",
      title: "接続位置"
    });
    const current = getLinkAnchor(link, side, endpointId);
    [...ANCHOR_OPTIONS, [CUSTOM_ANCHOR_OPTION, "指定位置"]].forEach(([value, label]) => {
      const option = el("option", { value }, label);
      option.selected = isCustomAnchor(current) ? value === CUSTOM_ANCHOR_OPTION : current === value;
      select.appendChild(option);
    });
    select.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      resetWorkspaceGesture();
    });
    select.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    select.addEventListener("change", () => {
      updateLinkAnchor(link, side, endpointId, select.value);
    });
    return select;
  }

  function anchorPicker(link, side, endpointId) {
    const endpoint = getConnectionEndpoint(endpointId);
    if (!endpoint) return null;
    const item = endpoint.item;
    const current = getLinkAnchor(link, side, endpointId);
    const ratio = anchorRatioFromValue(current) || { x: 0.5, y: 0.5 };
    const picker = el("button", {
      type: "button",
      class: "endpoint-anchor-picker",
      title: "接続位置"
    });
    const card = el("span", { class: "endpoint-anchor-card" });
    card.appendChild(el("span", {
      class: "endpoint-anchor-role",
      style: `background:${item.color || "#6c7a89"}`
    }, truncate(endpoint.label || "項目", 7)));
    card.appendChild(el("span", {
      class: "endpoint-anchor-image",
      style: `background:${hexToRgba(item.color || "#6c7a89", 0.13)}`
    }));
    card.appendChild(el("span", {
      class: "endpoint-anchor-name",
      style: `background:${item.color || "#6c7a89"}`
    }, truncate(endpoint.label || "項目", 7)));
    card.appendChild(el("span", {
      class: `endpoint-anchor-dot${isCustomAnchor(current) ? " is-custom" : ""}`,
      style: `left:${ratio.x * 100}%;top:${ratio.y * 100}%`
    }));
    picker.appendChild(card);
    picker.addEventListener("pointerdown", (event) => {
      event.stopPropagation();
      resetWorkspaceGesture();
    });
    picker.addEventListener("click", (event) => {
      const rect = card.getBoundingClientRect();
      const rx = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const ry = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      updateLinkAnchor(link, side, endpointId, makeCustomAnchor(rx, ry));
    });
    return picker;
  }

  function field(labelText, control) {
    const wrapper = el("div", { class: "field" });
    wrapper.appendChild(el("span", {}, labelText));
    wrapper.appendChild(control);
    return wrapper;
  }

  function textInput(value, onInput) {
    const input = el("input", { type: "text", value: value || "" });
    input.addEventListener("input", () => {
      onInput(input.value);
    });
    input.addEventListener("change", () => commitChange());
    return input;
  }

  function textarea(value, onInput) {
    const input = el("textarea");
    input.value = value || "";
    input.addEventListener("input", () => {
      onInput(input.value);
    });
    input.addEventListener("change", () => commitChange());
    return input;
  }

  function rangeInput(value, min, max, onInput, step = 1) {
    const input = el("input", { type: "range", min, max, value, step });
    input.addEventListener("input", () => {
      onInput(Number(input.value));
    });
    input.addEventListener("change", () => commitChange());
    return input;
  }

  function rangeWithValue(value, min, max, onInput, step = 1, unit = "px") {
    const wrap = el("div", { class: "range-with-value" });
    const input = el("input", { type: "range", min, max, value, step });
    const output = el("output", {}, `${Math.round(Number(value) || 0)}${unit}`);
    input.addEventListener("input", () => {
      const next = Number(input.value);
      output.value = `${Math.round(next)}${unit}`;
      output.textContent = `${Math.round(next)}${unit}`;
      onInput(next);
    });
    input.addEventListener("change", () => commitChange());
    wrap.appendChild(input);
    wrap.appendChild(output);
    return wrap;
  }

  function checkboxControl(checked, onChange) {
    const label = el("label", { class: "check-control" });
    const input = el("input", { type: "checkbox" });
    input.checked = checked;
    input.addEventListener("change", () => {
      onChange(input.checked);
      commitChange();
      render();
    });
    label.appendChild(input);
    label.appendChild(el("span", {}, checked ? "オン" : "オフ"));
    return label;
  }

  function autoSaveSettingControl() {
    const wrap = el("div");
    const label = el("label", { class: "check-control" });
    const input = el("input", { type: "checkbox" });
    const text = el("span", {}, autoSaveEnabled ? "オン" : "オフ");
    const note = el(
      "p",
      { class: "project-note" },
      autoSaveEnabled ? "1分ごとにPC保存データへ上書きします。" : "手動保存のみ行います。"
    );

    input.checked = autoSaveEnabled;
    input.addEventListener("change", () => {
      setAutoSaveEnabled(input.checked);
      text.textContent = autoSaveEnabled ? "オン" : "オフ";
      note.textContent = autoSaveEnabled ? "1分ごとにPC保存データへ上書きします。" : "手動保存のみ行います。";
    });

    label.appendChild(input);
    label.appendChild(text);
    wrap.appendChild(label);
    wrap.appendChild(note);
    return wrap;
  }

  function groupTitleFontSelect(group) {
    const select = el("select");
    GROUP_TITLE_FONTS.forEach(([value, label]) => {
      const option = el("option", { value }, label);
      option.selected = normalizeGroupTitleFontId(group.titleFontFamily) === value;
      select.appendChild(option);
    });
    select.addEventListener("change", () => {
      group.titleFontFamily = select.value;
      scheduleChange();
    });
    return select;
  }

  function gradientControls(item) {
    item.gradient = normalizeGradient(item.gradient, item.color || PALETTE[0]);
    const wrap = el("div", { class: "gradient-controls" });
    wrap.appendChild(checkboxControl(item.gradient.enabled, (checked) => {
      item.gradient = {
        ...normalizeGradient(item.gradient, item.color || PALETTE[0]),
        enabled: checked
      };
      scheduleChange();
    }));
    if (!item.gradient.enabled) return wrap;

    const options = el("div", { class: "gradient-options" });
    options.appendChild(field("2色目", swatches(item.gradient.color, (value) => {
      item.gradient = {
        ...normalizeGradient(item.gradient, item.color || PALETTE[0]),
        color: value
      };
      scheduleChange();
    }, ["#ffffff", "#202329", ...PALETTE])));

    const directionSelect = el("select");
    GRADIENT_DIRECTIONS.forEach(([value, label]) => {
      const option = el("option", { value }, label);
      option.selected = item.gradient.direction === value;
      directionSelect.appendChild(option);
    });
    directionSelect.addEventListener("change", () => {
      item.gradient = {
        ...normalizeGradient(item.gradient, item.color || PALETTE[0]),
        direction: directionSelect.value
      };
      scheduleChange();
      commitChange();
    });
    options.appendChild(field("方向", directionSelect));
    wrap.appendChild(options);
    return wrap;
  }

  function nodeMarkControls(node) {
    const wrap = el("div", { class: "mark-options" });
    const current = normalizeNodeMarks(node.marks);
    NODE_MARKS.forEach((mark) => {
      const option = el("label", {
        class: `mark-option${current.includes(mark.id) ? " is-active" : ""}`
      });
      const input = el("input", { type: "checkbox", value: mark.id });
      input.checked = current.includes(mark.id);
      input.addEventListener("change", () => {
        const next = new Set(normalizeNodeMarks(node.marks));
        if (input.checked) next.add(mark.id);
        else next.delete(mark.id);
        node.marks = NODE_MARKS.map((candidate) => candidate.id).filter((id) => next.has(id));
        commitChange();
        render();
      });
      option.appendChild(input);
      option.appendChild(el("span", {
        class: "mark-option-badge",
        style: `background:${mark.color}`
      }));
      option.appendChild(el("span", { class: "mark-option-label" }, mark.label));
      wrap.appendChild(option);
    });
    return wrap;
  }

  function swatches(activeColor, onSelect, colors = PALETTE) {
    const wrap = el("div", { class: "swatches" });
    colors.forEach((color) => {
      const button = el("button", {
        class: `swatch${color.toLowerCase() === String(activeColor).toLowerCase() ? " is-active" : ""}`,
        type: "button",
        title: color,
        style: `background:${color}`
      });
      button.addEventListener("click", () => {
        onSelect(color);
        commitChange();
        render();
      });
      wrap.appendChild(button);
    });
    return wrap;
  }

  function optionalSwatches(activeColor, onSelect, colors = PALETTE) {
    const wrap = el("div", { class: "swatches" });
    const none = el("button", {
      class: `swatch swatch-none${!activeColor ? " is-active" : ""}`,
      type: "button",
      title: "なし"
    }, "なし");
    none.addEventListener("click", () => {
      onSelect("");
      commitChange();
      render();
    });
    wrap.appendChild(none);
    colors.forEach((color) => {
      const button = el("button", {
        class: `swatch${color.toLowerCase() === String(activeColor).toLowerCase() ? " is-active" : ""}`,
        type: "button",
        title: color,
        style: `background:${color}`
      });
      button.addEventListener("click", () => {
        onSelect(color);
        commitChange();
        render();
      });
      wrap.appendChild(button);
    });
    return wrap;
  }

  function imageUploadControl(node) {
    const wrap = el("div", { class: "image-upload" });
    const input = el("input", {
      type: "file",
      accept: "image/*"
    });
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const dataUrl = String(reader.result || "");
        const image = new Image();
        image.onload = () => {
          node.image = storeImageAsset(dataUrl, image.naturalWidth || 0, image.naturalHeight || 0);
          node.imageNaturalWidth = image.naturalWidth || 0;
          node.imageNaturalHeight = image.naturalHeight || 0;
          node.imageScale = 1;
          node.imageOffsetX = 0;
          node.imageOffsetY = 0;
          commitChange();
          render();
          openCropEditor(node);
        };
        image.onerror = () => {
          node.image = storeImageAsset(dataUrl);
          node.imageScale = 1;
          node.imageOffsetX = 0;
          node.imageOffsetY = 0;
          commitChange();
          render();
        };
        image.src = dataUrl;
      });
      reader.readAsDataURL(file);
    });
    wrap.appendChild(input);

    const actions = el("div", { class: "image-actions" });
    if (node.image) {
      actions.appendChild(el("span", { class: "image-state" }, "設定済み"));
      const remove = el("button", { type: "button" }, "画像を外す");
      remove.addEventListener("click", () => {
        node.image = "";
        node.imageScale = 1;
        node.imageOffsetX = 0;
        node.imageOffsetY = 0;
        node.imageNaturalWidth = 0;
        node.imageNaturalHeight = 0;
        commitChange();
        render();
      });
      actions.appendChild(remove);
    } else {
      actions.appendChild(el("span", { class: "image-state" }, "未設定"));
    }
    wrap.appendChild(actions);
    return wrap;
  }

  function imageCropControls(node) {
    const wrap = el("div", { class: "image-crop-controls" });
    const edit = el("button", { type: "button" }, "画像位置を調整");
    edit.addEventListener("click", () => {
      openCropEditor(node);
    });
    wrap.appendChild(edit);
    return wrap;
  }

  function insertUploadedImage(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("画像ファイルを選択してください。");
      imageInsertInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const dataUrl = String(reader.result || "");
      const image = new Image();
      const addImage = (naturalWidth = 0, naturalHeight = 0) => {
        const center = screenCenterWorld();
        const size = insertedImageSize(naturalWidth, naturalHeight);
        const item = {
          id: uid("image"),
          name: file.name || "画像",
          src: storeImageAsset(dataUrl, naturalWidth, naturalHeight),
          x: center.x - size.w / 2,
          y: center.y - size.h / 2,
          w: size.w,
          h: size.h,
          naturalWidth,
          naturalHeight,
          opacity: 1,
          borderColor: "",
          borderWidth: 1,
          keepAspect: true
        };
        state.images.push(item);
        selected = { type: "image", id: item.id };
        inspectorOpen = true;
        mode = "select";
        pendingConnection = null;
        imageInsertInput.value = "";
        commitChange();
        render();
      };
      image.onload = () => addImage(image.naturalWidth || 0, image.naturalHeight || 0);
      image.onerror = () => addImage(0, 0);
      image.src = dataUrl;
    });
    reader.readAsDataURL(file);
  }

  function createNewProject() {
    if ((hasDiagramContent() || currentProjectId) && !window.confirm("現在の作業内容を閉じて、新規作成しますか？")) return;
    closeCropEditor();
    closeProjectDialog();
    resetWorkspaceGesture();
    state = createBlankState();
    selected = null;
    multiSelectedNodeIds.clear();
    inspectorOpen = false;
    mode = "select";
    pendingConnection = null;
    lastTap = null;
    currentProjectId = "";
    currentProjectTitle = "";
    history = [];
    future = [];
    pushHistory();
    lastAutoSaveSnapshot = autoSaveStateSnapshot();
    saveProjectMeta();
    saveToStorage();
    fitToContent(false);
    render();
  }

  function hasDiagramContent() {
    return Boolean(
      state.nodes.length ||
      state.links.length ||
      state.groups.length ||
      state.texts.length ||
      state.shapes.length ||
      state.legends.length ||
      state.images.length
    );
  }

  function insertedImageSize(naturalWidth, naturalHeight) {
    const width = Math.max(1, Number(naturalWidth) || INSERTED_IMAGE_MAX_WIDTH);
    const height = Math.max(1, Number(naturalHeight) || INSERTED_IMAGE_MAX_HEIGHT);
    const factor = Math.min(INSERTED_IMAGE_MAX_WIDTH / width, INSERTED_IMAGE_MAX_HEIGHT / height, 1);
    return {
      w: Math.max(24, Math.round(width * factor)),
      h: Math.max(24, Math.round(height * factor))
    };
  }

  function openCropEditor(node) {
    const imageSrc = resolveImageSource(node.image);
    if (!imageSrc) return;
    cropSession = {
      nodeId: node.id,
      draft: {
        imageScale: clamp(Number(node.imageScale) || 1, 1, 4),
        imageOffsetX: clamp(Number(node.imageOffsetX) || 0, -100, 100),
        imageOffsetY: clamp(Number(node.imageOffsetY) || 0, -100, 100),
        imageNaturalWidth: Math.max(0, Number(node.imageNaturalWidth) || 0),
        imageNaturalHeight: Math.max(0, Number(node.imageNaturalHeight) || 0)
      },
      pointers: new Map(),
      dragStart: null,
      pinchStart: null
    };
    cropEditor.classList.add("is-open");
    cropEditor.setAttribute("aria-hidden", "false");
    cropImage.onload = () => {
      if (!cropSession) return;
      cropSession.draft.imageNaturalWidth = cropImage.naturalWidth || cropSession.draft.imageNaturalWidth;
      cropSession.draft.imageNaturalHeight = cropImage.naturalHeight || cropSession.draft.imageNaturalHeight;
      renderCropEditor();
    };
    cropImage.src = imageSrc;
    renderCropEditor();
  }

  function closeCropEditor() {
    cropSession = null;
    cropEditor.classList.remove("is-open");
    cropEditor.setAttribute("aria-hidden", "true");
    cropImage.removeAttribute("src");
  }

  function applyCropEditor() {
    if (!cropSession) return;
    const node = getNode(cropSession.nodeId);
    if (node) {
      node.imageScale = cropSession.draft.imageScale;
      node.imageOffsetX = cropSession.draft.imageOffsetX;
      node.imageOffsetY = cropSession.draft.imageOffsetY;
      node.imageNaturalWidth = cropSession.draft.imageNaturalWidth;
      node.imageNaturalHeight = cropSession.draft.imageNaturalHeight;
    }
    closeCropEditor();
    commitChange();
    render();
  }

  function resetCropEditor() {
    if (!cropSession) return;
    cropSession.draft.imageScale = 1;
    cropSession.draft.imageOffsetX = 0;
    cropSession.draft.imageOffsetY = 0;
    renderCropEditor();
  }

  function zoomCrop(factor) {
    if (!cropSession) return;
    cropSession.draft.imageScale = clamp(cropSession.draft.imageScale * factor, 1, 4);
    renderCropEditor();
  }

  function renderCropEditor() {
    if (!cropSession) return;
    const node = getNode(cropSession.nodeId);
    if (!node) return;
    const frameSize = cropFrameSize(node);
    cropFrame.style.width = `${frameSize.w}px`;
    cropFrame.style.height = `${frameSize.h}px`;
    const draw = computeImageDraw(node, { x: 0, y: 0, w: frameSize.w, h: frameSize.h }, cropSession.draft);
    cropImage.style.left = `${draw.x}px`;
    cropImage.style.top = `${draw.y}px`;
    cropImage.style.width = `${draw.w}px`;
    cropImage.style.height = `${draw.h}px`;
  }

  function cropFrameSize(node) {
    const stageRect = cropStage.getBoundingClientRect();
    const frame = getNodeImageFrame(node);
    const aspect = frame.imageBox.w / frame.imageBox.h;
    const maxW = Math.max(180, stageRect.width * 0.86);
    const maxH = Math.max(160, stageRect.height * 0.74);
    let width = Math.min(maxW, 390);
    let height = width / aspect;
    if (height > maxH) {
      height = maxH;
      width = height * aspect;
    }
    return { w: width, h: height };
  }

  function onCropPointerDown(event) {
    if (!cropSession) return;
    event.preventDefault();
    cropFrame.setPointerCapture(event.pointerId);
    cropSession.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (cropSession.pointers.size === 2) {
      cropSession.pinchStart = {
        distance: cropPointerDistance(),
        scale: cropSession.draft.imageScale
      };
      cropSession.dragStart = null;
      return;
    }
    cropSession.dragStart = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      offsetX: cropSession.draft.imageOffsetX,
      offsetY: cropSession.draft.imageOffsetY
    };
  }

  function onCropPointerMove(event) {
    if (!cropSession || !cropSession.pointers.has(event.pointerId)) return;
    event.preventDefault();
    cropSession.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (cropSession.pointers.size >= 2 && cropSession.pinchStart) {
      const distance = cropPointerDistance();
      if (cropSession.pinchStart.distance > 0) {
        cropSession.draft.imageScale = clamp(
          cropSession.pinchStart.scale * (distance / cropSession.pinchStart.distance),
          1,
          4
        );
        renderCropEditor();
      }
      return;
    }
    if (!cropSession.dragStart || cropSession.dragStart.pointerId !== event.pointerId) return;
    const node = getNode(cropSession.nodeId);
    if (!node) return;
    const frameSize = cropFrameSize(node);
    const draw = computeImageDraw(
      node,
      { x: 0, y: 0, w: frameSize.w, h: frameSize.h },
      {
        ...cropSession.draft,
        imageOffsetX: cropSession.dragStart.offsetX,
        imageOffsetY: cropSession.dragStart.offsetY
      }
    );
    const extraX = Math.max(0, draw.w - frameSize.w);
    const extraY = Math.max(0, draw.h - frameSize.h);
    const dx = event.clientX - cropSession.dragStart.x;
    const dy = event.clientY - cropSession.dragStart.y;
    if (extraX > 0) {
      cropSession.draft.imageOffsetX = clamp(cropSession.dragStart.offsetX + dx * 200 / extraX, -100, 100);
    }
    if (extraY > 0) {
      cropSession.draft.imageOffsetY = clamp(cropSession.dragStart.offsetY + dy * 200 / extraY, -100, 100);
    }
    renderCropEditor();
  }

  function onCropPointerUp(event) {
    if (!cropSession) return;
    cropSession.pointers.delete(event.pointerId);
    cropSession.pinchStart = null;
    cropSession.dragStart = null;
    if (cropSession.pointers.size === 1) {
      const [remaining] = cropSession.pointers.entries();
      cropSession.dragStart = {
        pointerId: remaining[0],
        x: remaining[1].x,
        y: remaining[1].y,
        offsetX: cropSession.draft.imageOffsetX,
        offsetY: cropSession.draft.imageOffsetY
      };
    }
  }

  function onCropWheel(event) {
    if (!cropSession) return;
    event.preventDefault();
    zoomCrop(event.deltaY > 0 ? 0.92 : 1.08);
  }

  function cropPointerDistance() {
    const points = [...cropSession.pointers.values()];
    if (points.length < 2) return 0;
    return Math.hypot(points[0].x - points[1].x, points[0].y - points[1].y);
  }

  function sizeControls(item, kind) {
    const row = el("div", { class: "field-row" });
    const minWidth = kind === "node" ? 82 : kind === "shape" ? 20 : 96;
    const maxWidth = kind === "node" ? 220 : kind === "shape" ? 900 : GROUP_MAX_WIDTH;
    const minHeight = kind === "node" ? 110 : kind === "shape" ? 20 : 52;
    const maxHeight = kind === "node" ? 260 : kind === "shape" ? 900 : GROUP_MAX_HEIGHT;
    row.appendChild(field("幅", rangeWithValue(item.w, minWidth, maxWidth, (value) => {
      item.w = value;
      scheduleChange();
    })));
    row.appendChild(field("高さ", rangeWithValue(item.h, minHeight, maxHeight, (value) => {
      item.h = value;
      scheduleChange();
    })));
    return row;
  }

  function actionRow(onDuplicate, onDelete) {
    const row = el("div", { class: "field-row" });
    if (onDuplicate) {
      const duplicate = el("button", { type: "button" }, "複製");
      duplicate.addEventListener("click", onDuplicate);
      row.appendChild(duplicate);
    }
    const remove = el("button", { type: "button", class: "danger" }, "削除");
    remove.addEventListener("click", onDelete);
    row.appendChild(remove);
    return row;
  }

  function onPointerDown(event) {
    svg.focus();
    closeMobileToolPanel();
    const target = findDiagramTarget(event.target);
    const point = clientToWorld(event);
    const screen = clientToScreen(event);
    event.preventDefault();
    workspacePointers.set(event.pointerId, screen);
    svg.setPointerCapture(event.pointerId);

    if (workspacePointers.size >= 2) {
      startWorkspacePinch();
      return;
    }

    if (target?.type === "group-resize") {
      const group = getGroup(target.id);
      if (!group) return;
      if (mode === "connect") {
        startConnectionGesture(event, group, "group", point);
        return;
      }
      selected = { type: "group", id: group.id };
      mode = "select";
      pendingConnection = null;
      drag = {
        type: "group-resize",
        id: group.id,
        pointerId: event.pointerId,
        start: point,
        startScreen: screen,
        original: { w: group.w, h: group.h },
        moved: false
      };
      render();
      return;
    }

    if (target?.type === "node") {
      const node = getNode(target.id);
      if (!node) return;
      if (mode === "connect") {
        startConnectionGesture(event, node, "node", point);
        return;
      }
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        toggleMultiSelectedNode(node.id);
        return;
      }
      selected = { type: "node", id: node.id };
      inspectorOpen = false;
      drag = {
        type: "node",
        id: node.id,
        pointerId: event.pointerId,
        start: point,
        startScreen: screen,
        original: { x: node.x, y: node.y },
        moved: false
      };
      render();
      return;
    }

    if (target?.type === "group") {
      const group = getGroup(target.id);
      if (!group) return;
      if (mode === "connect") {
        startConnectionGesture(event, group, "group", point);
        return;
      }
      selected = { type: "group", id: group.id };
      inspectorOpen = false;
      drag = {
        type: "group",
        id: group.id,
        pointerId: event.pointerId,
        start: point,
        startScreen: screen,
        original: { x: group.x, y: group.y },
        moved: false
      };
      render();
      return;
    }

    if (target?.type === "text") {
      const textItem = getTextItem(target.id);
      if (!textItem) return;
      selected = { type: "text", id: textItem.id };
      mode = "select";
      pendingConnection = null;
      inspectorOpen = false;
      drag = {
        type: "text",
        id: textItem.id,
        pointerId: event.pointerId,
        start: point,
        startScreen: screen,
        original: { x: textItem.x, y: textItem.y },
        moved: false
      };
      render();
      return;
    }

    if (target?.type === "shape") {
      const shape = getShape(target.id);
      if (!shape) return;
      selected = { type: "shape", id: shape.id };
      mode = "select";
      pendingConnection = null;
      inspectorOpen = false;
      drag = {
        type: "shape",
        id: shape.id,
        pointerId: event.pointerId,
        start: point,
        startScreen: screen,
        original: { x: shape.x, y: shape.y },
        moved: false
      };
      render();
      return;
    }

    if (target?.type === "image") {
      const imageItem = getImageItem(target.id);
      if (!imageItem) return;
      selected = { type: "image", id: imageItem.id };
      mode = "select";
      pendingConnection = null;
      inspectorOpen = false;
      drag = {
        type: "image",
        id: imageItem.id,
        pointerId: event.pointerId,
        start: point,
        startScreen: screen,
        original: { x: imageItem.x, y: imageItem.y },
        moved: false
      };
      render();
      return;
    }

    if (target?.type === "legend") {
      const legend = getLegend(target.id);
      if (!legend) return;
      selected = { type: "legend", id: legend.id };
      mode = "select";
      pendingConnection = null;
      inspectorOpen = false;
      drag = {
        type: "legend",
        id: legend.id,
        pointerId: event.pointerId,
        start: point,
        startScreen: screen,
        original: { x: legend.x, y: legend.y },
        moved: false
      };
      render();
      return;
    }

    if (target?.type === "link-anchor") {
      if (startLinkAnchorDrag(event, target, point, screen)) return;
    }

    if (target?.type === "link-terminal") {
      if (startLinkTerminalDrag(event, target, point, screen)) return;
    }

    if (target?.type === "link-route") {
      if (startLinkRouteDrag(event, target, point, screen)) return;
    }

    if (target?.type === "link-label") {
      const link = getLink(target.id);
      if (!link) return;
      selected = { type: "link", id: link.id };
      mode = "select";
      pendingConnection = null;
      inspectorOpen = false;
      drag = {
        type: "link-label",
        id: link.id,
        pointerId: event.pointerId,
        start: point,
        startScreen: screen,
        original: {
          labelOffsetX: normalizedLinkLabelOffsetX(link),
          labelOffsetY: normalizedLinkLabelOffsetY(link)
        },
        moved: false
      };
      render();
      return;
    }

    if (target?.type === "link") {
      if (startLinkRouteDrag(event, target.id, point, screen)) return;
    }

    selected = null;
    inspectorOpen = false;
    drag = {
      type: "pan",
      pointerId: event.pointerId,
      start: screen,
      original: { x: state.viewport.x, y: state.viewport.y },
      moved: false
    };
    render();
  }

  function onPointerMove(event) {
    if (workspacePointers.has(event.pointerId)) {
      workspacePointers.set(event.pointerId, clientToScreen(event));
    }
    if (workspacePinch && workspacePointers.size >= 2) {
      event.preventDefault();
      updateWorkspacePinch();
      return;
    }
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.preventDefault();
    if (drag.type === "pan") {
      const screen = clientToScreen(event);
      state.viewport.x = drag.original.x + screen.x - drag.start.x;
      state.viewport.y = drag.original.y + screen.y - drag.start.y;
      if (Math.hypot(screen.x - drag.start.x, screen.y - drag.start.y) > 6) drag.moved = true;
      requestViewportRender();
      return;
    }

    if (drag.type === "connect") {
      const point = clientToWorld(event);
      const dx = point.x - drag.start.x;
      const dy = point.y - drag.start.y;
      drag.current = point;
      if (Math.hypot(dx, dy) > 12) drag.moved = true;
      requestDiagramRender();
      return;
    }

    const point = clientToWorld(event);
    const dx = point.x - drag.start.x;
    const dy = point.y - drag.start.y;
    const screen = clientToScreen(event);
    if (drag.startScreen && Math.hypot(screen.x - drag.startScreen.x, screen.y - drag.startScreen.y) > 6) {
      drag.moved = true;
    }
    if (drag.type === "node") {
      const node = getNode(drag.id);
      if (!node) return;
      node.x = drag.original.x + dx;
      node.y = drag.original.y + dy;
    }
    if (drag.type === "group") {
      const group = getGroup(drag.id);
      if (!group) return;
      group.x = drag.original.x + dx;
      group.y = drag.original.y + dy;
    }
    if (drag.type === "group-resize") {
      const group = getGroup(drag.id);
      if (!group) return;
      group.w = clamp(drag.original.w + dx, GROUP_MIN_WIDTH, GROUP_MAX_WIDTH);
      group.h = clamp(drag.original.h + dy, GROUP_MIN_HEIGHT, GROUP_MAX_HEIGHT);
    }
    if (drag.type === "text") {
      const textItem = getTextItem(drag.id);
      if (!textItem) return;
      textItem.x = drag.original.x + dx;
      textItem.y = drag.original.y + dy;
    }
    if (drag.type === "shape") {
      const shape = getShape(drag.id);
      if (!shape) return;
      shape.x = drag.original.x + dx;
      shape.y = drag.original.y + dy;
    }
    if (drag.type === "image") {
      const imageItem = getImageItem(drag.id);
      if (!imageItem) return;
      imageItem.x = drag.original.x + dx;
      imageItem.y = drag.original.y + dy;
    }
    if (drag.type === "legend") {
      const legend = getLegend(drag.id);
      if (!legend) return;
      legend.x = drag.original.x + dx;
      legend.y = drag.original.y + dy;
    }
    if (drag.type === "link-label") {
      const link = getLink(drag.id);
      if (!link) return;
      link.labelOffsetX = drag.original.labelOffsetX + dx;
      link.labelOffsetY = drag.original.labelOffsetY + dy;
    }
    if (drag.type === "link-route") {
      const link = getLink(drag.id);
      if (!link) return;
      if (drag.routeMode === "free" || drag.routeMode === "x") {
        link.routeOffsetX = drag.original.routeOffsetX + dx;
      }
      if (drag.routeMode === "free" || drag.routeMode === "y") {
        link.routeOffsetY = drag.original.routeOffsetY + dy;
      }
    }
    if (drag.type === "link-terminal") {
      const link = getLink(drag.id);
      if (!link) return;
      const next = {
        x: drag.original.terminalOffsetX,
        y: drag.original.terminalOffsetY
      };
      if (drag.axis === "horizontal") next.x += dx;
      if (drag.axis === "vertical") next.y += dy;
      setLinkTerminalOffset(link, drag.side, drag.endpointId, next);
    }
    if (drag.type === "link-anchor") {
      const link = getLink(drag.id);
      const endpoint = getConnectionEndpoint(drag.endpointId);
      if (!link || !endpoint) return;
      if (!drag.moved) return;
      const ratio = edgeAnchorRatioFromPoint(endpoint.item, point);
      setLinkAnchorValue(link, drag.side, drag.endpointId, makeCustomAnchor(ratio.x, ratio.y));
    }
    requestDiagramRender();
  }

  function onPointerUp(event) {
    workspacePointers.delete(event.pointerId);
    try {
      if (svg.hasPointerCapture(event.pointerId)) svg.releasePointerCapture(event.pointerId);
    } catch {
      // Pointer capture can already be gone after browser-level gesture cancellation.
    }
    if (workspacePinch) {
      if (workspacePointers.size < 2) {
        workspacePinch = null;
        saveToStorage();
      }
      return;
    }
    if (!drag || drag.pointerId !== event.pointerId) return;
    const currentDrag = drag;
    if (currentDrag.type === "connect") {
      finishConnectionGesture(event, currentDrag);
      drag = null;
      render();
      return;
    }
    if ((currentDrag.type === "node" || currentDrag.type === "group" || currentDrag.type === "group-resize" || currentDrag.type === "text" || currentDrag.type === "shape" || currentDrag.type === "image" || currentDrag.type === "legend" || currentDrag.type === "link-label" || currentDrag.type === "link-route" || currentDrag.type === "link-terminal" || currentDrag.type === "link-anchor") && !currentDrag.moved) {
      handleTapSelection(currentDrag.type === "group-resize" ? "group" : currentDrag.type === "link-label" || currentDrag.type === "link-route" || currentDrag.type === "link-terminal" || currentDrag.type === "link-anchor" ? "link" : currentDrag.type, currentDrag.id, event);
      drag = null;
      render();
      return;
    }
    const changed = drag.type !== "pan";
    drag = null;
    if (changed) commitChange();
  }

  function onGlobalPointerRelease(event) {
    if (workspacePointers.has(event.pointerId)) {
      workspacePointers.delete(event.pointerId);
    }
    if (workspacePinch && workspacePointers.size < 2) {
      workspacePinch = null;
      saveToStorage();
    }
    if (workspacePointers.size === 0 && drag?.pointerId === event.pointerId) {
      const currentDrag = drag;
      drag = null;
      if (currentDrag.type === "connect") {
        finishConnectionGesture(event, currentDrag);
        render();
        return;
      }
      if (currentDrag.type !== "pan" && currentDrag.moved) {
        commitChange();
      } else {
        render();
      }
    }
  }

  function resetWorkspaceGesture() {
    workspacePointers.clear();
    workspacePinch = null;
    drag = null;
  }

  function onWheel(event) {
    event.preventDefault();
    const before = clientToWorld(event);
    const factor = event.deltaY > 0 ? 0.9 : 1.1;
    state.viewport.scale = clamp(state.viewport.scale * factor, 0.25, 2.8);
    const afterScreen = worldToScreen(before);
    const screen = clientToScreen(event);
    state.viewport.x += screen.x - afterScreen.x;
    state.viewport.y += screen.y - afterScreen.y;
    requestViewportRender();
  }

  function startWorkspacePinch() {
    if (drag?.type === "node") {
      const node = getNode(drag.id);
      if (node) {
        node.x = drag.original.x;
        node.y = drag.original.y;
      }
    }
    if (drag?.type === "group") {
      const group = getGroup(drag.id);
      if (group) {
        group.x = drag.original.x;
        group.y = drag.original.y;
      }
    }
    if (drag?.type === "group-resize") {
      const group = getGroup(drag.id);
      if (group) {
        group.w = drag.original.w;
        group.h = drag.original.h;
      }
    }
    if (drag?.type === "text") {
      const textItem = getTextItem(drag.id);
      if (textItem) {
        textItem.x = drag.original.x;
        textItem.y = drag.original.y;
      }
    }
    if (drag?.type === "shape") {
      const shape = getShape(drag.id);
      if (shape) {
        shape.x = drag.original.x;
        shape.y = drag.original.y;
      }
    }
    if (drag?.type === "image") {
      const imageItem = getImageItem(drag.id);
      if (imageItem) {
        imageItem.x = drag.original.x;
        imageItem.y = drag.original.y;
      }
    }
    if (drag?.type === "legend") {
      const legend = getLegend(drag.id);
      if (legend) {
        legend.x = drag.original.x;
        legend.y = drag.original.y;
      }
    }
    if (drag?.type === "link-label") {
      const link = getLink(drag.id);
      if (link) {
        link.labelOffsetX = drag.original.labelOffsetX;
        link.labelOffsetY = drag.original.labelOffsetY;
      }
    }
    if (drag?.type === "link-route") {
      const link = getLink(drag.id);
      if (link) {
        link.routeOffsetX = drag.original.routeOffsetX;
        link.routeOffsetY = drag.original.routeOffsetY;
      }
    }
    if (drag?.type === "link-terminal") {
      const link = getLink(drag.id);
      if (link) {
        setLinkTerminalOffset(link, drag.side, drag.endpointId, {
          x: drag.original.terminalOffsetX,
          y: drag.original.terminalOffsetY
        });
      }
    }
    if (drag?.type === "link-anchor") {
      const link = getLink(drag.id);
      if (link) {
        setLinkAnchorValue(link, drag.side, drag.endpointId, drag.original.anchor);
      }
    }
    drag = null;
    const points = [...workspacePointers.values()];
    if (points.length < 2) return;
    const center = midpoint(points[0], points[1]);
    workspacePinch = {
      startDistance: distance(points[0], points[1]),
      startScale: state.viewport.scale,
      worldCenter: screenToWorld(center)
    };
    inspectorOpen = false;
    render();
  }

  function updateWorkspacePinch() {
    const points = [...workspacePointers.values()];
    if (!workspacePinch || points.length < 2) return;
    const currentDistance = distance(points[0], points[1]);
    if (workspacePinch.startDistance <= 0) return;
    const center = midpoint(points[0], points[1]);
    state.viewport.scale = clamp(
      workspacePinch.startScale * (currentDistance / workspacePinch.startDistance),
      0.25,
      2.8
    );
    state.viewport.x = center.x - workspacePinch.worldCenter.x * state.viewport.scale;
    state.viewport.y = center.y - workspacePinch.worldCenter.y * state.viewport.scale;
    requestViewportRender();
  }

  function handleTapSelection(type, id, event) {
    const screen = clientToScreen(event);
    const now = Date.now();
    const isDoubleTap = lastTap
      && lastTap.type === type
      && lastTap.id === id
      && now - lastTap.time < DOUBLE_TAP_TIMEOUT_MS
      && distance(screen, lastTap.screen) < DOUBLE_TAP_DISTANCE_PX;
    inspectorOpen = Boolean(isDoubleTap);
    lastTap = isDoubleTap ? null : { type, id, time: now, screen };
  }

  function startLinkRouteDrag(event, targetOrId, point, screen) {
    const id = typeof targetOrId === "string" ? targetOrId : targetOrId?.id;
    const link = getLink(id);
    if (!link) return false;
    const axis = typeof targetOrId === "string" ? "" : targetOrId?.axis;
    const routeMode = axis === "horizontal" ? "y" : axis === "vertical" ? "x" : linkRouteDragMode(link);
    selected = { type: "link", id: link.id };
    mode = "select";
    pendingConnection = null;
    inspectorOpen = false;
    drag = {
      type: "link-route",
      id: link.id,
      pointerId: event.pointerId,
      start: point,
      startScreen: screen,
      routeMode,
      original: {
        routeOffsetX: normalizedLinkRouteOffsetX(link),
        routeOffsetY: normalizedLinkRouteOffsetY(link)
      },
      moved: false
    };
    render();
    return true;
  }

  function startLinkAnchorDrag(event, target, point, screen) {
    const link = getLink(target.id);
    const side = target.side === "from" ? "from" : target.side === "to" ? "to" : "";
    const endpointId = target.endpointId || "";
    const endpoint = getConnectionEndpoint(endpointId);
    if (!link || !side || !endpoint) return false;
    const originalAnchor = getLinkAnchor(link, side, endpointId);
    selected = { type: "link", id: link.id };
    mode = "select";
    pendingConnection = null;
    inspectorOpen = false;
    drag = {
      type: "link-anchor",
      id: link.id,
      pointerId: event.pointerId,
      start: point,
      startScreen: screen,
      side,
      endpointId,
      original: {
        anchor: originalAnchor
      },
      moved: false
    };
    render();
    return true;
  }

  function startLinkTerminalDrag(event, target, point, screen) {
    const link = getLink(target.id);
    const side = target.side === "from" ? "from" : target.side === "to" ? "to" : "";
    const endpointId = target.endpointId || "";
    const axis = target.axis === "vertical" ? "vertical" : target.axis === "horizontal" ? "horizontal" : "";
    if (!link || !side || !endpointId || !axis) return false;
    const offset = getLinkTerminalOffset(link, side, endpointId);
    selected = { type: "link", id: link.id };
    mode = "select";
    pendingConnection = null;
    inspectorOpen = false;
    drag = {
      type: "link-terminal",
      id: link.id,
      pointerId: event.pointerId,
      start: point,
      startScreen: screen,
      side,
      endpointId,
      axis,
      original: {
        terminalOffsetX: offset.x,
        terminalOffsetY: offset.y
      },
      moved: false
    };
    render();
    return true;
  }

  function linkRouteDragMode(link) {
    const route = link.route || "orthogonal";
    const fromEndpoints = getLinkEndpointEntries(link, "from");
    const toEndpoints = getLinkEndpointEntries(link, "to");
    if (!fromEndpoints.length || !toEndpoints.length) return "none";
    if (route === "curve" && fromEndpoints.length === 1 && toEndpoints.length === 1) return "free";
    if (route !== "orthogonal") return "none";
    if (fromEndpoints.length === 1 && toEndpoints.length === 1) return "free";
    const fromCenter = averagePoint(fromEndpoints.map((endpoint) => endpoint.center));
    const toCenter = averagePoint(toEndpoints.map((endpoint) => endpoint.center));
    return Math.abs(toCenter.x - fromCenter.x) >= Math.abs(toCenter.y - fromCenter.y) ? "x" : "y";
  }

  function startConnectionGesture(event, item, itemType, point) {
    if (pendingConnection && pendingConnection !== item.id) {
      createConnection(pendingConnection, item.id);
      return;
    }

    drag = {
      type: "connect",
      pointerId: event.pointerId,
      from: item.id,
      start: point,
      current: point,
      moved: false,
      hadPending: pendingConnection === item.id
    };
    pendingConnection = item.id;
    selected = { type: itemType, id: item.id };
    inspectorOpen = false;
    svg.setPointerCapture(event.pointerId);
    render();
  }

  function finishConnectionGesture(event, connectionDrag) {
    const target = findDiagramTarget(document.elementFromPoint(event.clientX, event.clientY));
    if (isConnectableTarget(target) && target.id !== connectionDrag.from) {
      createConnection(connectionDrag.from, target.id);
      return;
    }

    if (!connectionDrag.moved) {
      pendingConnection = connectionDrag.hadPending ? null : connectionDrag.from;
      const endpoint = pendingConnection ? getConnectionEndpoint(pendingConnection) : null;
      selected = endpoint ? { type: endpoint.type, id: pendingConnection } : null;
      inspectorOpen = false;
      saveToStorage();
      return;
    }

    pendingConnection = connectionDrag.from;
    const endpoint = getConnectionEndpoint(connectionDrag.from);
    selected = endpoint ? { type: endpoint.type, id: connectionDrag.from } : null;
    inspectorOpen = false;
    saveToStorage();
  }

  function createConnection(fromId, toId) {
    if (!getConnectionEndpoint(fromId) || !getConnectionEndpoint(toId) || fromId === toId) return;
    const link = {
      id: uid("link"),
      from: fromId,
      to: toId,
      fromIds: [fromId],
      toIds: [toId],
      fromAnchors: {},
      toAnchors: {},
      fromTerminalOffsets: {},
      toTerminalOffsets: {},
      label: "関係",
      type: "bidirectional",
      route: "orthogonal",
      color: "#202329",
      labelColor: "",
      labelPosition: 0.5,
      labelOffsetX: 0,
      labelOffsetY: 0,
      labelBackgroundColor: LINK_LABEL_DEFAULT_BACKGROUND,
      labelBorderColor: LINK_LABEL_DEFAULT_BORDER,
      labelBorderWidth: 1,
      routeOffsetX: 0,
      routeOffsetY: 0,
      width: 1.5
    };
    state.links.push(link);
    selected = { type: "link", id: link.id };
    inspectorOpen = true;
    mode = "select";
    pendingConnection = null;
    commitChange();
    render();
  }

  function duplicateNode(node) {
    const copy = {
      ...structuredClone(node),
      id: uid("node"),
      name: `${node.name || "人物"} コピー`,
      x: node.x + 28,
      y: node.y + 28
    };
    state.nodes.push(copy);
    selected = { type: "node", id: copy.id };
    inspectorOpen = true;
    commitChange();
    render();
  }

  function duplicateGroup(group) {
    const copy = {
      ...structuredClone(group),
      id: uid("group"),
      title: `${group.title || "グループ"} コピー`,
      x: group.x + 30,
      y: group.y + 30
    };
    state.groups.push(copy);
    selected = { type: "group", id: copy.id };
    inspectorOpen = true;
    commitChange();
    render();
  }

  function duplicateText(textItem) {
    const copy = {
      ...structuredClone(textItem),
      id: uid("text"),
      x: textItem.x + 24,
      y: textItem.y + 24
    };
    state.texts.push(copy);
    selected = { type: "text", id: copy.id };
    inspectorOpen = true;
    commitChange();
    render();
  }

  function duplicateShape(shape) {
    const copy = {
      ...structuredClone(shape),
      id: uid("shape"),
      x: shape.x + 24,
      y: shape.y + 24
    };
    state.shapes.push(copy);
    selected = { type: "shape", id: copy.id };
    inspectorOpen = true;
    commitChange();
    render();
  }

  function duplicateImage(imageItem) {
    const copy = {
      ...structuredClone(imageItem),
      id: uid("image"),
      name: `${imageItem.name || "画像"} コピー`,
      x: imageItem.x + 24,
      y: imageItem.y + 24
    };
    state.images.push(copy);
    selected = { type: "image", id: copy.id };
    inspectorOpen = true;
    commitChange();
    render();
  }

  function duplicateLegend(legend) {
    const copy = {
      ...structuredClone(legend),
      id: uid("legend"),
      title: `${legend.title || "属性マーク凡例"} コピー`,
      x: legend.x + 24,
      y: legend.y + 24
    };
    state.legends.push(copy);
    selected = { type: "legend", id: copy.id };
    inspectorOpen = true;
    commitChange();
    render();
  }

  function deleteSelected() {
    if (!selected) return;
    if (selected.type === "node") {
      state.nodes = state.nodes.filter((node) => node.id !== selected.id);
      state.links = state.links.filter((link) => !linkReferencesEndpoint(link, selected.id));
      multiSelectedNodeIds.delete(selected.id);
    }
    if (selected.type === "group") {
      state.groups = state.groups.filter((group) => group.id !== selected.id);
      state.links = state.links.filter((link) => !linkReferencesEndpoint(link, selected.id));
    }
    if (selected.type === "link") {
      state.links = state.links.filter((link) => link.id !== selected.id);
    }
    if (selected.type === "text") {
      state.texts = state.texts.filter((textItem) => textItem.id !== selected.id);
    }
    if (selected.type === "shape") {
      state.shapes = state.shapes.filter((shape) => shape.id !== selected.id);
    }
    if (selected.type === "image") {
      state.images = state.images.filter((imageItem) => imageItem.id !== selected.id);
    }
    if (selected.type === "legend") {
      state.legends = state.legends.filter((legend) => legend.id !== selected.id);
    }
    selected = null;
    inspectorOpen = false;
    commitChange();
    render();
  }

  async function openSaveDialog() {
    showProjectDialog("save");
    if (STATIC_PWA_MODE) {
      renderOfflineSaveDialog();
      return;
    }
    if (!await ensureProjectStore()) {
      renderProjectStoreUnavailable("save");
      return;
    }
    await renderSaveDialog();
  }

  async function openLoadDialog() {
    showProjectDialog("load");
    if (STATIC_PWA_MODE) {
      renderOfflineLoadDialog();
      return;
    }
    if (!await ensureProjectStore()) {
      renderProjectStoreUnavailable("load");
      return;
    }
    await renderLoadDialog();
  }

  function openPngDialog() {
    showProjectDialog("png");
    renderPngDialog();
  }

  function showProjectDialog(mode) {
    projectDialogMode = mode;
    projectDialogTitle.textContent = mode === "save" ? "PCに保存" : mode === "load" ? "PCから読込" : "PNG書き出し";
    projectDialog.setAttribute("aria-hidden", "false");
    projectDialogContent.replaceChildren(el("div", { class: "project-message" }, "読み込み中..."));
  }

  function closeProjectDialog() {
    projectDialog.setAttribute("aria-hidden", "true");
    projectDialogContent.replaceChildren();
  }

  function renderOfflineSaveDialog() {
    projectDialogTitle.textContent = "iPhoneに保存";
    projectDialogContent.replaceChildren();
    const form = el("div", { class: "project-form" });
    form.appendChild(el("div", { class: "project-message" }, "GitHub Pages版ではPC保存を使わず、JSONファイルとして保存します。"));
    form.appendChild(el("p", { class: "project-note" }, "iPhoneではダウンロード後にファイルアプリやiCloud Driveへ保存してください。この画面の作業状態はブラウザ内にも自動で保持されます。"));
    const actions = el("div", { class: "project-actions" });
    const jsonSave = el("button", { type: "button", class: "primary-action" }, "JSON保存");
    jsonSave.addEventListener("click", saveJson);
    actions.appendChild(jsonSave);
    form.appendChild(actions);
    projectDialogContent.appendChild(form);
  }

  function renderOfflineLoadDialog() {
    projectDialogTitle.textContent = "iPhoneから読込";
    projectDialogContent.replaceChildren();
    const wrap = el("div", { class: "project-form" });
    wrap.appendChild(el("div", { class: "project-message" }, "保存済みのJSONファイルを選んで読み込みます。"));
    wrap.appendChild(el("p", { class: "project-note" }, "PCで作ったデータを使う場合は、JSON保存したファイルをAirDrop、iCloud Drive、ファイルアプリなどでiPhoneへ移してください。"));
    const actions = el("div", { class: "project-actions" });
    const jsonLoad = el("button", { type: "button", class: "primary-action" }, "JSONファイルを読込");
    jsonLoad.addEventListener("click", () => {
      closeProjectDialog();
      fileInput.click();
    });
    actions.appendChild(jsonLoad);
    wrap.appendChild(actions);
    projectDialogContent.appendChild(wrap);
  }

  async function renderSaveDialog() {
    let projects = [];
    try {
      projects = await fetchProjects();
    } catch {
      projectStoreAvailable = false;
      renderProjectStoreUnavailable("save");
      return;
    }
    projectDialogContent.replaceChildren();
    const form = el("div", { class: "project-form" });
    const name = el("input", {
      type: "text",
      value: currentProjectTitle || defaultProjectTitle(),
      placeholder: "保存名"
    });
    form.appendChild(field("保存名", name));
    form.appendChild(field("自動保存", autoSaveSettingControl()));
    const actions = el("div", { class: "project-actions" });
    const saveButton = el("button", { type: "button", class: "primary-action" }, currentProjectId ? "上書き保存" : "PCに保存");
    saveButton.addEventListener("click", () => saveProjectToPc(name.value, false));
    actions.appendChild(saveButton);
    if (currentProjectId) {
      const saveNewButton = el("button", { type: "button" }, "別名で保存");
      saveNewButton.addEventListener("click", () => saveProjectToPc(name.value, true));
      actions.appendChild(saveNewButton);
    }
    const jsonButton = el("button", { type: "button" }, "JSON保存");
    jsonButton.addEventListener("click", saveJson);
    actions.appendChild(jsonButton);
    form.appendChild(actions);
    form.appendChild(el("p", { class: "project-note" }, "PC内の data/projects フォルダに保存されます。同じURLで開いたスマホからも読込できます。"));
    if (projects.length) {
      form.appendChild(el("div", { class: "divider" }));
      form.appendChild(projectList(projects, "save"));
    }
    projectDialogContent.appendChild(form);
  }

  async function renderLoadDialog() {
    let projects = [];
    try {
      projects = await fetchProjects();
    } catch {
      projectStoreAvailable = false;
      renderProjectStoreUnavailable("load");
      return;
    }
    projectDialogContent.replaceChildren();
    const wrap = el("div", { class: "project-form" });
    const actions = el("div", { class: "project-actions" });
    const jsonLoadButton = el("button", { type: "button" }, "JSONファイルを読込");
    jsonLoadButton.addEventListener("click", () => {
      closeProjectDialog();
      fileInput.click();
    });
    actions.appendChild(jsonLoadButton);
    wrap.appendChild(actions);
    if (!projects.length) {
      wrap.appendChild(el("div", { class: "project-message" }, "PCに保存されたデータはまだありません。"));
    } else {
      wrap.appendChild(projectList(projects, "load"));
    }
    projectDialogContent.appendChild(wrap);
  }

  function renderProjectStoreUnavailable(mode) {
    projectDialogContent.replaceChildren();
    const wrap = el("div", { class: "project-form" });
    wrap.appendChild(el("div", { class: "project-alert" }, "PC保存サーバーに接続できません。"));
    wrap.appendChild(el("p", { class: "project-note" }, "PC内の相関図データをスマホから読むには、PC側で start-server.bat を起動し、スマホでは http://PCのIPアドレス:8766 を開いてください。"));
    wrap.appendChild(el("p", { class: "project-note" }, `現在のURL: ${location.origin}`));
    if (mode === "save") {
      wrap.appendChild(field("自動保存", autoSaveSettingControl()));
    }
    const actions = el("div", { class: "project-actions" });
    const retry = el("button", { type: "button", class: "primary-action" }, "再接続");
    retry.addEventListener("click", async () => {
      projectStoreAvailable = null;
      projectDialogContent.replaceChildren(el("div", { class: "project-message" }, "接続確認中..."));
      if (await ensureProjectStore()) {
        if (mode === "save") await renderSaveDialog();
        else await renderLoadDialog();
      } else {
        renderProjectStoreUnavailable(mode);
      }
    });
    actions.appendChild(retry);
    if (mode === "save") {
      const jsonSave = el("button", { type: "button" }, "JSON保存");
      jsonSave.addEventListener("click", saveJson);
      actions.appendChild(jsonSave);
    } else {
      const jsonLoad = el("button", { type: "button" }, "JSONファイルを読込");
      jsonLoad.addEventListener("click", () => {
        closeProjectDialog();
        fileInput.click();
      });
      actions.appendChild(jsonLoad);
    }
    wrap.appendChild(actions);
    projectDialogContent.appendChild(wrap);
  }

  function renderPngDialog() {
    let scale = loadPngExportScale();
    const form = el("div", { class: "project-form png-export-form" });
    const sizePreview = el("div", { class: "png-size-preview" });
    const scaleControl = el("div", { class: "png-scale-control" });
    const range = el("input", {
      type: "range",
      min: 0.5,
      max: 4,
      step: 0.5,
      value: scale
    });
    const scaleOutput = el("output", {}, `${formatScale(scale)}x`);
    scaleControl.appendChild(range);
    scaleControl.appendChild(scaleOutput);

    const presetRow = el("div", { class: "png-preset-row" });
    const presetButtons = [1, 2, 3, 4].map((preset) => {
      const button = el("button", {
        type: "button",
        class: Number(scale) === preset ? "is-active" : ""
      }, `${preset}x`);
      button.addEventListener("click", () => {
        scale = preset;
        range.value = String(scale);
        updatePreview();
      });
      presetRow.appendChild(button);
      return { preset, button };
    });

    function updatePreview() {
      scale = clamp(Number(range.value) || 1, 0.5, 4);
      const { width, height } = pngOutputSize(scale);
      scaleOutput.value = `${formatScale(scale)}x`;
      scaleOutput.textContent = `${formatScale(scale)}x`;
      sizePreview.textContent = `${width} x ${height}px`;
      presetButtons.forEach(({ preset, button }) => {
        button.classList.toggle("is-active", Number(scale) === preset);
      });
    }

    range.addEventListener("input", updatePreview);
    range.addEventListener("change", () => savePngExportScale(scale));
    updatePreview();

    form.appendChild(field("倍率", scaleControl));
    form.appendChild(presetRow);
    form.appendChild(field("出力サイズ", sizePreview));
    form.appendChild(el("p", { class: "project-note" }, "倍率を上げるほどPNGのピクセル数が増えます。スマホ共有用は1x、印刷や拡大表示用は2x以上が目安です。"));

    const actions = el("div", { class: "project-actions" });
    const exportButton = el("button", { type: "button", class: "primary-action" }, "PNGを書き出し");
    exportButton.addEventListener("click", () => {
      savePngExportScale(scale);
      closeProjectDialog();
      exportPng(scale);
    });
    const cancelButton = el("button", { type: "button" }, "キャンセル");
    cancelButton.addEventListener("click", closeProjectDialog);
    actions.appendChild(exportButton);
    actions.appendChild(cancelButton);
    form.appendChild(actions);
    projectDialogContent.replaceChildren(form);
  }

  function projectList(projects, mode) {
    const wrap = el("div", { class: "project-list" });
    projects.forEach((project) => {
      const row = el("div", { class: `project-item${project.id === currentProjectId ? " is-current" : ""}` });
      const meta = el("div", { class: "project-item__meta" });
      meta.appendChild(el("strong", {}, project.title || "無題"));
      meta.appendChild(el("span", {}, `${formatProjectDate(project.updatedAt)} 更新`));
      row.appendChild(meta);
      const actions = el("div", { class: "project-item__actions" });
      if (mode === "load") {
        const openButton = el("button", { type: "button", class: "primary-action" }, "開く");
        openButton.addEventListener("click", () => loadProjectFromPc(project.id));
        actions.appendChild(openButton);
      }
      const deleteButton = el("button", { type: "button", class: "danger-ghost" }, "削除");
      deleteButton.addEventListener("click", () => deleteProjectFromPc(project));
      actions.appendChild(deleteButton);
      row.appendChild(actions);
      wrap.appendChild(row);
    });
    return wrap;
  }

  async function saveProjectToPc(title, forceNew) {
    try {
      await persistProjectToPc(title, forceNew);
      await renderSaveDialog();
      window.alert("PCに保存しました。");
    } catch {
      window.alert("PCに保存できませんでした。サーバーが起動しているか確認してください。");
    }
  }

  async function persistProjectToPc(title, forceNew) {
    const payload = {
      title: String(title || "").trim() || defaultProjectTitle(),
      state: serializeStateForPersistence()
    };
    const body = JSON.stringify(payload);
    const useExisting = currentProjectId && !forceNew;
    const response = await fetch(useExisting ? `/api/projects/${encodeURIComponent(currentProjectId)}` : "/api/projects", {
      method: useExisting ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body
    });
    if (!response.ok) throw new Error("save_failed");
    const project = await response.json();
    currentProjectId = project.id || "";
    currentProjectTitle = project.title || payload.title;
    lastAutoSaveSnapshot = JSON.stringify(payload.state);
    saveProjectMeta();
    writeStateToStorage(payload.state);
    return project;
  }

  async function loadProjectFromPc(id) {
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(id)}`, { cache: "no-store" });
      if (!response.ok) throw new Error("load_failed");
      const project = await response.json();
      const next = normalizeState(project.state);
      if (!next) throw new Error("invalid_project");
      state = next;
      selected = null;
      multiSelectedNodeIds.clear();
      inspectorOpen = false;
      mode = "select";
      pendingConnection = null;
      currentProjectId = project.id || "";
      currentProjectTitle = project.title || "";
      history = [];
      future = [];
      pushHistory();
      saveProjectMeta();
      saveToStorage(true);
      fitToContent(false);
      lastAutoSaveSnapshot = autoSaveStateSnapshot();
      closeProjectDialog();
      render();
    } catch {
      window.alert("PC保存データを読み込めませんでした。");
    }
  }

  async function deleteProjectFromPc(project) {
    if (!window.confirm(`「${project.title || "無題"}」を削除しますか？`)) return;
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(project.id)}`, { method: "DELETE" });
      if (!response.ok) throw new Error("delete_failed");
      if (project.id === currentProjectId) {
        currentProjectId = "";
        currentProjectTitle = "";
        lastAutoSaveSnapshot = autoSaveStateSnapshot();
        saveProjectMeta();
      }
      if (projectDialogMode === "save") await renderSaveDialog();
      else await renderLoadDialog();
    } catch {
      window.alert("削除できませんでした。");
    }
  }

  async function ensureProjectStore() {
    if (STATIC_PWA_MODE) {
      projectStoreAvailable = false;
      return false;
    }
    if (projectStoreAvailable === true) return true;
    return detectProjectStore();
  }

  async function detectProjectStore() {
    if (STATIC_PWA_MODE) {
      projectStoreAvailable = false;
      return false;
    }
    try {
      const response = await fetch("/api/projects", { cache: "no-store" });
      projectStoreAvailable = response.ok;
    } catch {
      projectStoreAvailable = false;
    }
    return projectStoreAvailable;
  }

  async function fetchProjects() {
    const response = await fetch("/api/projects", { cache: "no-store" });
    if (!response.ok) throw new Error("projects_unavailable");
    const result = await response.json();
    return Array.isArray(result.projects) ? result.projects : [];
  }

  async function restoreSavedProjectOnBoot() {
    if (STATIC_PWA_MODE) return false;
    try {
      let project = currentProjectId ? await fetchProjectById(currentProjectId, BOOT_PROJECT_LOAD_TIMEOUT_MS) : null;
      if (!project) {
        const projects = await fetchProjectsWithTimeout(BOOT_PROJECT_LOAD_TIMEOUT_MS);
        project = projects[0]?.id ? await fetchProjectById(projects[0].id, BOOT_PROJECT_LOAD_TIMEOUT_MS) : null;
      }
      if (!project) return false;
      const next = normalizeState(project.state);
      if (!next) return false;
      state = next;
      selected = null;
      multiSelectedNodeIds.clear();
      inspectorOpen = false;
      mode = "select";
      pendingConnection = null;
      currentProjectId = project.id || "";
      currentProjectTitle = project.title || "";
      projectStoreAvailable = true;
      saveProjectMeta();
      writeStateToStorage(project.state);
      lastAutoSaveSnapshot = autoSaveStateSnapshot();
      return true;
    } catch {
      return false;
    }
  }

  async function fetchProjectsWithTimeout(timeoutMs) {
    const response = await fetchWithTimeout("/api/projects", { cache: "no-store" }, timeoutMs);
    if (!response.ok) throw new Error("projects_unavailable");
    const result = await response.json();
    return Array.isArray(result.projects) ? result.projects : [];
  }

  async function fetchProjectById(id, timeoutMs) {
    if (!id) return null;
    const response = await fetchWithTimeout(`/api/projects/${encodeURIComponent(id)}`, { cache: "no-store" }, timeoutMs);
    if (!response.ok) return null;
    return response.json();
  }

  async function fetchWithTimeout(url, options, timeoutMs) {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, {
        ...options,
        signal: controller.signal
      });
    } finally {
      window.clearTimeout(timer);
    }
  }

  function loadAutoSaveEnabled() {
    try {
      return localStorage.getItem(AUTO_SAVE_ENABLED_KEY) !== "false";
    } catch {
      return true;
    }
  }

  function setAutoSaveEnabled(enabled) {
    autoSaveEnabled = Boolean(enabled);
    try {
      localStorage.setItem(AUTO_SAVE_ENABLED_KEY, autoSaveEnabled ? "true" : "false");
    } catch {
      // 設定保存に失敗しても、現在の画面では切り替えを反映する。
    }
    if (autoSaveEnabled) {
      startAutoSave();
      void runAutoSave();
    } else {
      stopAutoSave();
    }
  }

  function startAutoSave() {
    stopAutoSave();
    if (!autoSaveEnabled) return;
    autoSaveTimer = window.setInterval(runAutoSave, AUTO_SAVE_INTERVAL_MS);
  }

  function stopAutoSave() {
    if (!autoSaveTimer) return;
    window.clearInterval(autoSaveTimer);
    autoSaveTimer = 0;
  }

  async function runAutoSave() {
    if (STATIC_PWA_MODE) return;
    if (!autoSaveEnabled) return;
    if (autoSaveInFlight) return;
    if (!currentProjectId && !hasDiagramContent()) return;
    if (!await ensureProjectStore()) return;
    const payload = {
      title: currentProjectTitle || autoSaveProjectTitle(),
      state: serializeStateForPersistence()
    };
    const snapshot = JSON.stringify(payload.state);
    if (snapshot === lastAutoSaveSnapshot) return;
    autoSaveInFlight = true;
    try {
      await persistProjectToPc(payload.title, false);
      lastAutoSaveSnapshot = snapshot;
    } catch {
      projectStoreAvailable = false;
    } finally {
      autoSaveInFlight = false;
    }
  }

  function autoSaveProjectTitle() {
    return `自動保存 ${defaultProjectTitle().replace(/^相関図\s*/, "")}`;
  }

  function autoSaveStateSnapshot() {
    return JSON.stringify(serializeStateForPersistence());
  }

  function isStaticPwaMode() {
    return location.protocol === "file:" || /\.github\.io$/i.test(location.hostname);
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    if (location.protocol !== "https:" && location.hostname !== "localhost" && location.hostname !== "127.0.0.1") return;
    navigator.serviceWorker.register(new URL("service-worker.js", location.href)).catch(() => {});
  }

  function saveJson() {
    downloadBlob(
      JSON.stringify({ version: 1, state: serializeStateForPersistence() }, null, 2),
      "correlation-diagram.json",
      "application/json"
    );
  }

  function loadJson(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const next = normalizeState(parsed.state || parsed);
        if (!next) throw new Error("Invalid data");
        state = next;
        selected = null;
        multiSelectedNodeIds.clear();
        inspectorOpen = false;
        mode = "select";
        pendingConnection = null;
        currentProjectId = "";
        currentProjectTitle = "";
        lastAutoSaveSnapshot = "";
        saveProjectMeta();
        commitChange();
        fitToContent(false);
        render();
      } catch {
        window.alert("JSONを読み込めませんでした。");
      } finally {
        fileInput.value = "";
      }
    });
    reader.readAsText(file);
  }

  function exportPng(scale = 1) {
    const bounds = contentBounds(36);
    const outputSize = pngOutputSize(scale, bounds);
    if (outputSize.width > PNG_MAX_DIMENSION || outputSize.height > PNG_MAX_DIMENSION || outputSize.width * outputSize.height > PNG_MAX_PIXELS) {
      window.alert(`PNGサイズが大きすぎます。倍率を下げてください。\n現在: ${outputSize.width} x ${outputSize.height}px`);
      return;
    }
    const exportSvg = svg.cloneNode(false);
    exportSvg.setAttribute("xmlns", SVG_NS);
    exportSvg.setAttribute("width", outputSize.width);
    exportSvg.setAttribute("height", outputSize.height);
    exportSvg.setAttribute("viewBox", `${bounds.x} ${bounds.y} ${bounds.w} ${bounds.h}`);
    exportSvg.appendChild(createSvg("rect", {
      x: bounds.x,
      y: bounds.y,
      width: bounds.w,
      height: bounds.h,
      fill: "#f9faf7"
    }));
    const defs = createSvg("defs");
    appendArrowMarkers(defs, state.links);
    appendObjectGradients(defs);
    exportSvg.appendChild(defs);
    const root = createSvg("g");
    const previousSelection = selected;
    const previousMultiSelection = multiSelectedNodeIds;
    selected = null;
    multiSelectedNodeIds = new Set();
    const linkLabelLayer = createSvg("g", { "data-layer": "link-labels" });
    state.groups.forEach((group) => root.appendChild(renderGroup(group)));
    state.links.forEach((link) => appendLinkWithLiftedLabel(root, linkLabelLayer, link));
    root.appendChild(linkLabelLayer);
    state.nodes.forEach((node) => root.appendChild(renderNode(node)));
    state.shapes.forEach((shape) => root.appendChild(renderShape(shape)));
    state.images.forEach((imageItem) => root.appendChild(renderInsertedImage(imageItem)));
    state.legends.forEach((legend) => root.appendChild(renderLegend(legend)));
    state.texts.forEach((textItem) => root.appendChild(renderTextItem(textItem)));
    selected = previousSelection;
    multiSelectedNodeIds = previousMultiSelection;
    exportSvg.appendChild(root);

    const source = new XMLSerializer().serializeToString(exportSvg);
    const image = new Image();
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = outputSize.width;
      canvas.height = outputSize.height;
      const context = canvas.getContext("2d");
      context.fillStyle = "#f9faf7";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (blob) downloadBlob(blob, "correlation-diagram.png", "image/png");
      }, "image/png");
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      window.alert("PNGを書き出せませんでした。");
    };
    image.src = url;
  }

  function pushHistory() {
    history.push(historySnapshot());
    if (history.length > HISTORY_LIMIT) history.shift();
  }

  function commitChange(renderAfter = true) {
    clearTimeout(changeTimer);
    const snapshot = historySnapshot();
    if (history[history.length - 1] !== snapshot) {
      history.push(snapshot);
      if (history.length > HISTORY_LIMIT) history.shift();
      future = [];
    }
    saveToStorage();
    if (renderAfter === true) render();
  }

  function scheduleChange(renderNow = true) {
    clearTimeout(changeTimer);
    if (renderNow) {
      renderDiagram();
      renderSelectionList();
      updateStatus();
    }
    changeTimer = window.setTimeout(() => commitChange(false), 280);
  }

  function undo() {
    if (history.length <= 1) return;
    future.push(history.pop());
    restoreSnapshot(history[history.length - 1]);
  }

  function redo() {
    if (!future.length) return;
    const snapshot = future.pop();
    history.push(snapshot);
    restoreSnapshot(snapshot);
  }

  function restoreSnapshot(snapshot) {
    const parsed = JSON.parse(snapshot);
    state.nodes = parsed.nodes || [];
    state.links = parsed.links || [];
    state.groups = parsed.groups || [];
    state.texts = parsed.texts || [];
    state.shapes = parsed.shapes || [];
    state.legends = parsed.legends || [];
    state.images = parsed.images || [];
    if (!Array.isArray(state.imageAssets)) state.imageAssets = [];
    migrateEmbeddedImagesToAssets(state);
    selected = null;
    updateAlignControls();
    inspectorOpen = false;
    pendingConnection = null;
    saveToStorage();
    render();
  }

  function historySnapshot() {
    migrateEmbeddedImagesToAssets(state);
    return JSON.stringify({
      nodes: state.nodes,
      links: state.links,
      groups: state.groups,
      texts: state.texts,
      shapes: state.shapes,
      legends: state.legends,
      images: state.images
    });
  }

  function serializeStateForPersistence(sourceState = state) {
    migrateEmbeddedImagesToAssets(sourceState);
    const usedIds = usedImageAssetIds(sourceState);
    return {
      nodes: sourceState.nodes,
      links: sourceState.links,
      groups: sourceState.groups,
      texts: sourceState.texts,
      shapes: sourceState.shapes,
      legends: sourceState.legends,
      images: sourceState.images,
      imageAssets: (sourceState.imageAssets || []).filter((asset) => usedIds.has(asset.id)),
      viewport: sourceState.viewport
    };
  }

  function saveToStorage(immediate = false) {
    clearTimeout(storageTimer);
    if (immediate) {
      writeToStorage();
      return;
    }
    storageTimer = window.setTimeout(writeToStorage, 420);
  }

  function writeToStorage() {
    writeStateToStorage(state);
  }

  function writeStateToStorage(sourceState) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeStateForPersistence(sourceState)));
    } catch {
      // Local storage can be unavailable in restrictive browser modes.
    }
  }

  function saveProjectMeta() {
    try {
      if (!currentProjectId) {
        localStorage.removeItem(PROJECT_META_KEY);
        return;
      }
      localStorage.setItem(PROJECT_META_KEY, JSON.stringify({
        id: currentProjectId,
        title: currentProjectTitle
      }));
    } catch {
      // Local storage can be unavailable in restrictive browser modes.
    }
  }

  function loadProjectMeta() {
    try {
      const raw = localStorage.getItem(PROJECT_META_KEY);
      if (!raw) return;
      const meta = JSON.parse(raw);
      currentProjectId = typeof meta.id === "string" ? meta.id : "";
      currentProjectTitle = typeof meta.title === "string" ? meta.title : "";
    } catch {
      currentProjectId = "";
      currentProjectTitle = "";
    }
  }

  function loadPngExportScale() {
    try {
      return clamp(Number(localStorage.getItem(PNG_SCALE_KEY)) || 1, 0.5, 4);
    } catch {
      return 1;
    }
  }

  function savePngExportScale(scale) {
    try {
      localStorage.setItem(PNG_SCALE_KEY, String(clamp(Number(scale) || 1, 0.5, 4)));
    } catch {
      // Local storage can be unavailable in restrictive browser modes.
    }
  }

  function pngOutputSize(scale, bounds = contentBounds(36)) {
    const baseWidth = Math.max(720, Math.ceil(bounds.w));
    const baseHeight = Math.max(480, Math.ceil(bounds.h));
    const factor = clamp(Number(scale) || 1, 0.5, 4);
    return {
      width: Math.max(1, Math.round(baseWidth * factor)),
      height: Math.max(1, Math.round(baseHeight * factor))
    };
  }

  function formatScale(scale) {
    const value = Number(scale) || 1;
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }

  function defaultProjectTitle() {
    const date = new Date();
    const pad = (value) => String(value).padStart(2, "0");
    return `相関図 ${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function formatProjectDate(value) {
    if (!value) return "日時不明";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "日時不明";
    const pad = (number) => String(number).padStart(2, "0");
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return normalizeState(JSON.parse(raw));
    } catch {
      return null;
    }
  }

  function normalizeState(value) {
    if (!value || !Array.isArray(value.nodes) || !Array.isArray(value.links) || !Array.isArray(value.groups)) {
      return null;
    }
    const normalized = {
      nodes: value.nodes.map((node) => ({
        id: node.id || uid("node"),
        name: String(node.name || "人物"),
        role: String(node.role || ""),
        memo: String(node.memo || ""),
        x: Number(node.x) || 0,
        y: Number(node.y) || 0,
        w: clamp(Number(node.w) || NODE_DEFAULT_WIDTH, 82, 260),
        h: clamp(Number(node.h) || NODE_DEFAULT_HEIGHT, 110, 320),
        color: node.color || PALETTE[0],
        gradient: normalizeGradient(node.gradient, node.color || PALETTE[0]),
        nameTextColor: normalizeColorValue(node.nameTextColor, "#ffffff"),
        nameOutlineColor: normalizeColorValue(node.nameOutlineColor, "#202329"),
        nameOutlineWidth: normalizeNodeOutlineWidth(node.nameOutlineWidth),
        roleTextColor: normalizeColorValue(node.roleTextColor, "#ffffff"),
        roleOutlineColor: normalizeColorValue(node.roleOutlineColor, "#202329"),
        roleOutlineWidth: normalizeNodeOutlineWidth(node.roleOutlineWidth),
        marks: normalizeNodeMarks(node.marks),
        image: typeof node.image === "string" ? node.image : "",
        imageNaturalWidth: Math.max(0, Number(node.imageNaturalWidth) || 0),
        imageNaturalHeight: Math.max(0, Number(node.imageNaturalHeight) || 0),
        imageScale: clamp(Number(node.imageScale) || 1, 1, 4),
        imageOffsetX: clamp(Number(node.imageOffsetX) || 0, -100, 100),
        imageOffsetY: clamp(Number(node.imageOffsetY) || 0, -100, 100)
      })),
      links: value.links.map(normalizeLink),
      groups: value.groups.map((group) => ({
        id: group.id || uid("group"),
        title: String(group.title || "グループ"),
        x: Number(group.x) || 0,
        y: Number(group.y) || 0,
        w: clamp(Number(group.w) || 280, GROUP_MIN_WIDTH, GROUP_MAX_WIDTH),
        h: clamp(Number(group.h) || 180, GROUP_MIN_HEIGHT, GROUP_MAX_HEIGHT),
        color: group.color || PALETTE[2],
        gradient: normalizeGradient(group.gradient, group.color || PALETTE[2]),
        titleFontSize: normalizeGroupTitleFontSize(group.titleFontSize),
        titleFontFamily: normalizeGroupTitleFontId(group.titleFontFamily)
      })),
      texts: Array.isArray(value.texts) ? value.texts.map(normalizeTextItem) : [],
      shapes: Array.isArray(value.shapes) ? value.shapes.map(normalizeShape) : [],
      legends: Array.isArray(value.legends) ? value.legends.map(normalizeLegend) : [],
      images: Array.isArray(value.images) ? value.images.map(normalizeInsertedImage) : [],
      imageAssets: normalizeImageAssets(value.imageAssets),
      viewport: value.viewport || { x: 0, y: 0, scale: 1 }
    };
    migrateEmbeddedImagesToAssets(normalized);
    return normalized;
  }

  function normalizeNodeMarks(value) {
    if (!Array.isArray(value)) return [];
    const seen = new Set();
    return value.filter((id) => {
      if (!NODE_MARK_IDS.has(id) || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  function normalizeImageAssets(value) {
    if (!Array.isArray(value)) return [];
    const normalized = {
      imageAssets: []
    };
    value.forEach((asset) => {
      const data = typeof asset?.data === "string" ? asset.data : "";
      if (!data) return;
      addImageAssetToState(
        normalized,
        data,
        asset.naturalWidth,
        asset.naturalHeight,
        typeof asset.id === "string" ? asset.id : ""
      );
    });
    return normalized.imageAssets;
  }

  function defaultGradient(primaryColor) {
    return {
      enabled: false,
      color: "#ffffff",
      direction: "horizontal"
    };
  }

  function normalizeGradient(value, primaryColor = PALETTE[0]) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const color = typeof source.color === "string" && source.color
      ? source.color
      : defaultGradient(primaryColor).color;
    const direction = GRADIENT_DIRECTION_IDS.has(source.direction) ? source.direction : "horizontal";
    return {
      enabled: Boolean(source.enabled),
      color,
      direction
    };
  }

  function normalizeGroupTitleFontSize(value) {
    return clamp(Number(value) || GROUP_TITLE_DEFAULT_FONT_SIZE, 9, 36);
  }

  function normalizeGroupTitleFontId(value) {
    return GROUP_TITLE_FONT_IDS.has(value) ? value : "default";
  }

  function groupTitleFontFamily(value) {
    const font = GROUP_TITLE_FONTS.find(([id]) => id === normalizeGroupTitleFontId(value));
    return font ? font[2] : GROUP_TITLE_FONTS[0][2];
  }

  function normalizeColorValue(value, fallback) {
    return typeof value === "string" && value ? value : fallback;
  }

  function normalizeLink(link) {
    const fromIds = normalizeEndpointIds(Array.isArray(link.fromIds) ? link.fromIds : [link.from]);
    const toIds = normalizeEndpointIds(Array.isArray(link.toIds) ? link.toIds : [link.to]);
    const normalized = {
      id: link.id || uid("link"),
      from: fromIds[0] || link.from || "",
      to: toIds[0] || link.to || "",
      fromIds,
      toIds,
      fromAnchors: normalizeAnchorMap(link.fromAnchors, fromIds),
      toAnchors: normalizeAnchorMap(link.toAnchors, toIds),
      fromTerminalOffsets: normalizeTerminalOffsetMap(link.fromTerminalOffsets, fromIds),
      toTerminalOffsets: normalizeTerminalOffsetMap(link.toTerminalOffsets, toIds),
      label: String(link.label || ""),
      type: ["line", "arrow", "bidirectional", "dashed"].includes(link.type) ? link.type : "line",
      route: ["straight", "orthogonal", "curve"].includes(link.route) ? link.route : "orthogonal",
      color: link.color || "#202329",
      labelColor: typeof link.labelColor === "string" ? link.labelColor : "",
      labelPosition: clamp(Number(link.labelPosition ?? 0.5), 0, 1),
      labelOffsetX: normalizeFreeOffset(link.labelOffsetX),
      labelOffsetY: normalizeFreeOffset(link.labelOffsetY),
      labelBackgroundColor: normalizeLinkLabelBackgroundColor(link.labelBackgroundColor),
      labelBorderColor: normalizeLinkLabelBorderColor(link.labelBorderColor),
      labelBorderWidth: normalizeLinkLabelBorderWidth(link.labelBorderWidth),
      routeOffsetX: normalizeFreeOffset(link.routeOffsetX),
      routeOffsetY: normalizeFreeOffset(link.routeOffsetY),
      width: clamp(Number(link.width) || 1.5, 0.5, 9)
    };
    syncLinkEndpoints(normalized);
    return normalized;
  }

  function normalizeLinkLabelBorderWidth(value) {
    if (value === undefined || value === null || value === "") return 1;
    return clamp(Number(value) || 0, 0, 10);
  }

  function normalizeLinkLabelBackgroundColor(value) {
    if (value === "transparent" || value === "none") return "transparent";
    return typeof value === "string" && value ? value : LINK_LABEL_DEFAULT_BACKGROUND;
  }

  function normalizeLinkLabelBorderColor(value) {
    if (value === "transparent" || value === "none") return "transparent";
    return typeof value === "string" && value ? value : LINK_LABEL_DEFAULT_BORDER;
  }

  function linkLabelPaintColor(value) {
    return value === "transparent" ? "" : value;
  }

  function normalizeTextItem(textItem) {
    const source = textItem && typeof textItem === "object" ? textItem : {};
    const align = ["left", "center", "right"].includes(source.align) ? source.align : "left";
    return {
      id: source.id || uid("text"),
      content: String(source.content || "テキスト"),
      x: Number(source.x) || 0,
      y: Number(source.y) || 0,
      w: clamp(Number(source.w) || TEXT_DEFAULT_WIDTH, 60, 520),
      fontSize: clamp(Number(source.fontSize) || 20, 8, 56),
      color: source.color || "#202329",
      align,
      backgroundColor: typeof source.backgroundColor === "string" ? source.backgroundColor : "",
      borderColor: typeof source.borderColor === "string" ? source.borderColor : "",
      borderWidth: clamp(Number(source.borderWidth) || 1, 1, 10),
      outline: Boolean(source.outline),
      bold: Boolean(source.bold)
    };
  }

  function normalizeShape(shape) {
    const source = shape && typeof shape === "object" ? shape : {};
    const type = SHAPE_TYPE_IDS.has(source.type) ? source.type : "rect";
    return {
      id: source.id || uid("shape"),
      type,
      x: Number(source.x) || 0,
      y: Number(source.y) || 0,
      w: clamp(Number(source.w) || SHAPE_DEFAULT_WIDTH, 20, 900),
      h: clamp(Number(source.h) || SHAPE_DEFAULT_HEIGHT, 20, 900),
      rotation: clamp(Number(source.rotation) || 0, -180, 180),
      fill: typeof source.fill === "string" ? source.fill : "#ffffff",
      stroke: typeof source.stroke === "string" ? source.stroke : "#202329",
      strokeWidth: clamp(Number(source.strokeWidth) || 0, 0, 24),
      opacity: clamp(Number(source.opacity) || 1, 0.05, 1)
    };
  }

  function normalizeLegend(legend) {
    const source = legend && typeof legend === "object" ? legend : {};
    return {
      id: source.id || uid("legend"),
      title: String(source.title || "属性マーク凡例"),
      x: Number(source.x) || 0,
      y: Number(source.y) || 0,
      w: clamp(Number(source.w) || LEGEND_DEFAULT_WIDTH, 150, 620),
      fontSize: clamp(Number(source.fontSize) || LEGEND_DEFAULT_FONT_SIZE, 9, 28),
      color: source.color || "#202329",
      backgroundColor: typeof source.backgroundColor === "string" ? source.backgroundColor : "#ffffff",
      borderColor: typeof source.borderColor === "string" ? source.borderColor : "#d8ded8",
      items: normalizeLegendItems(source.items)
    };
  }

  function normalizeLegendItems(value) {
    const sourceItems = Array.isArray(value) ? value : [];
    const sourceByMark = new Map(sourceItems.map((item) => [String(item?.markId || ""), item]));
    return NODE_MARKS.map((mark) => {
      const source = sourceByMark.get(mark.id) || {};
      return {
        markId: mark.id,
        text: String(source.text || mark.label),
        visible: source.visible !== false
      };
    });
  }

  function normalizeInsertedImage(imageItem) {
    const source = imageItem && typeof imageItem === "object" ? imageItem : {};
    const naturalWidth = Math.max(0, Number(source.naturalWidth) || 0);
    const naturalHeight = Math.max(0, Number(source.naturalHeight) || 0);
    const fallbackSize = insertedImageSize(naturalWidth, naturalHeight);
    return {
      id: source.id || uid("image"),
      name: String(source.name || "画像"),
      src: typeof source.src === "string" ? source.src : "",
      x: Number(source.x) || 0,
      y: Number(source.y) || 0,
      w: clamp(Number(source.w) || fallbackSize.w, 24, 1200),
      h: clamp(Number(source.h) || fallbackSize.h, 24, 1200),
      naturalWidth,
      naturalHeight,
      opacity: clamp(Number(source.opacity) || 1, 0.05, 1),
      borderColor: typeof source.borderColor === "string" ? source.borderColor : "",
      borderWidth: clamp(Number(source.borderWidth) || 1, 1, 24),
      keepAspect: source.keepAspect !== false
    };
  }

  function updateStatus() {
    const item = selected ? getSelectedItem() : null;
    if (mode === "connect" && pendingConnection) {
      const endpoint = getConnectionEndpoint(pendingConnection);
      statusText.textContent = `${endpoint?.label || "選択項目"} から接続`;
      return;
    }
    if (mode === "connect") {
      statusText.textContent = "関係作成";
      return;
    }
    if (!item) {
      statusText.textContent = "未選択";
      return;
    }
    if (selected.type === "node") statusText.textContent = `人物: ${item.name || "人物"}`;
    if (selected.type === "group") statusText.textContent = `グループ: ${item.title || "グループ"}`;
    if (selected.type === "link") statusText.textContent = `関係: ${item.label || "無題"}`;
    if (selected.type === "text") statusText.textContent = `文章: ${truncate(firstTextLine(item.content) || "テキスト", 18)}`;
    if (selected.type === "shape") statusText.textContent = `図形: ${shapeLabel(item)}`;
    if (selected.type === "image") statusText.textContent = `画像: ${item.name || "画像"}`;
    if (selected.type === "legend") statusText.textContent = `凡例: ${item.title || "属性マーク凡例"}`;
  }

  function shapeLabel(shape) {
    return SHAPE_TYPES.find(([type]) => type === shape.type)?.[1] || "図形";
  }

  function selectionDotStyle(item) {
    const gradient = normalizeGradient(item.gradient, item.color || PALETTE[0]);
    if (!gradient.enabled) return `background:${item.color || PALETTE[0]}`;
    const angle = gradientCssAngle(gradient.direction);
    return `background:linear-gradient(${angle}, ${item.color || PALETTE[0]}, ${gradient.color})`;
  }

  function gradientCssAngle(direction) {
    if (direction === "vertical") return "180deg";
    if (direction === "diagonal") return "135deg";
    if (direction === "reverse-diagonal") return "225deg";
    return "90deg";
  }

  function fitToContent(animate) {
    const bounds = contentBounds(60);
    const width = Math.max(svg.clientWidth, 320);
    const height = Math.max(svg.clientHeight, 320);
    const minScale = width <= 760 ? 0.68 : 0.3;
    const scale = clamp(Math.min(width / bounds.w, height / bounds.h), minScale, 1.35);
    state.viewport.scale = scale;
    state.viewport.x = width / 2 - (bounds.x + bounds.w / 2) * scale;
    state.viewport.y = height / 2 - (bounds.y + bounds.h / 2) * scale;
    if (animate) saveToStorage();
  }

  function centerViewport() {
    const bounds = contentBounds(0);
    const width = Math.max(svg.clientWidth, 320);
    const height = Math.max(svg.clientHeight, 320);
    state.viewport.x = width / 2 - (bounds.x + bounds.w / 2) * state.viewport.scale;
    state.viewport.y = height / 2 - (bounds.y + bounds.h / 2) * state.viewport.scale;
    saveToStorage();
  }

  function zoomBy(factor) {
    const center = screenCenterWorld();
    state.viewport.scale = clamp(state.viewport.scale * factor, 0.25, 2.8);
    const width = Math.max(svg.clientWidth, 320);
    const height = Math.max(svg.clientHeight, 320);
    state.viewport.x = width / 2 - center.x * state.viewport.scale;
    state.viewport.y = height / 2 - center.y * state.viewport.scale;
    saveToStorage();
    render();
  }

  function contentBounds(padding) {
    const boxes = [
      ...state.nodes.map((node) => ({ x: node.x, y: node.y, w: node.w, h: node.h })),
      ...state.groups.map((group) => ({ x: group.x, y: group.y, w: group.w, h: group.h })),
      ...state.texts.map(textItemBounds),
      ...state.shapes.map(shapeBounds),
      ...state.images.map(imageBounds),
      ...state.legends.map(legendBounds)
    ];
    if (!boxes.length) return { x: -250, y: -180, w: 500, h: 360 };
    const minX = Math.min(...boxes.map((box) => box.x)) - padding;
    const minY = Math.min(...boxes.map((box) => box.y)) - padding;
    const maxX = Math.max(...boxes.map((box) => box.x + box.w)) + padding;
    const maxY = Math.max(...boxes.map((box) => box.y + box.h)) + padding;
    return {
      x: minX,
      y: minY,
      w: Math.max(1, maxX - minX),
      h: Math.max(1, maxY - minY)
    };
  }

  function getNodeImageFrame(node) {
    const { roleBandHeight, nameBandHeight } = nodeFrameMetrics(node);
    return {
      roleBandHeight,
      nameBandHeight,
      imageBox: {
        x: node.x,
        y: node.y + roleBandHeight,
        w: node.w,
        h: Math.max(30, node.h - roleBandHeight - nameBandHeight)
      }
    };
  }

  function nodeFrameMetrics(node) {
    const nameLimit = clamp(Math.floor((node.w - 12) / 11), 3, 14);
    const roleLimit = clamp(Math.floor((node.w - 12) / 10), 3, 14);
    const nameLines = wrapLabel(node.name || "人物", nameLimit, 2);
    const roleLines = wrapLabel(node.role || "肩書き", roleLimit, 4);
    const roleFontSize = roleLines.length > 1 ? 9.5 : 11;
    const roleLineGap = roleLines.length > 1 ? 10.5 : 0;
    const roleBlockHeight = roleFontSize + roleLineGap * (roleLines.length - 1);
    const roleBandHeight = Math.max(21, Math.ceil(roleBlockHeight + 10));
    const nameFontSize = nameLines.length > 1 ? 10.5 : 12.5;
    const nameLineGap = nameLines.length > 1 ? 11 : 0;
    const nameBlockHeight = nameFontSize + nameLineGap * (nameLines.length - 1);
    const nameBandHeight = nameLines.length > 1 ? 31 : 24;
    return {
      nameLines,
      roleLines,
      roleBandHeight,
      nameBandHeight,
      roleFontSize,
      roleLineGap,
      roleBlockHeight,
      nameFontSize,
      nameLineGap,
      nameBlockHeight
    };
  }

  function computeImageDraw(node, box, overrides = {}) {
    const sourceWidth = Number(overrides.imageNaturalWidth) || Number(node.imageNaturalWidth) || 0;
    const sourceHeight = Number(overrides.imageNaturalHeight) || Number(node.imageNaturalHeight) || 0;
    if (!sourceWidth || !sourceHeight) {
      return {
        x: box.x,
        y: box.y,
        w: box.w,
        h: box.h,
        preserveAspectRatio: "xMidYMid slice"
      };
    }
    const naturalWidth = Math.max(1, sourceWidth);
    const naturalHeight = Math.max(1, sourceHeight);
    const scale = clamp(Number(overrides.imageScale ?? node.imageScale) || 1, 1, 4);
    const offsetX = clamp(Number(overrides.imageOffsetX ?? node.imageOffsetX) || 0, -100, 100) / 100;
    const offsetY = clamp(Number(overrides.imageOffsetY ?? node.imageOffsetY) || 0, -100, 100) / 100;
    const naturalAspect = naturalWidth / naturalHeight;
    const boxAspect = box.w / box.h;
    let baseWidth;
    let baseHeight;
    if (naturalAspect > boxAspect) {
      baseHeight = box.h;
      baseWidth = box.h * naturalAspect;
    } else {
      baseWidth = box.w;
      baseHeight = box.w / naturalAspect;
    }
    const width = baseWidth * scale;
    const height = baseHeight * scale;
    const extraX = Math.max(0, width - box.w);
    const extraY = Math.max(0, height - box.h);
    return {
      x: box.x - extraX / 2 + offsetX * extraX / 2,
      y: box.y - extraY / 2 + offsetY * extraY / 2,
      w: width,
      h: height
    };
  }

  function screenCenterWorld() {
    const width = Math.max(svg.clientWidth, 320);
    const height = Math.max(svg.clientHeight, 320);
    return {
      x: (width / 2 - state.viewport.x) / state.viewport.scale,
      y: (height / 2 - state.viewport.y) / state.viewport.scale
    };
  }

  function clientToScreen(event) {
    const rect = svg.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function clientToWorld(event) {
    const screen = clientToScreen(event);
    return screenToWorld(screen);
  }

  function screenToWorld(screen) {
    return {
      x: (screen.x - state.viewport.x) / state.viewport.scale,
      y: (screen.y - state.viewport.y) / state.viewport.scale
    };
  }

  function worldToScreen(point) {
    return {
      x: point.x * state.viewport.scale + state.viewport.x,
      y: point.y * state.viewport.scale + state.viewport.y
    };
  }

  function midpoint(a, b) {
    return {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2
    };
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function findDiagramTarget(target) {
    let current = target;
    while (current && current !== svg) {
      const type = current.getAttribute?.("data-type");
      const id = current.getAttribute?.("data-id");
      if (type && id && type !== "link") return {
        type,
        id,
        side: current.getAttribute?.("data-side") || "",
        endpointId: current.getAttribute?.("data-endpoint-id") || "",
        axis: current.getAttribute?.("data-axis") || ""
      };
      current = current.parentNode;
    }
    current = target;
    while (current && current !== svg) {
      const type = current.getAttribute?.("data-type");
      const id = current.getAttribute?.("data-id");
      if (type && id) return {
        type,
        id,
        side: current.getAttribute?.("data-side") || "",
        endpointId: current.getAttribute?.("data-endpoint-id") || "",
        axis: current.getAttribute?.("data-axis") || ""
      };
      current = current.parentNode;
    }
    return null;
  }

  function getSelectedItem() {
    if (!selected) return null;
    if (selected.type === "node") return getNode(selected.id);
    if (selected.type === "group") return getGroup(selected.id);
    if (selected.type === "link") return getLink(selected.id);
    if (selected.type === "text") return getTextItem(selected.id);
    if (selected.type === "shape") return getShape(selected.id);
    if (selected.type === "image") return getImageItem(selected.id);
    if (selected.type === "legend") return getLegend(selected.id);
    return null;
  }

  function getNode(id) {
    return state.nodes.find((node) => node.id === id);
  }

  function getGroup(id) {
    return state.groups.find((group) => group.id === id);
  }

  function getLink(id) {
    return state.links.find((link) => link.id === id);
  }

  function getTextItem(id) {
    return state.texts.find((textItem) => textItem.id === id);
  }

  function getShape(id) {
    return state.shapes.find((shape) => shape.id === id);
  }

  function getImageItem(id) {
    return state.images.find((imageItem) => imageItem.id === id);
  }

  function getLegend(id) {
    return state.legends.find((legend) => legend.id === id);
  }

  function getLinkEndpointIds(link, side) {
    const fallback = side === "fromIds" ? link.from : link.to;
    const ids = Array.isArray(link[side]) ? link[side] : [fallback];
    return normalizeEndpointIds(ids);
  }

  function getLinkEndpointEntries(link, sideName) {
    const side = sideName === "from" ? "fromIds" : "toIds";
    return getLinkEndpointIds(link, side)
      .map((id) => {
        const endpoint = getConnectionEndpoint(id);
        if (!endpoint) return null;
        return {
          id,
          ...endpoint,
          center: itemCenter(endpoint.item)
        };
      })
      .filter(Boolean);
  }

  function getConnectionCandidates() {
    return [
      ...state.nodes.map((node) => ({ id: node.id, label: `人物: ${node.name || "人物"}` })),
      ...state.groups.map((group) => ({ id: group.id, label: `グループ: ${group.title || "グループ"}` }))
    ];
  }

  function updateLinkEndpoint(link, side, id, checked) {
    resetWorkspaceGesture();
    const oppositeSide = side === "fromIds" ? "toIds" : "fromIds";
    let current = getLinkEndpointIds(link, side);
    let opposite = getLinkEndpointIds(link, oppositeSide);
    if (checked) {
      if (opposite.includes(id) && opposite.length <= 1) {
        render();
        return;
      }
      current = normalizeEndpointIds([...current, id]);
      opposite = opposite.filter((endpointId) => endpointId !== id);
    } else {
      if (current.length <= 1) {
        render();
        return;
      }
      current = current.filter((endpointId) => endpointId !== id);
    }
    link[side] = current;
    link[oppositeSide] = opposite;
    syncLinkEndpoints(link);
    commitChange();
  }

  function updateLinkAnchor(link, side, endpointId, value) {
    resetWorkspaceGesture();
    setLinkAnchorValue(link, side, endpointId, value);
    scheduleChange();
    renderInspector();
  }

  function setLinkAnchorValue(link, side, endpointId, value) {
    const mapKey = anchorMapKey(side);
    const ids = getLinkEndpointIds(link, side === "from" ? "fromIds" : side === "to" ? "toIds" : side);
    const anchors = normalizeAnchorMap(link[mapKey], ids);
    if (isCustomAnchor(value)) {
      anchors[endpointId] = value;
    } else if (value === CUSTOM_ANCHOR_OPTION) {
      const current = getLinkAnchor(link, side, endpointId);
      anchors[endpointId] = isCustomAnchor(current) ? current : makeCustomAnchor(0.5, 0.5);
    } else if (ANCHOR_KEYS.has(value) && value !== "auto") {
      anchors[endpointId] = value;
    } else {
      delete anchors[endpointId];
    }
    link[mapKey] = anchors;
  }

  function syncLinkEndpoints(link) {
    link.fromIds = getLinkEndpointIds(link, "fromIds");
    link.toIds = getLinkEndpointIds(link, "toIds");
    link.from = link.fromIds[0] || "";
    link.to = link.toIds[0] || "";
    link.fromAnchors = normalizeAnchorMap(link.fromAnchors, link.fromIds);
    link.toAnchors = normalizeAnchorMap(link.toAnchors, link.toIds);
    link.fromTerminalOffsets = normalizeTerminalOffsetMap(link.fromTerminalOffsets, link.fromIds);
    link.toTerminalOffsets = normalizeTerminalOffsetMap(link.toTerminalOffsets, link.toIds);
  }

  function linkReferencesEndpoint(link, id) {
    return getLinkEndpointIds(link, "fromIds").includes(id) || getLinkEndpointIds(link, "toIds").includes(id);
  }

  function normalizeEndpointIds(ids) {
    return [...new Set((ids || []).map((id) => String(id || "")).filter(Boolean))];
  }

  function getLinkAnchor(link, side, endpointId) {
    const map = link[anchorMapKey(side)] || {};
    const value = String(map[endpointId] || "auto");
    return isCustomAnchor(value) || ANCHOR_KEYS.has(value) ? value : "auto";
  }

  function anchorMapKey(side) {
    return side === "from" || side === "fromIds" ? "fromAnchors" : "toAnchors";
  }

  function terminalOffsetMapKey(side) {
    return side === "from" || side === "fromIds" ? "fromTerminalOffsets" : "toTerminalOffsets";
  }

  function getLinkTerminalOffset(link, side, endpointId) {
    const map = link[terminalOffsetMapKey(side)] || {};
    const source = map[endpointId] && typeof map[endpointId] === "object" ? map[endpointId] : {};
    return {
      x: normalizeFreeOffset(source.x),
      y: normalizeFreeOffset(source.y)
    };
  }

  function setLinkTerminalOffset(link, side, endpointId, offset) {
    const key = terminalOffsetMapKey(side);
    const ids = getLinkEndpointIds(link, side === "from" ? "fromIds" : "toIds");
    const next = normalizeTerminalOffsetMap(link[key], ids);
    const x = normalizeFreeOffset(offset?.x);
    const y = normalizeFreeOffset(offset?.y);
    if (Math.abs(x) > 0.001 || Math.abs(y) > 0.001) {
      next[endpointId] = { x, y };
    } else {
      delete next[endpointId];
    }
    link[key] = next;
  }

  function normalizeAnchorMap(value, endpointIds) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const allowedIds = new Set(endpointIds || []);
    const next = {};
    Object.entries(source).forEach(([id, anchor]) => {
      const key = String(anchor || "");
      if (!allowedIds.has(id)) return;
      if (isCustomAnchor(key)) {
        const parsed = parseCustomAnchor(key);
        next[id] = makeCustomAnchor(parsed.x, parsed.y);
      } else if (ANCHOR_KEYS.has(key) && key !== "auto") {
        next[id] = key;
      }
    });
    return next;
  }

  function normalizeTerminalOffsetMap(value, endpointIds) {
    const source = value && typeof value === "object" && !Array.isArray(value) ? value : {};
    const allowedIds = new Set(endpointIds || []);
    const next = {};
    Object.entries(source).forEach(([id, offset]) => {
      if (!allowedIds.has(id) || !offset || typeof offset !== "object") return;
      const x = normalizeFreeOffset(offset.x);
      const y = normalizeFreeOffset(offset.y);
      if (Math.abs(x) > 0.001 || Math.abs(y) > 0.001) next[id] = { x, y };
    });
    return next;
  }

  function isCustomAnchor(value) {
    return Boolean(parseCustomAnchor(value));
  }

  function parseCustomAnchor(value) {
    const text = String(value || "");
    if (!text.startsWith(CUSTOM_ANCHOR_PREFIX)) return null;
    const parts = text.slice(CUSTOM_ANCHOR_PREFIX.length).split(",");
    if (parts.length !== 2) return null;
    const x = Number(parts[0]);
    const y = Number(parts[1]);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return {
      x: clamp(x, 0, 1),
      y: clamp(y, 0, 1)
    };
  }

  function makeCustomAnchor(x, y) {
    return `${CUSTOM_ANCHOR_PREFIX}${clamp(Number(x) || 0, 0, 1).toFixed(4)},${clamp(Number(y) || 0, 0, 1).toFixed(4)}`;
  }

  function edgeAnchorRatioFromPoint(item, point) {
    const width = Math.max(1, Number(item.w) || 1);
    const height = Math.max(1, Number(item.h) || 1);
    let x = clamp((point.x - item.x) / width, 0, 1);
    let y = clamp((point.y - item.y) / height, 0, 1);
    const leftDistance = Math.abs(point.x - item.x);
    const rightDistance = Math.abs(point.x - (item.x + width));
    const topDistance = Math.abs(point.y - item.y);
    const bottomDistance = Math.abs(point.y - (item.y + height));
    const outsideX = point.x < item.x || point.x > item.x + width;
    const outsideY = point.y < item.y || point.y > item.y + height;
    if (outsideX || outsideY) {
      if (outsideX && leftDistance <= rightDistance) x = 0;
      if (outsideX && rightDistance < leftDistance) x = 1;
      if (outsideY && topDistance <= bottomDistance) y = 0;
      if (outsideY && bottomDistance < topDistance) y = 1;
      return { x, y };
    }
    const nearest = Math.min(leftDistance, rightDistance, topDistance, bottomDistance);
    if (nearest === topDistance) return { x, y: 0 };
    if (nearest === bottomDistance) return { x, y: 1 };
    if (nearest === leftDistance) return { x: 0, y };
    return { x: 1, y };
  }

  function anchorRatioFromValue(value) {
    const custom = parseCustomAnchor(value);
    if (custom) return custom;
    const ratios = {
      "top-left": { x: 0, y: 0 },
      "top-left-edge": { x: 0.25, y: 0 },
      top: { x: 0.5, y: 0 },
      "top-right-edge": { x: 0.75, y: 0 },
      "top-right": { x: 1, y: 0 },
      "right-top-edge": { x: 1, y: 0.25 },
      right: { x: 1, y: 0.5 },
      "right-bottom-edge": { x: 1, y: 0.75 },
      "bottom-right": { x: 1, y: 1 },
      "bottom-right-edge": { x: 0.75, y: 1 },
      bottom: { x: 0.5, y: 1 },
      "bottom-left-edge": { x: 0.25, y: 1 },
      "bottom-left": { x: 0, y: 1 },
      "left-bottom-edge": { x: 0, y: 0.75 },
      left: { x: 0, y: 0.5 },
      "left-top-edge": { x: 0, y: 0.25 },
      auto: { x: 0.5, y: 0.5 }
    };
    return ratios[value] || ratios.auto;
  }

  function getConnectionEndpoint(id) {
    const node = getNode(id);
    if (node) {
      return {
        type: "node",
        item: node,
        label: node.name || "人物"
      };
    }
    const group = getGroup(id);
    if (group) {
      return {
        type: "group",
        item: group,
        label: group.title || "グループ"
      };
    }
    return null;
  }

  function isConnectableTarget(target) {
    return (target?.type === "node" || target?.type === "group") && Boolean(getConnectionEndpoint(target.id));
  }

  function isSelected(type, id) {
    return selected?.type === type && selected?.id === id;
  }

  function edgePoint(from, to) {
    const fromCenter = { x: from.x + from.w / 2, y: from.y + from.h / 2 };
    const toCenter = { x: to.x + to.w / 2, y: to.y + to.h / 2 };
    const dx = toCenter.x - fromCenter.x;
    const dy = toCenter.y - fromCenter.y;
    if (dx === 0 && dy === 0) return fromCenter;
    const scale = Math.min(
      Math.abs((from.w / 2 + 4) / (dx || 0.0001)),
      Math.abs((from.h / 2 + 4) / (dy || 0.0001))
    );
    return {
      x: fromCenter.x + dx * scale,
      y: fromCenter.y + dy * scale
    };
  }

  function attachmentPoint(item, endpointId, link, side, toward) {
    const anchors = attachmentAnchors(item);
    const selectedAnchor = getLinkAnchor(link, side, endpointId);
    const customAnchor = parseCustomAnchor(selectedAnchor);
    if (customAnchor) {
      return {
        x: item.x + item.w * customAnchor.x,
        y: item.y + item.h * customAnchor.y
      };
    }
    if (selectedAnchor !== "auto") {
      const anchor = anchors.find((candidate) => candidate.key === selectedAnchor);
      if (anchor) return anchor.point;
    }
    const preferred = nearestAnchorIndex(anchors, toward);
    const spreadIndex = endpointUsageIndex(endpointId, link.id, side);
    const anchorIndex = wrapIndex(preferred + anchorSpreadOffset(spreadIndex), anchors.length);
    return anchors[anchorIndex].point;
  }

  function attachmentAnchors(item) {
    const left = item.x;
    const centerX = item.x + item.w / 2;
    const right = item.x + item.w;
    const quarterX = item.x + item.w * 0.25;
    const threeQuarterX = item.x + item.w * 0.75;
    const top = item.y;
    const centerY = item.y + item.h / 2;
    const bottom = item.y + item.h;
    const quarterY = item.y + item.h * 0.25;
    const threeQuarterY = item.y + item.h * 0.75;
    return [
      { key: "top-left", point: { x: left, y: top } },
      { key: "top-left-edge", point: { x: quarterX, y: top } },
      { key: "top", point: { x: centerX, y: top } },
      { key: "top-right-edge", point: { x: threeQuarterX, y: top } },
      { key: "top-right", point: { x: right, y: top } },
      { key: "right-top-edge", point: { x: right, y: quarterY } },
      { key: "right", point: { x: right, y: centerY } },
      { key: "right-bottom-edge", point: { x: right, y: threeQuarterY } },
      { key: "bottom-right", point: { x: right, y: bottom } },
      { key: "bottom-right-edge", point: { x: threeQuarterX, y: bottom } },
      { key: "bottom", point: { x: centerX, y: bottom } },
      { key: "bottom-left-edge", point: { x: quarterX, y: bottom } },
      { key: "bottom-left", point: { x: left, y: bottom } },
      { key: "left-bottom-edge", point: { x: left, y: threeQuarterY } },
      { key: "left", point: { x: left, y: centerY } },
      { key: "left-top-edge", point: { x: left, y: quarterY } }
    ];
  }

  function nearestAnchorIndex(anchors, toward) {
    let bestIndex = 0;
    let bestDistance = Infinity;
    anchors.forEach((anchor, index) => {
      const currentDistance = distance(anchor.point, toward);
      if (currentDistance < bestDistance) {
        bestDistance = currentDistance;
        bestIndex = index;
      }
    });
    return bestIndex;
  }

  function endpointUsageIndex(endpointId, linkId, side) {
    const usages = [];
    state.links.forEach((candidate) => {
      getLinkEndpointIds(candidate, "fromIds").forEach((id) => {
        if (id === endpointId) usages.push({ linkId: candidate.id, side: "from" });
      });
      getLinkEndpointIds(candidate, "toIds").forEach((id) => {
        if (id === endpointId) usages.push({ linkId: candidate.id, side: "to" });
      });
    });
    const index = usages.findIndex((usage) => usage.linkId === linkId && usage.side === side);
    return index < 0 ? 0 : index;
  }

  function anchorSpreadOffset(index) {
    return [0, 1, -1, 2, -2, 3, -3, 4, -4, 5, -5, 6, -6, 7, -7, 8][index % 16];
  }

  function wrapIndex(index, length) {
    return ((index % length) + length) % length;
  }

  function orthogonalBranchPath(start, end, trunkAxis, side) {
    return polylinePath(orthogonalBranchPoints(start, end, trunkAxis, side, []));
  }

  function singleOrthogonalPolyline(link, fromEndpoint, toEndpoint) {
    return singleOrthogonalGeometry(link, fromEndpoint, toEndpoint).points;
  }

  function singleOrthogonalGeometry(link, fromEndpoint, toEndpoint) {
    const start = attachmentPoint(fromEndpoint.item, fromEndpoint.id, link, "from", toEndpoint.center);
    const end = attachmentPoint(toEndpoint.item, toEndpoint.id, link, "to", fromEndpoint.center);
    const startTerminal = linkTerminalStubPoint(link, "from", fromEndpoint.id, fromEndpoint.item, start);
    const endTerminal = linkTerminalStubPoint(link, "to", toEndpoint.id, toEndpoint.item, end);
    const routeStart = startTerminal?.point || start;
    const routeEnd = endTerminal?.point || end;
    const preferredAxis = startTerminal?.axis
      || endTerminal?.axis
      || (Math.abs(routeEnd.x - routeStart.x) >= Math.abs(routeEnd.y - routeStart.y) ? "horizontal" : "vertical");
    const hasManualOffset = Math.abs(normalizedLinkRouteOffsetX(link)) > 0.001 || Math.abs(normalizedLinkRouteOffsetY(link)) > 0.001;
    const routed = hasManualOffset
      ? manualOrthogonalRoutePoints(link, routeStart, routeEnd, preferredAxis)
      : routeOrthogonalPoints(routeStart, routeEnd, preferredAxis, linkNodeObstacles(new Set([fromEndpoint.id, toEndpoint.id])));
    const points = [start];
    if (startTerminal) points.push(startTerminal.point);
    points.push(...routed);
    if (endTerminal) points.push(endTerminal.point);
    points.push(end);
    return {
      points: compactPolyline(points),
      startTerminal,
      endTerminal
    };
  }

  function manualOrthogonalRoutePoints(link, start, end, preferredAxis) {
    const center = {
      x: (start.x + end.x) / 2 + normalizedLinkRouteOffsetX(link),
      y: (start.y + end.y) / 2 + normalizedLinkRouteOffsetY(link)
    };
    if (preferredAxis === "horizontal") {
      return compactPolyline([
        start,
        { x: center.x, y: start.y },
        center,
        { x: end.x, y: center.y },
        end
      ]);
    }
    return compactPolyline([
      start,
      { x: start.x, y: center.y },
      center,
      { x: center.x, y: end.y },
      end
    ]);
  }

  function orthogonalBranchPoints(start, end, trunkAxis, side, obstacles, terminals = {}) {
    const routeStart = terminals.start?.point || start;
    const routeEnd = terminals.end?.point || end;
    let elbow;
    if (trunkAxis === "horizontal") {
      elbow = side === "from"
        ? { x: routeEnd.x, y: routeStart.y }
        : { x: routeStart.x, y: routeEnd.y };
    } else {
      elbow = side === "from"
        ? { x: routeStart.x, y: routeEnd.y }
        : { x: routeEnd.x, y: routeStart.y };
    }
    const preferred = [routeStart, elbow, routeEnd];
    const routed = polylineIsClear(preferred, obstacles)
      ? preferred
      : routeOrthogonalPoints(routeStart, routeEnd, sameY(routeStart, elbow) ? "horizontal" : "vertical", obstacles);
    const points = terminals.start ? [start, ...routed] : [...routed];
    if (terminals.end) points.push(end);
    return compactPolyline(points);
  }

  function terminalStubPoint(item, anchor) {
    const onLeft = sameCoord(anchor.x, item.x);
    const onRight = sameCoord(anchor.x, item.x + item.w);
    const onTop = sameCoord(anchor.y, item.y);
    const onBottom = sameCoord(anchor.y, item.y + item.h);
    const onHorizontalEdge = onTop || onBottom;
    const onVerticalEdge = onLeft || onRight;
    if (onHorizontalEdge && onVerticalEdge) return null;
    if (onLeft) return { point: { x: item.x - LINK_TERMINAL_STUB, y: anchor.y }, axis: "horizontal" };
    if (onRight) return { point: { x: item.x + item.w + LINK_TERMINAL_STUB, y: anchor.y }, axis: "horizontal" };
    if (onTop) return { point: { x: anchor.x, y: item.y - LINK_TERMINAL_STUB }, axis: "vertical" };
    if (onBottom) return { point: { x: anchor.x, y: item.y + item.h + LINK_TERMINAL_STUB }, axis: "vertical" };
    return null;
  }

  function linkTerminalStubPoint(link, side, endpointId, item, anchor) {
    const terminal = terminalStubPoint(item, anchor);
    if (!terminal) return null;
    const offset = getLinkTerminalOffset(link, side, endpointId);
    if (terminal.axis === "horizontal") {
      return {
        ...terminal,
        point: {
          x: terminal.point.x + offset.x,
          y: terminal.point.y
        }
      };
    }
    return {
      ...terminal,
      point: {
        x: terminal.point.x,
        y: terminal.point.y + offset.y
      }
    };
  }

  function chooseTrunkCoordinate(axis, base, rangeStart, rangeEnd, obstacles) {
    const candidates = trunkCoordinateCandidates(axis, base, obstacles);
    let best = base;
    let bestScore = Infinity;
    candidates.forEach((candidate) => {
      const start = axis === "vertical"
        ? { x: candidate, y: rangeStart }
        : { x: rangeStart, y: candidate };
      const end = axis === "vertical"
        ? { x: candidate, y: rangeEnd }
        : { x: rangeEnd, y: candidate };
      const hits = segmentObstacleCount(start, end, obstacles);
      const score = hits * 100000 + Math.abs(candidate - base);
      if (score < bestScore) {
        best = candidate;
        bestScore = score;
      }
    });
    return best;
  }

  function trunkCoordinateCandidates(axis, base, obstacles) {
    const coords = [base];
    if (obstacles.length) {
      const starts = obstacles.map((rect) => axis === "vertical" ? rect.x : rect.y);
      const ends = obstacles.map((rect) => axis === "vertical" ? rect.x + rect.w : rect.y + rect.h);
      coords.push(Math.min(...starts) - LINK_ROUTE_OUTER_PADDING, Math.max(...ends) + LINK_ROUTE_OUTER_PADDING);
      obstacles.forEach((rect) => {
        if (axis === "vertical") {
          coords.push(rect.x, rect.x + rect.w);
        } else {
          coords.push(rect.y, rect.y + rect.h);
        }
      });
    }
    return uniqueSortedNumbers(coords);
  }

  function routeOrthogonalPoints(start, end, preferredAxis, obstacles) {
    const scopedObstacles = scopedRouteObstacles(start, end, obstacles);
    const cacheKey = linkRouteCacheKey(start, end, preferredAxis, scopedObstacles);
    const cached = linkRouteCache.get(cacheKey);
    if (cached) {
      linkRouteCache.delete(cacheKey);
      linkRouteCache.set(cacheKey, cached);
      return clonePolyline(cached);
    }
    const direct = routeCandidatePoints(start, end, preferredAxis);
    if (polylineIsClear(direct, scopedObstacles)) {
      rememberLinkRoute(cacheKey, direct);
      return direct;
    }
    const alternate = routeCandidatePoints(start, end, preferredAxis === "horizontal" ? "vertical" : "horizontal");
    if (polylineIsClear(alternate, scopedObstacles)) {
      rememberLinkRoute(cacheKey, alternate);
      return alternate;
    }

    const gridRoute = findGridRoute(start, end, preferredAxis, scopedObstacles);
    const result = gridRoute || direct;
    rememberLinkRoute(cacheKey, result);
    return result;
  }

  function scopedRouteObstacles(start, end, obstacles) {
    if (!obstacles.length) return obstacles;
    const padding = LINK_ROUTE_OUTER_PADDING * 2 + LINK_AVOID_PADDING;
    const minX = Math.min(start.x, end.x) - padding;
    const maxX = Math.max(start.x, end.x) + padding;
    const minY = Math.min(start.y, end.y) - padding;
    const maxY = Math.max(start.y, end.y) + padding;
    return obstacles.filter((rect) => rectIntersectsBounds(rect, minX, minY, maxX, maxY));
  }

  function rectIntersectsBounds(rect, minX, minY, maxX, maxY) {
    return rect.x + rect.w >= minX && rect.x <= maxX && rect.y + rect.h >= minY && rect.y <= maxY;
  }

  function linkRouteCacheKey(start, end, preferredAxis, obstacles) {
    return [
      preferredAxis,
      pointKey(start),
      pointKey(end),
      obstacles.map(routeObstacleKey).join(";")
    ].join("|");
  }

  function routeObstacleKey(rect) {
    return [
      roundRouteCoord(rect.x),
      roundRouteCoord(rect.y),
      roundRouteCoord(rect.w),
      roundRouteCoord(rect.h)
    ].join(",");
  }

  function rememberLinkRoute(key, points) {
    linkRouteCache.set(key, clonePolyline(points));
    while (linkRouteCache.size > LINK_ROUTE_CACHE_LIMIT) {
      const oldestKey = linkRouteCache.keys().next().value;
      if (oldestKey === undefined) break;
      linkRouteCache.delete(oldestKey);
    }
  }

  function clonePolyline(points) {
    return points.map((point) => ({ x: point.x, y: point.y }));
  }

  function routeCandidatePoints(start, end, firstAxis) {
    const elbow = firstAxis === "horizontal"
      ? { x: end.x, y: start.y }
      : { x: start.x, y: end.y };
    return [start, elbow, end];
  }

  function findGridRoute(start, end, preferredAxis, obstacles) {
    const xCoords = [start.x, end.x];
    const yCoords = [start.y, end.y];
    const rectXs = [];
    const rectYs = [];
    obstacles.forEach((rect) => {
      rectXs.push(rect.x, rect.x + rect.w);
      rectYs.push(rect.y, rect.y + rect.h);
    });
    if (rectXs.length && rectYs.length) {
      xCoords.push(Math.min(start.x, end.x, ...rectXs) - LINK_ROUTE_OUTER_PADDING);
      xCoords.push(Math.max(start.x, end.x, ...rectXs) + LINK_ROUTE_OUTER_PADDING);
      yCoords.push(Math.min(start.y, end.y, ...rectYs) - LINK_ROUTE_OUTER_PADDING);
      yCoords.push(Math.max(start.y, end.y, ...rectYs) + LINK_ROUTE_OUTER_PADDING);
    }
    obstacles.forEach((rect) => {
      xCoords.push(rect.x, rect.x + rect.w);
      yCoords.push(rect.y, rect.y + rect.h);
    });

    const xs = uniqueSortedNumbers(xCoords);
    const ys = uniqueSortedNumbers(yCoords);
    const xIndexByCoord = new Map(xs.map((x, index) => [roundRouteCoord(x), index]));
    const yIndexByCoord = new Map(ys.map((y, index) => [roundRouteCoord(y), index]));
    const points = [];
    const indexByKey = new Map();
    ys.forEach((y) => {
      xs.forEach((x) => {
        const key = pointKey({ x, y });
        indexByKey.set(key, points.length);
        points.push({ x, y });
      });
    });

    const startIndex = indexByKey.get(pointKey(start));
    const endIndex = indexByKey.get(pointKey(end));
    if (startIndex === undefined || endIndex === undefined) return null;

    const queue = [{ pointIndex: startIndex, direction: "start", cost: 0, stateKey: routeStateKey(startIndex, "start") }];
    const distanceByState = new Map([[routeStateKey(startIndex, "start"), 0]]);
    const previousByState = new Map();
    let endStateKey = "";

    while (queue.length) {
      queue.sort((a, b) => a.cost - b.cost);
      const current = queue.shift();
      if (current.cost !== distanceByState.get(current.stateKey)) continue;
      if (current.pointIndex === endIndex) {
        endStateKey = current.stateKey;
        break;
      }
      routeNeighbors(current.pointIndex, xs, ys, points, indexByKey, xIndexByCoord, yIndexByCoord).forEach((neighbor) => {
        if (!segmentIsClear(points[current.pointIndex], points[neighbor.pointIndex], obstacles)) return;
        const turnPenalty = current.direction !== "start" && current.direction !== neighbor.direction ? 8 : 0;
        const axisPenalty = current.direction === "start" && neighbor.direction !== preferredAxis ? 4 : 0;
        const nextCost = current.cost + distance(points[current.pointIndex], points[neighbor.pointIndex]) + turnPenalty + axisPenalty;
        const nextStateKey = routeStateKey(neighbor.pointIndex, neighbor.direction);
        if (nextCost >= (distanceByState.get(nextStateKey) ?? Infinity)) return;
        distanceByState.set(nextStateKey, nextCost);
        previousByState.set(nextStateKey, current.stateKey);
        queue.push({
          pointIndex: neighbor.pointIndex,
          direction: neighbor.direction,
          cost: nextCost,
          stateKey: nextStateKey
        });
      });
    }

    if (!endStateKey) return null;
    const route = [];
    let cursor = endStateKey;
    while (cursor) {
      const pointIndex = Number(cursor.split("|")[0]);
      route.push(points[pointIndex]);
      cursor = previousByState.get(cursor);
    }
    return compactPolyline(route.reverse());
  }

  function routeNeighbors(pointIndex, xs, ys, points, indexByKey, xIndexByCoord, yIndexByCoord) {
    const point = points[pointIndex];
    const xIndex = xIndexByCoord.get(roundRouteCoord(point.x));
    const yIndex = yIndexByCoord.get(roundRouteCoord(point.y));
    if (xIndex === undefined || yIndex === undefined) return [];
    const neighbors = [];
    [
      { xIndex: xIndex - 1, yIndex, direction: "horizontal" },
      { xIndex: xIndex + 1, yIndex, direction: "horizontal" },
      { xIndex, yIndex: yIndex - 1, direction: "vertical" },
      { xIndex, yIndex: yIndex + 1, direction: "vertical" }
    ].forEach((candidate) => {
      if (candidate.xIndex < 0 || candidate.yIndex < 0 || candidate.xIndex >= xs.length || candidate.yIndex >= ys.length) return;
      const neighborIndex = indexByKey.get(pointKey({ x: xs[candidate.xIndex], y: ys[candidate.yIndex] }));
      if (neighborIndex === undefined) return;
      neighbors.push({ pointIndex: neighborIndex, direction: candidate.direction });
    });
    return neighbors;
  }

  function linkNodeObstacles(excludeIds = new Set()) {
    return state.nodes
      .filter((node) => !excludeIds.has(node.id))
      .map((node) => ({
        id: node.id,
        x: node.x - LINK_AVOID_PADDING,
        y: node.y - LINK_AVOID_PADDING,
        w: node.w + LINK_AVOID_PADDING * 2,
        h: node.h + LINK_AVOID_PADDING * 2
      }));
  }

  function polylineIsClear(points, obstacles) {
    for (let index = 1; index < points.length; index += 1) {
      if (!segmentIsClear(points[index - 1], points[index], obstacles)) return false;
    }
    return true;
  }

  function segmentIsClear(start, end, obstacles) {
    return segmentObstacleCount(start, end, obstacles) === 0;
  }

  function segmentObstacleCount(start, end, obstacles) {
    return obstacles.filter((rect) => segmentIntersectsRect(start, end, rect)).length;
  }

  function segmentIntersectsRect(start, end, rect) {
    if (sameY(start, end)) {
      const y = start.y;
      if (y <= rect.y || y >= rect.y + rect.h) return false;
      const minX = Math.min(start.x, end.x);
      const maxX = Math.max(start.x, end.x);
      return maxX > rect.x && minX < rect.x + rect.w;
    }
    if (sameX(start, end)) {
      const x = start.x;
      if (x <= rect.x || x >= rect.x + rect.w) return false;
      const minY = Math.min(start.y, end.y);
      const maxY = Math.max(start.y, end.y);
      return maxY > rect.y && minY < rect.y + rect.h;
    }
    return false;
  }

  function quadraticCurveIntersectsObstacles(start, control, end, obstacles) {
    if (!obstacles.length) return false;
    for (let step = 0; step <= 36; step += 1) {
      const point = quadraticPoint(start, control, end, step / 36);
      if (obstacles.some((rect) => pointInsideRect(point, rect))) return true;
    }
    return false;
  }

  function quadraticPoint(start, control, end, t) {
    const inverse = 1 - t;
    return {
      x: inverse * inverse * start.x + 2 * inverse * t * control.x + t * t * end.x,
      y: inverse * inverse * start.y + 2 * inverse * t * control.y + t * t * end.y
    };
  }

  function pointInsideRect(point, rect) {
    return point.x > rect.x && point.x < rect.x + rect.w && point.y > rect.y && point.y < rect.y + rect.h;
  }

  function compactPolyline(points) {
    const compact = [];
    points.forEach((point) => {
      const previous = compact[compact.length - 1];
      if (!previous || !samePoint(previous, point)) compact.push(point);
    });
    for (let index = compact.length - 2; index > 0; index -= 1) {
      const prev = compact[index - 1];
      const current = compact[index];
      const next = compact[index + 1];
      if ((sameX(prev, current) && sameX(current, next)) || (sameY(prev, current) && sameY(current, next))) {
        compact.splice(index, 1);
      }
    }
    return compact;
  }

  function routeStateKey(pointIndex, direction) {
    return `${pointIndex}|${direction}`;
  }

  function pointKey(point) {
    return `${roundRouteCoord(point.x)},${roundRouteCoord(point.y)}`;
  }

  function uniqueSortedNumbers(values) {
    return [...new Set(values.map(roundRouteCoord))].sort((a, b) => a - b);
  }

  function roundRouteCoord(value) {
    return Math.round(Number(value) * 1000) / 1000;
  }

  function sameCoord(a, b) {
    return Math.abs(a - b) < 0.001;
  }

  function samePoint(a, b) {
    return sameX(a, b) && sameY(a, b);
  }

  function sameX(a, b) {
    return sameCoord(a.x, b.x);
  }

  function sameY(a, b) {
    return sameCoord(a.y, b.y);
  }

  function segmentAxis(start, end) {
    if (sameY(start, end) && !sameX(start, end)) return "horizontal";
    if (sameX(start, end) && !sameY(start, end)) return "vertical";
    return "";
  }

  function pointIsOnSegment(point, start, end) {
    if (samePoint(point, start) || samePoint(point, end)) return true;
    if (sameY(start, end) && sameY(point, start)) {
      return point.x >= Math.min(start.x, end.x) - 0.001 && point.x <= Math.max(start.x, end.x) + 0.001;
    }
    if (sameX(start, end) && sameX(point, start)) {
      return point.y >= Math.min(start.y, end.y) - 0.001 && point.y <= Math.max(start.y, end.y) + 0.001;
    }
    return false;
  }

  function polylinePath(points) {
    const compact = compactPolyline(points);
    if (!compact.length) return "";
    return compact.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  }

  function itemCenter(item) {
    return {
      x: item.x + item.w / 2,
      y: item.y + item.h / 2
    };
  }

  function averagePoint(points) {
    if (!points.length) return { x: 0, y: 0 };
    return {
      x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
      y: points.reduce((sum, point) => sum + point.y, 0) / points.length
    };
  }

  function pointBox(point) {
    return {
      x: point.x - 1,
      y: point.y - 1,
      w: 2,
      h: 2
    };
  }

  function textItemBounds(textItem) {
    const lines = wrapTextLines(textItem.content || "テキスト", textItem.w, textItem.fontSize);
    const lineHeight = textItem.fontSize * 1.32;
    return {
      x: textItem.x - 6,
      y: textItem.y - 6,
      w: textItem.w + 12,
      h: Math.max(textItem.fontSize, lines.length * lineHeight) + 12
    };
  }

  function shapeBounds(shape) {
    const rotation = Number(shape.rotation) || 0;
    if (rotation) {
      const cx = shape.x + shape.w / 2;
      const cy = shape.y + shape.h / 2;
      const radians = rotation * Math.PI / 180;
      const sin = Math.sin(radians);
      const cos = Math.cos(radians);
      const corners = [
        { x: shape.x, y: shape.y },
        { x: shape.x + shape.w, y: shape.y },
        { x: shape.x + shape.w, y: shape.y + shape.h },
        { x: shape.x, y: shape.y + shape.h }
      ].map((point) => {
        const dx = point.x - cx;
        const dy = point.y - cy;
        return {
          x: cx + dx * cos - dy * sin,
          y: cy + dx * sin + dy * cos
        };
      });
      const minX = Math.min(...corners.map((point) => point.x));
      const minY = Math.min(...corners.map((point) => point.y));
      const maxX = Math.max(...corners.map((point) => point.x));
      const maxY = Math.max(...corners.map((point) => point.y));
      return {
        x: minX,
        y: minY,
        w: maxX - minX,
        h: maxY - minY
      };
    }
    return {
      x: shape.x,
      y: shape.y,
      w: shape.w,
      h: shape.h
    };
  }

  function imageBounds(imageItem) {
    return {
      x: imageItem.x,
      y: imageItem.y,
      w: imageItem.w,
      h: imageItem.h
    };
  }

  function imageAspectRatio(imageItem) {
    const naturalWidth = Number(imageItem.naturalWidth) || 0;
    const naturalHeight = Number(imageItem.naturalHeight) || 0;
    if (naturalWidth > 0 && naturalHeight > 0) return naturalWidth / naturalHeight;
    const width = Number(imageItem.w) || 1;
    const height = Number(imageItem.h) || 1;
    return width / height;
  }

  function legendBounds(legend) {
    return {
      x: legend.x,
      y: legend.y,
      w: legend.w,
      h: legendMetrics(legend).height
    };
  }

  function wrapTextLines(text, width, fontSize) {
    const maxChars = clamp(Math.floor((Number(width) || TEXT_DEFAULT_WIDTH) / Math.max(1, (Number(fontSize) || 20) * 0.82)), 1, 80);
    const lines = [];
    String(text || "")
      .replace(/\r/g, "")
      .split("\n")
      .forEach((paragraph) => {
        const chars = [...paragraph];
        if (!chars.length) {
          lines.push("");
          return;
        }
        for (let i = 0; i < chars.length; i += maxChars) {
          lines.push(chars.slice(i, i + maxChars).join(""));
        }
      });
    return lines.length ? lines : [""];
  }

  function firstTextLine(text) {
    return String(text || "")
      .replace(/\r/g, "")
      .split("\n")
      .map((line) => line.trim())
      .find(Boolean) || "";
  }

  function wrapLabel(text, limit, lines) {
    const maxChars = Math.max(1, Number(limit) || 1);
    const maxLines = Math.max(1, Number(lines) || 1);
    const chunks = [];
    String(text || "")
      .replace(/\r/g, "")
      .split("\n")
      .forEach((paragraph) => {
        const chars = [...paragraph];
        if (!chars.length) {
          chunks.push("");
          return;
        }
        for (let i = 0; i < chars.length; i += maxChars) {
          chunks.push(chars.slice(i, i + maxChars).join(""));
        }
      });
    const result = (chunks.length ? chunks : [""]).slice(0, maxLines);
    if (chunks.length > maxLines) {
      const last = result[result.length - 1] || "";
      result[result.length - 1] = last.length > 1 ? `${last.slice(0, -1)}…` : "…";
    }
    return result;
  }

  function truncate(value, length) {
    const chars = [...String(value || "")];
    if (chars.length <= length) return String(value || "");
    return `${chars.slice(0, length - 1).join("")}…`;
  }

  function hexToRgba(hex, alpha) {
    const normalized = String(hex || "#000000").replace("#", "");
    const value = normalized.length === 3
      ? normalized.split("").map((part) => part + part).join("")
      : normalized.padEnd(6, "0").slice(0, 6);
    const r = parseInt(value.slice(0, 2), 16);
    const g = parseInt(value.slice(2, 4), 16);
    const b = parseInt(value.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function uid(prefix) {
    return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
  }

  function roundedTopPath(x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height);
    return [
      `M ${x} ${y + height}`,
      `L ${x} ${y + r}`,
      `Q ${x} ${y} ${x + r} ${y}`,
      `L ${x + width - r} ${y}`,
      `Q ${x + width} ${y} ${x + width} ${y + r}`,
      `L ${x + width} ${y + height}`,
      "Z"
    ].join(" ");
  }

  function roundedBottomPath(x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height);
    return [
      `M ${x} ${y}`,
      `L ${x + width} ${y}`,
      `L ${x + width} ${y + height - r}`,
      `Q ${x + width} ${y + height} ${x + width - r} ${y + height}`,
      `L ${x + r} ${y + height}`,
      `Q ${x} ${y + height} ${x} ${y + height - r}`,
      `L ${x} ${y}`,
      "Z"
    ].join(" ");
  }

  function ensureCropEditorMarkup() {
    if (document.querySelector("#cropEditor")) return;
    document.body.insertAdjacentHTML("beforeend", `
      <div id="cropEditor" class="crop-editor" aria-hidden="true">
        <div class="crop-editor__bar">
          <button id="cropCancelBtn" type="button">キャンセル</button>
          <strong>画像位置調整</strong>
          <button id="cropApplyBtn" type="button">適用</button>
        </div>
        <div id="cropStage" class="crop-stage">
          <div id="cropFrame" class="crop-frame">
            <img id="cropImage" class="crop-image" alt="">
          </div>
        </div>
        <div class="crop-controls" aria-label="ズーム操作">
          <button id="cropZoomOutBtn" class="icon-button" type="button" title="縮小">−</button>
          <button id="cropResetBtn" type="button">リセット</button>
          <button id="cropZoomInBtn" class="icon-button" type="button" title="拡大">＋</button>
        </div>
      </div>
    `);
  }

  function createSvg(tag, attrs = {}, text = "") {
    const element = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) element.setAttribute(key, value);
    });
    if (text) element.textContent = text;
    return element;
  }

  function el(tag, attrs = {}, text = "") {
    const element = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "class") element.className = value;
      else if (key === "style") element.setAttribute("style", value);
      else element.setAttribute(key, value);
    });
    if (text) element.textContent = text;
    return element;
  }

  function downloadBlob(content, filename, type) {
    const blob = content instanceof Blob ? content : new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
})();
