import { Asset } from "./asset";
import Fraction from "fraction.js";

export class Portfolio {
  assets: Asset[];
  funds: Fraction;

  private totalFunds: Fraction;

  constructor(funds: number, assets?: Asset[]) {
    this.totalFunds = new Fraction(0);
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

  calculate(): { name: string, amount: Fraction }[] {
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
    this.assets.sort((a, b) => a.fracDev.compare(b.fracDev));

    const affectedAssets = this.calcAssets(this.funds, this.assets.slice(0), []);
    let targetDeviation = affectedAssets[affectedAssets.length - 2].fracDev;
    targetDeviation = targetDeviation.add(this.calcDevForMoney(this.funds, affectedAssets.slice(0), new Fraction(0)));

    const plan = affectedAssets.map(a => { return { name: a.name, amount: a.targetValue.mul(targetDeviation.sub(a.fracDev)) }; });

    return plan;
  }

  private calcPortion(asset: Asset): Fraction {
    return asset.amount.div(this.totalFunds);
  }

  private calcFracDev(portion: Fraction, asset: Asset): Fraction {
    return new Fraction(portion).div(asset.target).sub(1);
  }

  private calcAssets(amount: Fraction, rest: Asset[], assets: Asset[]): Asset[] {
    const currentAsset = rest.pop();

    if (!currentAsset) {
      return assets;
    }

    const catchUp = this.nextDeviation(rest).sub(currentAsset.fracDev);
    const targetSum = assets.reduce((sum, asset) => sum.add(asset.targetValue), currentAsset.targetValue)
    const delta = catchUp.mul(targetSum);

    if (delta.abs() < amount.abs()) {
      return this.calcAssets(amount.sub(delta), rest, assets.concat([currentAsset]));
    } else {
      return assets.concat([currentAsset]);
    }
  }

  private calcDevForMoney(amount: Fraction, rest: Asset[], sum: Fraction): Fraction {
    const currentAsset = rest.pop();

    if (!currentAsset) {
      return amount;
    }

    const newSum = currentAsset.targetValue.add(sum);
    const catchUp = this.nextDeviation(rest).sub(currentAsset.fracDev);
    const delta = catchUp.mul(newSum)

    if (delta.abs() < amount.abs()) {
      return this.calcDevForMoney(amount.sub(delta), rest, newSum);
    } else {
      return amount.div(newSum);
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
