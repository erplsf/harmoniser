// CSS modules
import styles, { stylesheet } from './style.module.css';

export function appendButton(document) {
  VM.observe(document.body, () => {
    const node = document.querySelector('.function-panel');

    if (node) {
      const ul = node.querySelector('.gs-span-16');
      if (ul) {
        const dom = <>
              <li className='gs-span-5'>
                <a className={`link-default ${styles.emphasizedText}`} href='#'>
                  Harmonise!
                </a>
              </li>
              <style>{stylesheet}</style>
            </>

        ul.prepend(dom);

        return true;
      }
    }
  });  
}
