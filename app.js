(() => {
  const SVG_NS = "http://www.w3.org/2000/svg";
  const XLINK_NS = "http://www.w3.org/1999/xlink";
  const STORAGE_KEY = "correlationDiagramToolState_v4";
  const PROJECT_META_KEY = "correlationDiagramToolProjectMeta_v1";
  const PNG_SCALE_KEY = "correlationDiagramToolPngScale_v1";
  const AUTO_SAVE_ENABLED_KEY = "correlationDiagramToolAutoSaveEnabled_v1";
  const IMAGE_ASSET_REF_PREFIX = "asset:";
  const HISTORY_LIMIT = 40;
  const AUTO_SAVE_INTERVAL_MS = 60000;
  const INTERACTION_RENDER_INTERVAL_MS = 42;
  const TOUCH_INTERACTION_RENDER_INTERVAL_MS = 64;
  const DEFERRED_SELECTION_RENDER_DELAY_MS = 560;
  const BOOT_PROJECT_LOAD_TIMEOUT_MS = 2500;
  const STATIC_PWA_MODE = isStaticPwaMode();
  const DOUBLE_TAP_TIMEOUT_MS = 520;
  const DOUBLE_TAP_DISTANCE_PX = 42;
  const LINK_LABEL_DEFAULT_BACKGROUND = "#ffffff";
  const LINK_LABEL_DEFAULT_BORDER = "#202329";
  const PNG_MAX_DIMENSION = 16384;
  const PNG_MAX_PIXELS = 134217728;
  const PNG_MIN_RENDER_SCALE = 2;
  const PNG_TILED_THRESHOLD_PIXELS = 16000000;
  const PNG_TILE_WIDTH = 4096;
  const PNG_TILE_HEIGHT = 512;
  const PNG_IDAT_CHUNK_SIZE = 1048576;
  const NODE_DEFAULT_WIDTH = 120;
  const NODE_DEFAULT_HEIGHT = 140;
  const NODE_SIZE_PRESETS = [
    { id: "small", label: "小", w: 120, h: 140 },
    { id: "medium", label: "中", w: 150, h: 160 },
    { id: "large", label: "大", w: 170, h: 180 }
  ];
  const TEXT_DEFAULT_WIDTH = 180;
  const SHAPE_DEFAULT_WIDTH = 120;
  const SHAPE_DEFAULT_HEIGHT = 90;
  const INSERTED_IMAGE_MAX_WIDTH = 360;
  const INSERTED_IMAGE_MAX_HEIGHT = 280;
  const LEGEND_DEFAULT_WIDTH = 260;
  const LEGEND_DEFAULT_FONT_SIZE = 14;
  const ARROW_LEGEND_DEFAULT_WIDTH = 300;
  const LEGEND_KINDS = new Set(["marks", "arrows"]);
  const ARROW_LEGEND_TYPES = [
    ["from-to", "右向き矢印"],
    ["to-from", "左向き矢印"],
    ["bidirectional", "両矢印"],
    ["none", "線のみ"]
  ];
  const ARROW_LEGEND_TYPE_IDS = new Set(ARROW_LEGEND_TYPES.map(([id]) => id));
  const GROUP_MIN_WIDTH = 96;
  const GROUP_MIN_HEIGHT = 52;
  const GROUP_MAX_WIDTH = 4800;
  const GROUP_MAX_HEIGHT = 3600;
  const GROUP_TITLE_DEFAULT_FONT_SIZE = 15;
  const GROUP_TITLE_TAB_OVERLAP_RATIO = 0.64;
  const DEFAULT_SETTINGS = {
    groupMoveContents: false
  };
  const GROUP_TITLE_FONTS = [
    ["default", "既定", "\"Yu Gothic UI\", \"Hiragino Sans\", \"Meiryo\", system-ui, sans-serif"],
    ["gothic", "ゴシック", "\"Yu Gothic\", \"Yu Gothic UI\", \"Hiragino Kaku Gothic ProN\", \"Meiryo\", sans-serif"],
    ["mincho", "明朝", "\"Yu Mincho\", \"Hiragino Mincho ProN\", \"Noto Serif JP\", serif"],
    ["rounded", "丸ゴシック", "\"Hiragino Maru Gothic ProN\", \"Yu Gothic UI\", \"Meiryo\", sans-serif"],
    ["pop", "ポップ", "\"HGSoeiKakupoptai\", \"Yu Gothic UI\", \"Meiryo\", sans-serif"],
    ["mono", "等幅", "\"Consolas\", \"Menlo\", \"Yu Gothic UI\", monospace"]
  ];
  const GROUP_TITLE_FONT_IDS = new Set(GROUP_TITLE_FONTS.map(([id]) => id));
  const GROUP_SHAPES = [
    ["rect", "四角"],
    ["l-top-left", "L字（左上切り欠き）"],
    ["l-top-right", "L字（右上切り欠き）"],
    ["l-bottom-left", "L字（左下切り欠き）"],
    ["l-bottom-right", "L字（右下切り欠き）"]
  ];
  const GROUP_SHAPE_IDS = new Set(GROUP_SHAPES.map(([id]) => id));
  const LINK_AVOID_PADDING = 16;
  const LINK_ROUTE_OUTER_PADDING = 80;
  const LINK_ROUTE_MAX_AUTO_SHIFT = 120;
  const LINK_TERMINAL_STUB = 22;
  const LINK_ROUTE_CACHE_LIMIT = 1800;
  const LINK_AXIS_CACHE_LIMIT = 2400;
  const LINK_AXIS_SWITCH_RATIO = 1.35;
  const LINK_JUMP_RADIUS = 12;
  const LINK_JUMP_HEIGHT = 8;
  const LINK_JUMP_ENDPOINT_PADDING = 18;
  const MARQUEE_SELECT_THRESHOLD = 6;
  const MULTI_SELECT_TYPES = new Set(["node", "group", "text", "shape", "image", "legend"]);
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
  const TEXT_BACKGROUND_COLORS = [
    "#202329",
    "#111827",
    "#000000",
    "#e53935",
    "#1e88e5",
    "#43a047",
    "#fdd835",
    "#ffffff",
    "#f9faf7",
    "#eef4ef",
    "#fff2ef",
    ...PALETTE
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
  const editOnlyControls = [...document.querySelectorAll("[data-edit-only]")];
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
  const viewModeBtn = document.querySelector("#viewModeBtn");
  const detailSettingsBtn = document.querySelector("#detailSettingsBtn");
  const zoomLabel = document.querySelector("#zoomLabel");
  const canvasContextMenu = document.querySelector("#canvasContextMenu");
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
  let multiSelectedItemKeys = new Set();
  let inspectorOpen = false;
  let inspectorCollapseState = new Map();
  let mode = "select";
  let pendingConnection = null;
  let hoveredConnectionTarget = null;
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
  let interactionRenderTimer = 0;
  let deferredSelectionRenderTimer = 0;
  let lastInteractionRenderAt = 0;
  let requestedDiagramRenderFast = false;
  let fastDiagramRender = false;
  let selectionListSignature = "";
  let autoSaveInFlight = false;
  let lastAutoSaveSnapshot = "";
  let autoSaveEnabled = loadAutoSaveEnabled();
  let imageObjectUrlCache = new Map();
  let inlineImageAssetsForExport = false;
  let diagramRoot = null;
  let linkRouteCache = new Map();
  let linkRoutingAxisCache = new Map();
  let linkJumpPolylineCache = new Map();
  let linkJumpReferenceSegmentCache = new Map();
  let cropSession = null;
  let inlineEditorSession = null;
  let canvasContextPoint = null;
  let canvasContextTarget = null;
  let pendingImageInsertPoint = null;
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
          description: "",
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
          description: "",
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
          description: "",
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
          description: "",
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
          titleFontFamily: "mincho",
          titleTextColor: "#202329",
          titleBackgroundOpacity: 1
        }
      ],
      texts: [],
      shapes: [],
      legends: [],
      images: [],
      imageAssets: [],
      settings: { ...DEFAULT_SETTINGS },
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
      settings: { ...DEFAULT_SETTINGS },
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

    document.querySelector("#addNodeBtn").addEventListener("click", () => createNodeAt());

    connectBtn.addEventListener("click", () => {
      if (isViewMode()) return;
      mode = mode === "connect" ? "select" : "connect";
      pendingConnection = null;
      updateStatus();
      render();
    });

    document.querySelector("#addGroupBtn").addEventListener("click", () => createGroupAt());
    document.querySelector("#addTextBtn").addEventListener("click", () => createTextAt());
    document.querySelector("#addShapeBtn").addEventListener("click", () => createShapeAt());
    document.querySelector("#addLegendBtn").addEventListener("click", () => createLegendAt());
    document.querySelector("#addArrowLegendBtn").addEventListener("click", () => createLegendAt(null, "arrows"));
    document.querySelector("#addImageBtn").addEventListener("click", () => requestImageInsert());

    document.querySelector("#zoomOutBtn").addEventListener("click", () => zoomBy(0.85));
    document.querySelector("#zoomInBtn").addEventListener("click", () => zoomBy(1.18));
    document.querySelector("#fitBtn").addEventListener("click", () => {
      fitToContent(true);
      render();
    });
    alignHorizontalBtn?.addEventListener("click", () => alignSelectedNodes("horizontal"));
    alignVerticalBtn?.addEventListener("click", () => alignSelectedNodes("vertical"));
    alignSpacingInput?.addEventListener("input", () => updateAlignControls());
    viewModeBtn?.addEventListener("click", toggleViewMode);
    detailSettingsBtn?.addEventListener("click", openDetailSettingsDialog);
    document.querySelector("#centerBtn").addEventListener("click", () => {
      centerViewport();
      render();
    });

    document.querySelector("#clearBtn").addEventListener("click", () => {
      if (isViewMode()) return;
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
      clearMultiSelection();
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
    svg.addEventListener("contextmenu", onCanvasContextMenu);
    svg.addEventListener("pointerleave", () => {
      if (!drag) setHoveredConnectionTarget(null);
    });
    svg.addEventListener("wheel", onWheel, { passive: false });
    svg.addEventListener("auxclick", (event) => {
      if (event.button === 1) event.preventDefault();
    });
    canvasContextMenu?.addEventListener("click", onCanvasContextMenuAction);
    document.addEventListener("pointerdown", (event) => {
      if (!isCanvasContextMenuOpen() || canvasContextMenu?.contains(event.target)) return;
      closeCanvasContextMenu();
    }, true);
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !isCanvasContextMenuOpen()) return;
      event.preventDefault();
      closeCanvasContextMenu({ restoreFocus: true });
    });

    document.querySelector(".inspector")?.addEventListener("pointerdown", resetWorkspaceGesture);
    window.addEventListener("pointerup", onGlobalPointerRelease);
    window.addEventListener("pointercancel", onGlobalPointerRelease);
    window.addEventListener("blur", () => {
      closeCanvasContextMenu();
      resetWorkspaceGesture();
    });
    window.addEventListener("resize", positionInlineTextEditor);
    window.visualViewport?.addEventListener("resize", positionInlineTextEditor);
    window.visualViewport?.addEventListener("scroll", positionInlineTextEditor);
    window.addEventListener("beforeunload", () => {
      finishInlineTextEdit(true, { render: false });
      saveToStorage(true);
      stopAutoSave();
      revokeImageObjectUrls();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        closeCanvasContextMenu();
        resetWorkspaceGesture();
      }
    });

    svg.addEventListener("keydown", (event) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        if (isViewMode()) return;
        deleteSelected();
      }
      if (event.key === "Escape") {
        if (isCanvasContextMenuOpen()) {
          closeCanvasContextMenu({ restoreFocus: true });
          return;
        }
        if (cropSession) {
          closeCropEditor();
          return;
        }
        if (mode === "connect") mode = "select";
        pendingConnection = null;
        selected = null;
        clearMultiSelection();
        inspectorOpen = false;
        render();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (isViewMode()) return;
        if (event.shiftKey) redo();
        else undo();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        if (isViewMode()) return;
        redo();
      }
    });

    window.addEventListener("resize", () => {
      closeCanvasContextMenu();
      render();
      renderCropEditor();
    });
  }

  function creationPoint(point) {
    if (point && Number.isFinite(point.x) && Number.isFinite(point.y)) {
      return { x: point.x, y: point.y };
    }
    return screenCenterWorld();
  }

  function finishCreatedItem(type, id) {
    selected = { type, id };
    clearMultiSelection();
    inspectorOpen = true;
    mode = "select";
    pendingConnection = null;
    commitChange();
    render();
  }

  function createNodeAt(point = null) {
    if (isViewMode()) return;
    const center = creationPoint(point);
    const color = PALETTE[state.nodes.length % PALETTE.length];
    const node = {
      id: uid("node"),
      name: `人物${state.nodes.length + 1}`,
      role: "",
      description: "",
      x: center.x - NODE_DEFAULT_WIDTH / 2,
      y: center.y - NODE_DEFAULT_HEIGHT / 2,
      w: NODE_DEFAULT_WIDTH,
      h: NODE_DEFAULT_HEIGHT,
      color,
      gradient: defaultGradient(color),
      marks: [],
      image: "",
      imageBackgroundColor: "#ffffff",
      imageScale: 1,
      imageOffsetX: 0,
      imageOffsetY: 0
    };
    state.nodes.push(node);
    finishCreatedItem("node", node.id);
  }

  function createGroupAt(point = null) {
    if (isViewMode()) return;
    const center = creationPoint(point);
    const color = PALETTE[(state.groups.length + 2) % PALETTE.length];
    const group = {
      id: uid("group"),
      title: `グループ${state.groups.length + 1}`,
      x: center.x - 150,
      y: center.y - 100,
      w: 300,
      h: 200,
      color,
      fillOpacity: 0.13,
      gradient: defaultGradient(color),
      titleFontSize: GROUP_TITLE_DEFAULT_FONT_SIZE,
      titleFontFamily: "mincho",
      titleTextColor: "#202329",
      titleBackgroundOpacity: 1,
      titleOutlineColor: "#ffffff",
      titleOutlineWidth: 0,
      shape: "rect",
      notchWidth: 120,
      notchHeight: 80
    };
    state.groups.push(group);
    finishCreatedItem("group", group.id);
  }

  function createTextAt(point = null) {
    if (isViewMode()) return;
    const center = creationPoint(point);
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
    finishCreatedItem("text", textItem.id);
  }

  function createShapeAt(point = null) {
    if (isViewMode()) return;
    const center = creationPoint(point);
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
    finishCreatedItem("shape", shape.id);
  }

  function createLegendAt(point = null, kind = "marks") {
    if (isViewMode()) return;
    const center = creationPoint(point);
    const legend = kind === "arrows"
      ? createDefaultArrowLegend(center)
      : createDefaultLegend(center);
    state.legends.push(legend);
    finishCreatedItem("legend", legend.id);
  }

  function requestImageInsert(point = null) {
    if (isViewMode()) return;
    pendingImageInsertPoint = point ? creationPoint(point) : null;
    imageInsertInput.value = "";
    imageInsertInput.click();
  }

  function isCanvasContextMenuOpen() {
    return canvasContextMenu?.getAttribute("aria-hidden") === "false";
  }

  function onCanvasContextMenu(event) {
    if (isViewMode() || !canvasContextMenu || cropSession || projectDialog?.getAttribute("aria-hidden") === "false") return;
    event.preventDefault();
    event.stopPropagation();
    finishInlineTextEdit(true);
    closeMobileToolPanel();
    resetWorkspaceGesture();

    const svgRect = svg.getBoundingClientRect();
    const withinCanvas = event.clientX >= svgRect.left
      && event.clientX <= svgRect.right
      && event.clientY >= svgRect.top
      && event.clientY <= svgRect.bottom;
    const clientX = withinCanvas ? event.clientX : svgRect.left + svgRect.width / 2;
    const clientY = withinCanvas ? event.clientY : svgRect.top + svgRect.height / 2;
    canvasContextPoint = screenToWorld({
      x: clientX - svgRect.left,
      y: clientY - svgRect.top
    });
    canvasContextTarget = withinCanvas ? findDiagramTarget(event.target) : null;

    canvasContextMenu.setAttribute("aria-hidden", "false");
    canvasContextMenu.style.visibility = "hidden";
    canvasContextMenu.style.left = "0px";
    canvasContextMenu.style.top = "0px";
    const menuRect = canvasContextMenu.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewportLeft = viewport?.offsetLeft || 0;
    const viewportTop = viewport?.offsetTop || 0;
    const viewportWidth = viewport?.width || window.innerWidth;
    const viewportHeight = viewport?.height || window.innerHeight;
    const margin = 8;
    const left = clamp(clientX, viewportLeft + margin, viewportLeft + viewportWidth - menuRect.width - margin);
    const top = clamp(clientY, viewportTop + margin, viewportTop + viewportHeight - menuRect.height - margin);
    canvasContextMenu.style.left = `${left}px`;
    canvasContextMenu.style.top = `${top}px`;
    canvasContextMenu.style.visibility = "";
    canvasContextMenu.querySelector("button")?.focus({ preventScroll: true });
  }

  function closeCanvasContextMenu(options = {}) {
    if (!canvasContextMenu) return;
    canvasContextMenu.setAttribute("aria-hidden", "true");
    canvasContextMenu.style.visibility = "";
    canvasContextMenu.style.left = "";
    canvasContextMenu.style.top = "";
    canvasContextPoint = null;
    canvasContextTarget = null;
    if (options.restoreFocus) svg.focus({ preventScroll: true });
  }

  function onCanvasContextMenuAction(event) {
    const button = event.target.closest("[data-context-create]");
    if (!button || !canvasContextMenu?.contains(button)) return;
    event.preventDefault();
    event.stopPropagation();
    const action = button.dataset.contextCreate || "";
    const point = canvasContextPoint ? { ...canvasContextPoint } : screenCenterWorld();
    const target = canvasContextTarget;
    closeCanvasContextMenu();

    if (action === "node") createNodeAt(point);
    if (action === "group") createGroupAt(point);
    if (action === "text") createTextAt(point);
    if (action === "shape") createShapeAt(point);
    if (action === "legend") createLegendAt(point);
    if (action === "arrow-legend") createLegendAt(point, "arrows");
    if (action === "image") requestImageInsert(point);
    if (action === "link") startContextConnection(target);
  }

  function startContextConnection(target) {
    if (isViewMode()) return;
    clearMultiSelection();
    mode = "connect";
    pendingConnection = null;
    inspectorOpen = false;
    const endpoint = target?.id ? getConnectionEndpoint(target.id) : null;
    if (endpoint) {
      pendingConnection = target.id;
      selected = { type: endpoint.type, id: target.id };
    } else {
      selected = null;
    }
    render();
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

  function isViewMode() {
    return mode === "view";
  }

  function toggleViewMode() {
    closeCanvasContextMenu();
    hoveredConnectionTarget = null;
    if (isViewMode()) {
      mode = "select";
      inspectorOpen = false;
    } else {
      mode = "view";
      pendingConnection = null;
      clearMultiSelection();
      inspectorOpen = Boolean(selected);
    }
    render();
  }

  function updateModeControls() {
    const viewing = isViewMode();
    editOnlyControls.forEach((control) => {
      control.disabled = viewing;
    });
    if (viewModeBtn) {
      viewModeBtn.textContent = viewing ? "編集" : "閲覧";
      viewModeBtn.title = viewing ? "編集モードに戻る" : "閲覧モード";
      viewModeBtn.setAttribute("aria-pressed", viewing ? "true" : "false");
    }
    if (connectBtn) connectBtn.setAttribute("aria-pressed", mode === "connect" ? "true" : "false");
    if (undoBtn) undoBtn.disabled = viewing || history.length <= 1;
    if (redoBtn) redoBtn.disabled = viewing || future.length === 0;
  }

  function appSettings() {
    state.settings = normalizeSettings(state.settings);
    return state.settings;
  }

  function groupMoveContentsEnabled() {
    return appSettings().groupMoveContents === true;
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
    if (next === "select") updateSelectionListState();
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

  function updateRenderShellState() {
    const currentSelection = selected ? getSelectedItem() : null;
    const multiNodeCount = selectedAlignmentNodes().length;
    document.body.dataset.selection = currentSelection ? selected.type : "none";
    document.body.dataset.mode = mode;
    document.body.dataset.inspectorOpen = inspectorOpen || multiNodeCount >= 2 || mode === "connect" || (isViewMode() && currentSelection) ? "true" : "false";
    document.body.dataset.toolsCollapsed = toolsCollapsed ? "true" : "false";
    return currentSelection;
  }

  function render() {
    cancelScheduledRenders();
    updateRenderShellState();
    renderDiagram();
    renderSelectionList();
    renderInspector();
    updateStatus();
    updateAlignControls();
    updateMobileToolPanel();
    updateToolsToggle();
    updateModeControls();
  }

  function renderViewSelection() {
    cancelScheduledRenders();
    updateRenderShellState();
    updateImmediateSelectionFeedback();
    refreshConnectionPortLayer();
    renderInspector();
    updateStatus();
    updateMobileToolPanel();
    updateToolsToggle();
    updateModeControls();
    updateSelectionListState({ skipHiddenMobileList: true });
  }

  function renderEditSelection(options = {}) {
    cancelScheduledRenders();
    updateRenderShellState();
    const linkSelectionReady = refreshImmediateLinkSelection();
    updateImmediateSelectionFeedback();
    refreshConnectionPortLayer();
    if (options.openInspector) renderInspector();
    updateStatus();
    updateAlignControls();
    updateMobileToolPanel();
    updateToolsToggle();
    updateModeControls();
    updateSelectionListState({ skipHiddenMobileList: true });
    if (options.deferDiagram && !linkSelectionReady) requestDeferredSelectionDiagramRender();
  }

  function updateImmediateSelectionFeedback() {
    if (!diagramRoot?.isConnected) {
      diagramRoot = svg.querySelector("[data-diagram-root='true']");
    }
    if (!diagramRoot) return;
    diagramRoot.querySelector("[data-layer='selection-feedback']")?.remove();
    const selectedNodes = state.nodes.filter((node) => isSelected("node", node.id) || isMultiSelectedItem("node", node.id));
    const selectedGroups = state.groups.filter((group) => isSelected("group", group.id) || isMultiSelectedItem("group", group.id));
    if (!selectedNodes.length && !selectedGroups.length) return;
    const layer = createSvg("g", {
      "data-layer": "selection-feedback",
      "pointer-events": "none"
    });
    selectedNodes.forEach((node) => {
      layer.appendChild(createSvg("rect", {
        x: node.x,
        y: node.y,
        width: node.w,
        height: node.h,
        rx: 8,
        fill: "none",
        stroke: "#202329",
        "stroke-width": 3,
        "pointer-events": "none"
      }));
      layer.appendChild(createSvg("circle", {
        cx: node.x + node.w,
        cy: node.y,
        r: 5,
        fill: "#202329",
        "pointer-events": "none"
      }));
    });
    selectedGroups.forEach((group) => {
      const shapeAttrs = {
        fill: "none",
        stroke: "#202329",
        "stroke-width": 3,
        "stroke-dasharray": "8 6",
        "stroke-linejoin": "round",
        "pointer-events": "none"
      };
      if (normalizeGroupShape(group.shape) === "rect") {
        layer.appendChild(createSvg("rect", {
          x: group.x,
          y: group.y,
          width: group.w,
          height: group.h,
          rx: 8,
          ...shapeAttrs
        }));
      } else {
        layer.appendChild(createSvg("path", {
          d: groupShapePath(group),
          ...shapeAttrs
        }));
      }
      const titleTab = groupTitleTabMetrics(group, normalizeGroupTitleFontSize(group.titleFontSize));
      layer.appendChild(createSvg("rect", {
        x: titleTab.x,
        y: titleTab.y,
        width: titleTab.w,
        height: titleTab.h,
        rx: Math.min(8, titleTab.h / 3),
        fill: "none",
        stroke: "#202329",
        "stroke-width": 3,
        "stroke-linejoin": "round",
        "pointer-events": "none"
      }));
    });
    diagramRoot.appendChild(layer);
  }

  function setHoveredConnectionTarget(target) {
    const endpoint = target?.id ? getConnectionEndpoint(target.id) : null;
    const next = endpoint && (endpoint.type === "node" || endpoint.type === "group")
      ? { type: endpoint.type, id: target.id }
      : null;
    if (hoveredConnectionTarget?.type === next?.type && hoveredConnectionTarget?.id === next?.id) return;
    hoveredConnectionTarget = next;
    refreshConnectionPortLayer();
  }

  function updateConnectionPortHover(target) {
    if (isViewMode()) {
      setHoveredConnectionTarget(null);
      return;
    }
    if (target?.type === "node"
      || target?.type === "node-name"
      || target?.type === "node-role"
      || target?.type === "group"
      || target?.type === "group-title"
      || target?.type === "connection-port") {
      setHoveredConnectionTarget(target);
      return;
    }
    setHoveredConnectionTarget(null);
  }

  function connectionPortOwner() {
    if (isViewMode()) return null;
    if (hoveredConnectionTarget) {
      const endpoint = getConnectionEndpoint(hoveredConnectionTarget.id);
      if (endpoint) return { id: hoveredConnectionTarget.id, ...endpoint };
    }
    if (selected?.type === "node" || selected?.type === "group") {
      const endpoint = getConnectionEndpoint(selected.id);
      if (endpoint) return { id: selected.id, ...endpoint };
    }
    return null;
  }

  function refreshConnectionPortLayer() {
    if (!diagramRoot?.isConnected) return;
    diagramRoot.querySelector("[data-layer='connection-ports']")?.remove();
    const owner = connectionPortOwner();
    if (!owner) return;
    const layer = createSvg("g", { "data-layer": "connection-ports" });
    const visualRadius = 7 / Math.max(0.01, state.viewport.scale);
    const hitRadius = 18 / Math.max(0.01, state.viewport.scale);
    const strokeWidth = 2 / Math.max(0.01, state.viewport.scale);
    connectionPortPoints(owner.item).forEach((entry) => {
      const anchor = makeCustomAnchor(
        (entry.point.x - owner.item.x) / Math.max(1, owner.item.w),
        (entry.point.y - owner.item.y) / Math.max(1, owner.item.h)
      );
      const handle = createSvg("g", {
        "data-type": "connection-port",
        "data-id": owner.id,
        "data-anchor": anchor,
        class: "connection-port-handle"
      });
      handle.appendChild(createSvg("title", {}, "関係線をドラッグ作成"));
      handle.appendChild(createSvg("circle", {
        cx: entry.point.x,
        cy: entry.point.y,
        r: hitRadius,
        fill: "transparent",
        "pointer-events": "all"
      }));
      handle.appendChild(createSvg("circle", {
        cx: entry.point.x,
        cy: entry.point.y,
        r: visualRadius * 1.9,
        fill: "#168cff",
        opacity: 0.16,
        "pointer-events": "none"
      }));
      handle.appendChild(createSvg("circle", {
        cx: entry.point.x,
        cy: entry.point.y,
        r: visualRadius,
        fill: "#168cff",
        stroke: "#ffffff",
        "stroke-width": strokeWidth,
        "pointer-events": "none"
      }));
      layer.appendChild(handle);
    });
    diagramRoot.appendChild(layer);
  }

  function connectionPortPoints(item) {
    const keys = new Set(["top", "right", "bottom", "left"]);
    const points = attachmentAnchors(item)
      .filter((anchor) => keys.has(anchor.key))
      .map((anchor) => ({
        key: anchor.key,
        point: avoidGroupTitleTabAttachment(item, anchor.point, { width: 1.5 })
      }));
    const unique = [];
    points.forEach((entry) => {
      if (!unique.some((candidate) => distance(candidate.point, entry.point) < 0.5)) unique.push(entry);
    });
    return unique;
  }

  function requestDeferredSelectionDiagramRender() {
    if (deferredSelectionRenderTimer) window.clearTimeout(deferredSelectionRenderTimer);
    deferredSelectionRenderTimer = window.setTimeout(() => {
      deferredSelectionRenderTimer = 0;
      requestDiagramRender();
    }, DEFERRED_SELECTION_RENDER_DELAY_MS);
  }

  function renderDiagram(options = {}) {
    cancelScheduledRenders();
    const previousFastDiagramRender = fastDiagramRender;
    fastDiagramRender = options.fast === true;
    if (fastDiagramRender) lastInteractionRenderAt = performance.now();
    connectBtn.setAttribute("aria-pressed", mode === "connect" ? "true" : "false");
    zoomLabel.value = `${Math.round(state.viewport.scale * 100)}%`;
    undoBtn.disabled = isViewMode() || history.length <= 1;
    redoBtn.disabled = isViewMode() || future.length === 0;

    try {
      svg.replaceChildren();
      if (!fastDiagramRender) {
        linkJumpPolylineCache = new Map();
        linkJumpReferenceSegmentCache = new Map();
      }
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
      appendGroupTitleHitTargets(root);
      if (drag?.type === "marquee") root.appendChild(renderMarqueeSelection(drag));
      state.groups.forEach((group) => {
        const handle = renderGroupResizeHandle(group);
        if (handle) root.appendChild(handle);
        const notchHandle = renderGroupNotchHandle(group);
        if (notchHandle) root.appendChild(notchHandle);
      });
      appendSelectedLinkAnchorHandles(root);
      updateImmediateSelectionFeedback();
      refreshConnectionPortLayer();
    } finally {
      fastDiagramRender = previousFastDiagramRender;
    }
  }

  function appendLinkWithLiftedLabel(root, labelLayer, link) {
    const linkGroup = renderLink(link);
    liftLinkLabels(linkGroup, labelLayer);
    root.appendChild(linkGroup);
  }

  function liftLinkLabels(linkGroup, labelLayer) {
    linkGroup.querySelectorAll("[data-type='link-label']").forEach((label) => {
      labelLayer.appendChild(label);
    });
  }

  function refreshImmediateLinkSelection() {
    if (!diagramRoot?.isConnected) return false;
    const currentId = selected?.type === "link" ? selected.id : "";
    const activeGroups = [...diagramRoot.querySelectorAll("g[data-type='link'][data-selected='true']")];
    const idsToRefresh = new Set(activeGroups.map((group) => group.getAttribute("data-id")).filter(Boolean));
    const currentGroup = findRenderedLinkGroup(currentId);
    if (currentId && currentGroup?.getAttribute("data-selected") !== "true") idsToRefresh.add(currentId);

    let changed = false;
    idsToRefresh.forEach((id) => {
      const link = getLink(id);
      const rendered = findRenderedLinkGroup(id);
      if (!link || !rendered) return;
      const labelLayer = [...diagramRoot.children].find((child) => child.getAttribute?.("data-layer") === "link-labels");
      if (!labelLayer) return;
      [...labelLayer.children]
        .filter((child) => child.getAttribute?.("data-type") === "link-label" && child.getAttribute?.("data-id") === id)
        .forEach((label) => label.remove());
      const replacement = renderLink(link);
      liftLinkLabels(replacement, labelLayer);
      rendered.replaceWith(replacement);
      changed = true;
    });

    const anchorLayer = [...diagramRoot.children].find((child) => child.getAttribute?.("data-layer") === "link-anchors");
    if (changed || (!currentId && anchorLayer) || (currentId && !anchorLayer)) {
      anchorLayer?.remove();
      if (currentId) appendSelectedLinkAnchorHandles(diagramRoot);
    }
    return Boolean(currentId && findRenderedLinkGroup(currentId)?.getAttribute("data-selected") === "true");
  }

  function findRenderedLinkGroup(id) {
    if (!id || !diagramRoot) return null;
    return [...diagramRoot.children].find((child) => (
      child.getAttribute?.("data-type") === "link"
      && child.getAttribute?.("data-id") === id
    )) || null;
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
    if (interactionRenderTimer) {
      window.clearTimeout(interactionRenderTimer);
      interactionRenderTimer = 0;
    }
    if (deferredSelectionRenderTimer) {
      window.clearTimeout(deferredSelectionRenderTimer);
      deferredSelectionRenderTimer = 0;
    }
    requestedDiagramRenderFast = false;
  }

  function requestDiagramRender(options = {}) {
    const fast = options.fast === true;
    if (diagramRenderFrame) {
      requestedDiagramRenderFast = requestedDiagramRenderFast && fast;
      return;
    }
    if (viewportRenderFrame) {
      window.cancelAnimationFrame(viewportRenderFrame);
      viewportRenderFrame = 0;
    }
    if (!fast && interactionRenderTimer) {
      window.clearTimeout(interactionRenderTimer);
      interactionRenderTimer = 0;
    }
    requestedDiagramRenderFast = fast;
    diagramRenderFrame = window.requestAnimationFrame(() => {
      diagramRenderFrame = 0;
      const renderFast = requestedDiagramRenderFast;
      requestedDiagramRenderFast = false;
      renderDiagram({ fast: renderFast });
    });
  }

  function requestInteractionDiagramRender() {
    if (deferredSelectionRenderTimer) {
      window.clearTimeout(deferredSelectionRenderTimer);
      deferredSelectionRenderTimer = 0;
    }
    if (diagramRenderFrame || interactionRenderTimer) return;
    const interval = window.matchMedia?.("(pointer: coarse)")?.matches
      ? TOUCH_INTERACTION_RENDER_INTERVAL_MS
      : INTERACTION_RENDER_INTERVAL_MS;
    const wait = interval - (performance.now() - lastInteractionRenderAt);
    if (wait > 0) {
      interactionRenderTimer = window.setTimeout(() => {
        interactionRenderTimer = 0;
        requestDiagramRender({ fast: true });
      }, wait);
      return;
    }
    requestDiagramRender({ fast: true });
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
      appendObjectGradient(defs, group, "group-bg", normalizeGroupFillOpacity(group.fillOpacity));
      appendObjectGradient(defs, group, "group-title", normalizeGroupTitleBackgroundOpacity(group.titleBackgroundOpacity));
    });
  }

  function appendRasterImage(parent, source, attrs) {
    const href = resolveImageSource(source);
    if (!href) return;
    parent.appendChild(createSvg("image", {
      ...attrs,
      href,
      "xlink:href": href
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
    const opacityValue = Number(opacity);
    const safeOpacity = String(Math.round((Number.isFinite(opacityValue) ? opacityValue : 1) * 1000));
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
    if (asset?.data) return inlineImageAssetsForExport ? asset.data : imageAssetObjectUrl(asset);
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
    const titleFontSize = normalizeGroupTitleFontSize(group.titleFontSize);
    const titleOutlineWidth = normalizeGroupTitleOutlineWidth(group.titleOutlineWidth);
    const titleBackgroundOpacity = normalizeGroupTitleBackgroundOpacity(group.titleBackgroundOpacity);
    const shape = normalizeGroupShape(group.shape);
    const fillOpacity = normalizeGroupFillOpacity(group.fillOpacity);
    const titleTab = groupTitleTabMetrics(group, titleFontSize);
    const g = createSvg("g", {
      "data-type": "group",
      "data-id": group.id,
      class: "node-handle"
    });
    const groupShapeAttrs = {
      fill: objectGradientFill(group, "group-bg", fillOpacity),
      stroke: objectGradientFill(group, "group"),
      "stroke-width": 2,
      "stroke-dasharray": "8 6",
      "stroke-linejoin": "round"
    };
    if (shape === "rect") {
      g.appendChild(createSvg("rect", {
        x: group.x,
        y: group.y,
        width: group.w,
        height: group.h,
        rx: 8,
        ...groupShapeAttrs
      }));
    } else {
      g.appendChild(createSvg("path", {
        d: groupShapePath(group, shape),
        ...groupShapeAttrs
      }));
    }

    g.appendChild(createSvg("rect", {
      x: titleTab.x,
      y: titleTab.y,
      width: titleTab.w,
      height: titleTab.h,
      rx: Math.min(8, titleTab.h / 3),
      fill: objectGradientFill(group, "group-title", titleBackgroundOpacity),
      stroke: objectGradientFill(group, "group"),
      "stroke-width": 2,
      "stroke-linejoin": "round"
    }));
    g.appendChild(createSvg("text", {
      x: titleTab.x + titleTab.w / 2,
      y: titleTab.y + titleTab.h / 2 + 0.5,
      fill: groupTitleTextColor(group),
      "font-size": titleFontSize,
      "font-family": groupTitleFontFamily(group.titleFontFamily),
      "font-weight": 700,
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      "paint-order": titleOutlineWidth > 0 ? "stroke" : "",
      stroke: titleOutlineWidth > 0 ? normalizeColorValue(group.titleOutlineColor, "#ffffff") : "",
      "stroke-width": titleOutlineWidth,
      "stroke-linejoin": "round"
    }, group.title || "グループ"));
    return g;
  }

  function appendGroupTitleHitTargets(root) {
    if (!state.groups.length) return;
    const layer = createSvg("g", { "data-layer": "group-title-hit-targets" });
    state.groups.forEach((group) => {
      const titleTab = groupTitleTabMetrics(group, normalizeGroupTitleFontSize(group.titleFontSize));
      layer.appendChild(createSvg("rect", {
        x: titleTab.x,
        y: titleTab.y,
        width: titleTab.w,
        height: titleTab.h,
        rx: Math.min(8, titleTab.h / 3),
        fill: "transparent",
        "pointer-events": "all",
        "data-type": "group-title",
        "data-id": group.id,
        "data-inline-owner": "group",
        "data-inline-field": "title",
        "aria-label": "グループ名を直接編集",
        class: "node-handle inline-text-hit"
      }));
    });
    root.appendChild(layer);
  }

  function groupShapePath(group, shape = normalizeGroupShape(group.shape)) {
    const x = group.x;
    const y = group.y;
    const w = group.w;
    const h = group.h;
    const notchW = normalizeGroupNotchWidth(group);
    const notchH = normalizeGroupNotchHeight(group);
    if (shape === "l-top-left") {
      return `M ${x + notchW} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} L ${x} ${y + notchH} L ${x + notchW} ${y + notchH} Z`;
    }
    if (shape === "l-top-right") {
      return `M ${x} ${y} L ${x + w - notchW} ${y} L ${x + w - notchW} ${y + notchH} L ${x + w} ${y + notchH} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
    }
    if (shape === "l-bottom-left") {
      return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x + notchW} ${y + h} L ${x + notchW} ${y + h - notchH} L ${x} ${y + h - notchH} Z`;
    }
    if (shape === "l-bottom-right") {
      return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h - notchH} L ${x + w - notchW} ${y + h - notchH} L ${x + w - notchW} ${y + h} L ${x} ${y + h} Z`;
    }
    return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
  }

  function groupTitleTabMetrics(group, titleFontSize) {
    const shape = normalizeGroupShape(group.shape);
    const notchW = normalizeGroupNotchWidth(group);
    const title = String(group.title || "グループ");
    const horizontalPadding = clamp(titleFontSize * 0.7, 10, 18);
    const height = Math.max(28, Math.ceil(titleFontSize + 18));
    const width = Math.max(56, Math.ceil(estimatedGroupTitleWidth(title, titleFontSize) + horizontalPadding * 2));
    const x = shape === "l-top-left" ? group.x + notchW + 10 : group.x + 12;
    return {
      x,
      y: group.y - height + Math.round(height * GROUP_TITLE_TAB_OVERLAP_RATIO),
      w: width,
      h: height
    };
  }

  function estimatedGroupTitleWidth(title, fontSize) {
    return [...String(title || "")].reduce((width, character) => {
      if (/\s/.test(character)) return width + fontSize * 0.35;
      if (/^[\u0000-\u00ff]$/.test(character)) return width + fontSize * 0.62;
      return width + fontSize;
    }, 0);
  }

  function groupDisplayBounds(group) {
    const titleTab = groupTitleTabMetrics(group, normalizeGroupTitleFontSize(group.titleFontSize));
    const minX = Math.min(group.x, titleTab.x);
    const minY = Math.min(group.y, titleTab.y);
    const maxX = Math.max(group.x + group.w, titleTab.x + titleTab.w);
    const maxY = Math.max(group.y + group.h, titleTab.y + titleTab.h);
    return {
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY
    };
  }

  function groupNotchHandlePoint(group) {
    const shape = normalizeGroupShape(group.shape);
    const notchW = normalizeGroupNotchWidth(group);
    const notchH = normalizeGroupNotchHeight(group);
    if (shape === "l-top-left") return { x: group.x + notchW, y: group.y + notchH };
    if (shape === "l-top-right") return { x: group.x + group.w - notchW, y: group.y + notchH };
    if (shape === "l-bottom-left") return { x: group.x + notchW, y: group.y + group.h - notchH };
    if (shape === "l-bottom-right") return { x: group.x + group.w - notchW, y: group.y + group.h - notchH };
    return null;
  }

  function updateGroupNotchFromDrag(group, dragState, point) {
    const shape = normalizeGroupShape(group.shape);
    const minW = 24;
    const minH = 24;
    const maxW = Math.max(minW, group.w - 24);
    const maxH = Math.max(minH, group.h - 24);
    if (shape === "l-top-left") {
      group.notchWidth = clamp(point.x - group.x, minW, maxW);
      group.notchHeight = clamp(point.y - group.y, minH, maxH);
      return;
    }
    if (shape === "l-top-right") {
      group.notchWidth = clamp(group.x + group.w - point.x, minW, maxW);
      group.notchHeight = clamp(point.y - group.y, minH, maxH);
      return;
    }
    if (shape === "l-bottom-left") {
      group.notchWidth = clamp(point.x - group.x, minW, maxW);
      group.notchHeight = clamp(group.y + group.h - point.y, minH, maxH);
      return;
    }
    if (shape === "l-bottom-right") {
      group.notchWidth = clamp(group.x + group.w - point.x, minW, maxW);
      group.notchHeight = clamp(group.y + group.h - point.y, minH, maxH);
      return;
    }
    group.notchWidth = dragState.original.notchWidth;
    group.notchHeight = dragState.original.notchHeight;
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

  function renderGroupNotchHandle(group) {
    if (!isSelected("group", group.id) || normalizeGroupShape(group.shape) === "rect") return null;
    const point = groupNotchHandlePoint(group);
    if (!point) return null;
    const g = createSvg("g", {
      "data-type": "group-notch",
      "data-id": group.id,
      class: "group-notch-handle-layer"
    });
    g.appendChild(createSvg("circle", {
      cx: point.x,
      cy: point.y,
      r: 19,
      fill: "transparent",
      "pointer-events": "all",
      "data-type": "group-notch",
      "data-id": group.id,
      class: "group-notch-hit"
    }));
    g.appendChild(createSvg("rect", {
      x: point.x - 8,
      y: point.y - 8,
      width: 16,
      height: 16,
      rx: 4,
      fill: "#ffffff",
      stroke: group.color || "#202329",
      "stroke-width": 2,
      "data-type": "group-notch",
      "data-id": group.id,
      class: "group-notch-handle"
    }));
    g.appendChild(createSvg("path", {
      d: `M ${point.x - 5} ${point.y} L ${point.x + 5} ${point.y} M ${point.x} ${point.y - 5} L ${point.x} ${point.y + 5}`,
      stroke: "#202329",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "pointer-events": "none"
    }));
    return g;
  }

  function renderNode(node) {
    const active = isSelected("node", node.id) || isMultiSelectedItem("node", node.id);
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
      g.appendChild(createSvg("rect", {
        x: imageBox.x,
        y: imageBox.y,
        width: imageBox.w,
        height: imageBox.h,
        fill: node.imageBackgroundColor || "#ffffff",
        "pointer-events": "none"
      }));
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

    g.appendChild(createSvg("rect", {
      x: node.x,
      y: node.y,
      width: node.w,
      height: roleBandHeight,
      fill: "transparent",
      "pointer-events": "all",
      "data-type": "node-role",
      "data-id": node.id,
      "data-inline-owner": "node",
      "data-inline-field": "role",
      "aria-label": "肩書きを直接編集",
      class: "inline-text-hit"
    }));
    g.appendChild(createSvg("rect", {
      x: node.x,
      y: nameBandTop,
      width: node.w,
      height: nameBandHeight,
      fill: "transparent",
      "pointer-events": "all",
      "data-type": "node-name",
      "data-id": node.id,
      "data-inline-owner": "node",
      "data-inline-field": "name",
      "aria-label": "人名を直接編集",
      class: "inline-text-hit"
    }));

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
    const active = isSelected("text", textItem.id) || isMultiSelectedItem("text", textItem.id);
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
        fill: "transparent",
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
    const active = isSelected("shape", shape.id) || isMultiSelectedItem("shape", shape.id);
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
    const active = isSelected("image", imageItem.id) || isMultiSelectedItem("image", imageItem.id);
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
    const active = isSelected("legend", legend.id) || isMultiSelectedItem("legend", legend.id);
    const metrics = legendMetrics(legend);
    const arrowLegend = isArrowLegend(legend);
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
    }, legendTitle(legend)));
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

    if (arrowLegend) {
      renderArrowLegendRows(g, legend, metrics);
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

  function renderArrowLegendRows(g, legend, metrics) {
    const sampleStartX = legend.x + 16;
    const sampleEndX = sampleStartX + metrics.sampleWidth;
    metrics.rows.forEach((row) => {
      const item = row.item;
      const flow = arrowLegendFlow(item.type);
      const color = item.color || "#202329";
      const width = clamp(Number(item.width) || 3, 1, 8);
      const headSize = clamp(width * 2.4 + 2, 6, 14);
      const y = row.y + row.height / 2;
      const x1 = sampleStartX + (flow.start ? headSize * 0.6 : 0);
      const x2 = sampleEndX - (flow.end ? headSize * 0.6 : 0);
      g.appendChild(createSvg("line", {
        x1,
        y1: y,
        x2,
        y2: y,
        stroke: color,
        "stroke-width": width,
        "stroke-linecap": "round",
        "pointer-events": "none"
      }));
      if (flow.start) appendArrowLegendHead(g, sampleStartX, y, headSize, color, "left");
      if (flow.end) appendArrowLegendHead(g, sampleEndX, y, headSize, color, "right");

      const text = createSvg("text", {
        x: sampleEndX + 12,
        y: row.y + metrics.fontSize,
        fill: legend.color || "#202329",
        "font-size": metrics.fontSize,
        "font-weight": 650,
        "pointer-events": "none"
      });
      row.lines.forEach((line, index) => {
        text.appendChild(createSvg("tspan", {
          x: sampleEndX + 12,
          dy: index === 0 ? 0 : metrics.lineHeight
        }, line || " "));
      });
      g.appendChild(text);
    });
  }

  function appendArrowLegendHead(g, x, y, size, color, direction) {
    const points = direction === "left"
      ? `${x},${y} ${x + size},${y - size * 0.62} ${x + size},${y + size * 0.62}`
      : `${x},${y} ${x - size},${y - size * 0.62} ${x - size},${y + size * 0.62}`;
    g.appendChild(createSvg("polygon", {
      points,
      fill: color,
      "pointer-events": "none"
    }));
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
      kind: "marks",
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

  function createDefaultArrowLegend(center) {
    return {
      id: uid("legend"),
      kind: "arrows",
      title: "関係線凡例",
      x: center.x - ARROW_LEGEND_DEFAULT_WIDTH / 2,
      y: center.y - 78,
      w: ARROW_LEGEND_DEFAULT_WIDTH,
      fontSize: LEGEND_DEFAULT_FONT_SIZE,
      color: "#202329",
      backgroundColor: "#ffffff",
      borderColor: "#d8ded8",
      items: [
        createArrowLegendItem({ text: "敵対", color: "#e53935", type: "bidirectional", width: 3 }),
        createArrowLegendItem({ text: "協力・友好", color: "#1e88e5", type: "bidirectional", width: 3 }),
        createArrowLegendItem({ text: "一方的な影響", color: "#202329", type: "from-to", width: 2 })
      ]
    };
  }

  function legendMetrics(legend) {
    if (isArrowLegend(legend)) return arrowLegendMetrics(legend);
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

  function arrowLegendMetrics(legend) {
    const fontSize = clamp(Number(legend.fontSize) || LEGEND_DEFAULT_FONT_SIZE, 9, 28);
    const lineHeight = fontSize * 1.25;
    const legendWidth = Number(legend.w) || ARROW_LEGEND_DEFAULT_WIDTH;
    const sampleWidth = clamp(Math.round(legendWidth * 0.28), 52, 90);
    const textWidth = Math.max(28, legendWidth - sampleWidth - 40);
    let cursorY = legend.y + 38;
    const rows = normalizeArrowLegendItems(legend.items)
      .filter((item) => item.visible)
      .map((item) => {
        const lines = wrapTextLines(item.text || "説明", textWidth, fontSize);
        const rowHeight = Math.max(22, Number(item.width) + 12, lines.length * lineHeight + 8);
        const row = {
          item,
          lines,
          y: cursorY,
          height: rowHeight
        };
        cursorY += rowHeight;
        return row;
      });
    const height = Math.max(58, cursorY - legend.y + 8);
    return {
      fontSize,
      lineHeight,
      sampleWidth,
      rows,
      height
    };
  }

  function legendKind(legend) {
    return LEGEND_KINDS.has(legend?.kind) ? legend.kind : "marks";
  }

  function isArrowLegend(legend) {
    return legendKind(legend) === "arrows";
  }

  function legendTitle(legend) {
    return String(legend?.title || (isArrowLegend(legend) ? "関係線凡例" : "属性マーク凡例"));
  }

  function arrowLegendFlow(type) {
    const normalized = ARROW_LEGEND_TYPE_IDS.has(type) ? type : "from-to";
    return {
      start: normalized === "to-from" || normalized === "bidirectional",
      end: normalized === "from-to" || normalized === "bidirectional"
    };
  }

  function arrowLegendTypeLabel(type) {
    return ARROW_LEGEND_TYPES.find(([id]) => id === type)?.[1] || "右向き矢印";
  }

  function renderLink(link) {
    const fromEndpoints = getLinkEndpointEntries(link, "from");
    const toEndpoints = getLinkEndpointEntries(link, "to");
    const active = isSelected("link", link.id);
    const g = createSvg("g", {
      "data-type": "link",
      "data-id": link.id,
      "data-selected": active ? "true" : "false"
    });
    if (!fromEndpoints.length || !toEndpoints.length) return g;

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
        const points = [start, end];
        appendLinkPath(g, link, polylinePathWithJumps(link, points), active, {
          markerEnd: link.type === "bidirectional" || link.type === "arrow",
          markerStart: link.type === "bidirectional",
          hitPathData: polylinePath(points)
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
    const obstacles = fastDiagramRender ? [] : linkConnectionObstacles([fromEndpoint, toEndpoint]);
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
    const manualRoute = link.manualRoute === true;
    const useHorizontalTrunk = resolvedLinkFlowAxis(link, fromCenter, toCenter, `multi:${fromEndpoints.length}:${toEndpoints.length}`);
    const nodeObstacles = fastDiagramRender || manualRoute ? [] : linkConnectionObstacles([...fromEndpoints, ...toEndpoints]);
    const allBranches = [];
    let trunkPath = "";
    let labelPoint;
    let routeHandlePoint;
    let trunkPoints = [];
    const terminalHandles = [];

    if (useHorizontalTrunk) {
      const estimatedYs = [...fromEndpoints, ...toEndpoints].map((endpoint) => endpoint.center.y);
      const baseTrunkX = (fromCenter.x + toCenter.x) / 2;
      const trunkX = (manualRoute
        ? baseTrunkX
        : chooseTrunkCoordinate(
          "vertical",
          baseTrunkX,
          Math.min(...estimatedYs),
          Math.max(...estimatedYs),
          nodeObstacles
        )) + normalizedLinkRouteOffsetX(link);
      const { sourceBranches, targetBranches } = resolveMultiLinkBranches(
        link,
        fromEndpoints,
        toEndpoints,
        "vertical",
        trunkX,
        nodeObstacles
      );
      [...sourceBranches, ...targetBranches].forEach((branch) => {
        if (branch.terminal) terminalHandles.push({ point: branch.terminal.point, side: branch.side, endpointId: branch.endpointId, axis: branch.terminal.axis });
      });
      const ys = [...sourceBranches, ...targetBranches].map((branch) => branch.join.y);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      trunkPoints = [{ x: trunkX, y: minY }, { x: trunkX, y: maxY }];
      trunkPath = polylinePath(trunkPoints);
      labelPoint = pointOnPolyline(trunkPoints, normalizedLinkLabelPosition(link));
      routeHandlePoint = pointOnPolyline(trunkPoints, 0.5);
      sourceBranches.forEach((branch) => {
        allBranches.push({
          d: polylinePath(branch.points),
          points: branch.points,
          side: branch.side,
          endpointId: branch.endpointId,
          terminal: branch.terminal,
          markerStart: link.type === "bidirectional",
          markerEnd: false
        });
      });
      targetBranches.forEach((branch) => {
        allBranches.push({
          d: polylinePath(branch.points),
          points: branch.points,
          side: branch.side,
          endpointId: branch.endpointId,
          terminal: branch.terminal,
          markerStart: false,
          markerEnd: link.type === "bidirectional" || link.type === "arrow"
        });
      });
    } else {
      const estimatedXs = [...fromEndpoints, ...toEndpoints].map((endpoint) => endpoint.center.x);
      const baseTrunkY = (fromCenter.y + toCenter.y) / 2;
      const trunkY = (manualRoute
        ? baseTrunkY
        : chooseTrunkCoordinate(
          "horizontal",
          baseTrunkY,
          Math.min(...estimatedXs),
          Math.max(...estimatedXs),
          nodeObstacles
        )) + normalizedLinkRouteOffsetY(link);
      const { sourceBranches, targetBranches } = resolveMultiLinkBranches(
        link,
        fromEndpoints,
        toEndpoints,
        "horizontal",
        trunkY,
        nodeObstacles
      );
      [...sourceBranches, ...targetBranches].forEach((branch) => {
        if (branch.terminal) terminalHandles.push({ point: branch.terminal.point, side: branch.side, endpointId: branch.endpointId, axis: branch.terminal.axis });
      });
      const xs = [...sourceBranches, ...targetBranches].map((branch) => branch.join.x);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      trunkPath = `M ${minX} ${trunkY} L ${maxX} ${trunkY}`;
      trunkPoints = [{ x: minX, y: trunkY }, { x: maxX, y: trunkY }];
      labelPoint = pointOnPolyline(trunkPoints, normalizedLinkLabelPosition(link));
      routeHandlePoint = pointOnPolyline(trunkPoints, 0.5);
      sourceBranches.forEach((branch) => {
        allBranches.push({
          d: polylinePath(branch.points),
          points: branch.points,
          side: branch.side,
          endpointId: branch.endpointId,
          terminal: branch.terminal,
          markerStart: link.type === "bidirectional",
          markerEnd: false
        });
      });
      targetBranches.forEach((branch) => {
        allBranches.push({
          d: polylinePath(branch.points),
          points: branch.points,
          side: branch.side,
          endpointId: branch.endpointId,
          terminal: branch.terminal,
          markerStart: false,
          markerEnd: link.type === "bidirectional" || link.type === "arrow"
        });
      });
    }

    appendLinkPath(g, link, polylinePathWithJumps(link, trunkPoints), active, { lineCap: "butt", hitPathData: trunkPath });
    allBranches.forEach((branch) => {
      appendLinkPath(g, link, polylinePathWithJumps(link, branch.points || []), active, { ...branch, lineCap: "butt", hitPathData: branch.d });
    });
    if (active) {
      appendLinkSegmentHandles(g, link, trunkPoints);
      allBranches.forEach((branch) => {
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
    appendLinkPath(g, link, polylinePathWithJumps(link, points), active, {
      markerStart: link.type === "bidirectional",
      markerEnd: link.type === "bidirectional" || link.type === "arrow",
      lineCap: "butt",
      hitPathData: polylinePath(points)
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
      d: markers.hitPathData || pathData,
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
        "data-inline-owner": "link",
        "data-inline-field": "label",
        "aria-label": "関係名を直接編集",
        class: "link-label inline-text-hit"
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
      "data-route-x": point.x,
      "data-route-y": point.y,
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
      "data-route-x": point.x,
      "data-route-y": point.y,
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
    const manualRoute = link.manualRoute === true;
    const useHorizontalTrunk = resolvedLinkFlowAxis(link, fromCenter, toCenter, `multi:${fromEndpoints.length}:${toEndpoints.length}`);
    const nodeObstacles = manualRoute ? [] : linkConnectionObstacles([...fromEndpoints, ...toEndpoints]);
    if (useHorizontalTrunk) {
      const estimatedYs = [...fromEndpoints, ...toEndpoints].map((endpoint) => endpoint.center.y);
      const baseTrunkX = (fromCenter.x + toCenter.x) / 2;
      const trunkX = (manualRoute
        ? baseTrunkX
        : chooseTrunkCoordinate(
          "vertical",
          baseTrunkX,
          Math.min(...estimatedYs),
          Math.max(...estimatedYs),
          nodeObstacles
        )) + normalizedLinkRouteOffsetX(link);
      const { sourceBranches, targetBranches } = resolveMultiLinkBranches(
        link,
        fromEndpoints,
        toEndpoints,
        "vertical",
        trunkX,
        nodeObstacles
      );
      const ys = [...sourceBranches, ...targetBranches].map((branch) => branch.join.y);
      return [{ x: trunkX, y: Math.min(...ys) }, { x: trunkX, y: Math.max(...ys) }];
    }
    const estimatedXs = [...fromEndpoints, ...toEndpoints].map((endpoint) => endpoint.center.x);
    const baseTrunkY = (fromCenter.y + toCenter.y) / 2;
    const trunkY = (manualRoute
      ? baseTrunkY
      : chooseTrunkCoordinate(
        "horizontal",
        baseTrunkY,
        Math.min(...estimatedXs),
        Math.max(...estimatedXs),
        nodeObstacles
      )) + normalizedLinkRouteOffsetY(link);
    const { sourceBranches, targetBranches } = resolveMultiLinkBranches(
      link,
      fromEndpoints,
      toEndpoints,
      "horizontal",
      trunkY,
      nodeObstacles
    );
    const xs = [...sourceBranches, ...targetBranches].map((branch) => branch.join.x);
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
    const start = connectionDrag.startAnchorPoint || edgePoint(from, {
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

  function renderMarqueeSelection(marqueeDrag) {
    const rect = marqueeRect(marqueeDrag.start, marqueeDrag.current || marqueeDrag.start);
    const g = createSvg("g", { "pointer-events": "none" });
    g.appendChild(createSvg("rect", {
      x: rect.x,
      y: rect.y,
      width: rect.w,
      height: rect.h,
      rx: 4,
      fill: "rgba(20, 125, 114, 0.12)",
      stroke: "#147d72",
      "stroke-width": 1.5,
      "stroke-dasharray": "7 5"
    }));
    return g;
  }

  function renderSelectionList() {
    normalizeMultiSelection();
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
        name: legendTitle(legend),
        color: legend.borderColor || "#202329"
      }))
    ];
    const signature = selectionListContentSignature(items);
    if (signature === selectionListSignature) {
      updateSelectionListState();
      return;
    }
    selectionListSignature = signature;
    selectionList.replaceChildren();
    if (!items.length) {
      selectionList.appendChild(el("div", { class: "empty-state" }, "項目なし"));
      return;
    }
    items.forEach((item) => {
      const row = el("div", {
        "data-type": item.type,
        "data-id": item.id,
        class: [
          "selection-item",
          isSelected(item.type, item.id) ? "is-active" : "",
          isMultiSelectedItem(item.type, item.id) ? "is-multi-selected" : ""
        ].filter(Boolean).join(" ")
      });
      if (item.type === "node") {
        const checkbox = el("input", {
          type: "checkbox",
          class: "selection-check",
          title: "整列対象"
        });
        checkbox.checked = isMultiSelectedItem("node", item.id);
        checkbox.disabled = isViewMode();
        checkbox.addEventListener("click", (event) => {
          event.stopPropagation();
        });
        checkbox.addEventListener("change", () => {
          if (isViewMode()) return;
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
        inspectorOpen = isViewMode();
        if (!isViewMode()) mode = "select";
        pendingConnection = null;
        if (isViewMode()) renderViewSelection();
        else renderEditSelection({ deferDiagram: true });
      });
      button.addEventListener("dblclick", () => {
        selected = { type: item.type, id: item.id };
        inspectorOpen = true;
        if (!isViewMode()) mode = "select";
        pendingConnection = null;
        if (isViewMode()) renderViewSelection();
        else renderEditSelection({ openInspector: true });
      });
      row.appendChild(button);
      selectionList.appendChild(row);
    });
  }

  function selectionListContentSignature(items) {
    const itemKey = items.map((item) => [
      item.type,
      item.id,
      item.name,
      item.color || "",
      item.dotStyle || ""
    ].join("~")).join("|");
    return items.length ? itemKey : "__empty__";
  }

  function updateSelectionListState(options = {}) {
    if (!selectionList) return;
    if (options.skipHiddenMobileList && window.innerWidth <= 760 && toolPanel?.dataset.mobilePanel !== "select") return;
    selectionList.querySelectorAll(".selection-item").forEach((row) => {
      const type = row.dataset.type || "";
      const id = row.dataset.id || "";
      row.classList.toggle("is-active", isSelected(type, id));
      row.classList.toggle("is-multi-selected", isMultiSelectedItem(type, id));
      const checkbox = row.querySelector(".selection-check");
      if (checkbox) {
        checkbox.checked = isMultiSelectedItem("node", id);
        checkbox.disabled = isViewMode();
      }
    });
  }

  function toggleMultiSelectedNode(id, force) {
    toggleMultiSelectedItem("node", id, force);
  }

  function toggleMultiSelectedItem(type, id, force) {
    if (!isMultiSelectableType(type) || !getSelectableItem(type, id)) return;
    const shouldSelect = force === undefined ? !isMultiSelectedItem(type, id) : Boolean(force);
    setMultiSelectedItem(type, id, shouldSelect);
    renderEditSelection({
      openInspector: multiSelectedCount() >= 2,
      deferDiagram: true
    });
  }

  function isMultiSelectableType(type) {
    return MULTI_SELECT_TYPES.has(type);
  }

  function multiSelectionKey(type, id) {
    return `${type}:${id}`;
  }

  function parseMultiSelectionKey(key) {
    const separator = String(key || "").indexOf(":");
    if (separator < 0) return null;
    return {
      type: key.slice(0, separator),
      id: key.slice(separator + 1)
    };
  }

  function isMultiSelectedItem(type, id) {
    if (!isMultiSelectableType(type) || !id) return false;
    return multiSelectedItemKeys.has(multiSelectionKey(type, id)) || (type === "node" && multiSelectedNodeIds.has(id));
  }

  function setMultiSelectedItem(type, id, shouldSelect = true) {
    if (!isMultiSelectableType(type) || !id) return;
    const key = multiSelectionKey(type, id);
    if (shouldSelect) {
      multiSelectedItemKeys.add(key);
      if (type === "node") multiSelectedNodeIds.add(id);
      return;
    }
    multiSelectedItemKeys.delete(key);
    if (type === "node") multiSelectedNodeIds.delete(id);
  }

  function clearMultiSelection() {
    multiSelectedItemKeys.clear();
    multiSelectedNodeIds.clear();
  }

  function multiSelectedItems() {
    normalizeMultiSelection();
    return [...multiSelectedItemKeys]
      .map(parseMultiSelectionKey)
      .filter((entry) => entry && getSelectableItem(entry.type, entry.id));
  }

  function multiSelectedCount() {
    return multiSelectedItems().length;
  }

  function normalizeMultiSelection() {
    multiSelectedNodeIds.forEach((id) => {
      if (getNode(id)) multiSelectedItemKeys.add(multiSelectionKey("node", id));
      else multiSelectedNodeIds.delete(id);
    });
    [...multiSelectedItemKeys].forEach((key) => {
      const entry = parseMultiSelectionKey(key);
      if (!entry || !isMultiSelectableType(entry.type) || !getSelectableItem(entry.type, entry.id)) {
        multiSelectedItemKeys.delete(key);
        return;
      }
      if (entry.type === "node") multiSelectedNodeIds.add(entry.id);
    });
  }

  function getSelectableItem(type, id) {
    if (type === "node") return getNode(id);
    if (type === "group") return getGroup(id);
    if (type === "text") return getTextItem(id);
    if (type === "shape") return getShape(id);
    if (type === "image") return getImageItem(id);
    if (type === "legend") return getLegend(id);
    return null;
  }

  function selectedAlignmentNodes() {
    return state.nodes.filter((node) => isMultiSelectedItem("node", node.id));
  }

  function alignmentSpacing() {
    return clamp(Number(alignSpacingInput?.value) || 0, 0, 240);
  }

  function updateAlignControls() {
    normalizeMultiSelection();
    const count = selectedAlignmentNodes().length;
    const disabled = isViewMode() || count < 2;
    if (alignHorizontalBtn) alignHorizontalBtn.disabled = disabled;
    if (alignVerticalBtn) alignVerticalBtn.disabled = disabled;
    if (alignSpacingValue) {
      alignSpacingValue.value = `${alignmentSpacing()}px`;
      alignSpacingValue.textContent = `${alignmentSpacing()}px`;
    }
    if (alignHint) {
      alignHint.textContent = isViewMode()
        ? "閲覧モード中は整列できません"
        : disabled
        ? "人物を2人以上チェック"
        : `${count}人を整列対象にしています`;
    }
  }

  function alignSelectedNodes(direction) {
    if (isViewMode()) return;
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
    if (isViewMode()) {
      if (!item) {
        inspectorContent.appendChild(el("div", { class: "empty-state" }, "要素を選択すると詳細を表示します"));
        return;
      }
      renderReadonlyInspector(item);
      return;
    }
    const multiNodes = selectedAlignmentNodes();
    if (multiNodes.length >= 2) {
      renderMultiNodeInspector(multiNodes);
      return;
    }
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

  function renderReadonlyInspector(item) {
    const wrap = el("div", { class: "readonly-details" });
    wrap.appendChild(el("div", { class: "readonly-mode-badge" }, "閲覧モード"));
    if (selected.type === "node") {
      wrap.appendChild(renderReadonlyNodeProfile(item));
      wrap.appendChild(detailRow("説明文", nodeDescription(item)));
      wrap.appendChild(detailRow("属性マーク", nodeMarkLabels(item.marks)));
      wrap.appendChild(renderReadonlyNodeRelations(item));
    }
    if (selected.type === "group") {
      wrap.appendChild(detailRow("種別", "グループ"));
      wrap.appendChild(detailRow("グループ名", item.title || "グループ"));
      wrap.appendChild(detailRow("形状", groupShapeLabel(item.shape)));
    }
    if (selected.type === "link") {
      wrap.appendChild(detailRow("種別", "関係線"));
      wrap.appendChild(detailRow("関係名", item.label || "関係"));
      wrap.appendChild(detailRow("接続元", endpointLabels(getLinkEndpointIds(item, "fromIds"))));
      wrap.appendChild(detailRow("接続先", endpointLabels(getLinkEndpointIds(item, "toIds"))));
      wrap.appendChild(detailRow("種類", linkTypeLabel(item.type)));
      wrap.appendChild(detailRow("線の形", linkRouteLabel(item.route)));
    }
    if (selected.type === "text") {
      wrap.appendChild(detailRow("種別", "文章"));
      wrap.appendChild(detailRow("内容", item.content || ""));
    }
    if (selected.type === "shape") {
      wrap.appendChild(detailRow("種別", "図形"));
      wrap.appendChild(detailRow("図形", shapeLabel(item)));
    }
    if (selected.type === "image") {
      wrap.appendChild(detailRow("種別", "画像"));
      wrap.appendChild(detailRow("名前", item.name || "画像"));
    }
    if (selected.type === "legend") {
      wrap.appendChild(detailRow("種別", isArrowLegend(item) ? "矢印凡例" : "属性マーク凡例"));
      wrap.appendChild(detailRow("見出し", legendTitle(item)));
      wrap.appendChild(detailRow("項目", legendDetailText(item)));
    }
    inspectorContent.appendChild(wrap);
  }

  function renderReadonlyNodeProfile(node) {
    const card = el("div", { class: "readonly-profile-card" });
    const avatar = el("div", { class: "readonly-profile-avatar" });
    const imageSrc = resolveImageSource(node.image);
    if (imageSrc) {
      const image = el("img", {
        class: "readonly-profile-image",
        src: imageSrc,
        alt: node.name || "人物",
        style: readonlyProfileImageStyle(node)
      });
      avatar.appendChild(image);
    } else {
      avatar.appendChild(el("span", { class: "readonly-profile-placeholder" }, "？"));
    }

    const body = el("div", { class: "readonly-profile-body" });
    body.appendChild(el("div", { class: "readonly-profile-kind" }, "人物プロフィール"));
    body.appendChild(el("div", { class: "readonly-profile-role" }, String(node.role || "肩書き未設定")));
    body.appendChild(el("div", { class: "readonly-profile-name" }, String(node.name || "人物")));
    const marks = readonlyProfileMarks(node);
    if (marks) body.appendChild(marks);
    card.appendChild(avatar);
    card.appendChild(body);
    return card;
  }

  function readonlyProfileImageStyle(node) {
    const box = { x: 0, y: 0, w: 104, h: 104 };
    const draw = computeImageDraw(node, box);
    if (draw.preserveAspectRatio) {
      return "inset:0;width:100%;height:100%;object-fit:cover;";
    }
    return [
      `left:${formatCssNumber(draw.x)}px`,
      `top:${formatCssNumber(draw.y)}px`,
      `width:${formatCssNumber(draw.w)}px`,
      `height:${formatCssNumber(draw.h)}px`
    ].join(";");
  }

  function formatCssNumber(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "0";
    return String(Math.round(number * 1000) / 1000);
  }

  function readonlyProfileMarks(node) {
    const marks = normalizeNodeMarks(node.marks)
      .map((id) => NODE_MARKS.find((mark) => mark.id === id))
      .filter(Boolean);
    if (!marks.length) return null;
    const wrap = el("div", { class: "readonly-profile-marks" });
    marks.forEach((mark) => {
      const badge = el("span", {
        class: "readonly-profile-mark",
        title: mark.label,
        style: `background:${mark.color}`
      });
      badge.appendChild(el("span", {}, mark.label.slice(0, 1)));
      wrap.appendChild(badge);
    });
    return wrap;
  }

  function renderReadonlyNodeRelations(node) {
    const section = el("section", { class: "readonly-relations" });
    const outgoing = readonlyNodeRelationEntries(node.id, "fromIds", "toIds");
    const incoming = readonlyNodeRelationEntries(node.id, "toIds", "fromIds");
    section.appendChild(el("div", { class: "readonly-relations-title" }, "関係線"));
    section.appendChild(renderReadonlyRelationList("この人物から伸びる関係", outgoing, node));
    section.appendChild(renderReadonlyRelationList("この人物へ向けて伸びる関係", incoming, node));
    return section;
  }

  function readonlyNodeRelationEntries(nodeId, ownSide, counterpartSide) {
    return state.links.flatMap((link) => {
      if (!getLinkEndpointIds(link, ownSide).includes(nodeId)) return [];
      const counterparts = getLinkEndpointIds(link, counterpartSide)
        .filter((id) => id !== nodeId)
        .map(readonlyRelationEndpoint)
        .filter(Boolean);
      const entries = counterparts.length ? counterparts : [{ label: "相手未設定", type: "unknown" }];
      return entries.map((counterpart, index) => ({
        id: `${link.id}:${counterpart.id || index}`,
        label: String(link.label || "関係名未設定"),
        type: link.type || "line",
        ownSide,
        counterpart
      }));
    });
  }

  function readonlyRelationEndpoint(id) {
    const endpoint = getConnectionEndpoint(id);
    if (!endpoint) return null;
    return {
      id,
      label: endpoint.label || "未設定",
      type: endpoint.type,
      item: endpoint.item
    };
  }

  function renderReadonlyRelationList(title, entries, node) {
    const group = el("section", { class: "readonly-relation-group" });
    group.appendChild(el("div", { class: "readonly-relation-group-title" }, title));
    if (!entries.length) {
      group.appendChild(el("div", { class: "readonly-relation-empty" }, "なし"));
      return group;
    }
    const list = el("div", { class: "readonly-relation-list" });
    entries.forEach((entry) => {
      list.appendChild(renderReadonlyRelationDiagram(entry, node));
    });
    group.appendChild(list);
    return group;
  }

  function renderReadonlyRelationDiagram(entry, node) {
    const diagram = el("div", { class: "readonly-relation-diagram" });
    diagram.appendChild(readonlyRelationNode(node, "node"));
    const link = el("div", { class: "readonly-relation-link" });
    link.appendChild(renderReadonlyRelationLine(entry));
    link.appendChild(el("div", { class: "readonly-relation-name" }, entry.label));
    diagram.appendChild(link);
    diagram.appendChild(readonlyRelationNode(entry.counterpart.item, entry.counterpart.type, entry.counterpart.label));
    return diagram;
  }

  function readonlyRelationNode(item, type, fallbackLabel = "") {
    const label = fallbackLabel || (type === "group" ? item?.title : item?.name) || "未設定";
    const chip = el("div", {
      class: "readonly-relation-node",
      style: item ? selectionDotStyle(item) : "background:#6b7280"
    });
    chip.appendChild(el("span", { class: "readonly-relation-node-name" }, label));
    if (type === "group") {
      chip.appendChild(el("span", { class: "readonly-relation-kind" }, "グループ"));
    }
    return chip;
  }

  function renderReadonlyRelationLine(entry) {
    const flow = readonlyRelationFlow(entry.type, entry.ownSide);
    const markerId = `readonly_relation_arrow_${String(entry.id).replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const svgLine = createSvg("svg", {
      class: "readonly-relation-line",
      viewBox: "0 0 240 48",
      preserveAspectRatio: "none",
      "aria-hidden": "true"
    });
    const defs = createSvg("defs");
    const marker = createSvg("marker", {
      id: markerId,
      viewBox: "0 0 10 10",
      refX: 8.5,
      refY: 5,
      markerWidth: 6,
      markerHeight: 6,
      orient: "auto-start-reverse"
    });
    marker.appendChild(createSvg("path", {
      d: "M 0 0 L 10 5 L 0 10 z",
      fill: "#147d72"
    }));
    defs.appendChild(marker);
    svgLine.appendChild(defs);
    svgLine.appendChild(createSvg("line", {
      x1: 8,
      y1: 24,
      x2: 232,
      y2: 24,
      stroke: "#147d72",
      "stroke-width": 2.4,
      "stroke-linecap": "round",
      "stroke-dasharray": entry.type === "dashed" ? "8 6" : "",
      "marker-start": flow.atSource ? `url(#${markerId})` : "",
      "marker-end": flow.atCounterpart ? `url(#${markerId})` : ""
    }));
    return svgLine;
  }

  function readonlyRelationFlow(type, ownSide) {
    if (type === "bidirectional") return { atSource: true, atCounterpart: true };
    if (type === "arrow" || type === "from-to") {
      return ownSide === "fromIds" ? { atSource: false, atCounterpart: true } : { atSource: true, atCounterpart: false };
    }
    if (type === "to-from") {
      return ownSide === "fromIds" ? { atSource: true, atCounterpart: false } : { atSource: false, atCounterpart: true };
    }
    return { atSource: false, atCounterpart: false };
  }

  function detailRow(label, value) {
    const text = String(value || "").trim();
    const row = el("div", { class: "detail-field" });
    row.appendChild(el("div", { class: "detail-label" }, label));
    row.appendChild(el("div", { class: `detail-value${text ? "" : " is-empty"}` }, text || "未設定"));
    return row;
  }

  function nodeDescription(node) {
    return String(node?.description ?? node?.memo ?? "");
  }

  function nodeMarkLabels(marks) {
    const labels = normalizeNodeMarks(marks)
      .map((id) => NODE_MARKS.find((mark) => mark.id === id)?.label)
      .filter(Boolean);
    return labels.join("、");
  }

  function endpointLabels(ids) {
    return ids
      .map((id) => getConnectionEndpoint(id)?.label || "")
      .filter(Boolean)
      .join("、");
  }

  function linkTypeLabel(type) {
    if (type === "from-to") return "接続元から接続先";
    if (type === "to-from") return "接続先から接続元";
    if (type === "none") return "矢印なし";
    return "双方向";
  }

  function linkRouteLabel(route) {
    if (route === "straight") return "直線";
    if (route === "curve") return "曲線";
    return "直角";
  }

  function groupShapeLabel(shape) {
    return GROUP_SHAPES.find(([id]) => id === normalizeGroupShape(shape))?.[1] || "四角";
  }

  function legendDetailText(legend) {
    if (isArrowLegend(legend)) {
      return normalizeArrowLegendItems(legend.items)
        .filter((item) => item.visible)
        .map((item) => `${arrowLegendTypeLabel(item.type)}: ${item.text || "説明"}`)
        .join("\n");
    }
    return normalizeLegendItems(legend.items)
      .filter((item) => item.visible)
      .map((item) => {
        const mark = NODE_MARKS.find((candidate) => candidate.id === item.markId);
        return item.text || mark?.label || "";
      })
      .filter(Boolean)
      .join("\n");
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
    form.appendChild(collapsedFieldSection("名前・肩書の文字色/フチ", [
      field("名前文字色", swatches(node.nameTextColor || "#ffffff", (value) => {
        node.nameTextColor = value;
        scheduleChange();
      }, ["#ffffff", "#202329", ...PALETTE])),
      field("名前フチ色", swatches(node.nameOutlineColor || "#202329", (value) => {
        node.nameOutlineColor = value;
        scheduleChange();
      }, ["#202329", "#ffffff", ...PALETTE])),
      field("名前フチ幅", rangeWithValue(normalizeNodeOutlineWidth(node.nameOutlineWidth), 0, 8, (value) => {
        node.nameOutlineWidth = value;
        scheduleChange();
      }, 1, "px")),
      field("肩書き文字色", swatches(node.roleTextColor || "#ffffff", (value) => {
        node.roleTextColor = value;
        scheduleChange();
      }, ["#ffffff", "#202329", ...PALETTE])),
      field("肩書きフチ色", swatches(node.roleOutlineColor || "#202329", (value) => {
        node.roleOutlineColor = value;
        scheduleChange();
      }, ["#202329", "#ffffff", ...PALETTE])),
      field("肩書きフチ幅", rangeWithValue(normalizeNodeOutlineWidth(node.roleOutlineWidth), 0, 8, (value) => {
        node.roleOutlineWidth = value;
        scheduleChange();
      }, 1, "px"))
    ]));
    const descriptionInput = textarea(nodeDescription(node), (value) => {
      node.description = value;
      scheduleChange(false);
    });
    descriptionInput.classList.add("description-input");
    form.appendChild(field("説明文", descriptionInput));
    form.appendChild(field("色", swatches(node.color, (value) => {
      node.color = value;
      scheduleChange();
    })));
    form.appendChild(field("グラデーション", gradientControls(node)));
    form.appendChild(field("属性マーク", nodeMarkControls(node)));
    form.appendChild(field("画像", imageUploadControl(node)));
    form.appendChild(field("画像背景色", swatches(node.imageBackgroundColor || "#ffffff", (value) => {
      node.imageBackgroundColor = value;
      scheduleChange();
    }, ["#ffffff", "#202329", "#f9faf7", "#eef4ef", "#fff2ef", ...PALETTE])));
    if (node.image) form.appendChild(imageCropControls(node));
    form.appendChild(field("サイズ", nodeSizePresetControls(node)));
    form.appendChild(sizeControls(node, "node"));
    form.appendChild(el("div", { class: "divider" }));
    form.appendChild(actionRow(() => duplicateNode(node), deleteSelected));
    inspectorContent.appendChild(form);
  }

  function renderMultiNodeInspector(nodes) {
    const form = el("div", { class: "form bulk-node-edit-form" });
    const totalSelected = multiSelectedCount();
    const additionalSelection = totalSelected > nodes.length ? `（人物以外 ${totalSelected - nodes.length}件は対象外）` : "";
    form.appendChild(el("div", { class: "bulk-node-edit-summary" }, `人物 ${nodes.length}人に一括適用${additionalSelection}`));
    form.appendChild(multiNodeSizeControls(nodes));
    form.appendChild(field("色", swatches(sharedNodeColor(nodes), (value) => {
      nodes.forEach((node) => {
        node.color = value;
      });
    })));
    form.appendChild(field("グラデーション", multiNodeGradientControls(nodes)));
    inspectorContent.appendChild(form);
  }

  function sharedNodeColor(nodes) {
    return sharedValue(nodes.map((node) => String(node.color || PALETTE[0]).toLowerCase()));
  }

  function multiNodeGradientControls(nodes) {
    const gradients = nodes.map((node) => normalizeGradient(node.gradient, node.color || PALETTE[0]));
    const enabledCount = gradients.filter((gradient) => gradient.enabled).length;
    const enabledState = enabledCount === gradients.length ? "all" : enabledCount ? "mixed" : "none";
    const wrap = el("div", { class: "gradient-controls" });
    wrap.appendChild(mixedCheckboxControl(enabledState, (checked) => {
      nodes.forEach((node) => {
        node.gradient = {
          ...normalizeGradient(node.gradient, node.color || PALETTE[0]),
          enabled: checked
        };
      });
    }, {
      all: "オン",
      mixed: "一部オン",
      none: "オフ"
    }));
    if (enabledState === "none") return wrap;

    const options = el("div", { class: "gradient-options" });
    const secondColor = sharedValue(gradients.map((gradient) => String(gradient.color || "").toLowerCase()));
    options.appendChild(field("2色目", swatches(secondColor, (value) => {
      nodes.forEach((node) => {
        node.gradient = {
          ...normalizeGradient(node.gradient, node.color || PALETTE[0]),
          color: value
        };
      });
    }, ["#ffffff", "#202329", ...PALETTE])));

    const sharedDirection = sharedValue(gradients.map((gradient) => gradient.direction));
    const directionSelect = el("select");
    if (!sharedDirection) {
      const mixedOption = el("option", { value: "" }, "混在");
      mixedOption.selected = true;
      directionSelect.appendChild(mixedOption);
    }
    GRADIENT_DIRECTIONS.forEach(([value, label]) => {
      const option = el("option", { value }, label);
      option.selected = sharedDirection === value;
      directionSelect.appendChild(option);
    });
    directionSelect.addEventListener("change", () => {
      if (!GRADIENT_DIRECTION_IDS.has(directionSelect.value)) return;
      nodes.forEach((node) => {
        node.gradient = {
          ...normalizeGradient(node.gradient, node.color || PALETTE[0]),
          direction: directionSelect.value
        };
      });
      commitChange();
    });
    options.appendChild(field("方向", directionSelect));
    wrap.appendChild(options);
    return wrap;
  }

  function mixedCheckboxControl(state, onChange, labels) {
    const label = el("label", { class: "check-control" });
    const input = el("input", { type: "checkbox" });
    const text = el("span", {}, labels[state] || "オフ");
    input.checked = state === "all";
    input.indeterminate = state === "mixed";
    input.addEventListener("change", () => {
      onChange(input.checked);
      commitChange();
    });
    label.appendChild(input);
    label.appendChild(text);
    return label;
  }

  function sharedValue(values) {
    if (!values.length) return "";
    const [first, ...rest] = values;
    return rest.every((value) => value === first) ? first : "";
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
    form.appendChild(field("見出し背景透明度", rangeWithValue(Math.round(normalizeGroupTitleBackgroundOpacity(group.titleBackgroundOpacity) * 100), 0, 100, (value) => {
      group.titleBackgroundOpacity = clamp(Number(value) || 0, 0, 100) / 100;
      scheduleChange();
    }, 1, "%")));
    form.appendChild(collapsedFieldSection("グループ名の色/フチ", [
      field("文字色", swatches(groupTitleTextColor(group), (value) => {
        group.titleTextColor = value;
        scheduleChange();
      }, ["#ffffff", "#202329", ...PALETTE])),
      field("フチ色", swatches(normalizeColorValue(group.titleOutlineColor, "#ffffff"), (value) => {
        group.titleOutlineColor = value;
        scheduleChange();
      }, ["#ffffff", "#202329", ...PALETTE])),
      field("フチ幅", rangeWithValue(normalizeGroupTitleOutlineWidth(group.titleOutlineWidth), 0, 8, (value) => {
        group.titleOutlineWidth = value;
        scheduleChange();
      }, 1, "px"))
    ]));
    form.appendChild(field("形状", groupShapeSelect(group)));
    if (normalizeGroupShape(group.shape) !== "rect") {
      form.appendChild(field("切り欠き幅", rangeWithValue(normalizeGroupNotchWidth(group), 24, Math.max(24, group.w - 24), (value) => {
        group.notchWidth = value;
        scheduleChange();
      }, 4, "px")));
      form.appendChild(field("切り欠き高さ", rangeWithValue(normalizeGroupNotchHeight(group), 24, Math.max(24, group.h - 24), (value) => {
        group.notchHeight = value;
        scheduleChange();
      }, 4, "px")));
    }
    form.appendChild(field("色", swatches(group.color, (value) => {
      group.color = value;
      scheduleChange();
    })));
    form.appendChild(field("透明度", rangeWithValue(Math.round(normalizeGroupFillOpacity(group.fillOpacity) * 100), 0, 100, (value) => {
      group.fillOpacity = clamp(Number(value) || 0, 0, 100) / 100;
      scheduleChange();
    }, 1, "%")));
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
      link.manualRoute = false;
      link.manualRouteAxis = "";
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
      link.manualRoute = false;
      link.manualRouteAxis = "";
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
    }, TEXT_BACKGROUND_COLORS)));
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
    form.appendChild(field(isArrowLegend(legend) ? "矢印項目" : "項目", isArrowLegend(legend) ? arrowLegendItemControls(legend) : legendItemControls(legend)));
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

  function arrowLegendItemControls(legend) {
    legend.items = normalizeArrowLegendItems(legend.items);
    const wrap = el("div", { class: "arrow-legend-item-options" });
    legend.items.forEach((item) => {
      const row = el("div", {
        class: `arrow-legend-item-option${item.visible ? " is-active" : ""}`
      });
      const main = el("div", { class: "arrow-legend-item-main" });
      const check = el("input", {
        type: "checkbox",
        title: "表示する"
      });
      check.checked = Boolean(item.visible);
      check.addEventListener("change", () => {
        item.visible = check.checked;
        commitChange();
        render();
      });
      main.appendChild(check);
      const input = el("input", {
        type: "text",
        value: item.text || "",
        "aria-label": "矢印凡例の説明"
      });
      input.addEventListener("input", () => {
        item.text = input.value;
        scheduleChange();
      });
      input.addEventListener("change", () => commitChange());
      main.appendChild(input);
      row.appendChild(main);

      const controls = el("div", { class: "arrow-legend-item-controls" });
      const typeSelect = el("select", { "aria-label": "矢印の種類" });
      ARROW_LEGEND_TYPES.forEach(([value, label]) => {
        const option = el("option", { value }, label);
        option.selected = item.type === value;
        typeSelect.appendChild(option);
      });
      typeSelect.addEventListener("change", () => {
        item.type = typeSelect.value;
        commitChange();
        render();
      });
      controls.appendChild(typeSelect);
      const remove = el("button", {
        type: "button",
        class: "danger",
        title: "この項目を削除"
      }, "削除");
      remove.addEventListener("click", () => {
        legend.items = legend.items.filter((candidate) => candidate.id !== item.id);
        commitChange();
        render();
      });
      controls.appendChild(remove);
      row.appendChild(controls);
      row.appendChild(field("色", swatches(item.color, (value) => {
        item.color = value;
      }, ["#e53935", "#1e88e5", "#43a047", "#f9a825", "#8e24aa", "#202329", "#ffffff"])));
      row.appendChild(field("太さ", rangeWithValue(item.width, 1, 8, (value) => {
        item.width = value;
        scheduleChange();
      }, 1, "px")));
      wrap.appendChild(row);
    });
    const add = el("button", { type: "button", class: "arrow-legend-add" }, "＋ 矢印項目を追加");
    add.addEventListener("click", () => {
      legend.items.push(createArrowLegendItem());
      commitChange();
      render();
    });
    wrap.appendChild(add);
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
    const searchInput = el("input", {
      type: "search",
      class: "endpoint-search",
      placeholder: "名前・肩書きで検索",
      "aria-label": "接続先を検索"
    });
    wrap.appendChild(searchInput);
    const searchStatus = el("div", {
      class: "endpoint-search-status",
      role: "status",
      "aria-live": "polite"
    }, "名前または肩書きを入力すると候補を絞り込みます");
    wrap.appendChild(searchStatus);
    const connectedWrap = el("div", { class: "endpoint-connected-list" });
    const connectedRows = [];
    let connectedEmpty = null;
    if (connected.length) {
      connected.forEach((candidate) => {
        const row = endpointOptionRow(link, side, candidate, true, current, opposite);
        connectedRows.push(row);
        connectedWrap.appendChild(row);
      });
      connectedEmpty = el("div", { class: "endpoint-empty endpoint-filter-empty", hidden: true }, "接続中の項目に一致するものはありません");
      connectedWrap.appendChild(connectedEmpty);
    } else {
      connectedWrap.appendChild(el("div", { class: "endpoint-empty" }, "接続中の項目はありません"));
    }
    wrap.appendChild(connectedWrap);
    let details = null;
    let candidateSummary = null;
    let candidateRows = [];
    let filterEmpty = null;
    if (unconnected.length) {
      details = el("details", { class: "endpoint-candidates" });
      candidateSummary = el("summary", {}, `候補を表示（${unconnected.length}件）`);
      details.appendChild(candidateSummary);
      const candidateWrap = el("div", { class: "endpoint-candidate-list" });
      unconnected.forEach((candidate) => {
        const row = endpointOptionRow(link, side, candidate, false, current, opposite);
        candidateRows.push(row);
        candidateWrap.appendChild(row);
      });
      filterEmpty = el("div", { class: "endpoint-empty endpoint-filter-empty", hidden: true }, "該当する候補はありません");
      candidateWrap.appendChild(filterEmpty);
      details.appendChild(candidateWrap);
      wrap.appendChild(details);
    }
    const applySearch = () => {
      const query = normalizeEndpointSearchQuery(searchInput.value);
      let connectedVisibleCount = 0;
      let candidateVisibleCount = 0;
      connectedRows.forEach((row) => {
        const matched = !query || row.dataset.searchText.includes(query);
        row.hidden = !matched;
        if (matched) connectedVisibleCount += 1;
      });
      candidateRows.forEach((row) => {
        const matched = !query || row.dataset.searchText.includes(query);
        row.hidden = !matched;
        if (matched) candidateVisibleCount += 1;
      });
      if (connectedEmpty) {
        connectedEmpty.hidden = !query || connectedVisibleCount > 0;
      }
      if (filterEmpty) {
        filterEmpty.hidden = !query || candidateVisibleCount > 0;
      }
      if (candidateSummary) {
        candidateSummary.textContent = query
          ? `検索結果：${candidateVisibleCount} / ${unconnected.length}件`
          : `候補を表示（${unconnected.length}件）`;
      }
      if (query) {
        details.open = true;
        const enteredName = searchInput.value.trim();
        searchStatus.textContent = `「${enteredName}」の検索結果：接続中 ${connectedVisibleCount}件、候補 ${candidateVisibleCount}件`;
      } else {
        searchStatus.textContent = "名前または肩書きを入力すると候補を絞り込みます";
      }
    };
    searchInput.addEventListener("input", applySearch);
    searchInput.addEventListener("search", applySearch);
    if (!unconnected.length) {
      searchInput.disabled = true;
      searchInput.placeholder = "候補はありません";
      searchStatus.textContent = "追加できる候補はありません";
    }
    return wrap;
  }

  function endpointOptionRow(link, side, candidate, checked, current, opposite) {
    const lockedOnlyChoice = checked && current.length <= 1;
    const lockedOppositeOnlyChoice = !checked && opposite.includes(candidate.id) && opposite.length <= 1;
    const row = el("div", {
      class: `endpoint-option${!checked && lockedOppositeOnlyChoice ? " is-disabled" : ""}`
    });
    row.dataset.searchText = endpointSearchText(candidate);
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

  function endpointSearchText(candidate) {
    const endpoint = getConnectionEndpoint(candidate.id);
    const item = endpoint?.item || {};
    return normalizeEndpointSearchQuery([
      candidate.label,
      endpoint?.label,
      endpoint?.type,
      item.name,
      item.role,
      item.title
    ].filter(Boolean).join(" "));
  }

  function normalizeEndpointSearchQuery(value) {
    return String(value || "").trim().toLocaleLowerCase();
  }

  function endpointAnchorControls(link, side, endpointId) {
    const wrap = el("div", { class: "endpoint-anchor-controls" });
    wrap.appendChild(anchorSelect(link, side, endpointId));
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

  function field(labelText, control) {
    const wrapper = el("div", { class: "field" });
    wrapper.appendChild(el("span", {}, labelText));
    wrapper.appendChild(control);
    return wrapper;
  }

  function collapsedFieldSection(summaryText, controls, stateKey = summaryText) {
    const collapseKey = inspectorCollapseKey(stateKey);
    const details = el("details", { class: "field-collapse" });
    details.open = inspectorCollapseState.get(collapseKey) === true;
    details.addEventListener("toggle", () => {
      inspectorCollapseState.set(collapseKey, details.open);
    });
    details.appendChild(el("summary", {}, summaryText));
    const body = el("div", { class: "field-collapse-body" });
    controls.forEach((control) => body.appendChild(control));
    details.appendChild(body);
    return details;
  }

  function inspectorCollapseKey(stateKey) {
    const selectionKey = selected ? `${selected.type}:${selected.id}` : "none";
    return `${selectionKey}:${stateKey}`;
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

  function rangeWithNumberInput(value, min, max, onInput, step = 1, options = {}) {
    const initial = clamp(Number(value) || min, min, max);
    const wrap = el("div", { class: "range-with-value" });
    const slider = el("input", { type: "range", min, max, value: initial, step });
    const number = el("input", {
      type: "number",
      min,
      max,
      step,
      value: options.mixed ? "" : initial,
      placeholder: options.mixed ? "混在" : "",
      inputmode: "numeric"
    });
    slider.addEventListener("input", () => {
      const next = Number(slider.value);
      number.value = String(next);
      onInput(next);
    });
    slider.addEventListener("change", () => commitChange());
    number.addEventListener("input", () => {
      if (number.value === "") return;
      const next = Number(number.value);
      if (!Number.isFinite(next) || next < min || next > max) return;
      slider.value = String(next);
      onInput(next);
    });
    number.addEventListener("change", () => {
      const next = clamp(Number(number.value) || initial, min, max);
      number.value = String(next);
      slider.value = String(next);
      onInput(next);
      commitChange();
    });
    number.addEventListener("keydown", (event) => {
      if (event.key === "Enter") number.blur();
    });
    wrap.appendChild(slider);
    wrap.appendChild(number);
    return wrap;
  }

  function checkboxControl(checked, onChange, labelText = "") {
    const label = el("label", { class: "check-control" });
    const input = el("input", { type: "checkbox" });
    const text = el("span", {}, labelText || (checked ? "オン" : "オフ"));
    input.checked = checked;
    input.addEventListener("change", () => {
      onChange(input.checked);
      if (!labelText) text.textContent = input.checked ? "オン" : "オフ";
      commitChange();
      render();
    });
    label.appendChild(input);
    label.appendChild(text);
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

  function groupShapeSelect(group) {
    const select = el("select");
    GROUP_SHAPES.forEach(([value, label]) => {
      const option = el("option", { value }, label);
      option.selected = normalizeGroupShape(group.shape) === value;
      select.appendChild(option);
    });
    select.addEventListener("change", () => {
      group.shape = normalizeGroupShape(select.value);
      if (group.shape !== "rect") {
        group.notchWidth = normalizeGroupNotchWidth(group);
        group.notchHeight = normalizeGroupNotchHeight(group);
      }
      scheduleChange();
      render();
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
    if (isViewMode()) {
      event.target.value = "";
      pendingImageInsertPoint = null;
      return;
    }
    const file = event.target.files?.[0];
    if (!file) {
      pendingImageInsertPoint = null;
      return;
    }
    const insertPoint = pendingImageInsertPoint ? { ...pendingImageInsertPoint } : screenCenterWorld();
    pendingImageInsertPoint = null;
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
        const size = insertedImageSize(naturalWidth, naturalHeight);
        const item = {
          id: uid("image"),
          name: file.name || "画像",
          src: storeImageAsset(dataUrl, naturalWidth, naturalHeight),
          x: insertPoint.x - size.w / 2,
          y: insertPoint.y - size.h / 2,
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
    if (isViewMode()) return;
    if ((hasDiagramContent() || currentProjectId) && !window.confirm("現在の作業内容を閉じて、新規作成しますか？")) return;
    closeCropEditor();
    closeProjectDialog();
    resetWorkspaceGesture();
    state = createBlankState();
    selected = null;
    clearMultiSelection();
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
    row.appendChild(field("幅", rangeWithNumberInput(item.w, minWidth, maxWidth, (value) => {
      item.w = value;
      scheduleChange();
    })));
    row.appendChild(field("高さ", rangeWithNumberInput(item.h, minHeight, maxHeight, (value) => {
      item.h = value;
      scheduleChange();
    })));
    return row;
  }

  function multiNodeSizeControls(nodes) {
    const row = el("div", { class: "field-row" });
    row.appendChild(field("幅", multiNodeDimensionControl(nodes, "w", 82, 220, NODE_DEFAULT_WIDTH)));
    row.appendChild(field("高さ", multiNodeDimensionControl(nodes, "h", 110, 260, NODE_DEFAULT_HEIGHT)));
    return row;
  }

  function multiNodeDimensionControl(nodes, key, min, max, fallback) {
    const values = nodes.map((node) => clamp(Math.round(Number(node[key]) || fallback), min, max));
    const shared = sharedValue(values);
    const initial = shared === ""
      ? Math.round(values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length))
      : shared;
    return rangeWithNumberInput(initial, min, max, (next) => {
      nodes.forEach((node) => {
        node[key] = next;
      });
      scheduleChange();
    }, 1, { mixed: shared === "" });
  }

  function nodeSizePresetControls(node) {
    const wrap = el("div", { class: "node-size-presets" });
    NODE_SIZE_PRESETS.forEach((preset) => {
      const active = Math.round(Number(node.w) || 0) === preset.w && Math.round(Number(node.h) || 0) === preset.h;
      const button = el("button", {
        type: "button",
        class: active ? "is-active" : "",
        "aria-pressed": active ? "true" : "false"
      });
      button.appendChild(el("span", { class: "node-size-label" }, preset.label));
      button.appendChild(el("span", { class: "node-size-value" }, `${preset.w}×${preset.h}px`));
      button.addEventListener("click", () => {
        node.w = preset.w;
        node.h = preset.h;
        commitChange();
        render();
      });
      wrap.appendChild(button);
    });
    return wrap;
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
    if (event.button === 2) return;
    let target = findDiagramTarget(event.target);
    finishInlineTextEdit(true);
    svg.focus();
    closeMobileToolPanel();
    const point = clientToWorld(event);
    const screen = clientToScreen(event);
    target = preferInlineTextTargetForRepeatedTap(target, event, screen);
    event.preventDefault();
    workspacePointers.set(event.pointerId, screen);
    svg.setPointerCapture(event.pointerId);

    if (workspacePointers.size >= 2) {
      startWorkspacePinch();
      return;
    }

    if (event.button === 1) {
      drag = {
        type: "pan",
        pointerId: event.pointerId,
        start: screen,
        original: { x: state.viewport.x, y: state.viewport.y },
        moved: false
      };
      return;
    }

    if (isViewMode()) {
      const previousSelection = selected ? { ...selected } : null;
      const viewSelection = selectionFromDiagramTarget(target, point, previousSelection);
      selected = viewSelection;
      inspectorOpen = Boolean(viewSelection);
      pendingConnection = null;
      drag = {
        type: "pan",
        pointerId: event.pointerId,
        start: screen,
        original: { x: state.viewport.x, y: state.viewport.y },
        moved: false
      };
      renderViewSelection();
      return;
    }

    if (target?.type === "connection-port") {
      if (event.button !== 0) return;
      const endpoint = getConnectionEndpoint(target.id);
      if (!endpoint || !target.anchor) return;
      const inlineTapTarget = inlineTextTargetAtPoint(event.clientX, event.clientY, target.id);
      const ratio = anchorRatioFromValue(target.anchor);
      const anchorPoint = {
        x: endpoint.item.x + endpoint.item.w * ratio.x,
        y: endpoint.item.y + endpoint.item.h * ratio.y
      };
      clearMultiSelection();
      startConnectionGesture(event, endpoint.item, endpoint.type, anchorPoint, {
        direct: true,
        fromAnchor: target.anchor
      });
      if (drag?.type === "connect") drag.inlineTapTarget = inlineTapTarget;
      return;
    }

    if (target?.type === "group-notch") {
      const group = getGroup(target.id);
      if (!group || normalizeGroupShape(group.shape) === "rect") return;
      clearMultiSelection();
      selected = { type: "group", id: group.id };
      mode = "select";
      pendingConnection = null;
      drag = {
        type: "group-notch",
        id: group.id,
        pointerId: event.pointerId,
        start: point,
        startScreen: screen,
        original: {
          notchWidth: normalizeGroupNotchWidth(group),
          notchHeight: normalizeGroupNotchHeight(group)
        },
        moved: false
      };
      renderEditSelection({ deferDiagram: true });
      return;
    }

    if (target?.type === "group-resize") {
      const group = getGroup(target.id);
      if (!group) return;
      if (mode === "connect") {
        startConnectionGesture(event, group, "group", point);
        return;
      }
      clearMultiSelection();
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
      renderEditSelection({ deferDiagram: true });
      return;
    }

    if (target?.type === "node" || target?.type === "node-name" || target?.type === "node-role") {
      const node = getNode(target.id);
      if (!node) return;
      if (mode === "connect") {
        startConnectionGesture(event, node, "node", point);
        return;
      }
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        toggleMultiSelectedItem("node", node.id);
        return;
      }
      if (isMultiSelectedItem("node", node.id) && multiSelectedCount() > 1) {
        startMultiSelectionDrag(event, "node", node.id, point, screen);
        return;
      }
      clearMultiSelection();
      selected = { type: "node", id: node.id };
      inspectorOpen = false;
      drag = {
        type: "node",
        id: node.id,
        pointerId: event.pointerId,
        start: point,
        startScreen: screen,
        original: { x: node.x, y: node.y },
        inlineField: target.type === "node-name" ? "name" : target.type === "node-role" ? "role" : "",
        moved: false
      };
      renderEditSelection({ deferDiagram: true });
      return;
    }

    if (target?.type === "group" || target?.type === "group-title") {
      const group = getGroup(target.id);
      if (!group) return;
      if (mode === "connect") {
        startConnectionGesture(event, group, "group", point);
        return;
      }
      const previousSelection = selected ? { ...selected } : null;
      const directTitleSelection = target.type === "group-title";
      const selectedGroupUnderPoint = !directTitleSelection && previousSelection?.type === "group" && previousSelection.id !== group.id
        ? groupAtPoint(previousSelection.id, point)
        : null;
      const interactionGroup = selectedGroupUnderPoint || group;
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        toggleMultiSelectedItem("group", interactionGroup.id);
        return;
      }
      if (isMultiSelectedItem("group", interactionGroup.id) && multiSelectedCount() > 1) {
        startMultiSelectionDrag(event, "group", interactionGroup.id, point, screen);
        return;
      }
      clearMultiSelection();
      selected = { type: "group", id: interactionGroup.id };
      inspectorOpen = false;
      drag = {
        type: "group",
        id: interactionGroup.id,
        pointerId: event.pointerId,
        start: point,
        startScreen: screen,
        original: {
          x: interactionGroup.x,
          y: interactionGroup.y,
          containedItems: groupMoveContentsEnabled() ? collectGroupDragItems(interactionGroup) : null
        },
        previousSelection: directTitleSelection || selectedGroupUnderPoint ? null : previousSelection,
        inlineField: directTitleSelection ? "title" : "",
        moved: false
      };
      renderEditSelection({ deferDiagram: true });
      return;
    }

    if (target?.type === "text") {
      const textItem = getTextItem(target.id);
      if (!textItem) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        toggleMultiSelectedItem("text", textItem.id);
        return;
      }
      if (isMultiSelectedItem("text", textItem.id) && multiSelectedCount() > 1) {
        startMultiSelectionDrag(event, "text", textItem.id, point, screen);
        return;
      }
      clearMultiSelection();
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
      renderEditSelection({ deferDiagram: true });
      return;
    }

    if (target?.type === "shape") {
      const shape = getShape(target.id);
      if (!shape) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        toggleMultiSelectedItem("shape", shape.id);
        return;
      }
      if (isMultiSelectedItem("shape", shape.id) && multiSelectedCount() > 1) {
        startMultiSelectionDrag(event, "shape", shape.id, point, screen);
        return;
      }
      clearMultiSelection();
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
      renderEditSelection({ deferDiagram: true });
      return;
    }

    if (target?.type === "image") {
      const imageItem = getImageItem(target.id);
      if (!imageItem) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        toggleMultiSelectedItem("image", imageItem.id);
        return;
      }
      if (isMultiSelectedItem("image", imageItem.id) && multiSelectedCount() > 1) {
        startMultiSelectionDrag(event, "image", imageItem.id, point, screen);
        return;
      }
      clearMultiSelection();
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
      renderEditSelection({ deferDiagram: true });
      return;
    }

    if (target?.type === "legend") {
      const legend = getLegend(target.id);
      if (!legend) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey) {
        toggleMultiSelectedItem("legend", legend.id);
        return;
      }
      if (isMultiSelectedItem("legend", legend.id) && multiSelectedCount() > 1) {
        startMultiSelectionDrag(event, "legend", legend.id, point, screen);
        return;
      }
      clearMultiSelection();
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
      renderEditSelection({ deferDiagram: true });
      return;
    }

    if (target?.type === "link-anchor") {
      clearMultiSelection();
      if (startLinkAnchorDrag(event, target, point, screen)) return;
    }

    if (target?.type === "link-terminal") {
      clearMultiSelection();
      if (startLinkTerminalDrag(event, target, point, screen)) return;
    }

    if (target?.type === "link-route") {
      clearMultiSelection();
      if (startLinkRouteDrag(event, target, point, screen)) return;
    }

    if (target?.type === "link-label") {
      const link = getLink(target.id);
      if (!link) return;
      clearMultiSelection();
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
        inlineField: "label",
        moved: false
      };
      renderEditSelection({ deferDiagram: true });
      return;
    }

    if (target?.type === "link") {
      clearMultiSelection();
      if (startLinkRouteDrag(event, target.id, point, screen)) return;
    }

    if (shouldStartMarqueeSelection(event, target)) {
      startMarqueeSelection(event, point, screen);
      return;
    }

    selected = null;
    clearMultiSelection();
    inspectorOpen = false;
    drag = {
      type: "pan",
      pointerId: event.pointerId,
      start: screen,
      original: { x: state.viewport.x, y: state.viewport.y },
      moved: false
    };
    renderEditSelection();
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
    if (!drag) {
      if (event.pointerType !== "touch") updateConnectionPortHover(findDiagramTarget(event.target));
      return;
    }
    if (drag.pointerId !== event.pointerId) return;
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
      updateConnectionPortHover(findDiagramTarget(document.elementFromPoint(event.clientX, event.clientY)));
      requestInteractionDiagramRender();
      return;
    }

    if (drag.type === "marquee") {
      const point = clientToWorld(event);
      const screen = clientToScreen(event);
      drag.current = point;
      if (Math.hypot(screen.x - drag.startScreen.x, screen.y - drag.startScreen.y) > MARQUEE_SELECT_THRESHOLD) {
        drag.moved = true;
        updateMarqueeSelection(drag);
      }
      requestInteractionDiagramRender();
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
    if (drag.type === "multi") {
      applyMultiSelectionDrag(drag.items, dx, dy);
    }
    if (drag.type === "group") {
      const group = getGroup(drag.id);
      if (!group) return;
      applyGroupDrag(group, drag, dx, dy);
    }
    if (drag.type === "group-resize") {
      const group = getGroup(drag.id);
      if (!group) return;
      group.w = clamp(drag.original.w + dx, GROUP_MIN_WIDTH, GROUP_MAX_WIDTH);
      group.h = clamp(drag.original.h + dy, GROUP_MIN_HEIGHT, GROUP_MAX_HEIGHT);
    }
    if (drag.type === "group-notch") {
      const group = getGroup(drag.id);
      if (!group) return;
      updateGroupNotchFromDrag(group, drag, point);
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
      if (!drag.moved) return;
      if (drag.activateManualRoute) {
        link.manualRoute = true;
        link.manualRouteAxis = drag.manualRouteAxis;
      }
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
      if (!drag.moved) return;
      if ((link.route || "orthogonal") === "orthogonal") {
        if (link.manualRoute !== true) {
          link.routeOffsetX = drag.manualRouteOffsets.routeOffsetX;
          link.routeOffsetY = drag.manualRouteOffsets.routeOffsetY;
        }
        link.manualRoute = true;
        if (!normalizedManualRouteAxis(link)) link.manualRouteAxis = linkRouteAxisForDrag(link);
      }
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
    requestInteractionDiagramRender();
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
      drag = null;
      if (finishConnectionPortInlineTap(event, currentDrag)) return;
      if (!finishConnectionGesture(event, currentDrag)) render();
      return;
    }
    if (currentDrag.type === "marquee") {
      if (!currentDrag.moved) {
        if (!currentDrag.additive) clearMultiSelection();
        selected = null;
      } else {
        updateMarqueeSelection(currentDrag);
      }
      drag = null;
      render();
      return;
    }
    if ((currentDrag.type === "node" || currentDrag.type === "multi" || currentDrag.type === "group" || currentDrag.type === "group-resize" || currentDrag.type === "group-notch" || currentDrag.type === "text" || currentDrag.type === "shape" || currentDrag.type === "image" || currentDrag.type === "legend" || currentDrag.type === "link-label" || currentDrag.type === "link-route" || currentDrag.type === "link-terminal" || currentDrag.type === "link-anchor") && !currentDrag.moved) {
      const tapType = currentDrag.type === "multi"
        ? currentDrag.itemType
        : currentDrag.type === "group-resize" || currentDrag.type === "group-notch"
          ? "group"
          : currentDrag.type === "link-label" || currentDrag.type === "link-route" || currentDrag.type === "link-terminal" || currentDrag.type === "link-anchor"
            ? "link"
            : currentDrag.type;
      handleTapSelection(tapType, currentDrag.id, event, currentDrag.previousSelection, currentDrag.inlineField || "");
      drag = null;
      renderEditSelection({
        openInspector: inspectorOpen,
        deferDiagram: !inspectorOpen
      });
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
        if (finishConnectionPortInlineTap(event, currentDrag)) return;
        if (!finishConnectionGesture(event, currentDrag)) render();
        return;
      }
      if (currentDrag.type === "marquee") {
        if (!currentDrag.moved) {
          if (!currentDrag.additive) clearMultiSelection();
          selected = null;
        } else {
          updateMarqueeSelection(currentDrag);
        }
        render();
        return;
      }
      if (currentDrag.type !== "pan" && currentDrag.moved) {
        commitChange();
      } else {
        renderEditSelection({
          openInspector: inspectorOpen,
          deferDiagram: !inspectorOpen
        });
      }
    }
  }

  function resetWorkspaceGesture() {
    workspacePointers.clear();
    workspacePinch = null;
    drag = null;
    hoveredConnectionTarget = null;
    refreshConnectionPortLayer();
  }

  function onWheel(event) {
    event.preventDefault();
    closeCanvasContextMenu();
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
    if (drag?.type === "multi") {
      applyMultiSelectionDrag(drag.items, 0, 0);
    }
    if (drag?.type === "group") {
      restoreGroupDrag(drag);
    }
    if (drag?.type === "group-resize") {
      const group = getGroup(drag.id);
      if (group) {
        group.w = drag.original.w;
        group.h = drag.original.h;
      }
    }
    if (drag?.type === "group-notch") {
      const group = getGroup(drag.id);
      if (group) {
        group.notchWidth = drag.original.notchWidth;
        group.notchHeight = drag.original.notchHeight;
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
        link.manualRoute = drag.original.manualRoute;
        link.manualRouteAxis = drag.original.manualRouteAxis;
      }
    }
    if (drag?.type === "link-terminal") {
      const link = getLink(drag.id);
      if (link) {
        setLinkTerminalOffset(link, drag.side, drag.endpointId, {
          x: drag.original.terminalOffsetX,
          y: drag.original.terminalOffsetY
        });
        link.routeOffsetX = drag.original.routeOffsetX;
        link.routeOffsetY = drag.original.routeOffsetY;
        link.manualRoute = drag.original.manualRoute;
        link.manualRouteAxis = drag.original.manualRouteAxis;
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

  function handleTapSelection(type, id, event, previousSelection = null, inlineField = "") {
    const screen = clientToScreen(event);
    const now = Date.now();
    const isDoubleTap = lastTap
      && lastTap.type === type
      && lastTap.id === id
      && (lastTap.inlineField || "") === inlineField
      && now - lastTap.time < DOUBLE_TAP_TIMEOUT_MS
      && distance(screen, lastTap.screen) < DOUBLE_TAP_DISTANCE_PX;
    if (isDoubleTap && inlineField && openInlineTextEditor(type, id, inlineField)) {
      inspectorOpen = false;
      lastTap = null;
      return;
    }
    if (type === "group" && !isDoubleTap) {
      const cycledSelection = groupSelectionAtPoint(clientToWorld(event), previousSelection);
      if (cycledSelection) {
        selected = cycledSelection;
        inspectorOpen = false;
        lastTap = { type: cycledSelection.type, id: cycledSelection.id, inlineField, time: now, screen };
        return;
      }
    }
    inspectorOpen = Boolean(isDoubleTap);
    lastTap = isDoubleTap ? null : { type, id, inlineField, time: now, screen };
  }

  function preferInlineTextTargetForRepeatedTap(target, event, screen) {
    if (target?.type !== "connection-port" || !lastTap?.inlineField) return target;
    if (lastTap.id !== target.id
      || Date.now() - lastTap.time >= DOUBLE_TAP_TIMEOUT_MS
      || distance(screen, lastTap.screen) >= DOUBLE_TAP_DISTANCE_PX) {
      return target;
    }

    const inlineTarget = inlineTextTargetAtPoint(event.clientX, event.clientY, target.id);
    if (inlineTarget
      && lastTap.type === inlineTarget.owner
      && lastTap.inlineField === inlineTarget.field) {
      return {
        type: inlineTarget.type,
        id: inlineTarget.id,
        side: "",
        endpointId: "",
        axis: "",
        anchor: ""
      };
    }
    return target;
  }

  function inlineTextTargetAtPoint(clientX, clientY, ownerId = "") {
    for (const element of document.elementsFromPoint(clientX, clientY)) {
      let current = element;
      while (current && current !== svg) {
        const owner = current.getAttribute?.("data-inline-owner") || "";
        const field = current.getAttribute?.("data-inline-field") || "";
        const id = current.getAttribute?.("data-id") || "";
        if (owner && field && (!ownerId || id === ownerId)) {
          const type = owner === "node"
            ? field === "name" ? "node-name" : field === "role" ? "node-role" : ""
            : owner === "group" && field === "title"
              ? "group-title"
              : "";
          if (type) return { type, owner, field, id };
        }
        current = current.parentNode;
      }
    }
    return null;
  }

  function finishConnectionPortInlineTap(event, connectionDrag) {
    const inlineTarget = connectionDrag.inlineTapTarget;
    if (connectionDrag.moved || !inlineTarget) return false;
    pendingConnection = null;
    selected = { type: inlineTarget.owner, id: inlineTarget.id };
    inspectorOpen = false;
    handleTapSelection(inlineTarget.owner, inlineTarget.id, event, null, inlineTarget.field);
    renderEditSelection({
      openInspector: inspectorOpen,
      deferDiagram: !inspectorOpen
    });
    return true;
  }

  function inlineTextEditDescriptor(type, id, field) {
    if (type === "node") {
      const node = getNode(id);
      if (!node) return null;
      if (field === "name") {
        return {
          label: "人名",
          value: String(node.name || ""),
          multiline: false,
          set: (value) => {
            node.name = value;
          }
        };
      }
      if (field === "role") {
        return {
          label: "肩書き",
          value: String(node.role || ""),
          multiline: true,
          set: (value) => {
            node.role = value;
          }
        };
      }
    }
    if (type === "group" && field === "title") {
      const group = getGroup(id);
      if (!group) return null;
      return {
        label: "グループ名",
        value: String(group.title || ""),
        multiline: false,
        set: (value) => {
          group.title = value;
        }
      };
    }
    if (type === "link" && field === "label") {
      const link = getLink(id);
      if (!link) return null;
      return {
        label: "関係名",
        value: String(link.label || ""),
        multiline: true,
        set: (value) => {
          link.label = value;
        }
      };
    }
    return null;
  }

  function inlineTextEditTarget(type, id, field) {
    if (!diagramRoot?.isConnected) return null;
    return [...diagramRoot.querySelectorAll("[data-inline-owner][data-inline-field]")]
      .find((element) => element.getAttribute("data-inline-owner") === type
        && element.getAttribute("data-id") === id
        && element.getAttribute("data-inline-field") === field) || null;
  }

  function openInlineTextEditor(type, id, field) {
    if (isViewMode()) return false;
    finishInlineTextEdit(true);
    const descriptor = inlineTextEditDescriptor(type, id, field);
    const targetElement = inlineTextEditTarget(type, id, field);
    if (!descriptor || !targetElement) return false;

    const input = document.createElement(descriptor.multiline ? "textarea" : "input");
    if (!descriptor.multiline) input.type = "text";
    input.className = "inline-diagram-editor";
    input.value = descriptor.value;
    input.setAttribute("aria-label", `${descriptor.label}を直接編集`);
    input.setAttribute("autocomplete", "off");
    input.setAttribute("autocapitalize", "sentences");
    input.setAttribute("data-multiline", descriptor.multiline ? "true" : "false");
    input.enterKeyHint = descriptor.multiline ? "enter" : "done";
    input.spellcheck = true;
    if (descriptor.multiline) input.rows = 3;

    inlineEditorSession = {
      type,
      id,
      field,
      originalValue: descriptor.value,
      multiline: descriptor.multiline,
      input,
      targetElement
    };
    document.body.appendChild(input);
    document.body.classList.add("is-inline-editing");
    positionInlineTextEditor();

    input.addEventListener("pointerdown", (event) => event.stopPropagation());
    input.addEventListener("keydown", (event) => {
      event.stopPropagation();
      if (event.isComposing) return;
      if (event.key === "Escape") {
        event.preventDefault();
        finishInlineTextEdit(false);
        svg.focus({ preventScroll: true });
        return;
      }
      if (event.key === "Enter" && (!descriptor.multiline || event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        input.blur();
      }
    });
    input.addEventListener("blur", () => finishInlineTextEdit(true), { once: true });

    try {
      input.focus({ preventScroll: true });
    } catch {
      input.focus();
    }
    input.select();
    return true;
  }

  function positionInlineTextEditor() {
    const session = inlineEditorSession;
    if (!session?.input?.isConnected) return;
    if (!session.targetElement?.isConnected) {
      session.targetElement = inlineTextEditTarget(session.type, session.id, session.field);
    }
    if (!session.targetElement) return;

    const targetRect = session.targetElement.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewportLeft = viewport?.offsetLeft || 0;
    const viewportTop = viewport?.offsetTop || 0;
    const viewportWidth = viewport?.width || window.innerWidth;
    const viewportHeight = viewport?.height || window.innerHeight;
    const margin = 8;
    const maxWidth = Math.max(140, viewportWidth - margin * 2);
    const preferredWidth = Math.max(targetRect.width + 16, session.multiline ? 220 : 180);
    const width = clamp(preferredWidth, 140, maxWidth);
    const height = session.multiline
      ? clamp(Math.max(targetRect.height + 32, 82), 82, 160)
      : 44;
    const preferredLeft = targetRect.left + (targetRect.width - width) / 2;
    const preferredTop = targetRect.top + (targetRect.height - height) / 2;
    const left = clamp(preferredLeft, viewportLeft + margin, viewportLeft + viewportWidth - width - margin);
    const top = clamp(preferredTop, viewportTop + margin, viewportTop + viewportHeight - height - margin);

    Object.assign(session.input.style, {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`
    });
  }

  function finishInlineTextEdit(commit, options = {}) {
    const session = inlineEditorSession;
    if (!session) return false;
    inlineEditorSession = null;
    const value = session.input.value.replace(/\r\n/g, "\n");
    session.input.remove();
    document.body.classList.remove("is-inline-editing");
    if (!commit || value === session.originalValue) return false;

    const descriptor = inlineTextEditDescriptor(session.type, session.id, session.field);
    if (!descriptor) return false;
    descriptor.set(value);
    commitChange(options.render !== false);
    return true;
  }

  function selectionFromDiagramTarget(target, point = null, previousSelection = null) {
    if (!target?.type || !target.id) return null;
    if (target.type === "group-resize" || target.type === "group-notch") {
      return getGroup(target.id) ? { type: "group", id: target.id } : null;
    }
    if (target.type === "link-label" || target.type === "link-route" || target.type === "link-terminal" || target.type === "link-anchor" || target.type === "link") {
      return getLink(target.id) ? { type: "link", id: target.id } : null;
    }
    if (target.type === "node" || target.type === "node-name" || target.type === "node-role") {
      return getNode(target.id) ? { type: "node", id: target.id } : null;
    }
    if (target.type === "group-title") return getGroup(target.id) ? { type: "group", id: target.id } : null;
    if (target.type === "group") return groupSelectionAtPoint(point, previousSelection) || (getGroup(target.id) ? { type: "group", id: target.id } : null);
    if (target.type === "text") return getTextItem(target.id) ? { type: "text", id: target.id } : null;
    if (target.type === "shape") return getShape(target.id) ? { type: "shape", id: target.id } : null;
    if (target.type === "image") return getImageItem(target.id) ? { type: "image", id: target.id } : null;
    if (target.type === "legend") return getLegend(target.id) ? { type: "legend", id: target.id } : null;
    return null;
  }

  function shouldStartMarqueeSelection(event, target) {
    return !target
      && mode === "select"
      && event.pointerType === "mouse"
      && event.button === 0
      && !event.altKey;
  }

  function startMarqueeSelection(event, point, screen) {
    const additive = Boolean(event.shiftKey || event.ctrlKey || event.metaKey);
    const baseItemKeys = new Set(multiSelectedItemKeys);
    const baseNodeIds = new Set(multiSelectedNodeIds);
    if (!additive) {
      selected = null;
      clearMultiSelection();
    }
    inspectorOpen = false;
    pendingConnection = null;
    drag = {
      type: "marquee",
      pointerId: event.pointerId,
      start: point,
      current: point,
      startScreen: screen,
      additive,
      baseItemKeys,
      baseNodeIds,
      moved: false
    };
    renderEditSelection({ deferDiagram: true });
  }

  function updateMarqueeSelection(marqueeDrag) {
    multiSelectedItemKeys = marqueeDrag.additive ? new Set(marqueeDrag.baseItemKeys) : new Set();
    multiSelectedNodeIds = marqueeDrag.additive ? new Set(marqueeDrag.baseNodeIds) : new Set();
    const hits = selectableItemsInRect(marqueeRect(marqueeDrag.start, marqueeDrag.current || marqueeDrag.start));
    hits.forEach((item) => setMultiSelectedItem(item.type, item.id, true));
    selected = hits.length === 1 ? { type: hits[0].type, id: hits[0].id } : null;
    inspectorOpen = false;
  }

  function marqueeRect(start, end) {
    const x1 = Math.min(start.x, end.x);
    const y1 = Math.min(start.y, end.y);
    const x2 = Math.max(start.x, end.x);
    const y2 = Math.max(start.y, end.y);
    return {
      x: x1,
      y: y1,
      w: x2 - x1,
      h: y2 - y1
    };
  }

  function selectableItemsInRect(rect) {
    const candidates = [
      ...state.nodes.map((node) => ({ type: "node", id: node.id, bounds: node })),
      ...state.groups.map((group) => ({ type: "group", id: group.id, bounds: group })),
      ...state.texts.map((textItem) => ({ type: "text", id: textItem.id, bounds: textItemBounds(textItem) })),
      ...state.shapes.map((shape) => ({ type: "shape", id: shape.id, bounds: shapeBounds(shape) })),
      ...state.images.map((imageItem) => ({ type: "image", id: imageItem.id, bounds: imageBounds(imageItem) })),
      ...state.legends.map((legend) => ({ type: "legend", id: legend.id, bounds: legendBounds(legend) }))
    ];
    return candidates
      .filter((item) => rectsIntersect(rect, item.bounds))
      .map(({ type, id }) => ({ type, id }));
  }

  function rectsIntersect(a, b) {
    if (!a || !b) return false;
    return a.x <= b.x + b.w
      && a.x + a.w >= b.x
      && a.y <= b.y + b.h
      && a.y + a.h >= b.y;
  }

  function startMultiSelectionDrag(event, type, id, point, screen) {
    const items = collectMultiSelectionDragItems();
    if (multiDragItemCount(items) < 2) return false;
    selected = { type, id };
    mode = "select";
    pendingConnection = null;
    inspectorOpen = false;
    drag = {
      type: "multi",
      id,
      itemType: type,
      pointerId: event.pointerId,
      start: point,
      startScreen: screen,
      items,
      moved: false
    };
    renderEditSelection({ deferDiagram: true });
    return true;
  }

  function collectMultiSelectionDragItems() {
    const keys = new Set(multiSelectedItems().map((item) => multiSelectionKey(item.type, item.id)));
    return {
      nodes: state.nodes.filter((node) => keys.has(multiSelectionKey("node", node.id))).map(positionSnapshot),
      groups: state.groups.filter((group) => keys.has(multiSelectionKey("group", group.id))).map(positionSnapshot),
      texts: state.texts.filter((textItem) => keys.has(multiSelectionKey("text", textItem.id))).map(positionSnapshot),
      shapes: state.shapes.filter((shape) => keys.has(multiSelectionKey("shape", shape.id))).map(positionSnapshot),
      images: state.images.filter((imageItem) => keys.has(multiSelectionKey("image", imageItem.id))).map(positionSnapshot),
      legends: state.legends.filter((legend) => keys.has(multiSelectionKey("legend", legend.id))).map(positionSnapshot)
    };
  }

  function multiDragItemCount(items) {
    return (items.nodes?.length || 0)
      + (items.groups?.length || 0)
      + (items.texts?.length || 0)
      + (items.shapes?.length || 0)
      + (items.images?.length || 0)
      + (items.legends?.length || 0);
  }

  function applyMultiSelectionDrag(items, dx, dy) {
    applyPositionSnapshots(items.nodes, getNode, dx, dy);
    applyPositionSnapshots(items.groups, getGroup, dx, dy);
    applyPositionSnapshots(items.texts, getTextItem, dx, dy);
    applyPositionSnapshots(items.shapes, getShape, dx, dy);
    applyPositionSnapshots(items.images, getImageItem, dx, dy);
    applyPositionSnapshots(items.legends, getLegend, dx, dy);
  }

  function startLinkRouteDrag(event, targetOrId, point, screen) {
    const id = typeof targetOrId === "string" ? targetOrId : targetOrId?.id;
    const link = getLink(id);
    if (!link) return false;
    const axis = typeof targetOrId === "string" ? "" : targetOrId?.axis;
    const routeMode = axis === "horizontal" ? "y" : axis === "vertical" ? "x" : linkRouteDragMode(link);
    const activateManualRoute = (link.route || "orthogonal") === "orthogonal";
    const currentOffsets = {
      routeOffsetX: normalizedLinkRouteOffsetX(link),
      routeOffsetY: normalizedLinkRouteOffsetY(link)
    };
    const calibratedOffsets = activateManualRoute && link.manualRoute !== true
      ? calibratedLinkRouteOffsets(link, routeMode, {
        x: finiteRouteCoordinate(targetOrId?.routeX, point.x),
        y: finiteRouteCoordinate(targetOrId?.routeY, point.y)
      }, currentOffsets)
      : currentOffsets;
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
      activateManualRoute,
      manualRouteAxis: activateManualRoute ? linkRouteAxisForDrag(link) : "",
      original: {
        routeOffsetX: calibratedOffsets.routeOffsetX,
        routeOffsetY: calibratedOffsets.routeOffsetY,
        manualRoute: link.manualRoute === true,
        manualRouteAxis: normalizedManualRouteAxis(link)
      },
      moved: false
    };
    renderEditSelection({ deferDiagram: true });
    return true;
  }

  function finiteRouteCoordinate(value, fallback) {
    if (value === "" || value === null || value === undefined) return fallback;
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function calibratedLinkRouteOffsets(link, routeMode, routePoint, currentOffsets) {
    const baseline = linkRouteOffsetBaseline(link);
    const next = { ...currentOffsets };
    if (routeMode === "free" || routeMode === "x") {
      next.routeOffsetX = normalizeFreeOffset(routePoint.x - baseline.x);
    }
    if (routeMode === "free" || routeMode === "y") {
      next.routeOffsetY = normalizeFreeOffset(routePoint.y - baseline.y);
    }
    return next;
  }

  function currentLinkRouteCalibrationOffsets(link) {
    const currentOffsets = {
      routeOffsetX: normalizedLinkRouteOffsetX(link),
      routeOffsetY: normalizedLinkRouteOffsetY(link)
    };
    const polyline = representativeLinkLabelPolyline(link);
    if (polyline.length < 2) return currentOffsets;
    return calibratedLinkRouteOffsets(
      link,
      "free",
      pointOnPolyline(polyline, 0.5),
      currentOffsets
    );
  }

  function linkRouteOffsetBaseline(link) {
    const fromEndpoints = getLinkEndpointEntries(link, "from");
    const toEndpoints = getLinkEndpointEntries(link, "to");
    if (!fromEndpoints.length || !toEndpoints.length) return { x: 0, y: 0 };
    if (fromEndpoints.length === 1 && toEndpoints.length === 1) {
      const fromEndpoint = fromEndpoints[0];
      const toEndpoint = toEndpoints[0];
      const start = attachmentPoint(fromEndpoint.item, fromEndpoint.id, link, "from", toEndpoint.center);
      const end = attachmentPoint(toEndpoint.item, toEndpoint.id, link, "to", fromEndpoint.center);
      const startTerminal = linkTerminalStubPoint(link, "from", fromEndpoint.id, fromEndpoint.item, start);
      const endTerminal = linkTerminalStubPoint(link, "to", toEndpoint.id, toEndpoint.item, end);
      return midpoint(startTerminal?.point || start, endTerminal?.point || end);
    }
    const fromCenter = averagePoint(fromEndpoints.map((endpoint) => endpoint.center));
    const toCenter = averagePoint(toEndpoints.map((endpoint) => endpoint.center));
    return midpoint(fromCenter, toCenter);
  }

  function linkRouteAxisForDrag(link) {
    const fromEndpoints = getLinkEndpointEntries(link, "from");
    const toEndpoints = getLinkEndpointEntries(link, "to");
    if (!fromEndpoints.length || !toEndpoints.length) return "";
    if (fromEndpoints.length === 1 && toEndpoints.length === 1) {
      const fromEndpoint = fromEndpoints[0];
      const toEndpoint = toEndpoints[0];
      const start = attachmentPoint(fromEndpoint.item, fromEndpoint.id, link, "from", toEndpoint.center);
      const end = attachmentPoint(toEndpoint.item, toEndpoint.id, link, "to", fromEndpoint.center);
      const startTerminal = linkTerminalStubPoint(link, "from", fromEndpoint.id, fromEndpoint.item, start);
      const endTerminal = linkTerminalStubPoint(link, "to", toEndpoint.id, toEndpoint.item, end);
      return startTerminal?.axis
        || endTerminal?.axis
        || (resolveLinkFlowAxis(link, startTerminal?.point || start, endTerminal?.point || end, "single") ? "horizontal" : "vertical");
    }
    const fromCenter = averagePoint(fromEndpoints.map((endpoint) => endpoint.center));
    const toCenter = averagePoint(toEndpoints.map((endpoint) => endpoint.center));
    return resolveLinkFlowAxis(link, fromCenter, toCenter, `multi:${fromEndpoints.length}:${toEndpoints.length}`)
      ? "horizontal"
      : "vertical";
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
    renderEditSelection({ deferDiagram: true });
    return true;
  }

  function startLinkTerminalDrag(event, target, point, screen) {
    const link = getLink(target.id);
    const side = target.side === "from" ? "from" : target.side === "to" ? "to" : "";
    const endpointId = target.endpointId || "";
    const axis = target.axis === "vertical" ? "vertical" : target.axis === "horizontal" ? "horizontal" : "";
    if (!link || !side || !endpointId || !axis) return false;
    const offset = getLinkTerminalOffset(link, side, endpointId);
    const manualRouteOffsets = link.manualRoute === true
      ? {
        routeOffsetX: normalizedLinkRouteOffsetX(link),
        routeOffsetY: normalizedLinkRouteOffsetY(link)
      }
      : currentLinkRouteCalibrationOffsets(link);
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
      manualRouteOffsets,
      original: {
        terminalOffsetX: offset.x,
        terminalOffsetY: offset.y,
        routeOffsetX: normalizedLinkRouteOffsetX(link),
        routeOffsetY: normalizedLinkRouteOffsetY(link),
        manualRoute: link.manualRoute === true,
        manualRouteAxis: normalizedManualRouteAxis(link)
      },
      moved: false
    };
    renderEditSelection({ deferDiagram: true });
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

  function startConnectionGesture(event, item, itemType, point, options = {}) {
    const direct = options.direct === true;
    if (!direct && pendingConnection && pendingConnection !== item.id) {
      createConnection(pendingConnection, item.id);
      return;
    }

    drag = {
      type: "connect",
      pointerId: event.pointerId,
      from: item.id,
      start: point,
      current: point,
      startAnchorPoint: direct ? point : null,
      fromAnchor: direct ? String(options.fromAnchor || "") : "",
      direct,
      moved: false,
      hadPending: !direct && pendingConnection === item.id
    };
    pendingConnection = direct ? null : item.id;
    if (direct) mode = "select";
    selected = { type: itemType, id: item.id };
    inspectorOpen = false;
    svg.setPointerCapture(event.pointerId);
    if (direct) renderEditSelection();
    else render();
  }

  function finishConnectionGesture(event, connectionDrag) {
    const target = findDiagramTarget(document.elementFromPoint(event.clientX, event.clientY));
    if (isConnectableTarget(target) && target.id !== connectionDrag.from) {
      const endpoint = getConnectionEndpoint(target.id);
      const targetPoint = clientToWorld(event);
      const ratio = endpoint ? edgeAnchorRatioFromPoint(endpoint.item, targetPoint) : null;
      const toAnchor = target.type === "connection-port" && target.anchor
        ? target.anchor
        : ratio
          ? makeCustomAnchor(ratio.x, ratio.y)
          : "";
      createConnection(connectionDrag.from, target.id, {
        fromAnchor: connectionDrag.fromAnchor,
        toAnchor
      });
      return true;
    }

    if (connectionDrag.direct) {
      pendingConnection = null;
      const endpoint = getConnectionEndpoint(connectionDrag.from);
      selected = endpoint ? { type: endpoint.type, id: connectionDrag.from } : null;
      inspectorOpen = false;
      saveToStorage();
      return false;
    }

    if (!connectionDrag.moved) {
      pendingConnection = connectionDrag.hadPending ? null : connectionDrag.from;
      const endpoint = pendingConnection ? getConnectionEndpoint(pendingConnection) : null;
      selected = endpoint ? { type: endpoint.type, id: pendingConnection } : null;
      inspectorOpen = false;
      saveToStorage();
      return false;
    }

    pendingConnection = connectionDrag.from;
    const endpoint = getConnectionEndpoint(connectionDrag.from);
    selected = endpoint ? { type: endpoint.type, id: connectionDrag.from } : null;
    inspectorOpen = false;
    saveToStorage();
    return false;
  }

  function createConnection(fromId, toId, anchors = {}) {
    if (!getConnectionEndpoint(fromId) || !getConnectionEndpoint(toId) || fromId === toId) return;
    const fromAnchor = isCustomAnchor(anchors.fromAnchor) || ANCHOR_KEYS.has(anchors.fromAnchor) ? anchors.fromAnchor : "";
    const toAnchor = isCustomAnchor(anchors.toAnchor) || ANCHOR_KEYS.has(anchors.toAnchor) ? anchors.toAnchor : "";
    const link = {
      id: uid("link"),
      from: fromId,
      to: toId,
      fromIds: [fromId],
      toIds: [toId],
      fromAnchors: fromAnchor ? { [fromId]: fromAnchor } : {},
      toAnchors: toAnchor ? { [toId]: toAnchor } : {},
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
      manualRoute: false,
      manualRouteAxis: "",
      width: 1.5
    };
    state.links.push(link);
    selected = { type: "link", id: link.id };
    inspectorOpen = true;
    mode = "select";
    pendingConnection = null;
    hoveredConnectionTarget = null;
    commitChange();
    render();
  }

  function duplicateNode(node) {
    if (isViewMode()) return;
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
    if (isViewMode()) return;
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
    if (isViewMode()) return;
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
    if (isViewMode()) return;
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
    if (isViewMode()) return;
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
    if (isViewMode()) return;
    const copy = {
      ...structuredClone(legend),
      id: uid("legend"),
      title: `${legendTitle(legend)} コピー`,
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
    if (isViewMode()) return;
    if (!selected) return;
    if (selected.type === "node") {
      state.nodes = state.nodes.filter((node) => node.id !== selected.id);
      state.links = state.links.filter((link) => !linkReferencesEndpoint(link, selected.id));
      setMultiSelectedItem("node", selected.id, false);
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
    if (isViewMode()) return;
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
    if (isViewMode()) return;
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
    if (isViewMode()) return;
    showProjectDialog("png");
    renderPngDialog();
  }

  function openDetailSettingsDialog() {
    if (isViewMode()) return;
    showProjectDialog("settings");
    renderDetailSettingsDialog();
  }

  function showProjectDialog(mode) {
    projectDialogMode = mode;
    projectDialogTitle.textContent = dialogTitle(mode);
    projectDialog.setAttribute("aria-hidden", "false");
    projectDialogContent.replaceChildren(el("div", { class: "project-message" }, "読み込み中..."));
  }

  function dialogTitle(mode) {
    if (mode === "save") return "PCに保存";
    if (mode === "load") return "PCから読込";
    if (mode === "settings") return "詳細設定";
    return "PNG書き出し";
  }

  function closeProjectDialog() {
    projectDialog.setAttribute("aria-hidden", "true");
    projectDialogContent.replaceChildren();
  }

  function renderDetailSettingsDialog() {
    projectDialogTitle.textContent = "詳細設定";
    projectDialogContent.replaceChildren();
    const form = el("div", { class: "project-form" });
    form.appendChild(field("グループ", checkboxControl(groupMoveContentsEnabled(), (checked) => {
      appSettings().groupMoveContents = checked;
    }, "グループを動かす時、中の要素も一緒に移動")));
    form.appendChild(el("p", { class: "project-note" }, "この設定は全グループ共通です。オフの場合、グループ枠だけを移動します。"));
    projectDialogContent.appendChild(form);
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
    const largeExportNote = el("p", { class: "project-note png-large-export-note" });
    const scaleControl = el("div", { class: "png-scale-control" });
    const range = el("input", {
      type: "range",
      min: 0.5,
      max: 4,
      step: 0.1,
      value: scale
    });
    const scaleNumberWrap = el("div", { class: "png-scale-number" });
    const scaleNumber = el("input", {
      type: "number",
      min: 0.5,
      max: 4,
      step: 0.1,
      value: formatScale(scale),
      inputmode: "decimal",
      "aria-label": "PNG出力倍率"
    });
    scaleNumberWrap.appendChild(scaleNumber);
    scaleNumberWrap.appendChild(el("span", {}, "x"));
    scaleControl.appendChild(range);
    scaleControl.appendChild(scaleNumberWrap);

    const presetRow = el("div", { class: "png-preset-row" });
    const presetButtons = [1, 2, 3, 4].map((preset) => {
      const button = el("button", {
        type: "button",
        class: Number(scale) === preset ? "is-active" : ""
      }, `${preset}x`);
      button.addEventListener("click", () => {
        updatePreview(preset);
      });
      presetRow.appendChild(button);
      return { preset, button };
    });

    function updatePreview(value = scale, options = {}) {
      const { syncRange = true, syncNumber = true } = options;
      scale = normalizePngExportScale(value, scale);
      if (syncRange) range.value = String(scale);
      if (syncNumber) scaleNumber.value = formatScale(scale);
      const { width, height } = pngOutputSize(scale);
      sizePreview.textContent = `${width} x ${height}px`;
      const supported = pngSizeIsSupported({ width, height });
      const tiled = supported && pngShouldUseTiledExport({ width, height });
      sizePreview.classList.toggle("is-over-limit", !supported);
      largeExportNote.hidden = supported && !tiled;
      largeExportNote.textContent = !supported
        ? `出力上限は1辺 ${PNG_MAX_DIMENSION}px・合計約1億3400万画素です。`
        : tiled
          ? "大サイズ用の分割描画で出力します。端末上で順番に処理するため、完了まで時間がかかります。"
          : "";
      presetButtons.forEach(({ preset, button }) => {
        button.classList.toggle("is-active", Math.abs(scale - preset) < 0.001);
      });
    }

    range.addEventListener("input", () => updatePreview(range.value, { syncRange: false }));
    range.addEventListener("change", () => savePngExportScale(scale));
    scaleNumber.addEventListener("input", () => {
      if (scaleNumber.value === "") return;
      const enteredScale = Number(scaleNumber.value);
      if (!Number.isFinite(enteredScale)) return;
      updatePreview(enteredScale, { syncNumber: false });
    });
    scaleNumber.addEventListener("change", () => {
      updatePreview(scaleNumber.value === "" ? scale : scaleNumber.value);
      savePngExportScale(scale);
    });
    updatePreview();

    form.appendChild(field("倍率", scaleControl));
    form.appendChild(presetRow);
    form.appendChild(field("出力サイズ", sizePreview));
    form.appendChild(largeExportNote);
    form.appendChild(el("p", { class: "project-note" }, "低倍率でも文字や線が潰れにくいよう、内部では高解像度で描画してからPNGサイズへ縮小します。印刷や拡大表示用は2x以上が目安です。"));

    const actions = el("div", { class: "project-actions" });
    const exportButton = el("button", { type: "button", class: "primary-action" }, "PNGを書き出し");
    exportButton.addEventListener("click", () => {
      updatePreview(scaleNumber.value === "" ? scale : scaleNumber.value);
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
      clearMultiSelection();
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
      clearMultiSelection();
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
        clearMultiSelection();
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
    if (!pngSizeIsSupported(outputSize)) {
      window.alert(`PNGサイズが出力上限を超えています。\n現在: ${outputSize.width} x ${outputSize.height}px\n上限: 1辺 ${PNG_MAX_DIMENSION}px・合計約1億3400万画素`);
      return;
    }
    const useTiledExport = pngShouldUseTiledExport(outputSize);
    const renderSize = useTiledExport ? outputSize : pngRenderSize(scale, bounds, outputSize);
    const exportSvg = svg.cloneNode(false);
    exportSvg.setAttribute("xmlns", SVG_NS);
    exportSvg.setAttribute("xmlns:xlink", XLINK_NS);
    exportSvg.setAttribute("width", renderSize.width);
    exportSvg.setAttribute("height", renderSize.height);
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
    const previousMultiItemSelection = multiSelectedItemKeys;
    const previousInlineExport = inlineImageAssetsForExport;
    try {
      selected = null;
      multiSelectedNodeIds = new Set();
      multiSelectedItemKeys = new Set();
      inlineImageAssetsForExport = true;
      const linkLabelLayer = createSvg("g", { "data-layer": "link-labels" });
      state.groups.forEach((group) => root.appendChild(renderGroup(group)));
      state.links.forEach((link) => appendLinkWithLiftedLabel(root, linkLabelLayer, link));
      root.appendChild(linkLabelLayer);
      state.nodes.forEach((node) => root.appendChild(renderNode(node)));
      state.shapes.forEach((shape) => root.appendChild(renderShape(shape)));
      state.images.forEach((imageItem) => root.appendChild(renderInsertedImage(imageItem)));
      state.legends.forEach((legend) => root.appendChild(renderLegend(legend)));
      state.texts.forEach((textItem) => root.appendChild(renderTextItem(textItem)));
    } finally {
      selected = previousSelection;
      multiSelectedNodeIds = previousMultiSelection;
      multiSelectedItemKeys = previousMultiItemSelection;
      inlineImageAssetsForExport = previousInlineExport;
    }
    exportSvg.appendChild(root);

    if (useTiledExport) {
      statusText.textContent = "大サイズPNGを準備中...";
      exportTiledPng(exportSvg, bounds, outputSize)
        .catch((error) => {
          console.error(error);
          const message = error?.message === "png_compression_unsupported"
            ? "この端末のブラウザは大サイズPNGの分割出力に対応していません。iOSまたはブラウザを更新してください。"
            : "大サイズPNGを書き出せませんでした。端末の空きメモリを確認して、もう一度お試しください。";
          window.alert(message);
        })
        .finally(updateStatus);
      return;
    }
    exportCanvasPng(exportSvg, renderSize, outputSize);
  }

  function exportCanvasPng(exportSvg, renderSize, outputSize) {
    const source = new XMLSerializer().serializeToString(exportSvg);
    const image = new Image();
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    image.onload = () => {
      try {
        const needsDownsample = renderSize.width !== outputSize.width || renderSize.height !== outputSize.height;
        let rasterSource = image;
        if (needsDownsample) {
          const renderCanvas = document.createElement("canvas");
          renderCanvas.width = renderSize.width;
          renderCanvas.height = renderSize.height;
          const renderContext = renderCanvas.getContext("2d");
          if (!renderContext) throw new Error("png_canvas_unavailable");
          renderContext.fillStyle = "#f9faf7";
          renderContext.fillRect(0, 0, renderCanvas.width, renderCanvas.height);
          renderContext.drawImage(image, 0, 0, renderCanvas.width, renderCanvas.height);
          rasterSource = renderCanvas;
        }

        const canvas = document.createElement("canvas");
        canvas.width = outputSize.width;
        canvas.height = outputSize.height;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("png_canvas_unavailable");
        context.fillStyle = "#f9faf7";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.drawImage(rasterSource, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => {
          if (blob) downloadBlob(blob, "correlation-diagram.png", "image/png");
          else window.alert("PNGを書き出せませんでした。");
        }, "image/png");
      } catch (error) {
        URL.revokeObjectURL(url);
        console.error(error);
        window.alert("PNGを書き出せませんでした。");
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      window.alert("PNGを書き出せませんでした。");
    };
    image.src = url;
  }

  async function exportTiledPng(exportSvg, bounds, outputSize) {
    let compression;
    try {
      if (typeof CompressionStream !== "function") throw new Error("unsupported");
      compression = new CompressionStream("deflate");
    } catch {
      throw new Error("png_compression_unsupported");
    }

    const compressedPromise = new Response(compression.readable).arrayBuffer();
    const writer = compression.writable.getWriter();
    const columns = Math.ceil(outputSize.width / PNG_TILE_WIDTH);
    const rows = Math.ceil(outputSize.height / PNG_TILE_HEIGHT);
    const totalTiles = columns * rows;
    let completedTiles = 0;

    try {
      for (let tileY = 0; tileY < outputSize.height; tileY += PNG_TILE_HEIGHT) {
        const tileHeight = Math.min(PNG_TILE_HEIGHT, outputSize.height - tileY);
        const stride = outputSize.width * 4 + 1;
        const scanlines = new Uint8Array(stride * tileHeight);
        for (let tileX = 0; tileX < outputSize.width; tileX += PNG_TILE_WIDTH) {
          const tileWidth = Math.min(PNG_TILE_WIDTH, outputSize.width - tileX);
          const pixels = await renderPngTile(exportSvg, bounds, outputSize, {
            x: tileX,
            y: tileY,
            width: tileWidth,
            height: tileHeight
          });
          const sourceStride = tileWidth * 4;
          for (let row = 0; row < tileHeight; row += 1) {
            const sourceStart = row * sourceStride;
            const targetStart = row * stride + 1 + tileX * 4;
            scanlines.set(pixels.subarray(sourceStart, sourceStart + sourceStride), targetStart);
          }
          completedTiles += 1;
          statusText.textContent = `大サイズPNGを分割描画中... ${Math.round(completedTiles / totalTiles * 100)}%`;
          await new Promise((resolve) => requestAnimationFrame(resolve));
        }
        await writer.write(scanlines);
      }
      statusText.textContent = "大サイズPNGを圧縮中...";
      await writer.close();
    } catch (error) {
      await writer.abort(error).catch(() => {});
      await compressedPromise.catch(() => {});
      throw error;
    }

    const compressed = new Uint8Array(await compressedPromise);
    statusText.textContent = "PNGファイルを作成中...";
    const pngBlob = createPngBlob(outputSize.width, outputSize.height, compressed);
    downloadBlob(pngBlob, "correlation-diagram.png", "image/png");
  }

  async function renderPngTile(exportSvg, bounds, outputSize, tile) {
    const fitScale = Math.min(
      outputSize.width / Math.max(1, bounds.w),
      outputSize.height / Math.max(1, bounds.h)
    );
    const contentWidth = bounds.w * fitScale;
    const contentHeight = bounds.h * fitScale;
    const offsetX = (outputSize.width - contentWidth) / 2;
    const offsetY = (outputSize.height - contentHeight) / 2;
    const viewX = bounds.x + (tile.x - offsetX) / fitScale;
    const viewY = bounds.y + (tile.y - offsetY) / fitScale;
    const viewWidth = tile.width / fitScale;
    const viewHeight = tile.height / fitScale;

    exportSvg.setAttribute("width", tile.width);
    exportSvg.setAttribute("height", tile.height);
    exportSvg.setAttribute("viewBox", `${viewX} ${viewY} ${viewWidth} ${viewHeight}`);
    exportSvg.setAttribute("preserveAspectRatio", "none");
    const source = new XMLSerializer().serializeToString(exportSvg);
    const { image, url } = await loadPngSvgImage(source);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = tile.width;
      canvas.height = tile.height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) throw new Error("png_canvas_unavailable");
      context.fillStyle = "#f9faf7";
      context.fillRect(0, 0, tile.width, tile.height);
      context.drawImage(image, 0, 0, tile.width, tile.height);
      return context.getImageData(0, 0, tile.width, tile.height).data;
    } finally {
      URL.revokeObjectURL(url);
      image.src = "";
    }
  }

  function loadPngSvgImage(source) {
    return new Promise((resolve, reject) => {
      const blob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const image = new Image();
      image.decoding = "async";
      image.onload = () => resolve({ image, url });
      image.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("png_svg_decode_failed"));
      };
      image.src = url;
    });
  }

  function createPngBlob(width, height, compressed) {
    const header = new Uint8Array(13);
    const headerView = new DataView(header.buffer);
    headerView.setUint32(0, width, false);
    headerView.setUint32(4, height, false);
    header[8] = 8;
    header[9] = 6;
    const parts = [
      Uint8Array.of(137, 80, 78, 71, 13, 10, 26, 10),
      ...pngChunkParts("IHDR", header)
    ];
    for (let offset = 0; offset < compressed.length; offset += PNG_IDAT_CHUNK_SIZE) {
      parts.push(...pngChunkParts("IDAT", compressed.subarray(offset, offset + PNG_IDAT_CHUNK_SIZE)));
    }
    parts.push(...pngChunkParts("IEND", new Uint8Array(0)));
    return new Blob(parts, { type: "image/png" });
  }

  function pngChunkParts(type, data) {
    const typeBytes = Uint8Array.from(type, (character) => character.charCodeAt(0));
    return [
      pngUint32(data.length),
      typeBytes,
      data,
      pngUint32(pngCrc32(typeBytes, data))
    ];
  }

  function pngUint32(value) {
    const bytes = new Uint8Array(4);
    new DataView(bytes.buffer).setUint32(0, value >>> 0, false);
    return bytes;
  }

  function pngCrc32(...arrays) {
    if (!pngCrc32.table) {
      pngCrc32.table = new Uint32Array(256);
      for (let index = 0; index < 256; index += 1) {
        let value = index;
        for (let bit = 0; bit < 8; bit += 1) {
          value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
        }
        pngCrc32.table[index] = value >>> 0;
      }
    }
    let crc = 0xffffffff;
    arrays.forEach((array) => {
      for (let index = 0; index < array.length; index += 1) {
        crc = pngCrc32.table[(crc ^ array[index]) & 0xff] ^ (crc >>> 8);
      }
    });
    return (crc ^ 0xffffffff) >>> 0;
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
      requestDiagramRender({ fast: true });
      updateStatus();
    }
    changeTimer = window.setTimeout(() => {
      commitChange(false);
      if (renderNow) {
        requestDiagramRender();
        renderSelectionList();
      }
    }, 420);
  }

  function undo() {
    if (isViewMode()) return;
    if (history.length <= 1) return;
    future.push(history.pop());
    restoreSnapshot(history[history.length - 1]);
  }

  function redo() {
    if (isViewMode()) return;
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
    state.settings = normalizeSettings(parsed.settings);
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
      images: state.images,
      settings: normalizeSettings(state.settings)
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
      settings: normalizeSettings(sourceState.settings),
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
      return normalizePngExportScale(localStorage.getItem(PNG_SCALE_KEY), 1);
    } catch {
      return 1;
    }
  }

  function savePngExportScale(scale) {
    try {
      localStorage.setItem(PNG_SCALE_KEY, String(normalizePngExportScale(scale, 1)));
    } catch {
      // Local storage can be unavailable in restrictive browser modes.
    }
  }

  function normalizePngExportScale(value, fallback = 1) {
    const numeric = value === null || value === "" ? Number.NaN : Number(value);
    const safeValue = Number.isFinite(numeric) ? numeric : Number(fallback) || 1;
    return Math.round(clamp(safeValue, 0.5, 4) * 10) / 10;
  }

  function pngOutputSize(scale, bounds = contentBounds(36)) {
    const baseWidth = Math.max(720, Math.ceil(bounds.w));
    const baseHeight = Math.max(480, Math.ceil(bounds.h));
    const factor = normalizePngExportScale(scale, 1);
    return {
      width: Math.max(1, Math.round(baseWidth * factor)),
      height: Math.max(1, Math.round(baseHeight * factor))
    };
  }

  function pngSizeIsSupported(size) {
    return size.width <= PNG_MAX_DIMENSION
      && size.height <= PNG_MAX_DIMENSION
      && size.width * size.height <= PNG_MAX_PIXELS;
  }

  function pngShouldUseTiledExport(size) {
    return size.width > PNG_TILE_WIDTH
      || size.height > PNG_TILE_WIDTH
      || size.width * size.height > PNG_TILED_THRESHOLD_PIXELS;
  }

  function pngRenderSize(scale, bounds = contentBounds(36), outputSize = pngOutputSize(scale, bounds)) {
    const outputScale = normalizePngExportScale(scale, 1);
    const desiredRenderScale = Math.max(outputScale, PNG_MIN_RENDER_SCALE);
    let factor = Math.max(1, desiredRenderScale / outputScale);
    const dimensionLimit = Math.min(PNG_MAX_DIMENSION / outputSize.width, PNG_MAX_DIMENSION / outputSize.height);
    const pixelLimit = Math.sqrt(PNG_MAX_PIXELS / Math.max(1, outputSize.width * outputSize.height));
    factor = Math.max(1, Math.min(factor, dimensionLimit, pixelLimit));
    return {
      width: Math.max(outputSize.width, Math.floor(outputSize.width * factor)),
      height: Math.max(outputSize.height, Math.floor(outputSize.height * factor))
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
        description: String(node.description ?? node.memo ?? ""),
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
        imageBackgroundColor: normalizeColorValue(node.imageBackgroundColor, "#ffffff"),
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
        fillOpacity: normalizeGroupFillOpacity(group.fillOpacity),
        gradient: normalizeGradient(group.gradient, group.color || PALETTE[2]),
        titleFontSize: normalizeGroupTitleFontSize(group.titleFontSize),
        titleFontFamily: normalizeGroupTitleFontId(group.titleFontFamily),
        titleTextColor: typeof group.titleTextColor === "string" ? group.titleTextColor : "#202329",
        titleBackgroundOpacity: normalizeGroupTitleBackgroundOpacity(group.titleBackgroundOpacity),
        titleOutlineColor: normalizeColorValue(group.titleOutlineColor, "#ffffff"),
        titleOutlineWidth: normalizeGroupTitleOutlineWidth(group.titleOutlineWidth),
        shape: normalizeGroupShape(group.shape),
        notchWidth: normalizeGroupNotchWidth(group),
        notchHeight: normalizeGroupNotchHeight(group)
      })),
      texts: Array.isArray(value.texts) ? value.texts.map(normalizeTextItem) : [],
      shapes: Array.isArray(value.shapes) ? value.shapes.map(normalizeShape) : [],
      legends: Array.isArray(value.legends) ? value.legends.map(normalizeLegend) : [],
      images: Array.isArray(value.images) ? value.images.map(normalizeInsertedImage) : [],
      imageAssets: normalizeImageAssets(value.imageAssets),
      settings: normalizeSettings(value.settings),
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
    return GROUP_TITLE_FONT_IDS.has(value) ? value : "mincho";
  }

  function groupTitleFontFamily(value) {
    const font = GROUP_TITLE_FONTS.find(([id]) => id === normalizeGroupTitleFontId(value));
    return font ? font[2] : GROUP_TITLE_FONTS[0][2];
  }

  function groupTitleTextColor(group) {
    return normalizeColorValue(group?.titleTextColor, "#202329");
  }

  function normalizeSettings(settings) {
    const source = settings && typeof settings === "object" ? settings : {};
    return {
      ...DEFAULT_SETTINGS,
      groupMoveContents: source.groupMoveContents === true
    };
  }

  function normalizeGroupTitleOutlineWidth(value) {
    return clamp(Number(value) || 0, 0, 8);
  }

  function normalizeGroupTitleBackgroundOpacity(value) {
    const number = Number(value);
    return Number.isFinite(number) ? clamp(number, 0, 1) : 1;
  }

  function normalizeGroupShape(value) {
    return GROUP_SHAPE_IDS.has(value) ? value : "rect";
  }

  function normalizeGroupFillOpacity(value) {
    const number = Number(value);
    return Number.isFinite(number) ? clamp(number, 0, 1) : 0.13;
  }

  function normalizeGroupNotchWidth(group) {
    const width = Math.max(GROUP_MIN_WIDTH, Number(group?.w) || 280);
    const fallback = Math.round(width * 0.42);
    return clamp(Number(group?.notchWidth) || fallback, 24, Math.max(24, width - 24));
  }

  function normalizeGroupNotchHeight(group) {
    const height = Math.max(GROUP_MIN_HEIGHT, Number(group?.h) || 180);
    const fallback = Math.round(height * 0.42);
    return clamp(Number(group?.notchHeight) || fallback, 24, Math.max(24, height - 24));
  }

  function normalizeColorValue(value, fallback) {
    return typeof value === "string" && value ? value : fallback;
  }

  function normalizeLink(link) {
    const fromIds = normalizeEndpointIds(Array.isArray(link.fromIds) ? link.fromIds : [link.from]);
    const toIds = normalizeEndpointIds(Array.isArray(link.toIds) ? link.toIds : [link.to]);
    const route = ["straight", "orthogonal", "curve"].includes(link.route) ? link.route : "orthogonal";
    const routeOffsetX = normalizeFreeOffset(link.routeOffsetX);
    const routeOffsetY = normalizeFreeOffset(link.routeOffsetY);
    const fromTerminalOffsets = normalizeTerminalOffsetMap(link.fromTerminalOffsets, fromIds);
    const toTerminalOffsets = normalizeTerminalOffsetMap(link.toTerminalOffsets, toIds);
    const hasLegacyManualRoute = route === "orthogonal" && (
      Math.abs(routeOffsetX) > 0.001
      || Math.abs(routeOffsetY) > 0.001
      || Object.keys(fromTerminalOffsets).length > 0
      || Object.keys(toTerminalOffsets).length > 0
    );
    const normalized = {
      id: link.id || uid("link"),
      from: fromIds[0] || link.from || "",
      to: toIds[0] || link.to || "",
      fromIds,
      toIds,
      fromAnchors: normalizeAnchorMap(link.fromAnchors, fromIds),
      toAnchors: normalizeAnchorMap(link.toAnchors, toIds),
      fromTerminalOffsets,
      toTerminalOffsets,
      label: String(link.label || ""),
      type: ["line", "arrow", "bidirectional", "dashed"].includes(link.type) ? link.type : "line",
      route,
      color: link.color || "#202329",
      labelColor: typeof link.labelColor === "string" ? link.labelColor : "",
      labelPosition: clamp(Number(link.labelPosition ?? 0.5), 0, 1),
      labelOffsetX: normalizeFreeOffset(link.labelOffsetX),
      labelOffsetY: normalizeFreeOffset(link.labelOffsetY),
      labelBackgroundColor: normalizeLinkLabelBackgroundColor(link.labelBackgroundColor),
      labelBorderColor: normalizeLinkLabelBorderColor(link.labelBorderColor),
      labelBorderWidth: normalizeLinkLabelBorderWidth(link.labelBorderWidth),
      routeOffsetX,
      routeOffsetY,
      manualRoute: link.manualRoute === true || hasLegacyManualRoute,
      manualRouteAxis: link.manualRouteAxis === "horizontal" || link.manualRouteAxis === "vertical"
        ? link.manualRouteAxis
        : Math.abs(routeOffsetX) > Math.abs(routeOffsetY)
          ? "horizontal"
          : Math.abs(routeOffsetY) > 0.001
            ? "vertical"
            : "",
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
    const kind = LEGEND_KINDS.has(source.kind) ? source.kind : "marks";
    return {
      id: source.id || uid("legend"),
      kind,
      title: String(source.title || (kind === "arrows" ? "関係線凡例" : "属性マーク凡例")),
      x: Number(source.x) || 0,
      y: Number(source.y) || 0,
      w: clamp(Number(source.w) || (kind === "arrows" ? ARROW_LEGEND_DEFAULT_WIDTH : LEGEND_DEFAULT_WIDTH), 150, 620),
      fontSize: clamp(Number(source.fontSize) || LEGEND_DEFAULT_FONT_SIZE, 9, 28),
      color: source.color || "#202329",
      backgroundColor: typeof source.backgroundColor === "string" ? source.backgroundColor : "#ffffff",
      borderColor: typeof source.borderColor === "string" ? source.borderColor : "#d8ded8",
      items: kind === "arrows" ? normalizeArrowLegendItems(source.items) : normalizeLegendItems(source.items)
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

  function createArrowLegendItem(source = {}) {
    const item = source && typeof source === "object" ? source : {};
    const type = ARROW_LEGEND_TYPE_IDS.has(item.type) ? item.type : "from-to";
    return {
      id: String(item.id || uid("arrowLegendItem")),
      text: typeof item.text === "string" ? item.text : "説明",
      color: typeof item.color === "string" && item.color ? item.color : "#202329",
      type,
      width: clamp(Number(item.width) || 3, 1, 8),
      visible: item.visible !== false
    };
  }

  function normalizeArrowLegendItems(value) {
    const sourceItems = Array.isArray(value) ? value : [];
    return sourceItems.map((item) => createArrowLegendItem(item));
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
    const multiCount = multiSelectedCount();
    if (multiCount > 1) {
      statusText.textContent = `${multiCount}件選択`;
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
    if (selected.type === "legend") statusText.textContent = `${isArrowLegend(item) ? "矢印凡例" : "属性マーク凡例"}: ${legendTitle(item)}`;
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
      ...state.groups.map(groupDisplayBounds),
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
        axis: current.getAttribute?.("data-axis") || "",
        anchor: current.getAttribute?.("data-anchor") || "",
        routeX: current.getAttribute?.("data-route-x") || "",
        routeY: current.getAttribute?.("data-route-y") || ""
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
        axis: current.getAttribute?.("data-axis") || "",
        anchor: current.getAttribute?.("data-anchor") || "",
        routeX: current.getAttribute?.("data-route-x") || "",
        routeY: current.getAttribute?.("data-route-y") || ""
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
    return (target?.type === "node"
      || target?.type === "node-name"
      || target?.type === "node-role"
      || target?.type === "group"
      || target?.type === "group-title"
      || target?.type === "connection-port")
      && Boolean(getConnectionEndpoint(target.id));
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
    let point = null;
    if (customAnchor) {
      point = {
        x: item.x + item.w * customAnchor.x,
        y: item.y + item.h * customAnchor.y
      };
    }
    if (!point && selectedAnchor !== "auto") {
      const anchor = anchors.find((candidate) => candidate.key === selectedAnchor);
      if (anchor) point = anchor.point;
    }
    if (!point) {
      const preferred = nearestAnchorIndex(anchors, toward);
      const spreadIndex = endpointUsageIndex(endpointId, link.id, side);
      const anchorIndex = wrapIndex(preferred + anchorSpreadOffset(spreadIndex), anchors.length);
      point = anchors[anchorIndex].point;
    }
    return avoidGroupTitleTabAttachment(item, point, link);
  }

  function avoidGroupTitleTabAttachment(item, point, link) {
    const group = item && Object.prototype.hasOwnProperty.call(item, "title") ? item : null;
    if (!group || !point) return point;
    const tab = groupTitleTabMetrics(group, normalizeGroupTitleFontSize(group.titleFontSize));
    const clearance = Math.max(10, (Number(link?.width) || 1.5) * 6 + 4);
    const insideTabClearance = point.x >= tab.x - clearance
      && point.x <= tab.x + tab.w + clearance
      && point.y >= tab.y - clearance
      && point.y <= tab.y + tab.h + clearance;
    if (!insideTabClearance) return point;

    const shape = normalizeGroupShape(group.shape);
    const notchW = normalizeGroupNotchWidth(group);
    const notchH = normalizeGroupNotchHeight(group);
    const left = group.x;
    const right = group.x + group.w;
    const bottom = group.y + group.h;
    let topStart = left;
    let topEnd = right;
    if (shape === "l-top-left") topStart += notchW;
    if (shape === "l-top-right") topEnd -= notchW;

    const candidates = [];
    const leftTopEnd = Math.min(topEnd, tab.x - clearance);
    if (leftTopEnd >= topStart) {
      candidates.push({ x: clamp(point.x, topStart, leftTopEnd), y: group.y });
    }
    const rightTopStart = Math.max(topStart, tab.x + tab.w + clearance);
    if (rightTopStart <= topEnd) {
      candidates.push({ x: clamp(point.x, rightTopStart, topEnd), y: group.y });
    }

    const tabSafeY = Math.min(bottom, Math.max(group.y, tab.y + tab.h + clearance));
    const leftEdgeStart = shape === "l-top-left" ? group.y + notchH : group.y;
    const rightEdgeStart = shape === "l-top-right" ? group.y + notchH : group.y;
    candidates.push({ x: left, y: clamp(tabSafeY, leftEdgeStart, bottom) });
    candidates.push({ x: right, y: clamp(tabSafeY, rightEdgeStart, bottom) });
    return candidates.reduce((nearest, candidate) => (
      !nearest || distance(candidate, point) < distance(nearest, point) ? candidate : nearest
    ), null) || point;
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
      || (resolvedLinkFlowAxis(link, routeStart, routeEnd, "single") ? "horizontal" : "vertical");
    const hasManualRoute = link.manualRoute === true
      || Math.abs(normalizedLinkRouteOffsetX(link)) > 0.001
      || Math.abs(normalizedLinkRouteOffsetY(link)) > 0.001;
    const routed = hasManualRoute
      ? manualOrthogonalRoutePoints(link, routeStart, routeEnd, preferredAxis)
      : fastDiagramRender
        ? routeCandidatePoints(routeStart, routeEnd, preferredAxis)
        : routeOrthogonalPoints(routeStart, routeEnd, preferredAxis, linkConnectionObstacles([fromEndpoint, toEndpoint]));
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

  function resolveMultiLinkBranches(link, fromEndpoints, toEndpoints, trunkOrientation, trunkCoordinate, obstacles) {
    return {
      sourceBranches: fromEndpoints.map((endpoint) => resolveMultiLinkBranch(
        link,
        endpoint,
        "from",
        trunkOrientation,
        trunkCoordinate,
        obstacles
      )),
      targetBranches: toEndpoints.map((endpoint) => resolveMultiLinkBranch(
        link,
        endpoint,
        "to",
        trunkOrientation,
        trunkCoordinate,
        obstacles
      ))
    };
  }

  function resolveMultiLinkBranch(link, endpoint, side, trunkOrientation, trunkCoordinate, obstacles) {
    const toward = trunkOrientation === "vertical"
      ? { x: trunkCoordinate, y: endpoint.center.y }
      : { x: endpoint.center.x, y: trunkCoordinate };
    const anchor = attachmentPoint(endpoint.item, endpoint.id, link, side, toward);
    const terminal = linkTerminalStubPoint(link, side, endpoint.id, endpoint.item, anchor);
    const terminalPoint = terminal?.point || anchor;
    const initialJoin = trunkOrientation === "vertical"
      ? { x: trunkCoordinate, y: terminalPoint.y }
      : { x: terminalPoint.x, y: trunkCoordinate };
    const branchAxis = trunkOrientation === "vertical" ? "horizontal" : "vertical";
    const branchPoints = (join) => side === "from"
      ? orthogonalBranchPoints(anchor, join, branchAxis, side, obstacles, { start: terminal })
      : orthogonalBranchPoints(join, anchor, branchAxis, side, obstacles, { end: terminal });
    const settled = settleMultiLinkBranchJoin(branchPoints, initialJoin, side, trunkOrientation);
    return {
      anchor,
      join: settled.join,
      side,
      endpointId: endpoint.id,
      terminal,
      obstacles,
      points: settled.points
    };
  }

  function settleMultiLinkBranchJoin(buildPoints, initialJoin, side, trunkOrientation) {
    let join = initialJoin;
    let points = buildPoints(join);
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const approach = side === "from" ? points[points.length - 2] : points[1];
      const nextJoin = branchJoinFromApproach(join, approach, trunkOrientation);
      if (!nextJoin || samePoint(nextJoin, join)) break;
      join = nextJoin;
      points = buildPoints(join);
    }
    return { join, points };
  }

  function branchJoinFromApproach(join, approach, trunkOrientation) {
    if (!approach) return null;
    if (trunkOrientation === "horizontal" && sameY(join, approach) && !sameX(join, approach)) {
      return { x: approach.x, y: join.y };
    }
    if (trunkOrientation === "vertical" && sameX(join, approach) && !sameY(join, approach)) {
      return { x: join.x, y: approach.y };
    }
    return null;
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

  function normalizedManualRouteAxis(link) {
    return link?.manualRouteAxis === "horizontal" || link?.manualRouteAxis === "vertical"
      ? link.manualRouteAxis
      : "";
  }

  function resolvedLinkFlowAxis(link, from, to, scope) {
    const manualAxis = link?.manualRoute === true ? normalizedManualRouteAxis(link) : "";
    if (manualAxis) return manualAxis === "horizontal";
    return resolveLinkFlowAxis(link, from, to, scope);
  }

  function resolveLinkFlowAxis(link, from, to, scope) {
    const horizontalDistance = Math.abs(to.x - from.x);
    const verticalDistance = Math.abs(to.y - from.y);
    const proposed = horizontalDistance >= verticalDistance ? "horizontal" : "vertical";
    const cacheKey = `${scope}|${link.id}`;
    const previous = linkRoutingAxisCache.get(cacheKey);
    let resolved = proposed;

    // Keep an existing bend direction until the alternate direction is clearly shorter.
    if (previous && previous !== proposed) {
      const previousDistance = previous === "horizontal" ? horizontalDistance : verticalDistance;
      const proposedDistance = proposed === "horizontal" ? horizontalDistance : verticalDistance;
      if (proposedDistance < previousDistance * LINK_AXIS_SWITCH_RATIO) {
        resolved = previous;
      }
    }

    linkRoutingAxisCache.delete(cacheKey);
    linkRoutingAxisCache.set(cacheKey, resolved);
    while (linkRoutingAxisCache.size > LINK_AXIS_CACHE_LIMIT) {
      const oldestKey = linkRoutingAxisCache.keys().next().value;
      if (oldestKey === undefined) break;
      linkRoutingAxisCache.delete(oldestKey);
    }
    return resolved === "horizontal";
  }

  function linkConnectionObstacles(endpoints) {
    const endpointItems = endpoints.map((endpoint) => endpoint?.item).filter(Boolean);
    const endpointIds = new Set(endpoints.map((endpoint) => endpoint?.id).filter(Boolean));
    const obstacles = linkNodeObstacles(endpointIds);
    if (!endpointItems.length || !obstacles.length) return obstacles;

    // A relationship only needs to consider nearby icons. Distant icons must not change its route.
    const padding = LINK_ROUTE_OUTER_PADDING + LINK_AVOID_PADDING;
    const minX = Math.min(...endpointItems.map((item) => item.x)) - padding;
    const maxX = Math.max(...endpointItems.map((item) => item.x + item.w)) + padding;
    const minY = Math.min(...endpointItems.map((item) => item.y)) - padding;
    const maxY = Math.max(...endpointItems.map((item) => item.y + item.h)) + padding;
    return obstacles.filter((obstacle) => rectIntersectsBounds(obstacle, minX, minY, maxX, maxY));
  }

  function chooseTrunkCoordinate(axis, base, rangeStart, rangeEnd, obstacles) {
    const candidates = trunkCoordinateCandidates(axis, base, obstacles)
      .filter((candidate) => Math.abs(candidate - base) <= LINK_ROUTE_MAX_AUTO_SHIFT);
    if (!candidates.some((candidate) => sameCoord(candidate, base))) candidates.push(base);
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
    const alternateAxis = preferredAxis === "horizontal" ? "vertical" : "horizontal";
    const candidates = [
      routeCandidatePoints(start, end, preferredAxis),
      centeredRouteCandidatePoints(start, end, preferredAxis),
      routeCandidatePoints(start, end, alternateAxis),
      centeredRouteCandidatePoints(start, end, alternateAxis)
    ].map(compactPolyline);
    const clear = candidates.find((candidate) => polylineIsClear(candidate, scopedObstacles));
    const result = clear || candidates.reduce((best, candidate) => {
      const hits = candidate.reduce((count, point, index) => (
        index === 0 ? count : count + segmentObstacleCount(candidate[index - 1], point, scopedObstacles)
      ), 0);
      const score = hits * 100000 + polylineLength(candidate) + Math.max(0, candidate.length - 2) * 8;
      return !best || score < best.score ? { points: candidate, score } : best;
    }, null)?.points || candidates[0];
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

  function centeredRouteCandidatePoints(start, end, firstAxis) {
    if (firstAxis === "horizontal") {
      const x = (start.x + end.x) / 2;
      return [start, { x, y: start.y }, { x, y: end.y }, end];
    }
    const y = (start.y + end.y) / 2;
    return [start, { x: start.x, y }, { x: end.x, y }, end];
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

  function polylinePathWithJumps(link, points) {
    const compact = compactPolyline(points);
    if (compact.length < 2) return polylinePath(compact);
    if (fastDiagramRender) return polylinePath(compact);
    const crossingsBySegment = linkJumpCrossings(link, compact);
    if (!crossingsBySegment.size) return polylinePath(compact);

    const jumpRadius = Math.max(LINK_JUMP_RADIUS, (Number(link.width) || 1.5) * 3.5 + 7);
    const jumpHeight = Math.max(LINK_JUMP_HEIGHT, (Number(link.width) || 1.5) * 2.4 + 5);
    let pathData = `M ${compact[0].x} ${compact[0].y}`;

    for (let index = 1; index < compact.length; index += 1) {
      const start = compact[index - 1];
      const end = compact[index];
      const segmentLength = distance(start, end);
      const crossings = crossingsBySegment.get(index - 1) || [];
      if (segmentLength <= 0 || !crossings.length) {
        pathData += ` L ${end.x} ${end.y}`;
        continue;
      }

      const unit = {
        x: (end.x - start.x) / segmentLength,
        y: (end.y - start.y) / segmentLength
      };
      const normal = linkJumpNormal(start, end);
      let lastJumpEnd = 0;

      crossings.forEach((crossing) => {
        const bridgeStartDistance = Math.max(0, crossing.distanceAlong - jumpRadius);
        const bridgeEndDistance = Math.min(segmentLength, crossing.distanceAlong + jumpRadius);
        if (bridgeStartDistance < lastJumpEnd + jumpRadius * 0.35) return;

        const bridgeStart = pointAtSegmentDistance(start, unit, bridgeStartDistance);
        const bridgeEnd = pointAtSegmentDistance(start, unit, bridgeEndDistance);
        const control = {
          x: crossing.point.x + normal.x * jumpHeight,
          y: crossing.point.y + normal.y * jumpHeight
        };
        pathData += ` L ${bridgeStart.x} ${bridgeStart.y} Q ${control.x} ${control.y} ${bridgeEnd.x} ${bridgeEnd.y}`;
        lastJumpEnd = bridgeEndDistance;
      });

      pathData += ` L ${end.x} ${end.y}`;
    }

    return pathData;
  }

  function linkJumpCrossings(link, points) {
    const currentSegments = polylineSegments(points);
    if (!currentSegments.length) return new Map();
    const referenceSegments = linkJumpReferenceSegments(link);
    if (!referenceSegments.length) return new Map();

    const crossingsBySegment = new Map();
    currentSegments.forEach((segment) => {
      const segmentCrossings = [];
      referenceSegments.forEach((reference) => {
        const crossing = segmentIntersection(segment, reference);
        if (!crossing) return;
        const duplicate = segmentCrossings.some((candidate) => distance(candidate.point, crossing.point) < LINK_JUMP_RADIUS * 1.5);
        if (duplicate) return;
        segmentCrossings.push(crossing);
      });
      if (segmentCrossings.length) {
        segmentCrossings.sort((a, b) => a.distanceAlong - b.distanceAlong);
        crossingsBySegment.set(segment.index, segmentCrossings);
      }
    });
    return crossingsBySegment;
  }

  function linkJumpReferenceSegments(link) {
    const cached = linkJumpReferenceSegmentCache.get(link.id);
    if (cached) return cached;

    const linkIndex = state.links.findIndex((candidate) => candidate.id === link.id);
    if (linkIndex <= 0) {
      linkJumpReferenceSegmentCache.set(link.id, []);
      return [];
    }

    const segments = [];
    state.links.slice(0, linkIndex).forEach((referenceLink) => {
      linkPolylinesForJumps(referenceLink).forEach((polyline, polylineIndex) => {
        segments.push(...polylineSegments(polyline, referenceLink.id, polylineIndex));
      });
    });
    linkJumpReferenceSegmentCache.set(link.id, segments);
    return segments;
  }

  function linkPolylinesForJumps(link) {
    const cached = linkJumpPolylineCache.get(link.id);
    if (cached) return cached;
    const polylines = buildLinkPolylinesForJumps(link);
    linkJumpPolylineCache.set(link.id, polylines);
    return polylines;
  }

  function buildLinkPolylinesForJumps(link) {
    const fromEndpoints = getLinkEndpointEntries(link, "from");
    const toEndpoints = getLinkEndpointEntries(link, "to");
    if (!fromEndpoints.length || !toEndpoints.length) return [];

    const route = link.route || "orthogonal";
    if (route === "straight") {
      const polylines = [];
      fromEndpoints.forEach((fromEndpoint) => {
        toEndpoints.forEach((toEndpoint) => {
          if (fromEndpoint.id === toEndpoint.id) return;
          const start = attachmentPoint(fromEndpoint.item, fromEndpoint.id, link, "from", toEndpoint.center);
          const end = attachmentPoint(toEndpoint.item, toEndpoint.id, link, "to", fromEndpoint.center);
          polylines.push([start, end]);
        });
      });
      return polylines;
    }

    if (route === "curve" && fromEndpoints.length === 1 && toEndpoints.length === 1) {
      const fromEndpoint = fromEndpoints[0];
      const toEndpoint = toEndpoints[0];
      const curve = linkCurveGeometry(link, fromEndpoint, toEndpoint);
      const obstacles = linkConnectionObstacles([fromEndpoint, toEndpoint]);
      if (!quadraticCurveIntersectsObstacles(curve.start, curve.control, curve.end, obstacles)) {
        return [approximateQuadraticPolyline(curve.start, curve.control, curve.end, 28)];
      }
    }

    return orthogonalPolylinesForJumps(link, fromEndpoints, toEndpoints);
  }

  function linkCurveGeometry(link, fromEndpoint, toEndpoint) {
    const start = attachmentPoint(fromEndpoint.item, fromEndpoint.id, link, "from", toEndpoint.center);
    const end = attachmentPoint(toEndpoint.item, toEndpoint.id, link, "to", fromEndpoint.center);
    const midpointPoint = midpoint(start, end);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    const curve = Math.min(70, Math.max(28, length * 0.14));
    return {
      start,
      end,
      control: {
        x: midpointPoint.x + (-dy / length) * curve + normalizedLinkRouteOffsetX(link),
        y: midpointPoint.y + (dx / length) * curve + normalizedLinkRouteOffsetY(link)
      }
    };
  }

  function orthogonalPolylinesForJumps(link, fromEndpoints, toEndpoints) {
    if (fromEndpoints.length === 1 && toEndpoints.length === 1) {
      if (fromEndpoints[0].id === toEndpoints[0].id) return [];
      return [singleOrthogonalPolyline(link, fromEndpoints[0], toEndpoints[0])];
    }

    const fromCenter = averagePoint(fromEndpoints.map((endpoint) => endpoint.center));
    const toCenter = averagePoint(toEndpoints.map((endpoint) => endpoint.center));
    const manualRoute = link.manualRoute === true;
    const useHorizontalTrunk = resolvedLinkFlowAxis(link, fromCenter, toCenter, `multi:${fromEndpoints.length}:${toEndpoints.length}`);
    const nodeObstacles = manualRoute ? [] : linkConnectionObstacles([...fromEndpoints, ...toEndpoints]);
    const polylines = [];

    if (useHorizontalTrunk) {
      const estimatedYs = [...fromEndpoints, ...toEndpoints].map((endpoint) => endpoint.center.y);
      const baseTrunkX = (fromCenter.x + toCenter.x) / 2;
      const trunkX = (manualRoute
        ? baseTrunkX
        : chooseTrunkCoordinate(
          "vertical",
          baseTrunkX,
          Math.min(...estimatedYs),
          Math.max(...estimatedYs),
          nodeObstacles
        )) + normalizedLinkRouteOffsetX(link);
      const { sourceBranches, targetBranches } = resolveMultiLinkBranches(
        link,
        fromEndpoints,
        toEndpoints,
        "vertical",
        trunkX,
        nodeObstacles
      );
      const ys = [...sourceBranches, ...targetBranches].map((branch) => branch.join.y);
      polylines.push([{ x: trunkX, y: Math.min(...ys) }, { x: trunkX, y: Math.max(...ys) }]);
      sourceBranches.forEach((branch) => {
        polylines.push(branch.points);
      });
      targetBranches.forEach((branch) => {
        polylines.push(branch.points);
      });
      return polylines;
    }

    const estimatedXs = [...fromEndpoints, ...toEndpoints].map((endpoint) => endpoint.center.x);
    const baseTrunkY = (fromCenter.y + toCenter.y) / 2;
    const trunkY = (manualRoute
      ? baseTrunkY
      : chooseTrunkCoordinate(
        "horizontal",
        baseTrunkY,
        Math.min(...estimatedXs),
        Math.max(...estimatedXs),
        nodeObstacles
      )) + normalizedLinkRouteOffsetY(link);
    const { sourceBranches, targetBranches } = resolveMultiLinkBranches(
      link,
      fromEndpoints,
      toEndpoints,
      "horizontal",
      trunkY,
      nodeObstacles
    );
    const xs = [...sourceBranches, ...targetBranches].map((branch) => branch.join.x);
    polylines.push([{ x: Math.min(...xs), y: trunkY }, { x: Math.max(...xs), y: trunkY }]);
    sourceBranches.forEach((branch) => {
      polylines.push(branch.points);
    });
    targetBranches.forEach((branch) => {
      polylines.push(branch.points);
    });
    return polylines;
  }

  function polylineSegments(points, linkId = "", polylineIndex = 0) {
    const compact = compactPolyline(points);
    const segments = [];
    for (let index = 1; index < compact.length; index += 1) {
      const start = compact[index - 1];
      const end = compact[index];
      const length = distance(start, end);
      if (length <= 0.001) continue;
      segments.push({
        linkId,
        polylineIndex,
        index: index - 1,
        start,
        end,
        length
      });
    }
    return segments;
  }

  function segmentIntersection(segment, reference) {
    const p = segment.start;
    const r = { x: segment.end.x - segment.start.x, y: segment.end.y - segment.start.y };
    const q = reference.start;
    const s = { x: reference.end.x - reference.start.x, y: reference.end.y - reference.start.y };
    const cross = crossProduct(r, s);
    if (Math.abs(cross) < 0.001) return null;

    const qp = { x: q.x - p.x, y: q.y - p.y };
    const t = crossProduct(qp, s) / cross;
    const u = crossProduct(qp, r) / cross;
    if (t <= 0.001 || t >= 0.999 || u <= 0.001 || u >= 0.999) return null;

    const distanceAlong = t * segment.length;
    const referenceDistanceAlong = u * reference.length;
    if (distanceAlong < LINK_JUMP_ENDPOINT_PADDING || segment.length - distanceAlong < LINK_JUMP_ENDPOINT_PADDING) return null;
    if (referenceDistanceAlong < LINK_JUMP_ENDPOINT_PADDING || reference.length - referenceDistanceAlong < LINK_JUMP_ENDPOINT_PADDING) return null;

    return {
      point: {
        x: p.x + r.x * t,
        y: p.y + r.y * t
      },
      distanceAlong
    };
  }

  function crossProduct(a, b) {
    return a.x * b.y - a.y * b.x;
  }

  function pointAtSegmentDistance(start, unit, distanceAlong) {
    return {
      x: start.x + unit.x * distanceAlong,
      y: start.y + unit.y * distanceAlong
    };
  }

  function linkJumpNormal(start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy) || 1;
    let normal = { x: -dy / length, y: dx / length };
    if (Math.abs(dx) >= Math.abs(dy)) {
      if (normal.y > 0) normal = { x: -normal.x, y: -normal.y };
    } else if (normal.x < 0) {
      normal = { x: -normal.x, y: -normal.y };
    }
    return normal;
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

  function collectGroupDragItems(group) {
    return {
      nodes: state.nodes.filter((node) => itemBoundsCenterIsInGroup(group, node)).map(positionSnapshot),
      groups: state.groups
        .filter((candidate) => candidate.id !== group.id && itemBoundsCenterIsInGroup(group, candidate))
        .map(positionSnapshot),
      texts: state.texts.filter((textItem) => itemBoundsCenterIsInGroup(group, textItemBounds(textItem))).map(positionSnapshot),
      shapes: state.shapes.filter((shape) => itemBoundsCenterIsInGroup(group, shapeBounds(shape))).map(positionSnapshot),
      images: state.images.filter((imageItem) => itemBoundsCenterIsInGroup(group, imageBounds(imageItem))).map(positionSnapshot),
      legends: state.legends.filter((legend) => itemBoundsCenterIsInGroup(group, legendBounds(legend))).map(positionSnapshot)
    };
  }

  function itemBoundsCenterIsInGroup(group, itemOrBounds) {
    if (!itemOrBounds) return false;
    return pointInGroupShape(group, itemCenter(itemOrBounds));
  }

  function pointInGroupShape(group, point) {
    if (!group || !point) return false;
    if (point.x < group.x || point.x > group.x + group.w || point.y < group.y || point.y > group.y + group.h) {
      return false;
    }
    const shape = normalizeGroupShape(group.shape);
    if (shape === "rect") return true;
    const notchW = normalizeGroupNotchWidth(group);
    const notchH = normalizeGroupNotchHeight(group);
    if (shape === "l-top-left") return point.x >= group.x + notchW || point.y >= group.y + notchH;
    if (shape === "l-top-right") return point.x <= group.x + group.w - notchW || point.y >= group.y + notchH;
    if (shape === "l-bottom-left") return point.x >= group.x + notchW || point.y <= group.y + group.h - notchH;
    if (shape === "l-bottom-right") return point.x <= group.x + group.w - notchW || point.y <= group.y + group.h - notchH;
    return true;
  }

  function groupSelectionAtPoint(point, previousSelection = null) {
    if (!point || previousSelection?.type !== "group") return null;
    const candidates = state.groups
      .filter((group) => pointInGroupShape(group, point))
      .reverse();
    if (candidates.length <= 1) return null;
    const currentIndex = candidates.findIndex((group) => group.id === previousSelection.id);
    if (currentIndex < 0) return null;
    const nextGroup = candidates[(currentIndex + 1) % candidates.length];
    return nextGroup ? { type: "group", id: nextGroup.id } : null;
  }

  function groupAtPoint(id, point) {
    const group = getGroup(id);
    return group && pointInGroupShape(group, point) ? group : null;
  }

  function positionSnapshot(item) {
    return {
      id: item.id,
      x: item.x,
      y: item.y
    };
  }

  function applyGroupDrag(group, dragState, dx, dy) {
    group.x = dragState.original.x + dx;
    group.y = dragState.original.y + dy;
    applyGroupContainedDragItems(dragState.original.containedItems, dx, dy);
  }

  function restoreGroupDrag(dragState) {
    const group = getGroup(dragState.id);
    if (group) {
      group.x = dragState.original.x;
      group.y = dragState.original.y;
    }
    applyGroupContainedDragItems(dragState.original.containedItems, 0, 0);
  }

  function applyGroupContainedDragItems(containedItems, dx, dy) {
    if (!containedItems) return;
    applyPositionSnapshots(containedItems.nodes, getNode, dx, dy);
    applyPositionSnapshots(containedItems.groups, getGroup, dx, dy);
    applyPositionSnapshots(containedItems.texts, getTextItem, dx, dy);
    applyPositionSnapshots(containedItems.shapes, getShape, dx, dy);
    applyPositionSnapshots(containedItems.images, getImageItem, dx, dy);
    applyPositionSnapshots(containedItems.legends, getLegend, dx, dy);
  }

  function applyPositionSnapshots(snapshots, getter, dx, dy) {
    (snapshots || []).forEach((snapshot) => {
      const item = getter(snapshot.id);
      if (!item) return;
      item.x = snapshot.x + dx;
      item.y = snapshot.y + dy;
    });
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
      if (value !== undefined && value !== null) {
        if (key === "xlink:href") element.setAttributeNS(XLINK_NS, key, value);
        else element.setAttribute(key, value);
      }
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
