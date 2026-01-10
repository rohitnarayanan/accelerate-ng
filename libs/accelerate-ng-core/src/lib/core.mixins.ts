// external imports

// internal imports
import { AbstractConstructor, Constructor } from './core.types';

// defintions
export type Mixin<TBase extends Constructor, TResult extends Constructor> = (
  base: TBase,
) => TResult;
export type AbstractMixin<
  TBase extends AbstractConstructor,
  TResult extends AbstractConstructor,
> = (base: TBase) => TResult;

export function applyMixin<
  TBase extends Constructor,
  TResult extends Constructor,
>(base: TBase, mixin: Mixin<TBase, TResult>): TResult {
  return mixin(base);
}

export function applyAbstractMixin<
  TBase extends AbstractConstructor,
  TResult extends AbstractConstructor,
>(base: TBase, mixin: AbstractMixin<TBase, TResult>): TResult {
  return mixin(base);
}
