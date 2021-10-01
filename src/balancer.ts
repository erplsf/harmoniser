import { Asset } from './asset';
import { Portfolio } from './portfolio';
import util from 'util';

if (require.main === module) {
  console.log('in main');
  const portf = new Portfolio(1000, [
    new Asset("Asset 1", 900, 0.1),
    new Asset("Asset 2", 100, 0.9),
  ]);
  portf.calculate();
  console.log(util.inspect(portf, false, null, true));
}
