import type { Miew } from 'miew';
import type { MiewOptionsExtended } from '../../@types/miew';

abstract class MiewRequest {
  abstract perform(miew: Miew, callback: () => void): void;
}

class MiewSourceRequest extends MiewRequest {
  private readonly _source: string;
  constructor(source: string) {
    super();
    this._source = source;
  }

  perform(miew: Miew, callback: () => void) {
    miew.unload(undefined);
    miew
      .load(this._source, {})
      .then(() => {
        callback();
      })
      .catch((error) => {
        console.warn(error.message);
      });
  }
}

class MiewOptionsRequest extends MiewRequest {
  protected _options: MiewOptionsExtended;
  constructor(options: MiewOptionsExtended) {
    super();
    this._options = options;
  }

  merge(request: MiewOptionsRequest): void {
    this._options = {
      ...this._options,
      ...request._options,
    };
  }

  perform(miew: Miew, callback: () => void) {
    const { preset, reps, ...rest } = this._options;
    miew.setOptions(rest);
    if (reps) {
      miew.setOptions({ reps });
    } else if (preset) {
      miew.applyPreset(preset);
    }
    callback();
  }
}

class MiewRequestProcessor {
  private _miew: Miew | undefined;
  private _queue: MiewRequest[];
  private _requestInProgress: MiewRequest | undefined;
  constructor(miew: Miew) {
    this._miew = miew;
    this._queue = [];
  }

  registerRequest(request: MiewRequest): void {
    const last = this._queue[this._queue.length - 1];
    if (request instanceof MiewSourceRequest) {
      this._queue = [request];
    } else if (
      last instanceof MiewOptionsRequest &&
      request instanceof MiewOptionsRequest
    ) {
      last.merge(request);
    } else {
      this._queue.push(request);
    }
    this.performNextRequest();
  }

  dispose() {
    this._queue = [];
    this._miew = undefined;
  }

  private pickRequest(): MiewRequest | undefined {
    if (this._queue.length === 0) {
      return undefined;
    }
    return this._queue.shift();
  }

  private onRequestDone(): void {
    this._requestInProgress = undefined;
    this.performNextRequest();
  }

  private performNextRequest(): void {
    if (!this._requestInProgress && this._miew) {
      this._requestInProgress = this.pickRequest();
      if (this._requestInProgress) {
        this._requestInProgress.perform(
          this._miew,
          this.onRequestDone.bind(this),
        );
      }
    }
  }
}

export { MiewRequestProcessor, MiewSourceRequest, MiewOptionsRequest };
