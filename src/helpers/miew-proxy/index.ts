import type { Miew } from 'miew';
import type { MiewOptionsExtended } from '../../@types/miew';
import {
  MiewOptionsRequest,
  MiewRequestProcessor,
  MiewSourceRequest,
} from './miew-request';
import { getOptionsDiffIgnoringRepresentationNames } from './preprocess-options';

class MiewProxy {
  private _source: string | undefined;
  private _options: MiewOptionsExtended;
  private readonly _processor: MiewRequestProcessor;
  constructor(miew: Miew, options?: MiewOptionsExtended) {
    this._processor = new MiewRequestProcessor(miew);
    this._source = undefined;
    this._options = {};
    this.requestOptions(options ?? {});
  }

  get busy(): boolean {
    return this._processor.busy;
  }

  requestOptions(options: MiewOptionsExtended) {
    const { load, ...rest } = options;
    if (load && this._source !== load) {
      this._source = load;
      this._options = rest;
      this._processor.registerRequest(new MiewSourceRequest(load));
      this._processor.registerRequest(new MiewOptionsRequest(rest));
    } else {
      const diff = getOptionsDiffIgnoringRepresentationNames(
        this._options,
        rest,
      );
      this._options = rest;
      this._processor.registerRequest(
        new MiewOptionsRequest({ ...diff, reps: rest.reps }),
      );
    }
  }

  dispose() {
    this._processor.dispose();
  }
}

export default MiewProxy;
