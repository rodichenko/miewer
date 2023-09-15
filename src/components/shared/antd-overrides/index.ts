/* eslint-disable @typescript-eslint/naming-convention */
import { Input as AntdInput, InputNumber as AntdInputNumber } from 'antd';
import { miewerInputHoc } from './miewer-input-hoc';

export const Input = miewerInputHoc(AntdInput);
export const InputNumber = miewerInputHoc(AntdInputNumber);
