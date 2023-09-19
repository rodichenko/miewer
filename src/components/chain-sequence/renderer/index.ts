import type {
  ChainSequence,
  Residue,
  ResidueSelectionCallback,
  SequenceItem,
} from '../../../@types/miew';
import type { PredefinedTheme } from '../../../@types/themes';
import type { ChainSequencePointerEventCallback } from '../../../@types/components/chain-sequences';
import {
  ChainSequenceAlignment,
  ChainSequenceEvent,
  ChainSequenceRenderType,
} from '../../../@types/components/chain-sequences';
import { colorValueToString } from '../../../helpers/colors';
import { getDprValue, getUnDprValue } from '../../../helpers/canvas';
import type { AnimationAbortCallback } from '../../../@types/rest';
import { animate, stopAnimation } from '../../../helpers/animation';
import { arraysEquals } from '../../../helpers/rest';

declare type Size = { width: number; height: number };
declare type Rect = Size & { top: number; left: number };

declare type ScrollSession = {
  sliderInitialPosition: number;
  touchPosition: number;
};

declare type SelectionSession = {
  touchPosition: number;
  exclude: boolean;
  append: boolean;
  initialSelection: Residue[];
  lastSelection: Residue[];
};

const bricksRenderModeThresholdPx = getDprValue(10);
const sliderInViewportSizeHovered = getDprValue(10);
const sliderSelectionOffset = getDprValue(2);
const selectionLineWidth = getDprValue(1);
const sliderInViewportSize = getDprValue(5);
const sliderOutOfViewportSize = getDprValue(1.0);
const sliderTopMargin = getDprValue(4.0);
const margin = getDprValue(2);
const sequenceItemHorizontalMargin = getDprValue(2.0);
const sliderZoneHeight =
  sliderInViewportSizeHovered + sliderSelectionOffset + selectionLineWidth;

const animationDurationMs = 100;

class ChainRenderer {
  private _canvas: HTMLCanvasElement | undefined;
  private _renderRaf: number;
  private _width: number;
  private _height: number;
  private _bbox: Rect;
  private _renderRequested: boolean;
  private _reportSelectionRequested: Residue[] | undefined;
  private _chain: ChainSequence | undefined;
  private _position: number; // Position in sequence item coordinate system (i.e. 0 - first item, 1 - second, etc.)
  private _sliderHeight: number;
  private _renderType: ChainSequenceRenderType;
  private _useColorer: boolean;
  private _alignment: ChainSequenceAlignment;
  private _chainTitleSize: Size;
  private _itemMaxCodeSize: Size;
  private _itemMaxCodeLetterSize: Size;
  private _theme: PredefinedTheme | undefined;
  private _scrollSession: ScrollSession | undefined;
  private _selectionSession: SelectionSession | undefined;
  private _sliderHovered: boolean;
  private _sequenceHovered: boolean;
  private _selectedResidues: Residue[];
  private _selectedResiduesIndices: Set<number>;
  private _positionAnimationAbort: AnimationAbortCallback | undefined;
  private _sliderHeightAnimationAbort: AnimationAbortCallback | undefined;
  private _selectionCallback: ResidueSelectionCallback | undefined;
  private _pointerEventsDisabled: boolean;
  private _pointerEventCallback: ChainSequencePointerEventCallback | undefined;

  constructor() {
    this._theme = undefined;
    this._width = 1;
    this._height = 1;
    this._bbox = { width: 1, height: 1, top: 0, left: 0 };
    this._position = 0;
    this._sliderHeight = sliderInViewportSize;
    this._renderType = ChainSequenceRenderType.letter;
    this._useColorer = true;
    this._alignment = ChainSequenceAlignment.left;
    this._renderRaf = 0;
    this._renderRequested = false;
    this._reportSelectionRequested = undefined;
    this._chain = undefined;
    this._scrollSession = undefined;
    this._selectionSession = undefined;
    this._sliderHovered = false;
    this._sequenceHovered = false;
    this._chainTitleSize = { width: 1, height: 1 };
    this._itemMaxCodeSize = { width: 1, height: 1 };
    this._itemMaxCodeLetterSize = { width: 1, height: 1 };
    this._selectedResidues = [];
    this._selectedResiduesIndices = new Set<number>();
    this._positionAnimationAbort = undefined;
    this._sliderHeightAnimationAbort = undefined;
    this._pointerEventsDisabled = false;
    this._pointerEventCallback = undefined;
    this.initializeRenderLoop();
  }

  get chain(): ChainSequence | undefined {
    return this._chain;
  }

  set chain(chain: ChainSequence | undefined) {
    if (this._chain !== chain) {
      this._chain = chain;
      this.resetPosition(true);
      this.calculateTextSizes();
      this.requestRender();
    }
  }

  get renderType(): ChainSequenceRenderType {
    return this._renderType;
  }

  set renderType(renderType: ChainSequenceRenderType) {
    if (this._renderType !== renderType) {
      this._renderType = renderType;
      this.resetPosition();
      this.requestRender();
    }
  }

  get useColorer(): boolean {
    return this._useColorer;
  }

  set useColorer(useColorer: boolean) {
    if (this._useColorer !== useColorer) {
      this._useColorer = useColorer;
      this.requestRender();
    }
  }

  get alignment(): ChainSequenceAlignment {
    return this._alignment;
  }

  set alignment(alignment: ChainSequenceAlignment) {
    if (this._alignment !== alignment) {
      this._alignment = alignment;
      this.resetPosition();
      this.requestRender();
    }
  }

  get theme(): PredefinedTheme | undefined {
    return this._theme;
  }

  set theme(theme: PredefinedTheme | undefined) {
    if (this._theme !== theme) {
      this._theme = theme;
      this.requestRender();
    }
  }

  get selectedResidues(): Residue[] {
    return this._selectedResidues;
  }

  set selectedResidues(residues: Residue[]) {
    // Shallow compare
    if (this._selectedResidues !== residues) {
      this._selectedResidues = residues;
      this._selectedResiduesIndices = new Set(
        residues.map((residue) => residue._index),
      );
      this.requestRender();
    }
  }

  get selectionCallback(): ResidueSelectionCallback | undefined {
    return this._selectionCallback;
  }

  set selectionCallback(
    selectionCallback: ResidueSelectionCallback | undefined,
  ) {
    if (this._selectionCallback !== selectionCallback) {
      this._selectionCallback = selectionCallback;
    }
  }

  get pointerEventCallback(): ChainSequencePointerEventCallback | undefined {
    return this._pointerEventCallback;
  }

  set pointerEventCallback(
    callback: ChainSequencePointerEventCallback | undefined,
  ) {
    if (this._pointerEventCallback !== callback) {
      this._pointerEventCallback = callback;
    }
  }

  get pointerEventsDisabled(): boolean {
    return this._pointerEventsDisabled;
  }

  set pointerEventsDisabled(disabled: boolean) {
    if (this._pointerEventsDisabled !== disabled) {
      this._pointerEventsDisabled = disabled;
      this.requestRender();
    }
  }

  private get sequenceTitle(): string {
    const { chain } = this;
    if (chain) {
      return `Chain ${chain.chain.getName()}:`;
    }
    return '';
  }

  private get chainItemsStartPx(): number {
    return this._chainTitleSize.width + sequenceItemHorizontalMargin;
  }

  private get itemSize(): Size {
    switch (this.renderType) {
      case ChainSequenceRenderType.name:
        return this._itemMaxCodeSize;
      case ChainSequenceRenderType.letter:
      default:
        return this._itemMaxCodeLetterSize;
    }
  }

  private get itemsCount(): number {
    return this.chain?.sequence.length ?? 0;
  }

  private get visibleItemsCount(): number {
    if (this.itemSize.width === 0) {
      return 0;
    }
    return this._width / this.itemSize.width;
  }

  private get position(): number {
    return this._position;
  }

  private set position(position: number) {
    const corrected = this.correctPosition(position);
    if (this._position !== corrected) {
      this._position = corrected;
      this.stopPositionAnimation();
      this.requestRender();
    }
  }

  private get center(): number {
    return this.position + this.visibleItemsCount / 2.0;
  }

  private set center(center: number) {
    this.setPosition(center - this.visibleItemsCount / 2.0, true);
  }

  private get sliderVisible(): boolean {
    return this.visibleItemsCount < this.itemsCount;
  }

  private get sliderHovered(): boolean {
    return this._sliderHovered && !this.pointerEventsDisabled;
  }

  private set sliderHovered(hovered: boolean) {
    if (this._sliderHovered !== hovered) {
      this._sliderHovered = hovered;
      this.stopSliderHeightAnimation();
      this._sliderHeightAnimationAbort = animate(
        {
          from: this._sliderHeight,
          to: hovered ? sliderInViewportSizeHovered : sliderInViewportSize,
          durationMs: animationDurationMs / 2.0,
        },
        (value: number) => {
          this._sliderHeight = value;
          this.requestRender();
        },
      );
      this.requestRender();
    }
  }

  private get sequenceHovered(): boolean {
    return this._sequenceHovered && !this.pointerEventsDisabled;
  }

  private set sequenceHovered(hovered: boolean) {
    if (this._sequenceHovered !== hovered) {
      this._sequenceHovered = hovered;
      this.requestRender();
    }
  }

  private get sliderRatio(): number {
    const { chain } = this;
    if (!chain || chain.sequence.length === 0 || !this.sliderVisible) {
      return 0;
    }
    return this._width / chain.sequence.length;
  }

  private get sliderWidth(): number {
    const { chain, sliderRatio, itemsCount, visibleItemsCount } = this;
    if (
      !chain ||
      sliderRatio === 0 ||
      !this.sliderVisible ||
      itemsCount === 0
    ) {
      return 0;
    }
    return Math.max(
      Math.min(itemsCount, visibleItemsCount) * sliderRatio,
      2 * this.sliderHeight,
    );
  }

  private get sliderHeight(): number {
    const { chain } = this;
    if (!chain || chain.sequence.length === 0 || !this.sliderVisible) {
      return 0;
    }
    return this._sliderHeight;
  }

  private get sliderCenter(): number {
    const { sliderVisible, sliderRatio } = this;
    if (!sliderVisible || sliderRatio === 0) {
      return 0;
    }
    return sliderRatio * this.center;
  }

  private get sliderVerticalPosition(): number {
    return Math.floor(
      margin +
        this.itemSize.height +
        sliderTopMargin +
        sliderInViewportSizeHovered / 2.0,
    );
  }

  private get sliderRange(): [number, number] {
    const { sliderWidth, sliderVisible, sliderCenter } = this;
    if (!sliderVisible) {
      return [0, 0];
    }
    return [sliderCenter - sliderWidth / 2.0, sliderCenter + sliderWidth / 2.0];
  }

  private get sequenceBoundingBox(): Rect {
    return {
      top: this._bbox.top,
      left: this._bbox.left,
      width: this._bbox.width,
      height: getUnDprValue(
        margin +
          this.itemSize.height +
          (this.sliderVisible ? sliderTopMargin : margin),
      ),
    };
  }

  private get sliderOuterBoundingBox(): Rect {
    return {
      top:
        this._bbox.top +
        getUnDprValue(
          this.sliderVerticalPosition - sliderInViewportSizeHovered / 2.0,
        ),
      left: this._bbox.left,
      width: this._bbox.width,
      height: getUnDprValue(sliderZoneHeight),
    };
  }

  private get sliderInnerBoundingBox(): Rect {
    const [x1, x2] = this.sliderRange;
    const { top, height } = this.sliderOuterBoundingBox;
    return {
      top,
      left: this._bbox.left + getUnDprValue(x1),
      width: getUnDprValue(x2 - x1),
      height,
    };
  }

  setCanvases(canvas: HTMLCanvasElement) {
    if (this._canvas !== canvas) {
      this.detachListeners();
      this.stopAnimations();
      this._canvas = canvas;
      if (this._canvas) {
        this._canvas.style.height = `${getDprValue(1)}px`;
      }
      this.attachListeners();
      this.calculateTextSizes();
      this.requestRender();
    }
  }

  destroy() {
    cancelAnimationFrame(this._renderRaf);
    this.stopAnimations();
    this.detachListeners();
    this._canvas = undefined;
  }

  private correctPosition(position: number): number {
    const { visibleItemsCount, itemsCount } = this;
    if (visibleItemsCount >= itemsCount) {
      switch (this.alignment) {
        case ChainSequenceAlignment.center:
          return (itemsCount - visibleItemsCount) / 2.0;
        case ChainSequenceAlignment.right:
          return itemsCount - visibleItemsCount;
        case ChainSequenceAlignment.left:
        default:
          return 0;
      }
    }
    const max = itemsCount - visibleItemsCount;
    const min = Math.max(0, (visibleItemsCount - itemsCount) / 2.0);
    return Math.max(min, Math.min(max, position));
  }

  private setPosition(position: number, animated?: boolean) {
    const newPosition = this.correctPosition(position);
    if (animated) {
      this.stopPositionAnimation();
      this._positionAnimationAbort = animate(
        {
          from: this.position,
          to: newPosition,
          durationMs: animationDurationMs,
        },
        (value: number) => {
          this._position = this.correctPosition(value);
          this.requestRender();
        },
      );
    } else {
      this.position = newPosition;
    }
  }

  private resetPosition(toStart = false): void {
    this.setPosition(toStart ? 0 : this.position, true);
    this.requestRender();
  }

  private initializeRenderLoop() {
    let width: number | undefined;
    let height: number | undefined;
    const callback = () => {
      const desiredHeight = Math.ceil(
        getUnDprValue(
          this.itemSize.height +
            2.0 * margin +
            (this.sliderVisible ? sliderZoneHeight + sliderTopMargin : 0),
        ),
      );
      if (this._canvas && desiredHeight !== this._canvas.clientHeight) {
        this._canvas.style.height = `${desiredHeight}px`;
      }
      if (this._canvas) {
        this._bbox = this._canvas.getBoundingClientRect();
      }
      if (
        this._canvas &&
        (width !== this._canvas.clientWidth ||
          height !== this._canvas.clientHeight)
      ) {
        width = this._canvas.clientWidth;
        height = this._canvas.clientHeight;
        this._width = Math.max(1, getDprValue(width));
        this._height = Math.max(1, getDprValue(height));
        this._canvas.width = this._width;
        this._canvas.height = this._height;
        this.resetPosition();
        this.requestRender();
      }
      if (this._renderRequested) {
        this._renderRequested = false;
        this.render();
      }
      if (this._reportSelectionRequested) {
        this.reportSelectionChanged(this._reportSelectionRequested);
        this._reportSelectionRequested = undefined;
      }
      this._renderRaf = requestAnimationFrame(callback);
    };
    callback();
  }

  private applyTheme(ctx: CanvasRenderingContext2D): void {
    const { fontFamily, fontSize } = this._theme ?? {
      background: 0x0,
      foreground: 0xfafafa,
      fontSize: 11,
      fontFamily: 'verdana, sans-serif',
    };
    ctx.font = `${getDprValue(fontSize)}px ${fontFamily}`;
  }

  private residueIsSelected(residue: Residue) {
    return this._selectedResiduesIndices.has(residue._index);
  }

  private getSequencePositionForMouseEvent(event: MouseEvent) {
    const { clientX } = event;
    const { left } = this._bbox;
    const x = getDprValue(clientX - left) - this.chainItemsStartPx;
    if (this.itemSize.width === 0) {
      return 0;
    }
    return this.position + x / this.itemSize.width;
  }

  private getSliderPositionForMouseEvent(event: MouseEvent) {
    const { sliderRatio } = this;
    if (sliderRatio === 0) {
      return 0;
    }
    const { clientX } = event;
    const { left } = this._bbox;
    const x = getDprValue(clientX - left);
    return x / sliderRatio;
  }

  private attachListeners(): void {
    this.detachListeners();
    if (this._canvas) {
      this._canvas.addEventListener('mousedown', this.mouseDown);
      window.addEventListener('mouseup', this.mouseUp, { capture: true });
      window.addEventListener('mousemove', this.mouseMove, { capture: true });
    }
  }

  private detachListeners(): void {
    if (this._canvas) {
      this._canvas.removeEventListener('mousedown', this.mouseDown);
      window.removeEventListener('mouseup', this.mouseUp, { capture: true });
      window.removeEventListener('mousemove', this.mouseMove, {
        capture: true,
      });
    }
  }

  private getItemsWithinRange(from: number, to: number): Residue[] {
    const { chain } = this;
    if (chain) {
      const correct = (position: number): number =>
        Math.max(0, Math.min(chain.sequence.length + 1, position));
      const start = correct(Math.floor(Math.min(from, to)));
      const end = correct(Math.ceil(Math.max(from, to)));
      return chain.sequence
        .slice(start, end + (start === end ? 1 : 0))
        .map((item) => item.residue);
    }
    return [];
  }

  private reportPointerEvent(event: ChainSequenceEvent): void {
    const { chain } = this;
    if (
      chain &&
      !this.pointerEventsDisabled &&
      typeof this._pointerEventCallback === 'function'
    ) {
      this._pointerEventCallback(chain.chain, event);
    }
  }

  private reportSelectionChanged(newSelection: Residue[]): void {
    if (typeof this._selectionCallback === 'function') {
      this._selectionCallback(newSelection);
    }
  }

  private stopAnimations(): void {
    this.stopPositionAnimation();
    this.stopSliderHeightAnimation();
  }

  private stopPositionAnimation(): void {
    stopAnimation(this._positionAnimationAbort);
    this._positionAnimationAbort = undefined;
  }

  private stopSliderHeightAnimation(): void {
    stopAnimation(this._sliderHeightAnimationAbort);
    this._sliderHeightAnimationAbort = undefined;
  }

  private mouseEventUnderBoundingBox(event: MouseEvent, bbox: Rect): boolean {
    const { clientX, clientY } = event;
    return (
      bbox.left <= clientX &&
      bbox.left + bbox.width >= clientX &&
      bbox.top <= clientY &&
      bbox.top + bbox.height > clientY
    );
  }

  private handleSelectionEvent(event: MouseEvent): void {
    const session = this._selectionSession;
    if (session) {
      const items = this.getItemsWithinRange(
        session.touchPosition,
        this.getSequencePositionForMouseEvent(event),
      );
      let selected = [...session.initialSelection];
      if (!session.append && !session.exclude) {
        selected = [];
      }
      items.forEach((item) => {
        if (session.exclude && selected.find((o) => o._index === item._index)) {
          selected = selected.filter((o) => o._index !== item._index);
        } else {
          selected.push(item);
        }
      });
      const hash = [
        ...new Set(session.lastSelection.map((item) => item._index)),
      ].sort((a, b) => a - b);
      const newHash = [...new Set(selected.map((item) => item._index))].sort(
        (a, b) => a - b,
      );
      if (!arraysEquals(hash, newHash)) {
        this._reportSelectionRequested = selected;
      }
      session.lastSelection = items;
    }
  }

  private updateHoveredStatesForEvent(event: MouseEvent): void {
    this.sliderHovered =
      event.target === this._canvas &&
      this.mouseEventUnderBoundingBox(event, this.sliderOuterBoundingBox);
    this.sequenceHovered =
      event.target === this._canvas &&
      this.mouseEventUnderBoundingBox(event, this.sequenceBoundingBox);
  }

  private readonly mouseMove = (event: MouseEvent): void => {
    if (this.pointerEventsDisabled) {
      return;
    }
    if (this._scrollSession) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      this.sliderHovered = true;
      const diff =
        this.getSliderPositionForMouseEvent(event) -
        this._scrollSession.touchPosition;
      this.position = this._scrollSession.sliderInitialPosition + diff;
      this.reportPointerEvent(ChainSequenceEvent.scroll);
    } else if (this._selectionSession) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      this.sequenceHovered = true;
      this.handleSelectionEvent(event);
      this.reportPointerEvent(ChainSequenceEvent.selection);
    } else {
      this.updateHoveredStatesForEvent(event);
    }
  };

  private readonly mouseDown = (event: MouseEvent): void => {
    if (event.button !== 0 || this.pointerEventsDisabled) {
      return;
    }
    const sliderOuter = this.mouseEventUnderBoundingBox(
      event,
      this.sliderOuterBoundingBox,
    );
    const sliderInner = this.mouseEventUnderBoundingBox(
      event,
      this.sliderInnerBoundingBox,
    );
    const sequence = this.mouseEventUnderBoundingBox(
      event,
      this.sequenceBoundingBox,
    );
    if (!sliderInner && sliderOuter) {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      this.center = this.getSliderPositionForMouseEvent(event);
      return;
    }
    if (sliderInner) {
      this.reportPointerEvent(ChainSequenceEvent.scrollStart);
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      this._scrollSession = {
        sliderInitialPosition: this.position,
        touchPosition: this.getSliderPositionForMouseEvent(event),
      };
      return;
    }
    if (sequence) {
      this.reportPointerEvent(ChainSequenceEvent.selectionStart);
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      this._selectionSession = {
        touchPosition: this.getSequencePositionForMouseEvent(event),
        append: event.shiftKey && !event.altKey,
        exclude: event.shiftKey && event.altKey,
        initialSelection: this.selectedResidues.slice(),
        lastSelection: this.selectedResidues.slice(),
      };
      this.handleSelectionEvent(event);
    }
  };

  private readonly mouseUp = (event: MouseEvent): void => {
    if (!this.pointerEventsDisabled && this._scrollSession !== undefined) {
      this.mouseMove(event);
      this.reportPointerEvent(ChainSequenceEvent.scrollFinish);
      this.requestRender();
    }
    if (!this.pointerEventsDisabled && this._selectionSession !== undefined) {
      this.handleSelectionEvent(event);
      this.reportPointerEvent(ChainSequenceEvent.selectionFinish);
      this.requestRender();
    }
    this._selectionSession = undefined;
    this._scrollSession = undefined;
    this.updateHoveredStatesForEvent(event);
  };

  private calculateTextSizes() {
    const { chain } = this;
    if (this._canvas && chain) {
      const ctx = this._canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.textBaseline = 'alphabetic';
        this.applyTheme(ctx);
        const measureText = (text: string): Size => {
          const { width, fontBoundingBoxAscent } = ctx.measureText(text);
          return {
            width: Math.ceil(width),
            height: fontBoundingBoxAscent,
          };
        };
        this._chainTitleSize = measureText(this.sequenceTitle);
        this._itemMaxCodeSize = { width: 0, height: 0 };
        this._itemMaxCodeLetterSize = { width: 0, height: 0 };
        chain.sequence.forEach((item) => {
          const letterCodeSize = measureText(item.letterCode);
          const codeSize = measureText(item.code);
          this._itemMaxCodeSize.width = Math.max(
            this._itemMaxCodeSize.width,
            codeSize.width,
          );
          this._itemMaxCodeSize.height = Math.max(
            this._itemMaxCodeSize.height,
            codeSize.height,
          );
          this._itemMaxCodeLetterSize.width = Math.max(
            this._itemMaxCodeLetterSize.width,
            letterCodeSize.width,
          );
          this._itemMaxCodeLetterSize.height = Math.max(
            this._itemMaxCodeLetterSize.height,
            letterCodeSize.height,
          );
        });
        this._itemMaxCodeSize.width += sequenceItemHorizontalMargin;
        this._itemMaxCodeLetterSize.width += sequenceItemHorizontalMargin;
        ctx.restore();
      }
      this.resetPosition();
      this.requestRender();
    }
  }

  private requestRender(): void {
    this._renderRequested = true;
  }

  private getItemText(item: SequenceItem): string {
    switch (this.renderType) {
      case ChainSequenceRenderType.letter:
        return item.letterCode;
      case ChainSequenceRenderType.name:
      default:
        return item.code;
    }
  }

  private getSequenceItemPositionByIndex(index: number): number {
    if (index >= 0) {
      const { width = 0 } = this.itemSize;
      return this.chainItemsStartPx + width * (index + 0.5 - this.position);
    }
    return this.chainItemsStartPx;
  }

  private renderSlider(ctx: CanvasRenderingContext2D): void {
    const {
      chain,
      sliderWidth,
      sliderHeight,
      sliderRange,
      sliderRatio,
      sliderVerticalPosition,
      theme,
    } = this;
    const { foreground, foregroundFaded, selectionBackground } = theme ?? {
      foreground: 0xfafafa,
      foregroundFaded: 0x777777,
      selectionBackground: 0xe78d04,
    };
    if (
      chain &&
      chain.sequence.length > 0 &&
      this.sliderVisible &&
      sliderWidth > 0
    ) {
      const dx = sliderRatio;
      const y = sliderVerticalPosition;
      const selectionY = Math.ceil(
        y + sliderInViewportSizeHovered / 2.0 + sliderSelectionOffset,
      );
      let [sliderX1, sliderX2] = sliderRange;
      sliderX1 += sliderHeight / 2.0;
      sliderX2 -= sliderHeight / 2.0;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sliderX1, y);
      ctx.arc(
        sliderX1,
        y,
        sliderHeight / 2.0,
        Math.PI / 2.0,
        -Math.PI / 2.0,
        false,
      );
      ctx.moveTo(sliderX2, y);
      ctx.arc(
        sliderX2,
        y,
        sliderHeight / 2.0,
        -Math.PI / 2.0,
        Math.PI / 2.0,
        false,
      );
      ctx.moveTo(0, y);
      ctx.rect(
        0,
        Math.floor(y - sliderOutOfViewportSize / 2.0),
        this._width,
        sliderOutOfViewportSize,
      );
      ctx.moveTo(sliderX1, y);
      ctx.rect(
        sliderX1,
        Math.floor(y - sliderHeight / 2.0),
        sliderX2 - sliderX1,
        sliderHeight,
      );
      ctx.moveTo(0, y);
      ctx.rect(
        0,
        selectionY - selectionLineWidth,
        this._width,
        selectionLineWidth * 2.0,
      );
      ctx.clip();
      chain.sequence.forEach((item, index) => {
        const color =
          !this.useColorer || !item.colorer
            ? colorValueToString(this.useColorer ? foregroundFaded : foreground)
            : colorValueToString(
                item.colorer.getResidueColor(item.residue, item.complex),
              );
        ctx.save();
        ctx.fillStyle = color;
        ctx.beginPath();
        if (dx > bricksRenderModeThresholdPx) {
          // Blocks greater than `bricksRenderModeThresholdPx`
          // we should render as "bricks"
          ctx.rect(
            index * dx,
            Math.floor(y - sliderHeight / 2.0),
            dx - 2,
            sliderHeight,
          );
        } else {
          ctx.rect(
            index * dx,
            Math.floor(y - sliderHeight / 2.0),
            dx,
            sliderHeight,
          );
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        if (this.residueIsSelected(item.residue)) {
          ctx.save();
          ctx.beginPath();
          ctx.lineWidth = selectionLineWidth;
          ctx.moveTo(index * dx, selectionY - selectionLineWidth / 2.0);
          ctx.lineTo((index + 1) * dx, selectionY - selectionLineWidth / 2.0);
          ctx.closePath();
          ctx.strokeStyle = colorValueToString(selectionBackground);
          ctx.stroke();
          ctx.restore();
        }
      });
      ctx.restore();
    }
  }

  private render(): void {
    const canvas = this._canvas;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }
    if ((this.sliderVisible && this.sliderHovered) || this.sequenceHovered) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = 'default';
    }
    ctx.clearRect(0, 0, this._width, this._height);
    this.applyTheme(ctx);

    const { chain, position, visibleItemsCount, itemSize, theme } = this;
    const { foreground, foregroundFaded, selectionBackground } = theme ?? {
      foreground: 0xfafafa,
      foregroundFaded: 0x777777,
      selectionBackground: 0xe78d04,
    };
    if (chain && chain.sequence.length > 0) {
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'center';
      ctx.save();
      const size = itemSize.width;
      const textPosition = margin + itemSize.height - getDprValue(1);
      const selectionOffset = Math.floor(
        Math.min(
          margin - getDprValue(1),
          sliderTopMargin - getDprValue(1),
          getDprValue(2),
        ),
      );
      ctx.save();
      ctx.textAlign = 'left';
      ctx.fillStyle = colorValueToString(foreground);
      ctx.fillText(this.sequenceTitle, 0, textPosition);
      ctx.restore();
      ctx.beginPath();
      ctx.rect(
        this.chainItemsStartPx,
        0,
        this._width - this.chainItemsStartPx,
        this._height,
      );
      ctx.clip();
      chain.sequence.forEach((item, index) => {
        const partiallyInViewport =
          index >= position - 1 && index <= position + visibleItemsCount;
        const color =
          !this.useColorer || !item.colorer
            ? colorValueToString(this.useColorer ? foregroundFaded : foreground)
            : colorValueToString(
                item.colorer.getResidueColor(item.residue, item.complex),
              );
        if (partiallyInViewport) {
          const tx = this.getSequenceItemPositionByIndex(index);
          if (this._theme && this.residueIsSelected(item.residue)) {
            ctx.save();
            ctx.fillStyle = colorValueToString(selectionBackground, 0.25);
            ctx.beginPath();
            ctx.rect(
              tx - size / 2.0,
              margin - selectionOffset,
              size,
              itemSize.height + 2 * selectionOffset,
            );
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = colorValueToString(selectionBackground);
            ctx.beginPath();
            ctx.lineWidth = selectionLineWidth;
            ctx.moveTo(
              tx - size / 2.0,
              margin - selectionOffset + selectionLineWidth / 2.0,
            );
            ctx.lineTo(
              tx + size / 2.0,
              margin - selectionOffset + selectionLineWidth / 2.0,
            );
            ctx.moveTo(
              tx - size / 2.0,
              margin +
                itemSize.height +
                selectionOffset +
                selectionLineWidth / 2.0,
            );
            ctx.lineTo(
              tx + size / 2.0,
              margin +
                itemSize.height +
                selectionOffset +
                selectionLineWidth / 2.0,
            );
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
          }
          ctx.fillStyle = color;
          ctx.fillText(this.getItemText(item), tx, textPosition);
        }
      });
      ctx.restore();
      this.renderSlider(ctx);
    }
  }
}

export default ChainRenderer;
