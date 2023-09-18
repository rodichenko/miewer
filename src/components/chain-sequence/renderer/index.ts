import type {
  ChainSequence,
  Residue,
  SequenceItem,
  ResidueSelectionCallback,
} from '../../../@types/miew';
import type { PredefinedTheme } from '../../../@types/themes';
import { ChainSequenceRenderType } from '../../../@types/components/chain-sequences';
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
const selectionLineHeight = getDprValue(1);
const sliderInViewportSize = getDprValue(5);
const sliderOutOfViewportSize = getDprValue(1.0);
const margin = getDprValue(5.0);
const sliderZoneHeight =
  sliderInViewportSizeHovered + sliderSelectionOffset + selectionLineHeight;

const animationDurationMs = 100;

class ChainRenderer {
  private _canvas: HTMLCanvasElement | undefined;
  private _renderRaf: number;
  private _width: number;
  private _height: number;
  private _bbox: Rect;
  private _renderRequested: boolean;
  private _chain: ChainSequence | undefined;
  private _position: number; // Position in sequence item coordinate system (i.e. 0 - first item, 1 - second, etc.)
  private _renderType: ChainSequenceRenderType;
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
  private _selectionCallback: ResidueSelectionCallback | undefined;

  constructor() {
    this._theme = undefined;
    this._width = 1;
    this._height = 1;
    this._bbox = { width: 1, height: 1, top: 0, left: 0 };
    this._position = 0;
    this._renderType = ChainSequenceRenderType.letter;
    this._renderRaf = 0;
    this._renderRequested = false;
    this._chain = undefined;
    this._scrollSession = undefined;
    this._selectionSession = undefined;
    this._sliderHovered = false;
    this._sequenceHovered = false;
    this._itemMaxCodeSize = { width: 1, height: 1 };
    this._itemMaxCodeLetterSize = { width: 1, height: 1 };
    this._selectedResidues = [];
    this._selectedResiduesIndices = new Set<number>();
    this._positionAnimationAbort = undefined;
    this.initializeRenderLoop();
  }

  get chain(): ChainSequence | undefined {
    return this._chain;
  }

  set chain(chain: ChainSequence | undefined) {
    if (this._chain !== chain) {
      this._chain = chain;
      this.resetPosition(true);
      this.initializeChainItems();
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

  private get itemSize(): Size {
    switch (this.renderType) {
      case ChainSequenceRenderType.name:
        return this._itemMaxCodeSize;
      case ChainSequenceRenderType.letter:
      default:
        return this._itemMaxCodeLetterSize;
    }
  }

  private get itemMargin(): number {
    return getDprValue(3.0);
  }

  private get itemsCount(): number {
    return this.chain?.sequence.length ?? 0;
  }

  private get visibleItemsCount(): number {
    return this._width / (this.itemSize.width + this.itemMargin);
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
    return this._sliderHovered;
  }

  private set sliderHovered(hovered: boolean) {
    if (this._sliderHovered !== hovered) {
      this._sliderHovered = hovered;
      this.requestRender();
    }
  }

  private get sequenceHovered(): boolean {
    return this._sequenceHovered;
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
    return this.sliderHovered
      ? sliderInViewportSizeHovered
      : sliderInViewportSize;
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
      this.itemSize.height + 2.0 * margin + sliderInViewportSizeHovered / 2.0,
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
      height: getUnDprValue(2.0 * margin + this.itemSize.height),
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
      this.attachListeners();
      this.initializeChainItems();
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
      return (itemsCount - visibleItemsCount) / 2.0;
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
        getUnDprValue(this.itemSize.height + 2.0 * margin + sliderZoneHeight),
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
    const x = getDprValue(clientX - left);
    const itemSize = this.itemSize.width + this.itemMargin;
    return this.position + x / itemSize;
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
      const start = Math.floor(Math.min(from, to));
      const end = Math.ceil(Math.max(from, to));
      return chain.sequence
        .slice(start, end + (start === end ? 1 : 0))
        .map((item) => item.residue);
    }
    return [];
  }

  private reportSelectionChanged(newSelection: Residue[]): void {
    if (typeof this._selectionCallback === 'function') {
      this._selectionCallback(newSelection);
    }
  }

  private stopAnimations(): void {
    this.stopPositionAnimation();
  }

  private stopPositionAnimation(): void {
    stopAnimation(this._positionAnimationAbort);
    this._positionAnimationAbort = undefined;
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
      const newHash = [...new Set(items.map((item) => item._index))].sort(
        (a, b) => a - b,
      );
      if (!arraysEquals(hash, newHash)) {
        this.reportSelectionChanged(selected);
      }
      session.lastSelection = items;
    }
  }

  private readonly mouseMove = (event: MouseEvent): void => {
    if (this._scrollSession) {
      event.preventDefault();
      event.stopPropagation();
      this.sliderHovered = true;
      const diff =
        this.getSliderPositionForMouseEvent(event) -
        this._scrollSession.touchPosition;
      this.position = this._scrollSession.sliderInitialPosition + diff;
    } else if (this._selectionSession) {
      event.preventDefault();
      event.stopPropagation();
      this.sequenceHovered = true;
      this.handleSelectionEvent(event);
    } else {
      this.sliderHovered = this.mouseEventUnderBoundingBox(
        event,
        this.sliderOuterBoundingBox,
      );
      this.sequenceHovered = this.mouseEventUnderBoundingBox(
        event,
        this.sequenceBoundingBox,
      );
    }
  };

  private readonly mouseDown = (event: MouseEvent): void => {
    if (event.button !== 0) {
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
      event.stopPropagation();
      event.preventDefault();
      this.center = this.getSliderPositionForMouseEvent(event);
      return;
    }
    if (sliderInner) {
      event.preventDefault();
      event.stopPropagation();
      this._scrollSession = {
        sliderInitialPosition: this.position,
        touchPosition: this.getSliderPositionForMouseEvent(event),
      };
      return;
    }
    if (sequence) {
      event.preventDefault();
      event.stopPropagation();
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
    if (this._scrollSession !== undefined) {
      this.mouseMove(event);
      this._scrollSession = undefined;
      this.requestRender();
    }
    if (this._selectionSession !== undefined) {
      this.mouseMove(event);
      this._selectionSession = undefined;
      this.requestRender();
    }
  };

  private initializeChainItems() {
    const { chain } = this;
    if (this._canvas && chain) {
      const ctx = this._canvas.getContext('2d');
      if (ctx) {
        this.applyTheme(ctx);
        const measureText = (text: string): Size => {
          let { width, fontBoundingBoxAscent, fontBoundingBoxDescent } =
            ctx.measureText(text);
          width = Math.ceil(width);
          const height = fontBoundingBoxAscent + fontBoundingBoxDescent;
          return { width, height };
        };
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

  private getSequenceItemPositionByIndex(index: number): {
    x: number;
    y: number;
  } {
    if (index >= 0) {
      const { width = 0, height = 0 } = this.itemSize;
      const x =
        (width + this.itemMargin) * (index - this.position) + width / 2.0;
      return {
        x,
        y: height + margin,
      };
    }
    return {
      x: 0,
      y: margin,
    };
  }

  private getSequenceItemPosition(item: SequenceItem): {
    x: number;
    y: number;
  } {
    return this.getSequenceItemPositionByIndex(
      this.chain?.sequence?.indexOf(item) ?? -1,
    );
  }

  private renderSlider(ctx: CanvasRenderingContext2D): void {
    const {
      chain,
      sliderWidth,
      sliderHeight,
      sliderRange,
      sliderRatio,
      sliderVerticalPosition,
    } = this;
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
      ctx.rect(0, selectionY, this._width, selectionLineHeight);
      ctx.clip();
      chain.sequence.forEach((item, index) => {
        if (item.colorer) {
          ctx.save();
          ctx.fillStyle = colorValueToString(
            item.colorer.getResidueColor(item.residue, item.complex),
          );
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
          if (this.residueIsSelected(item.residue) && this._theme) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(index * dx, selectionY, dx, selectionLineHeight);
            ctx.closePath();
            ctx.fillStyle = colorValueToString(this._theme.selectionBackground);
            ctx.fill();
            ctx.restore();
          }
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

    const { chain, position, visibleItemsCount, itemSize, itemMargin } = this;
    if (chain && chain.sequence.length > 0) {
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'center';
      ctx.save();
      const size = itemSize.width + itemMargin;
      chain.sequence.forEach((item, index) => {
        const partiallyInViewport =
          index >= position - 1 && index <= position + visibleItemsCount;
        if (item.colorer && partiallyInViewport) {
          const { x: tx, y: ty } = this.getSequenceItemPositionByIndex(index);
          if (this._theme && this.residueIsSelected(item.residue)) {
            ctx.save();
            ctx.fillStyle = colorValueToString(
              this._theme.selectionBackground,
              0.25,
            );
            ctx.beginPath();
            ctx.rect(
              tx - size / 2.0,
              Math.floor(ty - itemSize.height - 1),
              size,
              itemSize.height + 1,
            );
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = colorValueToString(this._theme.selectionBackground);
            ctx.beginPath();
            ctx.rect(
              tx - size / 2.0,
              Math.floor(ty - itemSize.height - 1),
              size,
              getDprValue(1),
            );
            ctx.rect(tx - size / 2.0, Math.ceil(ty + 1), size, getDprValue(1));
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
          ctx.fillStyle = colorValueToString(
            item.colorer.getResidueColor(item.residue, item.complex),
          );
          ctx.fillText(this.getItemText(item), tx, ty);
        }
      });
      ctx.restore();
      this.renderSlider(ctx);
    }
  }
}

export default ChainRenderer;
