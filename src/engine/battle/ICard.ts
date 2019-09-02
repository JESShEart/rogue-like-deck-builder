import {IEffect, IUnTargetedEffect} from './IEffect';
import IIdentified from './IIdentified';

export enum CardType {
  TARGETED,
  UN_TARGETED,
}

export interface ITargetedCard {
  readonly name: string;
  readonly cost: number;
  readonly cardType: CardType.TARGETED;
  readonly effectList: IEffect[];
}

export interface IUnTargetedCard {
  readonly name: string;
  readonly cost: number;
  readonly cardType: CardType.UN_TARGETED;
  readonly effectList: IUnTargetedEffect[];
}

export type ICard = ITargetedCard | IUnTargetedCard;

export type IdentifiedTargetedCard = IIdentified & ITargetedCard;
export type IdentifiedUnTargetedCard = IIdentified & IUnTargetedCard;

export type IdentifiedCard = IdentifiedTargetedCard | IdentifiedUnTargetedCard;

export interface IIdentifiedCardMap {
  [id: number]: IdentifiedCard;
}
