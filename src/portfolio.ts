import { Asset } from "./asset";
import Fraction from "fraction.js";

export class Portfolio {
  assets: Asset[];
  funds: Fraction;

  private totalFunds: Fraction;

  constructor(funds: number, assets?: Asset[]) {
    if (assets) {
      this.assets = assets;
    } else {
      this.assets = [];
    }
    this.funds = new Fraction(funds);
  }

  addAsset(asset: Asset): void {
    this.assets.push(asset);
  }

  calculate(): void {
    this.totalFunds = this.assets.reduce(
      (sum, asset) => sum.add(asset.amount), new Fraction(0),
    );
    this.assets.forEach(asset => {
      const portion = this.calcPortion(asset);
      const fracDev = this.calcFracDev(portion, asset);
      const targetValue = this.totalFunds.mul(asset.target);

      asset.portion = portion;
      asset.fracDev = fracDev;
      asset.targetValue = targetValue;
    });
    this.assets.sort((a, b) => a.fracDev.compare(b.fracDev)) // flip the sign to get the smaller values first
  }

  private calcPortion(asset: Asset): Fraction {
    return asset.amount.div(this.totalFunds);
  }

  private calcFracDev(portion: Fraction, asset: Asset): Fraction {
    return new Fraction(portion).div(asset.target).sub(1);
  }

  private calcAssets(amount: Fraction, rest: Asset[], assets: Asset[]): Asset[] {
    const currentAsset = rest.pop();

    const catchUp = this.nextDeviation(rest).sub(currentAsset.fracDev);
    const targetSum = assets.reduce((sum, asset) => sum.add(asset.targetValue), currentAsset.targetValue)
    const delta = catchUp.mul(targetSum);

    if (delta.abs() < amount.abs()) {
      return this.calcAssets(amount.sub(delta), rest, assets.concat(currentAsset));
    } else {
      return assets.concat(currentAsset);
    }
  }

  private nextDeviation(assets: Asset[]): Fraction {
    if (assets.length == 0) {
      return new Fraction(0);
    } else {
      return assets[0].fracDev;
    }
  }
};
