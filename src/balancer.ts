import { Asset } from './asset';
import { Portfolio } from './portfolio';
import util from 'util';

if (require.main === module) {
  console.log('in main');
  const portf = new Portfolio(1000, [
    new Asset("Asset 1", 900, 0.5),
    new Asset("Asset 2", 100, 0.5),
  ]);
  const aa = portf.calculate();
  // console.log(util.inspect(portf, false, null, true));
  console.log(util.inspect(aa, false, null, true));
}
